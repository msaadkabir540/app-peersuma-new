// contexts/PostsContext.tsx
"use client";
import React, { useContext, useState, useEffect, createContext, useCallback } from "react";

import { getAllVideoRequests } from "../app/api/video-request";

import { useClients } from "./context-collection";

import {
  changeVideoRequestThemeId,
  getAllVideoRequestsThemes,
} from "../app/api/video-request-themes";
import createNotification from "../components/create-notification";

interface CalenderInterface {
  invontriesId: string;
  schoolYear?: string;
  setVideoThemesData?: any;
  loadingVideoRequest: boolean;
  pageLoader?: boolean;
  active: boolean;
  videoRequestData: any[];
  videoThemesData: any[];
  setLoading?: any;
  onDragEnd?: any;
  handleActive: () => void;
  handleActiveClose: () => void;
  loading: {
    isLoading: boolean;
    UpdatedLoading: boolean;
    isUpdateing?: string;
  };
  handleGetAllThemes: () => void;
  handleCloseInventory: () => void;
  handleAddIntoVideoPlan: ({
    themeId,
    invontriesId,
  }: {
    themeId: string;
    invontriesId: string;
  }) => void;
  handleGetAllUnassigendVideo: () => void;
  handleAddedVideoRequest: () => void;
  handleActiveFilter?: () => void;
  handleUnActiveFilter?: () => void;
  isUpdateVideoRequest: {
    videRequestId: string;
    themeId: string;
    dragMedia?: any;
    isDrop: boolean;
    isVideo?: boolean;
    dropIndex?: number;
  };
  setIsUpdateVideoRequest?: any;
  handleCheckbox: ({ inventoryId }: { inventoryId: string }) => void;
  handleCategory?: ({ schoolYear }: { schoolYear: string }) => void;
}

const CalenderContext = createContext<CalenderInterface>({
  active: false,
  invontriesId: "",
  loading: {
    isLoading: false,
    UpdatedLoading: false,
    isUpdateing: "",
  },
  videoRequestData: [],
  videoThemesData: [],
  handleActive: () => {},
  handleCheckbox: () => {},
  loadingVideoRequest: false,
  handleActiveClose: () => {},
  handleGetAllThemes: () => {},
  handleCloseInventory: () => {},
  handleAddIntoVideoPlan: () => {},
  handleAddedVideoRequest: () => {},
  handleGetAllUnassigendVideo: () => {},
  isUpdateVideoRequest: { videRequestId: "", isDrop: false, themeId: "", dragMedia: {} },
});

export const CalenderContextCollection = ({ children }: { children: React.ReactNode }) => {
  const currentUserRole = typeof window !== "undefined" ? localStorage.getItem("user-role") : null;

  const [loading, setLoading] = useState<{
    isLoading: boolean;
    UpdatedLoading: boolean;
    isUpdateing?: string;
  }>({
    isLoading: false,
    UpdatedLoading: false,
    isUpdateing: "",
  });

  const [isUpdateVideoRequest, setIsUpdateVideoRequest] = useState<{
    videRequestId: string;
    themeId: string;
    dragMedia?: any;
    isDrop: boolean;
    isVideo?: boolean;
    inventoryId?: string;
    dropIndex?: number;
  }>({
    videRequestId: "",
    inventoryId: "",
    isDrop: false,
    isVideo: false,
    themeId: "",
    dragMedia: {},
  });

  const [active, setActive] = useState<boolean>(false);
  const [schoolYear, setSchoolYear] = useState<string>("");
  const [videoThemesData, setVideoThemesData] = useState([]);
  const [pageLoader, setPageLoader] = useState<boolean>(true);
  const [videoRequestData, setVideoRequestData] = useState([]);
  const [invontriesId, setInvontriesId] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [loadingVideoRequest, setLoadingVideoRequest] = useState<boolean>(false);

  const clientContext = useClients();
  const selectedClient = clientContext && clientContext?.selectedClient;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const handleCheckbox = ({ inventoryId }: { inventoryId: string }) => {
    setInvontriesId(inventoryId);
  };

  const handleCloseInventory = () => {
    setInvontriesId("");
  };

  const handleActiveFilter = () => {
    setActiveFilter(false);
  };
  const handleUnActiveFilter = () => {
    setActiveFilter(true);
  };

  const handleActive = () => {
    handleCloseInventory();
    setActive(!active);
  };

  const handleActiveClose = () => {
    handleCloseInventory();
    setActive(false);
  };

  const handleAddedVideoRequest = () => {
    handleGetAllUnassigendVideo();
  };

  const handleAddIntoVideoPlan = ({
    themeId,
    invontriesId,
  }: {
    themeId: string;
    invontriesId: string;
  }) => {
    setIsUpdateVideoRequest((prev: any) => ({
      ...prev,
      isVideo: true,
      dragMedia: { inventoryId: invontriesId },
      isDrop: true,
      themeId: themeId,
    }));
  };

  // call api to unassigned videos

  const handleCategory = ({ schoolYear }: { schoolYear: string }) => {
    setSchoolYear(schoolYear);
  };

  const handleGetAllUnassigendVideo = async () => {
    setLoadingVideoRequest(true);
    try {
      const res = await getAllVideoRequests({
        clientId: selectedClientId as string,
      });
      if (res) {
        setVideoRequestData(res);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoadingVideoRequest(false);
      setPageLoader(false);
    }
  };

  useEffect(() => {
    selectedClientId && handleGetAllUnassigendVideo();
  }, [selectedClientId]);

  // call themes api

  const handleGetAllThemes = async () => {
    if (schoolYear) {
      setLoading((prev) => ({ ...prev, isLoading: true, UpdatedLoading: false }));
      try {
        const res = await getAllVideoRequestsThemes({
          clientId: selectedClientId as string,
          schoolYear,
        });

        if (res) {
          setVideoThemesData(res);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading((prev) => ({ ...prev, isLoading: false, UpdatedLoading: false }));
      }
    }
  };

  const handleChangeVideoRequest = async ({
    videoRequestId,
    themeIdRemove,
    themeIdAdd,
    orderNumber,
  }: {
    videoRequestId: string;
    themeIdRemove: string;
    themeIdAdd: string;
    orderNumber: number;
  }) => {
    try {
      const changeVideoRequestThemeIds = { videoRequestId, themeIdRemove, themeIdAdd, orderNumber };
      await changeVideoRequestThemeId({ changeVideoRequestThemeIds });
    } catch (error) {
      console.error("Error changing theme for video request:", error);
    }
  };

  const updateVideoThemes = ({
    videoId,
    themeIdRemove,
    themeIdAdd,
    orderNumber,
  }: {
    videoId: string;
    themeIdRemove: string;
    themeIdAdd: string;
    orderNumber: number;
  }) => {
    if (themeIdAdd === themeIdRemove) {
      setVideoThemesData((prevState: any) => {
        return prevState.map((theme: any) => {
          if (theme._id === themeIdRemove || theme._id === themeIdAdd) {
            const updatedTheme = { ...theme };
            if (themeIdRemove === themeIdAdd) {
              const itemIndex = updatedTheme.videoRequestIds.findIndex(
                (item: any) => item.videoRequestId._id === videoId,
              );
              if (itemIndex !== -1) {
                const itemToMove = updatedTheme.videoRequestIds.splice(itemIndex, 1)[0];
                updatedTheme.videoRequestIds.splice(orderNumber, 0, itemToMove);
              }
              updatedTheme.videoRequestIds = updatedTheme.videoRequestIds.map(
                (item: any, index: number) => ({
                  ...item,
                  orderNumber: index,
                }),
              );
            } else {
              const sourceTheme = prevState.find((t: any) => t._id === themeIdRemove);
              if (sourceTheme) {
                sourceTheme.videoRequestIds = sourceTheme.videoRequestIds.filter(
                  (item: any) => item.videoRequestId._id !== videoId,
                );
                sourceTheme.videoRequestIds = sourceTheme.videoRequestIds.map(
                  (item: any, index: number) => ({
                    ...item,
                    orderNumber: index,
                  }),
                );
              }

              const targetTheme = prevState.find((t: any) => t._id === themeIdAdd);
              if (targetTheme) {
                // Shift order numbers of the existing videoRequestIds in the target theme
                targetTheme.videoRequestIds = targetTheme.videoRequestIds.map((item: any) => ({
                  ...item,
                  orderNumber:
                    item.orderNumber >= orderNumber ? item.orderNumber + 1 : item.orderNumber,
                }));

                // Add the new videoRequestId at the specified orderNumber in the target theme
                targetTheme.videoRequestIds.splice(orderNumber, 0, {
                  orderNumber: orderNumber,
                  videoRequestId: { _id: videoId }, // Add the full videoRequestId data
                });

                // Reorder the videoRequestIds to maintain sequential order numbers
                targetTheme.videoRequestIds = targetTheme.videoRequestIds.map(
                  (item: any, index: number) => ({
                    ...item,
                    orderNumber: index,
                  }),
                );
              }
            }

            return updatedTheme;
          }

          return theme;
        });
      });
    } else {
      setVideoThemesData((prevState: any) => {
        return prevState.map((theme: any) => {
          // If we are dealing with themeIdAdd
          if (theme._id === themeIdAdd) {
            const updatedTheme = { ...theme };

            // Find the video data using the videoId from videoRequestIds in the theme
            const videoData = prevState
              .find((t: any) => t._id === themeIdRemove)
              ?.videoRequestIds.find(
                (item: any) => item.videoRequestId._id === videoId,
              )?.videoRequestId;

            if (!videoData) {
              return updatedTheme; // If videoData is not found, return the theme as is
            }

            // Prevent adding the same videoRequestId if it's already in themeIdAdd
            const isAlreadyInTheme = updatedTheme.videoRequestIds.some(
              (item: any) => item.videoRequestId._id === videoId,
            );

            if (isAlreadyInTheme) {
              return updatedTheme; // If it's already in themeIdAdd, do not add again
            }

            // Adjust the order numbers of the current videoRequestIds in themeIdAdd
            updatedTheme.videoRequestIds = updatedTheme.videoRequestIds.map((item: any) => ({
              ...item,
              orderNumber:
                item.orderNumber >= orderNumber ? item.orderNumber + 1 : item.orderNumber,
            }));

            // Insert the videoRequestId at the specified orderNumber
            updatedTheme.videoRequestIds.splice(orderNumber, 0, {
              orderNumber: orderNumber,
              videoRequestId: videoData,
            });

            // Reorder the videoRequestIds to maintain sequential order numbers
            updatedTheme.videoRequestIds = updatedTheme.videoRequestIds.map(
              (item: any, index: number) => ({
                ...item,
                orderNumber: index,
              }),
            );

            return updatedTheme;
          }

          // If we are dealing with themeIdRemove, remove the videoRequestId
          if (theme._id === themeIdRemove) {
            const updatedTheme = { ...theme };

            // Remove the videoRequestId from themeIdRemove
            updatedTheme.videoRequestIds = updatedTheme.videoRequestIds.filter(
              (item: any) => item.videoRequestId._id !== videoId,
            );

            // Reorder the videoRequestIds after removal to maintain sequential order
            updatedTheme.videoRequestIds = updatedTheme.videoRequestIds.map(
              (item: any, index: number) => ({
                ...item,
                orderNumber: index,
              }),
            );

            return updatedTheme;
          }

          return theme;
        });
      });
    }
  };

  const onDragEnd = useCallback(
    async (result: any) => {
      if (!result.destination) {
        return;
      }

      const videoRequestId = result?.draggableId;
      const themeIdAdd = result?.destination?.droppableId;
      const orderNumber = result?.destination?.index;
      const themeIdRemove = result?.source?.droppableId;

      if (result && activeFilter === false && currentUserRole != "producer") {
        updateVideoThemes({ videoId: videoRequestId, themeIdRemove, themeIdAdd, orderNumber });
        await handleChangeVideoRequest({ videoRequestId, themeIdRemove, themeIdAdd, orderNumber });
      } else {
        if (currentUserRole != "producer") {
          createNotification({
            type: "warn",
            message: "Drag-and-drop is disabled",
            description: "Please turn off the filter to proceed",
          });
        } else {
          createNotification({
            type: "warn",
            message: "Drag-and-drop is disabled",
            description: "You are not allowed to drag and drop",
          });
        }
      }
    },
    [activeFilter, currentUserRole],
  );

  useEffect(() => {
    schoolYear && selectedClientId && handleGetAllThemes();
  }, [selectedClientId, schoolYear]);

  const contextData = {
    active,
    loading,
    onDragEnd,
    pageLoader,
    setLoading,
    schoolYear,
    invontriesId,
    handleActive,
    handleCategory,
    handleCheckbox,
    videoThemesData,
    videoRequestData,
    handleActiveClose,
    handleActiveFilter,
    setVideoThemesData,
    handleGetAllThemes,
    loadingVideoRequest,
    handleUnActiveFilter,
    handleCloseInventory,
    isUpdateVideoRequest,
    handleAddIntoVideoPlan,
    setIsUpdateVideoRequest,
    handleAddedVideoRequest,
    handleGetAllUnassigendVideo,
  };

  return <CalenderContext.Provider value={contextData}>{children}</CalenderContext.Provider>;
};

export const useCalender = (): CalenderInterface => {
  const context = useContext(CalenderContext);
  if (!context) {
    console.error("useClients must be used within a InventoriesContextProvider");
  }

  return context;
};
