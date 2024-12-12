"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// import {
//   LibraryContextInterface,
//   LibraryFormInterface,
//   LibraryMediaInterface,
//   SelectedWidgetInterface,
// } from "../app/interface/library-interface/library-interface";
import { addWidgetMedia, getAllLibrary } from "../app/api/library-api";
import { useForm } from "react-hook-form";
import { useDebounce } from "../app/custom-hook/debounce";
import createNotification from "../components/create-notification";
import { usePathname, useRouter } from "next/navigation";

const LibraryContext = createContext<any>(undefined);

const LibraryContextCollection = ({ children }: { children: React.ReactNode }) => {
  const route = useRouter();
  const pathname = usePathname();
  const { register, control, reset, watch, setValue, handleSubmit } = useForm<any>({
    defaultValues: {
      selectedWidget: { value: "", label: "" },
      videoURL: "",
      shortLink: "",
      description: "",
      name: "",
      producers: [{ value: "", label: "" }],
      shareable: true,
      active: true,
      backgroundColor: "#000000",
      textColor: "#ffffff",
    },
  });
  // seleted Client from localStorage
  const selectedClientIds =
    typeof window !== "undefined" ? localStorage.getItem("selectedClient") : null;

  const isToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMediaList, setIsMobileMediaList] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState<string>("");
  const [customOrderNumber, setCustomOrderNumber] = useState<number>();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedWidget, setSelectedWidget] = useState<string>("");
  const [isLibraryLoading, setIsLibraryLoading] = useState<boolean>(false);
  const [showWidgetSlider, setShowWidgetSlider] = useState<boolean>(false);
  const [library, setLibrary] = useState<any>({} as any);
  const [selectedClient, setSelectedClient] = useState<string>(selectedClientIds as string);
  const [createUpdateMedia, setCreateUpdateMedia] = useState<{
    isModal: boolean;
    isCreate: boolean;
    isUpdate: boolean;
    mediaId: string;
    isCreated: number;
  }>({
    mediaId: "",
    isCreated: 0,
    isModal: false,
    isCreate: false,
    isUpdate: false,
  });

  const searchParamsValue = useDebounce({ value: searchParams, milliSeconds: 2000 });

  const handleCloseCreateUpdate = () => {
    setValue?.("videoURL", "");
    setValue?.("shortLink", "");
    setValue?.("description", "");
    setValue?.("reference", "");
    setValue?.("backgroundColor", "");
    setValue?.("textColor", "");
    setValue?.("producers", undefined);
    reset(
      {
        videoURL: "",
        shortLink: "",
        description: "",
        reference: "",
        name: "",
        producers: [],
        shareable: true,
        active: true,
        backgroundColor: "#000000",
        textColor: "#ffffff",
      },
      { keepValues: true },
    );

    setCreateUpdateMedia((prev) => ({
      ...prev,
      isModal: false,
      isCreate: false,
      isUpdate: false,
      mediaId: "",
    }));
  };

  const handleHighlightIndex = ({ value }: { value: number | null }) => {
    setHighlightIndex(value);
  };

  const handleUpdateMedia = () => {
    setValue("background", "#000000");
    setValue("textColor", "#ffffff");
    setCreateUpdateMedia((prev) => ({
      ...prev,
      isModal: true,
      isCreate: false,
      isUpdate: true,
    }));
  };

  const handleVideoModalClose = () => {
    setIsMobileMediaList(false);
  };

  const handleSelectedClients = ({ data }: { data: string }) => {
    if (data != undefined) {
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedClient", data);
        setSelectedClient(data);
      }
    }
  };

  const handleCloseWidget = () => {
    setShowWidgetSlider(false);
    setSelectedWidget("");
    setLibrary((prev: any) => ({ ...prev, selectedWidget: {} }));
    setValue?.("selectedWidget", { value: "", label: "" });
  };
  const handleSelectedValue = ({ value }: { value: string }) => setSelectedValue(value);

  const handleSetShowWidgetSlider = () => {
    handleCloseWidget();
    setShowWidgetSlider(!showWidgetSlider);
  };

  const handleMediaDeleted = ({ mediaId }: { mediaId: string }) => {
    // Assuming library is defined and available
    const updatedMedia = (library?.media || []).filter((item: any) => item._id !== mediaId);

    // Assuming reordering logic if needed

    setLibrary((prev: any) => {
      return {
        ...prev,
        media: updatedMedia, // Correctly update media array after filtering
      };
    });
  };

  const handleCreated = () => {
    setCreateUpdateMedia((prev) => ({ ...prev, isCreated: prev.isCreated + 1 }));
  };

  const handleVideoModalOpen = () => {
    setIsMobileMediaList(true);
  };

  const handleAddWidgetMediaOrder = async ({
    dragMedia,
    newOrder,
  }: {
    // dragMedia: DragMediainterface;
    dragMedia: any;
    newOrder: number;
  }) => {
    // Filter out the media with the same _id as dragMedia
    const filteredMedia = library?.media?.filter((x: any) => x._id !== dragMedia?._id);

    // Create a new media item with the new order
    const newMediaItem = {
      order: newOrder,
      _id: dragMedia,
    };

    // Insert the new media item at the specified newOrder index
    const updatedSelectedWidgetMedia = [
      ...library?.selectedWidget?.media.slice(0, newOrder),
      newMediaItem,
      ...library?.selectedWidget?.media.slice(newOrder),
    ];

    // Reorder media items to ensure sequential order
    const reorderedMedia = updatedSelectedWidgetMedia.map((item, index) => ({
      ...item,
      order: index + 1, // Adjust this if you need a different order logic
    }));

    try {
      const res = await addWidgetMedia({
        id: selectedWidget,
        data: {
          media: reorderedMedia,
        },
      });

      if (res.status === 200) {
        setLibrary((prev: any) => ({
          ...prev,
          media: filteredMedia,
          selectedWidget: {
            ...prev.selectedWidget,
            media: reorderedMedia,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating media:", error);
    }
  };

  const handleMoveWidgetMediaLibraryUp = ({ order }: { order: number }) => {
    // Assuming library is defined and available
    const orderNumber = order - 1;

    const updatedMedia = library?.selectedWidget?.media ? [...library.selectedWidget.media] : [];

    // Insert the new item at the specified order
    updatedMedia.splice(orderNumber, 0, { order: orderNumber, type: "mediaDrop" } as any);
    // Reorder the items
    for (let i = 0; i < updatedMedia.length; i++) {
      updatedMedia[i].order = i + 1;
    }

    setLibrary((prev: any) => {
      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
      };
    });
  };

  const handleSelectedWidget = ({ selectedWidgetId }: { selectedWidgetId: string }) =>
    setSelectedWidget(selectedWidgetId);

  const handleAddWidgetMediaSelectedMedia = async ({ mediaId }: { mediaId: string[] }) => {
    // Step 1: Filter the media array to get the items matching the mediaId

    const filteredMedia = library?.media?.filter((item: any) => mediaId?.includes(item._id));
    if (customOrderNumber) {
      handleAddWidgetMediaOrder({
        dragMedia: filteredMedia?.[0],
        newOrder: customOrderNumber,
      });
    } else {
      const updatedMediaWithOrder =
        filteredMedia?.map((item: any, index: any) => ({
          _id: item,
          order: index + 1,
        })) || [];
      const currentSelectedMedia = library.selectedWidget.media.map((item: any, index: any) => ({
        ...item,
        order: updatedMediaWithOrder?.length + index + 1, // Continue order sequence
      }));

      const updatedSelectedWidgetMedia = [...updatedMediaWithOrder, ...currentSelectedMedia];

      const remainingMedia = library?.media?.filter((item: any) => !mediaId.includes(item._id));

      {
        try {
          await addWidgetMedia({
            id: selectedWidget,
            data: {
              media: updatedSelectedWidgetMedia,
            } as any,
          });
        } catch (error) {
          console.error(error);
          throw new Error("Failed to update library");
        }
      }

      setLibrary((prev: any) => ({
        ...prev,
        media: remainingMedia,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedSelectedWidgetMedia,
        },
      }));
    }
  };

  const handleMoveWidgetMediaLibrary = ({ order }: { order: number }) => {
    // Assuming library is defined and available
    const orderNumber = order;

    const updatedMedia = library?.selectedWidget?.media ? [...library.selectedWidget.media] : [];

    // Insert the new item at the specified order
    updatedMedia.splice(orderNumber, 0, { order: orderNumber, type: "mediaDrop" } as any);

    // Reorder the items
    for (let i = 0; i < updatedMedia.length; i++) {
      updatedMedia[i].order = i + 1;
    }

    setLibrary((prev: any) => {
      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
      };
    });
  };

  const handleAddWidgetMediaNewOrder = ({
    dragMedia,
    newOrder,
  }: {
    // dragMedia: DragMediainterface;
    dragMedia: any;
    newOrder: number;
  }) => {
    const filteredMedia = library?.media?.filter((x: any) => x._id !== dragMedia?._id);

    const updatedMediaWithOrder = [
      {
        order: newOrder,
        _id: dragMedia,
      },
    ];

    // Step 3: Append the existing selectedWidget.media items after the newly ordered items
    const currentSelectedMedia = library.selectedWidget.media.map((item: any, index: any) => ({
      ...item,
      order: updatedMediaWithOrder.length + index + 1, // Continue order sequence
    }));
    // Step 4: Combine the new and existing items
    const updatedSelectedWidgetMedia = [...updatedMediaWithOrder, ...currentSelectedMedia];

    setLibrary((prev: any) => {
      return {
        ...prev,
        media: filteredMedia,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedSelectedWidgetMedia,
        },
      };
    });
  };

  const handelSetLibrary = async ({ updatedWidget }: { updatedWidget: any }) => {
    setLibrary((prevState: any) => ({
      ...prevState,
      selectedWidget: updatedWidget,
    }));
    {
      try {
        await addWidgetMedia({
          id: selectedWidget,
          data: {
            media: updatedWidget?.media ? [...updatedWidget?.media] : [],
          } as any,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update library");
      }
    }
  };

  const handleIsLoadingTrue = () => {
    setIsLoading(true);
  };
  // remove media from selected widget
  const handleRemoveWidgetMediaLibrary = ({ widgetID }: { widgetID: string }) => {
    const removedMedia = library?.selectedWidget?.media?.find(
      ({ _id }: any) => _id?._id === widgetID,
    )?._id;
    const updatedMedia = library?.selectedWidget?.media?.filter(
      ({ _id }: any) => _id?._id !== widgetID,
    );

    setLibrary((prev: any) => {
      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
        media: [...(prev.media || []), removedMedia],
      };
    });
  };

  const handleSetOrder = ({ orderNumber }: { orderNumber: number }) => {
    setCustomOrderNumber(orderNumber);
  };

  const handleRemove = ({ order }: { order: number }) => {
    // Assuming library is defined and available
    const updatedMedia = (library.selectedWidget?.media || []).filter(
      (item: any) => item.order !== order || item.type !== "mediaDrop",
    );

    // Reorder the remaining items
    for (let i = 0; i < updatedMedia.length; i++) {
      updatedMedia[i].order = i + 1;
    }

    setLibrary((prev: any) => {
      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
      };
    });
  };

  const handleDragEnd = () => {
    setHighlightIndex(null);
    document?.getElementById("video_data")?.remove();
  };

  const handleUpdateThumbnailOnReplaceVimeoVideo = ({ updateLibrary }: any) => {
    setLibrary((prev: any) => ({
      ...prev,
      media: prev.media.map((data: any) =>
        data?._id === updateLibrary?._id ? { ...data, ...updateLibrary } : data,
      ),
    }));
  };

  // api here
  const getAllLibraryMedia = useCallback(async () => {
    setIsLibraryLoading(true);
    try {
      const res = await getAllLibrary({
        params: {
          search: searchParamsValue,
          active: selectedValue,
          clientId: selectedClient || selectedClientIds || "",
          selectedWidgetId:
            watch("selectedWidget")?.value != "" ? watch("selectedWidget")?.value : selectedWidget,
        },
      });

      if (res?.status === 200) {
        setLibrary((prev: any) => ({
          ...prev,
          widgets: res.data.allWidgets,
          media: res.data.allLibraries,
          selectedWidget: res?.data?.selectedWidget
            ? {
                ...res?.data?.selectedWidget,
                media: res?.data?.selectedWidget?.media || [],
              }
            : {},
        }));
      } else if (res?.response?.status === 403) {
        setIsLoading(true);
        setLibrary({});
        localStorage.setItem("redirect_url", "/" as string);
        route.push("/");
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.msg,
        });
      }
      setIsLibraryLoading(false);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [
    isToken,
    selectedValue,
    selectedWidget,
    selectedClient,
    selectedClientIds,
    searchParamsValue,
    watch("selectedWidget")?.value,
    createUpdateMedia?.isCreated,
  ]);

  const handlePageRedirect = () => {
    // setIsLoading(true);
    // (selectedClient || selectedClientIds) && isToken && getAllLibraryMedia();
  };
  // reset the thumbnail when updateing and viemo is in processing

  const checkIsMediaUpdated = useMemo(() => {
    return library?.media?.some((libraryMedia: any) => libraryMedia?.isUpdate) || false;
  }, [library]);

  const handleUpdateThumbnail = useCallback(async () => {
    if (isToken !== undefined && isToken !== null) {
      try {
        const res = await getAllLibrary({
          params: {
            active: selectedValue,
            clientId: selectedClient || selectedClientIds || "",
            selectedWidgetId:
              watch("selectedWidget")?.value !== ""
                ? watch("selectedWidget")?.value
                : selectedWidget,
          },
        });

        if (res?.status === 200) {
          setLibrary((prev: any) => ({
            ...prev,
            widgets: res.data.allWidgets,
            media: res.data.allLibraries,
            selectedWidget: res?.data?.selectedWidget
              ? {
                  ...res?.data?.selectedWidget,
                  media: res?.data?.selectedWidget?.media || [],
                }
              : {},
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    isToken,
    selectedValue,
    selectedWidget,
    selectedClient,
    selectedClientIds,
    watch("selectedWidget")?.value,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const intervalTime = 30000; // 30 seconds
    const duration = 180000; // 3 minutes

    if (
      checkIsMediaUpdated === true &&
      pathname === "/library" &&
      isToken !== undefined &&
      isToken !== null
    ) {
      interval = setInterval(handleUpdateThumbnail, intervalTime);

      // Stop the interval after 3 minutes
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [handleUpdateThumbnail, isToken, checkIsMediaUpdated, pathname]);

  useEffect(() => {
    if (watch("selectedWidget")?.value) setSelectedWidget(watch("selectedWidget")?.value);
  }, [watch("selectedWidget")]);

  useEffect(() => {
    if (
      (selectedClient || selectedClientIds) &&
      pathname === "/library" &&
      isToken !== undefined &&
      isToken !== null
    ) {
      getAllLibraryMedia();
    }
  }, [selectedClientIds, selectedClient, getAllLibraryMedia, pathname, isToken]);

  const contextData = {
    watch,
    library,
    control,
    setValue,
    register,
    isLoading,
    searchParams,
    handleSubmit,
    setIsLoading,
    handleRemove,
    handleCreated,
    handleDragEnd,
    handleSetOrder,
    selectedWidget,
    selectedClient,
    setSearchParams,
    highlightIndex,
    handelSetLibrary,
    showWidgetSlider,
    isLibraryLoading,
    createUpdateMedia,
    handleCloseWidget,
    isMobileMediaList,
    handleUpdateMedia,
    handlePageRedirect,
    handleMediaDeleted,
    handleSelectedValue,
    handleHighlightIndex,
    handleIsLoadingTrue,
    handleVideoModalOpen,
    handleSelectedWidget,
    handleUpdateThumbnail,
    handleVideoModalClose,
    handleSelectedClients,
    handleCloseCreateUpdate,
    handleSetShowWidgetSlider,
    handleAddWidgetMediaOrder,
    handleAddWidgetMediaNewOrder,
    handleMoveWidgetMediaLibrary,
    handleRemoveWidgetMediaLibrary,
    handleMoveWidgetMediaLibraryUp,
    handleAddWidgetMediaSelectedMedia,
    handleUpdateThumbnailOnReplaceVimeoVideo,
  };

  return <LibraryContext.Provider value={contextData}>{children}</LibraryContext.Provider>;
};

const useLibrary = (): any => {
  const context = useContext(LibraryContext);
  if (!context) {
    console.error("useLibrary must be used within a LibraryContextCollection");
  }
  return context as any;
};

export { LibraryContextCollection, useLibrary };
