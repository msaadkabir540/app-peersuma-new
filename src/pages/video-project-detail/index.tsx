/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { writeText } from "clipboard-polyfill";
import React, { useEffect, useMemo, useState } from "react";

import Draft from "./components/drafts";
import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import Loader from "@/src/components/loader";
import Loading from "@/src/components/loading";
import ViewContainer from "./components/views";
import Textarea from "@/src/components/textarea";
import PageHeader from "./components/page-header";
import CustomInstallPWA from "../custom-install-pwa";
import ButtonContainer from "./components/button-container";
import ImageComponent from "@/src/components/image-component";
import createNotification from "@/src/components/create-notification";

import { deleteShotById, videoProjectApi } from "@/src/app/api/video-projects";

import { videoProjectMediaShotApi } from "@/src/app/api/video-project-media-shot";

import { useClients } from "@/src/(context)/context-collection";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import { statusOption } from "@/src/app/option";

import { ClientInterface } from "@/src/app/interface/client-interface/client-interface";
import {
  AlbumShotInterface,
  ShotMediaInterface,
  SortColumnInterface,
  UploadsMediaInterface,
  VideoHookFromInterface,
  VideoProjectInterface,
} from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";

const VideoProjectDetail = ({
  videoPageID,
  isLoading,
  handlePageLoading,
}: {
  isLoading: boolean;
  handlePageLoading: ({ value }: { value: boolean }) => void;
  videoPageID: string;
}) => {
  const router = useRouter();
  const { control, register, setValue, watch, handleSubmit } = useForm<VideoHookFromInterface>({
    defaultValues: {
      projectStatus: {},
      isInvites: { value: 3, label: "All" },
      sortMedia: { value: "date-desc", label: "Newest to Oldest" },
    },
  });

  const watchContributor = watch("contributor");
  const watchSelectedShot = watch("selectedShot");
  const watchSortMedia = watch("sortMedia");
  const watchShotLink = watch("shotLink");

  const siteLink = `${process.env.NEXT_PUBLIC_APP_URL}upload/` || "";

  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState({
    isDeleting: false,
    isPageLoading: false,
  });
  const [startDate, setStartDate] = useState();
  const [searchParams, setSearchParams] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isInvites, setIsInvites] = useState<{
    isInviteModal: boolean;
    isInviteEmailModal: boolean;
    isLoading: boolean;
    isShotUrl: boolean;
    sendShotName: string;
    shotId: string;
    sendShotToUser: string;
    sendShotToUserId?: string;
    isEditLoading: boolean;
    isCopyLoading: boolean;
  }>({
    isEditLoading: false,
    isShotUrl: false,
    isCopyLoading: false,
    isInviteModal: false,
    isLoading: false,
    isInviteEmailModal: false,
    sendShotName: "",
    shotId: "",
    sendShotToUser: "",
    sendShotToUserId: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStatusUpdate, setIsStatusUpdate] = useState(false);
  const [editShotUrl, setEditShotUrl] = useState<{
    isEdit: boolean;
    selectedShotShotUrl: string;
  }>({ isEdit: false, selectedShotShotUrl: "" });
  const [activeView, setActiveView] = useState<string>("grid");
  const [activeList, SetActiveList] = useState<string>("media");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [videoProjectData, setVideoProjectData] = useState<VideoProjectInterface>();
  const [isContributor, setIsContributor] = useState<boolean | undefined>(false);
  const [sortColumn, setSortColumn] = useState<SortColumnInterface>({
    sortBy: "name",
    sortOrder: "asc",
  });

  const { albumId } = (videoProjectData || []) as VideoProjectInterface;
  const { albumshots } = (albumId || []) as any;

  const context = useClients();
  const allUser = context ? context.allUser : [];
  const allClients = context ? context.allClients : [];
  const logInUsers = context ? context.loggedInUser : [];
  const loggedInUserId = context ? context.userLoggedIn : [];
  const selectedClient = context ? context.selectedClientIds : [];

  const selectedClientData = useMemo(() => {
    return allClients?.find((data) => {
      return data?._id === selectedClient;
    });
  }, [allClients, selectedClient]);

  const searchParamsValue = useDebounce({ value: searchParams, milliSeconds: 2000 });
  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchParams(e.target.value);
  const handleSetEventCross = () => setSearchParams("");

  // video project api call here
  const sortOrder = useMemo(() => {
    switch (watchSortMedia?.value) {
      case "name-asc":
        return { sortBy: "name", sortOrder: "asc" };
      case "name-desc":
        return { sortBy: "name", sortOrder: "desc" };
      case "date-acs":
        return { sortBy: "updatedAt", sortOrder: "asc" };
      case "date-desc":
        return { sortBy: "updatedAt", sortOrder: "desc" };
      default:
        return { sortBy: "updatedAt", sortOrder: "desc" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSortMedia]);

  const handleMediaList = () => {
    SetActiveList("media");
  };

  const handleUpdateShotUrlModalOpen = () => {
    setIsInvites((prev) => ({ ...prev, isShotUrl: true }));
  };

  const handleUpdateShotUrlModalClose = () => {
    setIsInvites((prev) => ({ ...prev, isShotUrl: false }));
  };

  const handleDraftsList = () => {
    SetActiveList("drafts");
  };

  const handleSort = ({ sort }: { sort: { sortBy: string; sortOrder: "asc" | "desc" } }) => {
    setSortColumn({ sortBy: sort?.sortBy, sortOrder: sort?.sortOrder });
  };

  const handleVideoProjectId = async ({ id }: { id: string }) => {
    setIsLoadingState((prev) => ({ ...prev, isPageLoading: true }));
    try {
      const urlData = {
        id,
      };
      const res: any = await videoProjectApi.performAction("get-video-project-byId", urlData);

      if (res) {
        const { videoProjectById } = res?.getVideoProject || [];
        const isContributor = videoProjectById?.contributor?.some(
          (data: any) =>
            data?.videoProjectId === videoPageID && data?.userId?._id === loggedInUserId,
        );
        setIsContributor(isContributor);
        setVideoProjectData(videoProjectById);
      }

      handlePageLoading({ value: false });
    } catch (error) {
      console.error(error);
      handlePageLoading({ value: false });
    }
    setIsLoadingState((prev) => ({ ...prev, isPageLoading: false }));
  };

  const handleStatusChange = async ({ status }: { status: string }) => {
    setIsStatusUpdate(true);
    const token = localStorage?.getItem("token");
    try {
      const updateData = {
        name: videoProjectData?.name,
        oldStatus: videoProjectData?.status,
        statusChangeFrom: "projectsPeersuma",
        email: logInUsers?.email,
        contactNumber: logInUsers?.contactNumber,
        userName: logInUsers?.username,
        status: status || watch("projectStatus")?.value,
      };
      const urlData = {
        videoPageID,
        token,
        updateData,
      };
      const res: any = await videoProjectApi.performAction("update-video-project-status", urlData);
      if (res) {
        setValue?.("status", res?.updatedStatus?.status);
        setVideoProjectData((prev: any) => ({
          ...prev,
          status: res?.updatedStatus?.status,
        }));
        setIsStatusUpdate(false);
        createNotification({ type: "success", message: "Success!", description: "Status Updated" });
      }
    } catch (error) {
      setIsStatusUpdate(false);
      console.error(error);
    }
  };

  const handleUploadMedia = async ({
    id,
    uploads,
  }: {
    id: string;
    uploads: UploadsMediaInterface[];
  }) => {
    setLoadingPage(true);

    try {
      // Map over uploads to add userId to each media item
      const uploadsData = uploads?.map((upload) => ({
        ...upload,
        userId: loggedInUserId,
      }));

      // Construct uploadMediaData object
      const uploadMediaData = {
        id,
        media: uploadsData,
      };
      const response = await videoProjectMediaShotApi?.performAction({
        action: "upload-media",
        data: uploadMediaData,
      });

      if (response) {
        createNotification({
          type: "success",
          message: "Success!",
          description: "Media uploaded.",
        });
        setVideoProjectData((prev) => {
          if (!prev?.albumId) return prev;

          const updatedAlbumshots = prev.albumId.albumshots?.map((data: any) =>
            data?._id === id
              ? {
                  ...data,
                  media: [...(data.media || []), ...uploadsData],
                }
              : data,
          );

          return {
            ...prev,
            albumId: {
              ...prev.albumId,
              albumshots: updatedAlbumshots,
            },
          };
        });
      }

      handleVideoProjectId({ id: videoPageID });
      setLoadingPage(false);
    } catch (error) {
      // Handle errors
      console.error(error);
      // Reset loading state in case of error
      setLoadingPage(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsUpdate(true);
    const updateData = {
      name: data?.videoProjectName,
      description: data?.description,
      status: data?.status,
      email: logInUsers?.email,
      userName: logInUsers?.username,
    };
    const urlData = {
      videoPageID,
      updateData,
    };
    if (data?.status != videoProjectData?.status) {
      handleStatusChange({ status: data?.status });
    }
    const res: any = await videoProjectApi.performAction("update-video-project", urlData);

    if (res) {
      const updateResult = res?.getVideoProject;

      setVideoProjectData((prev: any) => ({
        ...prev,
        name: updateResult?.name !== undefined ? updateResult?.name : prev.name,
        description:
          updateResult?.description !== undefined ? updateResult?.description : prev.description,
        status: updateResult?.status !== undefined ? updateResult?.status : prev.status,
      }));
      setIsOpen(false);
      setIsUpdate(false);
    }
  };

  const handleCreateUpdateShot = async (data: any) => {
    setIsProcessing(true);
    try {
      const shotData = {
        album: videoProjectData?.albumId?._id,
        name: data?.name,
        dueDate: startDate,
        description: data?.description,
      };

      const updateShot = {
        shotId: data?.shotId,
        name: data?.name,
        dueDate: startDate,
        description: data?.description,
      };

      const response: any = data?.updated
        ? await videoProjectMediaShotApi.performAction({
            action: "update-shot",
            data: updateShot,
          })
        : await videoProjectMediaShotApi.performAction({
            action: "add-shot",
            data: shotData,
          });
      if (response?.status === 200) {
        // if (data?.updated)
        const updateMedia = ({ prevState, response }: { prevState: any; response: any }) => {
          const newState = { ...prevState };
          if (response) {
            const index = newState.albumId.albumshots?.findIndex(
              (albumshot: any) => albumshot?._id === response?._id,
            );
            index !== -1
              ? (newState.albumId.albumshots[index] = response)
              : newState.albumId.albumshots.push(response);
          }
          return newState;
        };
        setVideoProjectData((prevState: any) =>
          updateMedia({ prevState, response: response?.data?.data } as any),
        );
        data?.updated
          ? createNotification({
              type: "success",
              message: "Success!",
              description: "Scene updated.",
            })
          : createNotification({
              type: "success",
              message: "Success!",
              description: "New scene added.",
            });
        setValue("shotName", "");
        setStartDate(undefined);
        setIsProcessing(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectedMediaShot = useMemo(() => {
    const selectedShotId = watchSelectedShot?.value;
    const selectedShot = albumshots
      ?.filter((shot: any) => shot?._id === selectedShotId)
      .map((shot: any) => {
        if (shot.media && shot.media.length > 0) {
          switch (sortColumn.sortBy) {
            case "name":
              shot.media.sort((a: any, b: any) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return sortColumn.sortOrder === "asc" ? -1 : 1;
                }
                if (nameA > nameB) {
                  return sortColumn.sortOrder === "asc" ? 1 : -1;
                }
                return 0;
              });
              break;
            case "updatedAt":
              shot.media.sort((a: any, b: any) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);
                return sortColumn.sortOrder === "asc"
                  ? dateA.getTime() - dateB.getTime()
                  : dateB.getTime() - dateA.getTime();
              });
              break;
            // Add more cases if needed for additional sorting criteria
            default:
              break;
          }
        }
        return shot;
      });

    return selectedShot;
  }, [videoProjectData, albumshots, watchSelectedShot, sortColumn]);

  const selectedMediaShotWithUsername = useMemo(() => {
    const contributor = watchContributor?.value;
    return selectedMediaShot
      ? selectedMediaShot.map((shot: AlbumShotInterface) => ({
          ...shot,
          media: shot.media
            ?.filter(({ userId }) => {
              if (contributor === "all" || !contributor) return true;
              if (contributor === "guest") return userId === null;
              return userId?._id === contributor;
            })
            ?.filter(({ userId }) => {
              return isContributor ? userId?._id === loggedInUserId : true;
            })
            ?.map((media: ShotMediaInterface) => {
              return {
                ...media,
                username: media?.userId?.username || "Guest",
              };
            }),
        }))
      : [];
  }, [watchContributor, selectedMediaShot, isContributor, loggedInUserId]);

  const searchSceneMediaData = useMemo(() => {
    if (!selectedMediaShotWithUsername || selectedMediaShotWithUsername.length === 0) return [];

    return selectedMediaShotWithUsername?.map((item: any) => ({
      ...item,
      media: item.media
        ?.filter((data: any) => {
          if (!searchParamsValue) return true;
          return data?.name?.toLowerCase()?.includes(searchParamsValue?.toLowerCase());
        })
        ?.sort((a: any, b: any) => {
          const fieldA = a[sortOrder.sortBy]?.toString()?.toLowerCase() || "";
          const fieldB = b[sortOrder.sortBy]?.toString()?.toLowerCase() || "";

          if (sortOrder.sortOrder === "asc") {
            return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
          } else {
            return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
          }
        }),
    }));
  }, [selectedMediaShotWithUsername, searchParamsValue, sortOrder]);

  const handleDeleteShotMedia = async ({ shotId }: { shotId: string }) => {
    setIsProcessing(true);
    try {
      const params = {
        albumshotId: selectedMediaShot?.[0]?._id,
        mediaIdsToDelete: shotId,
      };
      const res: any = await videoProjectMediaShotApi.performAction({
        action: "delete-media",
        data: params,
      });

      if (res?.status === 200) {
        setVideoProjectData((prevState: any) => {
          return {
            ...prevState,
            albumId: {
              ...prevState.albumId,
              albumshots: prevState.albumId.albumshots.map((shot: any) => {
                if (shot._id === selectedMediaShot[0]?._id) {
                  // Filter out the media based on shotId
                  const filteredMedia = shot.media.filter((media: any) => shotId !== media._id);
                  return {
                    ...shot,
                    media: filteredMedia,
                  };
                }
                return shot;
              }),
            },
          };
        });

        setIsProcessing(false);
        return true;
      } else {
        setIsProcessing(false);
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.error,
        });
        return false;
      }
    } catch (error) {
      createNotification({ type: "error", message: "Error!", description: "Error occurs" });
      return false;
    }
  };

  useEffect(() => {
    handlePageLoading({ value: true });
    handleVideoProjectId({ id: videoPageID });
  }, [videoPageID]);

  useEffect(() => {
    if (videoProjectData?.status) {
      const seletedValue = statusOption?.find((data) => {
        if (data.value === videoProjectData?.status) {
          return { label: data.label, value: data.value };
        }
      });

      setValue?.("projectStatus", seletedValue as any);
    }
  }, [videoProjectData?.status]);

  const shotData = useMemo(() => {
    return albumshots;
  }, [albumshots]);

  const shotsOption = useMemo(() => {
    let filteredShots = albumshots;
    if (isContributor) {
      filteredShots = filteredShots?.filter((data: any) =>
        data?.invites?.find((invite: any) => invite?.id === loggedInUserId),
      );
    }
    return filteredShots?.map((shots: any) => ({ value: shots?._id, label: shots?.name }));
  }, [albumshots, isContributor, loggedInUserId, videoProjectData]);

  const handleMoveMediaShot = async ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: string;
    moveShot: string;
    media: any;
  }) => {
    const data = {
      selectedShot,
      moveShot,
      media,
    };
    setIsProcessing(true);

    try {
      const res: any = await videoProjectMediaShotApi.performAction({
        action: "move-media-shot",
        data: data,
      });

      if (res.status === 200) {
        const updateMedia = ({
          prevState,
          moveShot,
          selectedShot,
        }: {
          prevState: any;
          moveShot: any;
          selectedShot: any;
        }) => {
          const newState = { ...prevState };

          // Update or add moveShot
          const moveShotIndex = newState.albumId.albumshots.findIndex(
            (albumshot: any) => albumshot._id === moveShot._id,
          );
          if (moveShotIndex !== -1) {
            newState.albumId.albumshots[moveShotIndex] = moveShot;
          } else {
            newState.albumId.albumshots.push(moveShot);
          }

          // Update or add selectedShot
          const selectedShotIndex = newState.albumId.albumshots.findIndex(
            (albumshot: any) => albumshot._id === selectedShot._id,
          );
          if (selectedShotIndex !== -1) {
            newState.albumId.albumshots[selectedShotIndex] = selectedShot;
          } else {
            newState.albumId.albumshots.push(selectedShot);
          }

          return newState;
        };

        // Assuming setVideoProjectData is a function to update the state
        setVideoProjectData((prevState: any) =>
          updateMedia({
            prevState,
            moveShot: res?.data?.data?.moveShot,
            selectedShot: res?.data?.data?.selectedShot,
          } as any),
        );
        createNotification({
          type: "success",
          message: "Success!",
          description: "Media moved.",
        });
        setIsProcessing(false);
        return true;
      } else {
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
    }
  };

  const handleRenameFile = async ({ shotId, s3Key }: { shotId: string; s3Key?: string }) => {
    const extension = s3Key?.split(".").pop();
    setIsProcessing(true);
    try {
      const params = {
        mediaIds: shotId,
        albumshotId: selectedMediaShot?.[0]?._id,
        rename: `${watch("renameFile")}.${extension}`,
      };

      const res: any = await videoProjectMediaShotApi.performAction({
        action: "update-media-file-name",
        data: params,
      });

      if (res?.status === 200) {
        setVideoProjectData((prevState: any) => {
          const updatedAlbumshots = prevState?.albumId?.albumshots?.map((shot: any) => {
            if (shot._id === selectedMediaShot?.[0]?._id) {
              const updatedMedia = shot?.media?.map((mediaItem: any) => {
                if (mediaItem._id === params.mediaIds) {
                  return {
                    ...mediaItem,
                    name: params.rename,
                  };
                }
                return mediaItem;
              });

              return {
                ...shot,
                media: updatedMedia,
              };
            }
            return shot;
          });

          return {
            ...prevState,
            albumId: {
              ...prevState.albumId,
              albumshots: updatedAlbumshots,
            },
          };
        });

        setIsProcessing(false);
        return true;
      } else {
        setIsProcessing(false);
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.error,
        });
        return false;
      }
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      return false;
    }
  };

  const handleInvitesModal = () => {
    setIsInvites((prev) => ({ ...prev, isInviteModal: true, isInviteEmailModal: false }));
  };

  const handleSendEmailInvite = ({
    userName,
    shotName,
    userId,
    shotId,
  }: {
    userName: string;
    shotName: string;
    userId?: string;
    shotId: string;
  }) => {
    setIsInvites((prev) => ({
      ...prev,
      isInviteModal: false,
      isInviteEmailModal: true,
      sendShotName: shotName,
      sendShotToUser: userName,
      sendShotToUserId: userId,
      shotId: shotId,
    }));

    setValue?.("inviteSearch", "");
  };

  const handleUpdateShotUrl = async ({ shotId, shotUrl }: { shotId: string; shotUrl: string }) => {
    setIsInvites((prev) => ({ ...prev, isEditLoading: true }));

    try {
      const data = {
        shotId,
        shotUrl,
      };

      const res: any = await videoProjectMediaShotApi.performAction({
        action: "update-shot-name-by-Id",
        data: data,
      });
      if (res?.response?.status === 422) {
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.error || "Scene URl already exist.",
        });
        setIsInvites((prev) => ({ ...prev, isEditLoading: false }));
      } else if (res?.status === 200) {
        createNotification({
          type: "success",
          message: "Success!",
          description: "Scene Url Updated.",
        });
        setIsInvites((prev) => ({ ...prev, isEditLoading: false }));
        const albumshotsToUpdate = videoProjectData?.albumId?.albumshots?.map((albumshot) => {
          if (albumshot?._id === shotId) {
            return {
              ...albumshot,
              shotUrl: shotUrl,
            };
          }
          return albumshot;
        });
        const updatedData = {
          ...videoProjectData,
          albumId: {
            ...videoProjectData?.albumId,
            albumshots: albumshotsToUpdate,
          },
        };
        setEditShotUrl((prev) => ({ ...prev, isEdit: false }));
        setVideoProjectData(updatedData as VideoProjectInterface);
      }
    } catch (error) {
      setIsInvites((prev) => ({ ...prev, isEditLoading: false }));
      console.error(error);
    }
  };

  const debouncedFindUser = useDebounce({ value: watch("inviteSearch"), milliSeconds: 2000 });

  const invitesUser = useMemo(() => {
    const searchTerm = debouncedFindUser;
    if (!searchTerm) {
      // If no search term provided, return all data
      return allUser;
    }

    // Convert search term to lowercase for case-insensitive matching
    const searchTermLower = searchTerm.toLowerCase();

    // Filter data based on search term matching contact number, email, or full name
    return allUser?.filter((user) => {
      const { contactNumber, email, username } = user;
      return (
        contactNumber?.includes(searchTermLower) ||
        email?.toLowerCase()?.includes(searchTermLower) ||
        username?.toLowerCase()?.includes(searchTermLower)
      );
    });
  }, [debouncedFindUser, allUser]);

  const updateInviteData = ({ prevState, response }: { prevState: any; response: any }) => {
    const newState = { ...prevState };
    if (response) {
      const index = newState.albumId.albumshots?.findIndex(
        (albumshot: any) => albumshot?._id === response?.shotId,
      );
      index !== -1 &&
        newState.albumId.albumshots[index]?.invites?.push({ id: response?.sendShotToUserId });
    }
    return newState;
  };

  const handleSendInviteEmail = async () => {
    setIsInvites((prev) => ({ ...prev, isLoading: true }));
    const emailNote = watch("emailAddNote");

    const sendInviteData = {
      emailNote,
      selectedClient,
      shotId: isInvites?.shotId,
      clientName: selectedClientData?.name,
      videoProjectId: videoProjectData?._id,
      sendShotName: isInvites?.sendShotName,
      videoProjectName: videoProjectData?.name,
      sendShotToUser: isInvites?.sendShotToUser,
      sendShotToUserId: isInvites?.sendShotToUserId,
      sendByUser: logInUsers?.username,
    };

    try {
      const response: any = await videoProjectApi?.performAction("user-invitation", sendInviteData);
      if (response.status === 200) {
        const updateResponse = {
          shotId: isInvites?.shotId,
          sendShotToUserId: isInvites?.sendShotToUserId,
        };

        setVideoProjectData((prevState: any) =>
          updateInviteData({ prevState, response: updateResponse } as any),
        );
        setValue?.("inviteSearch", "");
        setValue?.("emailAddNote", "");
        setValue?.("inviteSearch", "");
        setIsInvites((prev) => ({
          ...prev,
          isInviteModal: false,
          isInviteEmailModal: false,
          isLoading: false,
        }));
        createNotification({
          type: "success",
          message: "Success!",
          description: "Send invitation.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async ({ userId }: { userId?: string | undefined }) => {
    if (watchSelectedShot) {
      const copyLink = userId
        ? `${siteLink + watchShotLink}?uploaded=${userId}`
        : siteLink + watchShotLink;
      await writeText(copyLink);
      createNotification({
        type: "success",
        message: "Success!",
        description: "Short link copied.",
      });
    }
  };

  useEffect(() => {
    if (watchSelectedShot) {
      const selectedShot = albumshots?.find((shot: any) => {
        return shot?._id === watchSelectedShot?.value;
      });
      setEditShotUrl((prev) => ({ ...prev, selectedShotShotUrl: selectedShot?.shotUrl }));
      setValue?.("shotLink", selectedShot?.shotUrl);
    }
  }, [watchSelectedShot]);

  useEffect(() => {
    handlePageLoading({ value: true });
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      handlePageLoading({ value: false });
    }
  }, []);

  const selectedInviteShot = useMemo(() => {
    return albumshots?.find((shot: any) => {
      return shot?._id === watchSelectedShot?.value;
    });
  }, [albumshots, watchSelectedShot]);

  const addUserToShot = ({
    users,
    selectedInviteShot,
  }: {
    users: any;
    selectedInviteShot: any;
  }) => {
    users?.map((user: any) => {
      selectedInviteShot?.invites?.map((invite: any) => {
        if (invite.id === user?._id) {
          user.shot = [];
          user.shot.push(selectedInviteShot?._id);
        }
      });
    });
    return users;
  };

  const updatedUsers: any = addUserToShot({
    users: invitesUser,
    selectedInviteShot: selectedInviteShot,
  });

  useEffect(() => {
    const selectedShot = albumshots?.find((shot: any) => {
      return shot?._id === shotsOption?.[0]?.value;
    });
    const checkName = albumshots?.find((shot: any) => {
      return shot?._id === watch("selectedShot")?.value;
    });

    setValue?.(
      "selectedShot",
      (checkName ? { value: checkName?._id, label: checkName?.name } : watch("selectedShot")) ??
        shotsOption?.[0],
    );

    setValue?.("shotLink", selectedShot?.shotUrl);
    setValue?.("inviteShot", { value: selectedShot?._id, label: selectedShot?.name });
  }, [shotsOption]);

  const invitedFilterData = useMemo(() => {
    if (!updatedUsers) return [];

    const selectedShot = watchSelectedShot?.value;

    return updatedUsers
      ?.filter(({ _id, shot }: { _id: string; shot: string[] }) => {
        return _id !== loggedInUserId && selectedShot && !shot?.includes(selectedShot);
      })
      ?.map((data: any) => ({
        ...data,
        inviteUser: 2,
      }));
  }, [updatedUsers, loggedInUserId, videoProjectData, watchSelectedShot]);

  const invitedUser = useMemo(() => {
    if (!updatedUsers) return [];

    const selectedShot = watchSelectedShot?.value;

    return updatedUsers
      ?.filter(({ _id, shot }: { _id: string; shot: string[] }) => {
        return _id !== loggedInUserId && selectedShot && shot?.includes(selectedShot);
      })
      ?.map((data: any) => ({
        ...data,
        inviteUser: 2,
      }));
  }, [updatedUsers, videoProjectData, loggedInUserId, watchSelectedShot]);

  const contributorOption = useMemo(() => {
    const uniqueContributors = selectedMediaShot?.[0]?.media?.reduce((acc: any, data: any) => {
      const userId = data?.userId?._id;
      const userName = data?.userId?.username;
      if (
        userId !== undefined &&
        !acc.find((contributor: { value: string; label: string }) => contributor.value === userId)
      ) {
        acc.push({
          value: userId,
          label: userName,
        });
      } else if (
        userId === undefined &&
        !acc.find((contributor: { value: string; label: string }) => contributor.value === "guest")
      ) {
        acc.push({
          value: "guest",
          label: "Guest",
        });
      }
      return acc;
    }, []);

    return uniqueContributors?.length > 0
      ? [{ value: "all", label: "All" }, ...uniqueContributors]
      : [{ value: "all", label: "All" }];
  }, [selectedMediaShotWithUsername, loggedInUserId]);

  const handleSendReminderMail = ({ userName, userId }: { userName: string; userId: string }) => {
    handleSendEmailInvite({
      userId,
      userName: userName as string,
      shotName: watchSelectedShot?.label as string,
      shotId: watchSelectedShot?.value as string,
    });
  };

  const removeData = ({ prevState, response }: { prevState: any; response: any }) => {
    const newState = { ...prevState };

    if (response) {
      newState.albumId.albumshots = newState.albumId.albumshots?.filter(
        (albumshot: any) => albumshot._id !== response?.shotId,
      );
    }

    return newState;
  };

  const handleDeleteShotById = async () => {
    const shotId = watch("selectedShot")?.value as string;
    setIsLoadingState((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response: any = await deleteShotById({
        id: shotId,
      });
      if (response.status === 200) {
        const updatedResponse = {
          shotId: watch("selectedShot")?.value as string,
        };

        setVideoProjectData((prevState: any) =>
          removeData({ prevState, response: updatedResponse } as any),
        );
        setValue?.("selectedShot", shotsOption?.[shotsOption?.length > 1 ? -1 : 0]);
        createNotification({
          type: "success",
          message: "Success!",
          description: "Scene deleted successfully.",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingState((prev) => ({ ...prev, isDeleting: false }));
  };

  return (
    <>
      {isLoading || isLoadingState?.isPageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <div className=" md:mt-[80px] mt-[75px] h-[calc(100vh-85px)] overflow-scroll">
          <PageHeader
            isOpen={isOpen}
            control={control}
            register={register}
            setValue={setValue}
            onSubmit={onSubmit}
            isUpdate={isUpdate}
            setIsOpen={setIsOpen}
            activeList={activeList}
            handleSubmit={handleSubmit}
            videoProjectId={videoPageID}
            isContributor={isContributor}
            isStatusUpdate={isStatusUpdate}
            name={videoProjectData?.name || ""}
            handleDraftsList={handleDraftsList}
            handleStatusChange={handleStatusChange}
            status={videoProjectData?.status || ""}
            description={videoProjectData?.description || ""}
            isEditingProcess={videoProjectData?.isEditingProcess || false}
            createdDate={videoProjectData?.createdAt?.substring(0, 10) || ""}
            producerName={videoProjectData?.createdByUser?.username || ""}
          />
          <div className={`${activeList === "media" ? "m-5" : "mx-5 mb-5 mt-2"}`}>
            {activeList === "media" && (
              <div>
                <ButtonContainer
                  control={control}
                  register={register}
                  setValue={setValue}
                  shotMedia={shotData}
                  startDate={startDate}
                  activeView={activeView}
                  invitedUser={invitedUser}
                  shotsOption={shotsOption}
                  isProcessing={isProcessing}
                  setStartDate={setStartDate}
                  handleSubmit={handleSubmit}
                  searchParams={searchParams}
                  videoProjectId={videoPageID}
                  setActiveView={setActiveView}
                  isContributor={isContributor}
                  selectedShot={watchSelectedShot}
                  onSubmit={handleCreateUpdateShot}
                  watchContributor={watchContributor}
                  contributorOption={contributorOption}
                  searchParamsValue={searchParamsValue}
                  handleSearchEvent={handleSearchEvent}
                  handleInvitesModal={handleInvitesModal}
                  handleSetEventCross={handleSetEventCross}
                  dueDate={selectedMediaShot?.[0]?.dueDate}
                  projectName={videoProjectData?.name || ""}
                  handleDeleteShotById={handleDeleteShotById}
                  isDeletingScenes={isLoadingState?.isDeleting}
                  handleSendReminderMail={handleSendReminderMail}
                  description={selectedMediaShot?.[0]?.description}
                  mediaLength={searchSceneMediaData?.[0]?.media?.length}
                  handleUpdateShotUrlModalOpen={handleUpdateShotUrlModalOpen}
                  isEditingProcess={videoProjectData?.isEditingProcess || false}
                  handleUploadMedia={({ id, uploads }) => handleUploadMedia({ id, uploads })}
                />
              </div>
            )}
            {activeList === "media" ? (
              loadingPage ? (
                <Loading pageLoader={true} diffHeight={600} />
              ) : (
                <ViewContainer
                  register={register}
                  setValue={setValue}
                  activeView={activeView}
                  sortColumn={sortColumn}
                  handleSort={handleSort}
                  shotsOption={shotsOption}
                  isProcessing={isProcessing}
                  isContributor={isContributor}
                  mediaType={watch("type")?.value}
                  selectedShot={watchSelectedShot}
                  handleRenameFile={handleRenameFile}
                  handleDeleteShots={handleDeleteShotMedia}
                  handleMoveMediaShot={handleMoveMediaShot}
                  isEditingProcess={videoProjectData?.isEditingProcess || false}
                  allMediaShot={(searchSceneMediaData as any) || []}
                />
              )
            ) : (
              <div className="h-full overflow-scroll">
                <Draft
                  userData={allUser}
                  videoPageId={videoPageID}
                  handleMediaList={handleMediaList}
                  selectedUser={videoProjectData?.createdByUser as ClientInterface}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <CustomInstallPWA />

      {isInvites?.isShotUrl && (
        <Modal
          open={isInvites?.isShotUrl}
          className={styles.inviteModalShotUrl}
          iconClassName={styles.showIcon}
          showCross={true}
          handleClose={handleUpdateShotUrlModalClose}
        >
          <div>
            <div className="md:text-2xl text-lg">Share link to contributors</div>

            <div className={styles.shotLink}>
              <div className={styles.field}>
                <span className='text-[var(--Fonts-Font-B,#0F0F0F)] text-[18px] font-normal leading-normal"'>
                  {/* <span className={styles.labelClass} > */}
                  Anyone with link will be able to upload media into this scene.{" "}
                </span>
                <div className={` mt-[5px] ${styles.inputBase}`}>
                  <span>{siteLink}</span>
                  <Input
                    name="shotLink"
                    disabled={!editShotUrl?.isEdit ? true : false}
                    register={register}
                    labelClass={styles.labelClass}
                  />
                </div>
              </div>

              {!editShotUrl?.isEdit && !isContributor && (
                <div className={"flex absolute md:right-3.5 md:top-[56%] right-[2%] top-[77%]"}>
                  <ImageComponent
                    src={"/assets/pen.png"}
                    className={`${watchSelectedShot ? "!cursor-pointer" : "!-default"} ${styles.icon}`}
                    alt="edit"
                    onClick={() => {
                      if (watchSelectedShot) {
                        setEditShotUrl((prev) => ({ ...prev, isEdit: true }));
                      }
                    }}
                  />
                </div>
              )}

              {editShotUrl?.isEdit && (
                <div className={"flex absolute md:right-3.5 md:top-[52%] right-[3%] top-[78%]  "}>
                  {isInvites?.isEditLoading ? (
                    <Loader pageLoader={false} loaderClass={styles.updateURlClass} />
                  ) : (
                    <ImageComponent
                      alt="ticket"
                      className={` ${styles.editIcons}`}
                      src={"/assets/ticket-gray.png"}
                      onClick={() =>
                        handleUpdateShotUrl({
                          shotId: watchSelectedShot?.value as string,
                          shotUrl: watch("shotLink") as string,
                        })
                      }
                    />
                  )}
                  <ImageComponent
                    src={"/assets/cross-gray.png"}
                    className={`${styles.editIcons}`}
                    alt="Search"
                    onClick={() => {
                      setValue?.("shotLink", editShotUrl?.selectedShotShotUrl);
                      setEditShotUrl((prev) => ({ ...prev, isEdit: false }));
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end mt-[20px]">
              <Button
                text="Copy Link"
                isLoading={isInvites?.isCopyLoading}
                handleClick={() => handleCopy({})}
                className={`md:!text-sm !text-xs !w-[100px]`}
              />
            </div>
          </div>
        </Modal>
      )}

      {isInvites?.isInviteModal && (
        <Modal
          open={isInvites?.isInviteModal}
          className={styles.inviteModal}
          iconClassName={styles.showIcon}
          showCross={true}
          handleClose={() => {
            setEditShotUrl((prev) => ({ ...prev, isEdit: false }));
            setIsInvites((prev) => ({ ...prev, isInviteModal: false }));
          }}
        >
          <div>
            <div className="md:text-2xl text-lg">Invite</div>
            <div className="mb-1">
              <Input
                name="inviteSearch"
                register={register}
                showSearchIcon={true}
                placeholder="Search by name/contact number/email"
              />
            </div>
            <div
              className={` ${styles.scrollClass}
                bg-[#F8F8F8] h-full max-h-[440px] overflow-y-auto p-5 flex flex-col gap-5
              `}
            >
              {updatedUsers?.length === 0 ? (
                <>
                  <div className={"flex justify-between items-center"}>
                    <div className={"flex items-center gap-4"}>
                      <div className={styles.avatarClass}>
                        <p>{debouncedFindUser?.charAt(0)}</p>
                      </div>
                      <h6 className={styles.heading}>{debouncedFindUser}</h6>
                    </div>
                    <Button
                      handleClick={() =>
                        handleSendEmailInvite({
                          userName: debouncedFindUser as string,
                          shotName: watchSelectedShot?.label as string,
                          shotId: watchSelectedShot?.value as string,
                        })
                      }
                      disabled={watchSelectedShot ? false : true}
                      text="Invite"
                      btnClass={`!bg-[#FFF]  ${styles.btnClass}`}
                      className={` ${watchSelectedShot ? `!text-[#ED1C24]` : `!text-[#FF838880]`} ${`!font-medium`}`}
                    />
                  </div>
                </>
              ) : invitedFilterData?.length > 0 ? (
                invitedFilterData.map((data: any) => (
                  <div key={data?._id} className={"flex justify-between items-center"}>
                    <div className={"flex items-center gap-4"}>
                      <div className={styles.avatarClass}>
                        <p>{data?.username?.charAt(0)}</p>
                      </div>
                      <h6 className={styles.heading}>{data?.username}</h6>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <Button
                        handleClick={() =>
                          handleSendEmailInvite({
                            userId: data?._id || "",
                            shotId: watchSelectedShot?.value as string,
                            shotName: watchSelectedShot?.label as string,
                            userName: data?.username,
                          })
                        }
                        toolTip={data?.inviteUser === 1 ? "Resend Invite" : "Send Invite"}
                        disabled={!watchSelectedShot}
                        text={data?.inviteUser === 1 ? "Invited" : "Invite"}
                        btnClass={`!bg-[#FFF]  ${styles.btnClass}`}
                        className={`${data?.inviteUser === 1 ? "!text-[#A1A1A1]" : !watchSelectedShot ? "!text-[#FF838880]" : "!text-[#ED1C24]"} !font-medium`}
                      />
                      <ImageComponent
                        src={"/assets/copy.png"}
                        className={`${watchSelectedShot ? "!cursor-pointer" : "!cursor-default"} ${styles.copyIcon}`}
                        alt="Copy"
                        onClick={() => handleCopy({ userId: data?._id })}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No users invited yet</p>
              )}
            </div>

            <div className={styles.shotLink}>
              <div className={styles.field}>
                <span className={styles.labelClass}>
                  Not listed above? Invite them by sharing a link
                </span>
                <div className={styles.inputBase}>
                  <span>{siteLink}</span>
                  <Input
                    name="shotLink"
                    disabled={!editShotUrl?.isEdit ? true : false}
                    register={register}
                    labelClass={styles.labelClass}
                  />
                </div>
              </div>

              {!editShotUrl?.isEdit && (
                <div className={"flex absolute md:right-3.5 md:top-[56%] right-[3%] top-[82%]"}>
                  <ImageComponent
                    src={"/assets/pen.png"}
                    className={`${watchSelectedShot ? "!cursor-pointer" : "!-default"} ${styles.icon}`}
                    alt="edit"
                    onClick={() => {
                      if (watchSelectedShot) {
                        setEditShotUrl((prev) => ({ ...prev, isEdit: true }));
                      }
                    }}
                  />

                  {isInvites?.isCopyLoading ? (
                    <Loader pageLoader={false} loaderClass={styles.updateURlClass} />
                  ) : (
                    <ImageComponent
                      src={"/assets/copy.png"}
                      className={`${watchSelectedShot ? "!cursor-pointer" : "!cursor-default"} ${styles.icon}`}
                      alt="Copy"
                      onClick={() => handleCopy({})}
                    />
                  )}
                </div>
              )}

              {editShotUrl?.isEdit && (
                <div className={"flex absolute md:right-3.5 md:top-[52%] right-[3%] top-[78%]  "}>
                  {isInvites?.isEditLoading ? (
                    <Loader pageLoader={false} loaderClass={styles.updateURlClass} />
                  ) : (
                    <ImageComponent
                      alt="ticket"
                      className={` ${styles.editIcons}`}
                      src={"/assets/ticket-gray.png"}
                      onClick={() =>
                        handleUpdateShotUrl({
                          shotId: watchSelectedShot?.value as string,
                          shotUrl: watch("shotLink") as string,
                        })
                      }
                    />
                  )}
                  <ImageComponent
                    src={"/assets/cross-gray.png"}
                    className={`${styles.editIcons}`}
                    alt="Search"
                    onClick={() => {
                      setValue?.("shotLink", editShotUrl?.selectedShotShotUrl);
                      setEditShotUrl((prev) => ({ ...prev, isEdit: false }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {isInvites?.isInviteEmailModal && (
        <Modal
          open={isInvites?.isInviteEmailModal}
          className={styles.inviteEmailModal}
          showCross={true}
          iconClassName={styles.showIcon}
          handleClose={() =>
            setIsInvites((prev) => ({ ...prev, isInviteEmailModal: false, isLoading: false }))
          }
        >
          <div>
            <div className="md:text-2xl text-lg mb-5 w-[96%]">{`Invite ${isInvites?.sendShotToUser} to ${isInvites?.sendShotName}`}</div>
            <div>
              <Textarea rows={6} name="emailAddNote" register={register} placeholder="Add a Note" />
            </div>
            <div className="flex justify-end items-end gap-3 mt-5">
              <Button
                text="Go Back"
                btnClass={styles.backBtnClass}
                className={`md:!text-sm !text-xs ${styles.backBtnClassText2}`}
                handleClick={handleInvitesModal}
              />
              <Button
                text={
                  isInvites?.isLoading ? (
                    <Loading pageLoader={false} loaderClass={styles.loadingClass} />
                  ) : (
                    "Send Email"
                  )
                }
                isLoading={isInvites?.isLoading}
                handleClick={() => handleSendInviteEmail()}
                className={`md:!text-sm !text-xs ${styles.sendEmailBtn} ${isInvites?.isLoading ? "w-16 " : ""}`}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default VideoProjectDetail;
