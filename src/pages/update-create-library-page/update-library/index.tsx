"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { writeText } from "clipboard-polyfill";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ShortUrl from "./short-url";
import ChangeVideo from "./change-video";
import SingleVideo from "./single-video";
import VimeoPlayer from "./vimeo-player";
import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Switch from "@/src/components/switch";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import PreviewFieldCompoenets from "./prewiew-field-component";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import { useClients } from "@/src/(context)/context-collection";

import { handleViemoVideo, vimeoTransloaditUploadMap } from "@/src/helper/helper";

import {
  addLibraryMedia,
  updateLibraryMedia,
  getLibraryWidgetById,
  updateColorVideoLibrary,
  updateReplaceVideoLibrary,
  updateThumbnailFromFrame,
} from "@/src/app/api/library-api";

import { OptionType } from "@/src/components/selection/selection-interface";
import { UsersInterface } from "@/src/app/interface/user-interface/user-interface";
import { SelectedMediaChildInterface } from "@/src/app/interface/library-interface/update-create-interface";

import styles from "./index.module.scss";

const UpdateLibrary = ({ libraryId, videoURl }: { libraryId: string; videoURl?: string }) => {
  const route = useRouter();

  const inputFile = useRef<HTMLInputElement | null>(null);

  const { register, control, watch, setValue, handleSubmit } = useForm<{
    selectedWidget: OptionType;
    videoURL: string;
    shortLink: string;
    description: string;
    name: string;
    producers: OptionType[] | undefined | null;
    shareable: boolean;
    active: boolean;
    backgroundColor: string;
    reference?: string;
    duration?: number;
    textColor: string;
  }>({
    defaultValues: {
      selectedWidget: { value: "", label: "" },
      videoURL: "",
      shortLink: "",
      description: "",
      name: "",
      reference: "",
      producers: null,
      shareable: true,
      active: true,
      backgroundColor: "#000000",
      textColor: "#ffffff",
    },
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<{
    updateFrame: boolean;
    isSaveUpdate: boolean;
    isPageLoading: boolean;
    isCopyLoading?: boolean;
    isReplaceVideo?: boolean;
    isDownloadLoading?: boolean;
  }>({
    updateFrame: false,
    isSaveUpdate: false,
    isPageLoading: true,
    isCopyLoading: false,
    isReplaceVideo: false,
    isDownloadLoading: false,
  });

  const [isUpload, setIsUpload] = useState<any>();
  const [nameValue, setNameValue] = useState<string>("");
  const [droppedFiles, setDroppedFiles] = useState<any>(null);
  const [videoUrlLink, setVideoUrlLink] = useState<string>("");
  const [isVideoLink, setIsVideoLink] = useState<boolean>(true);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMediaChildInterface | null>(null);
  const [isChangeVideo, setIsChangeVideo] = useState<{
    videoUrlChange: string;
    isFileModal: boolean;
    isFile: boolean;
  }>({
    videoUrlChange: "",
    isFileModal: false,
    isFile: false,
  });
  const [videoTime, setVideoTime] = useState<number | null>(0);
  const [errorName, setErrorName] = useState<string>("");

  const clinetContext = useClients();
  const allUser = clinetContext ? clinetContext?.allUser : [];
  const allClients = clinetContext && clinetContext?.allClients;
  const loggedInUser = clinetContext && clinetContext?.loggedInUser;
  const selectedClientIds = clinetContext && clinetContext?.selectedClientIds;
  const isShowLibraryProcessCard = clinetContext && clinetContext?.isShowLibraryProcessCard;
  const handleHideLibraryProcessCard = clinetContext && clinetContext?.handleHideLibraryProcessCard;
  const handleShowLibraryProcessCard = clinetContext && clinetContext?.handleShowLibraryProcessCard;

  const viemoId = useDebounce({ value: watch?.("videoURL"), milliSeconds: 0 });
  const backgroundColorWatch = useDebounce({
    value: watch?.("backgroundColor"),
    milliSeconds: 500,
  });
  const textColorWatch = useDebounce({ value: watch?.("textColor"), milliSeconds: 500 });
  const checkUrl = viemoId?.split("/");

  const handleCancel = () => {
    route.push("/library");
  };

  const producerOptions = useMemo(() => {
    return allUser
      ?.filter(({ roles }: { roles: string[] }) =>
        roles.find((role: string) => ["executive-producer", "producer"]?.includes(role)),
      )
      ?.map(({ _id, fullName, username }) => ({
        label: `${username || fullName || ""}`,
        value: _id,
      }));
  }, [allUser]);

  const handleEditEvent = () => setIsEdit(true);
  const handleEditEventCloseEvent = () => setIsEdit(false);

  const handleEditEventClose = () => {
    setValue("shortLink", selectedMedia?.shortLink as string);
    setIsEdit(false);
  };

  const shortLink = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_APP_URL}video/${watch?.("shortLink")}`;
  }, [watch?.("shortLink")]);

  const copyLink = () => {
    writeText?.(shortLink);
    createNotification({
      type: "success",
      message: "Success!",
      description: "Short link copied to clipboard",
    });
  };

  const handleGetViemoVideo = async () => {
    try {
      setIsVideoLink(true);
      const data = await handleViemoVideo({ videoId: watch?.("videoURL") as string });

      if (data) {
        const videoLinkFile = data?.player_embed_url;
        setVideoUrlLink(videoLinkFile);
        if (checkUrl?.length === 1) {
          setSelectedMedia((prev: any) => ({
            ...prev,
            thumbnailUrl: data?.pictures?.base_link,
          }));
        }
      } else {
        setIsVideoLink(false);
        setVideoUrlLink(`https://vimeo.com/${watch?.("videoURL")}`);
        createNotification({ type: "error", message: "Error!", description: "Video not found" });
      }
    } catch (error) {
      createNotification({ type: "error", message: "Error!", description: "" });
      throw new Error("Error while get the video");
    }
    setIsVideoLink(false);
    setIsLoading((prev) => ({ ...prev, isPageLoading: false }));
  };

  const handleGetLibraryWidgetById = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, isPageLoading: true }));
    try {
      const res = await getLibraryWidgetById({ params: { id: libraryId } });

      if (res.status === 200) {
        const handleFilterData = allUser?.find(
          (data: UsersInterface) => data?._id === res?.data?.producers?.[0],
        );

        const formattedData = handleFilterData
          ? {
              value: handleFilterData._id,
              label: handleFilterData.username || handleFilterData.fullName,
            }
          : null;

        setSelectedMedia(res?.data);
        setNameValue(res?.data?.name);
        setValue?.("shortLink", res?.data?.shortLink);
        setValue?.("active", res?.data?.active);
        setValue?.("shareable", res?.data?.shareable);
        setValue?.("reference", res?.data?.reference);
        setValue?.("producers", formattedData as any);
        setValue?.("description", res?.data?.description);
        setValue?.("backgroundColor", res?.data?.backgroundColor ?? "#000000");
        setValue?.("textColor", res?.data?.textColor ?? "#ffffff");
        setValue?.("videoURL", res?.data?.videoUrl?.split(".com/")?.[1]);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading((prev) => ({ ...prev, isPageLoading: false }));
  }, [libraryId, setSelectedMedia, setNameValue]);

  useEffect(() => {
    libraryId && handleGetLibraryWidgetById();
  }, [handleGetLibraryWidgetById, libraryId]);

  useEffect(() => {
    videoURl && setValue("videoURL", videoURl);
  }, [videoURl]);

  useEffect(() => {
    const checkUrl = viemoId?.split("/");

    if (checkUrl && checkUrl?.length != 1) {
      setVideoUrlLink(`https://vimeo.com/${watch?.("videoURL")}`);
      setIsVideoLink(false);
      setIsLoading((prev) => ({ ...prev, isPageLoading: false }));
    } else if (viemoId) {
      handleGetViemoVideo();
    }
  }, [viemoId]);

  const handleSubmitEvent = async (data: any) => {
    if (nameValue?.trim()?.length === 0 || !nameValue) {
      setErrorName("Required");
    } else {
      setErrorName("");

      data.name = nameValue;
      data.backgroundColor = data?.backgroundColor || "#000000";
      data.textColor = data?.textColor || "#ffffff";
      data.producers = data?.producers?.value;
      data.thumbnailUrl = selectedMedia?.thumbnailUrl;
      data.videoUrl = `https://vimeo.com/${data?.videoURL}`;
      if (!libraryId) {
        data.videoUrl = `https://vimeo.com/${watch?.("videoURL")}`;
        data.clientId = selectedClientIds as string;
        data.userId = loggedInUser?._id;
        data.folderId =
          allClients?.find((x: any) => x._id === selectedClientIds)?.vimeoFolderId || "";
      }
      if (isUpload) {
        data.uploads = isUpload;
      }
      setIsLoading((prev) => ({ ...prev, isSaveUpdate: true }));
      try {
        const res = libraryId
          ? await updateLibraryMedia({ id: libraryId, data })
          : await addLibraryMedia({
              data: data,
            });

        if (res.status === 200) {
          route.push("/library");
        }
      } catch (error) {
        console.error(error);
      }
    }

    setIsLoading((prev) => ({ ...prev, isSaveUpdate: false }));
  };

  const handleSetNameValue = (e: any) => setNameValue(e.target.value);
  const handleChangeVideo = () => {
    !isShowLibraryProcessCard && setIsChangeVideo((prev) => ({ ...prev, isFile: true }));
  };
  const handleCloseModal = () => {
    setIsChangeVideo((prev) => ({ ...prev, isFile: false })), setDroppedFiles(null);
  };

  const handleUploadEventClose = () =>
    setIsChangeVideo((prev) => ({ ...prev, isFileModal: false }));
  const handleSetVideoTime = ({ value }: { value: number | null }) => setVideoTime(value);

  const handleUpdateThumbnail = async () => {
    setIsLoading((prev) => ({ ...prev, updateFrame: true }));
    try {
      const res = await updateThumbnailFromFrame({
        data: {
          id: libraryId,
          time: videoTime || 0,
          assetId: checkUrl && checkUrl?.length < 1 ? watch("videoURL") : (checkUrl?.[0] as string),
        },
      });
      if (res.status === 200) {
        setSelectedMedia((prev: any) => ({
          ...prev,
          thumbnailUrl: res?.data?.updatedLibrary?.thumbnailUrl,
        }));
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading((prev) => ({ ...prev, updateFrame: false }));
  };

  const handleDescriptionChange = (e: any) => {
    setValue("description", e.target.value);
  };

  const handleCopyDownloadVideo = async ({
    isCopy,
    isDownload,
  }: {
    isCopy?: boolean;
    isDownload?: boolean;
  }) => {
    try {
      const data = await handleViemoVideo({ videoId: selectedMedia?.assetId as string });

      if (data) {
        if (isCopy || isDownload) {
          const largestVideo = data.download.reduce((prev: any, curr: any) => {
            return curr.size > prev.size ? curr : prev;
          });

          if (largestVideo && largestVideo.link) {
            if (isCopy) {
              writeText?.(largestVideo.link);
              createNotification({
                type: "success",
                message: "Success!",
                description: "Download link copied to clipboard",
              });
            } else {
              try {
                const response = await fetch(largestVideo.link);
                if (!response.ok) {
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = nameValue;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error("File download error:", error);
              }
            }
          }
        } else {
          setVideoUrlLink("");
          createNotification({
            type: "error",
            message: "Error!",
            description: "Video not found",
          });
        }
      }
    } catch (error) {
      throw new Error("Error while get the video");
    }
  };

  const libraryAssetId = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_APP_URL}library-video-download/${selectedMedia?._id}`;
  }, [selectedMedia?.assetId]);

  const handleCopyDownloadLink = async () => {
    writeText?.(libraryAssetId);
    createNotification({
      type: "success",
      message: "Success!",
      description: "Short link copied to clipboard",
    });
  };

  const handleDownloadVideo = async () => {
    setIsLoading((prev) => ({ ...prev, isDownloadLoading: true }));
    await handleCopyDownloadVideo({ isDownload: true });
    setIsLoading((prev) => ({ ...prev, isDownloadLoading: false }));
  };

  const handleVideoUrlChange = (e?: any) => {
    setIsChangeVideo((prev) => ({ ...prev, videoUrlChange: e?.target?.value }));
  };

  const handleSetChangeVideoUrl = () => {
    setValue("videoURL", isChangeVideo?.videoUrlChange);
    setIsChangeVideo((prev) => ({ ...prev, videoUrlChange: "", isFile: false }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;

    if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
      setDroppedFiles(files);
      setIsChangeVideo((prev) => ({ ...prev, isFileModal: true }));
    } else {
      createNotification({
        type: "warn",
        message: "Warning!",
        description: "Please select a video only",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  const handleFileUploads = (e: any) => {
    const { files } = e.target;
    if (files && files.length) {
      if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
        setDroppedFiles(files);
        setIsChangeVideo((prev) => ({ ...prev, isFileModal: true }));
      } else {
        createNotification({
          type: "warn",
          message: "Warning!",
          description: "Please select a video only",
        });
      }
    }
  };

  const handleUpdateReplace = useCallback(async () => {
    try {
      localStorage.setItem("libraryId", libraryId);
      localStorage.setItem("videoId", isUpload?.[0]?.id || selectedMedia?.assetId);
      handleShowLibraryProcessCard?.();

      setSelectedMedia((prev: any) => ({
        ...prev,
        isUpdate: true,
      }));
      route.push("/library");
      const res = await updateReplaceVideoLibrary({
        id: libraryId,
        videoId: isUpload?.[0]?.id || selectedMedia?.assetId,
      });
      if (res) {
        setValue?.(
          "videoURL",
          res?.data?.newLibraryMedia?.videoUrl?.split(".com/")?.[1]?.split("/")?.[0],
        );
        localStorage.removeItem("videoId");
        localStorage.removeItem("libraryId");
        handleHideLibraryProcessCard?.();

        setSelectedMedia((prev: any) => ({
          ...prev,
          isUpdate: res?.data?.newLibraryMedia?.isUpdate,
          thumbnailUrl: res?.data?.newLibraryMedia?.thumbnailUrl,
        }));
      }
    } catch (error) {
      console.error(error);
    }
    setIsVideoLink(false);
  }, [isUpload, selectedMedia?.isUpdate]);

  useEffect(() => {
    if (isUpload) {
      handleUpdateReplace();
    }
  }, [isUpload]);

  useEffect(() => {
    if (selectedMedia?.isUpdate === true) {
      handleUpdateReplace();
    }
  }, [selectedMedia?.isUpdate]);

  const handleColorChange = useCallback(async () => {
    try {
      await updateColorVideoLibrary({
        id: libraryId,
        textColor: textColorWatch as string,
        backgroundColor: backgroundColorWatch as string,
      });
    } catch (error) {
      console.error(error);
    }
  }, [textColorWatch, backgroundColorWatch, libraryId]);

  useEffect(() => {
    if (
      backgroundColorWatch != selectedMedia?.backgroundColor &&
      textColorWatch != selectedMedia?.textColor
    ) {
      handleColorChange();
    }
  }, [backgroundColorWatch, textColorWatch, selectedMedia]);

  return (
    <>
      {isLoading?.isPageLoading ? (
        <div className="flex justify-center items-center h-[730px]">
          <Loader pageLoader={true} diffHeight={450} />
        </div>
      ) : (
        <div className="m-5 mt-[104px]">
          <form onSubmit={handleSubmit?.(handleSubmitEvent)}>
            <div className={styles.updateMediaContainer}>
              {/* left  */}
              <div className="flex flex-col gap-5">
                {/* this is component for the shot url edit  */}
                <div className="flex flex-col gap-[10px] border border-[#B8B8B8] rounded-[15px] p-4">
                  <div className="text-[#0F0F0F] text-[16px] font-semibold leading-normal">
                    Share Settings
                  </div>
                  <ShortUrl
                    isEdit={isEdit}
                    copyLink={copyLink}
                    register={register as any}
                    shortLinkWatch={watch?.("shortLink")}
                    handleEditEvent={handleEditEvent}
                    mediaId={libraryId as string}
                    handleEditEventClose={handleEditEventClose}
                    handleEditEventCloseEvent={handleEditEventCloseEvent}
                  />
                  <SingleVideo mediaId={libraryId as string} register={register as any} />
                  <div className="flex flex-col gap-[10px]">
                    <div className={styles.switchContainer}>
                      <div>
                        <div
                          className={`${watch("shareable") ? "" : styles.colorStyle} font-medium`}
                        >
                          Share button is visible
                        </div>
                      </div>
                      <div className={`flex gap-3 ${styles.btnSwitch}`}>
                        <Switch
                          control={control}
                          name="shareable"
                          label={`${watch("shareable") ? "Yes" : "No"}`}
                          mainClass={`${watch("shareable") ? "!text-[#ed1c24]" : styles.colorStyle} !gap-[10px]`}
                        />
                      </div>
                    </div>

                    {libraryId && (
                      <div className={styles.switchContainer}>
                        <div>
                          <div
                            className={`${watch("active") ? "" : styles.colorStyle}  font-medium`}
                          >
                            Video is active
                          </div>
                        </div>
                        <div className={`flex gap-3 ${styles.btnSwitch}`}>
                          <Switch
                            control={control}
                            name="active"
                            mainClass={`${watch("active") ? "!text-[#ed1c24]" : styles.colorStyle} !gap-[10px]`}
                            label={`${watch("active") ? "Yes" : "No"}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:text-[14px] text-[13px]">
                    <span className="font-semibold md:text-[14px] text-[13px]"> Note: </span> A
                    video must be active for share link and embedded code to work. Only an active
                    video may be placed in a widget.
                  </div>
                </div>
                <div className="flex justify-end items-center gap-3">
                  <Button
                    type="button"
                    text="Cancel"
                    disabled={selectedMedia?.isUpdate}
                    handleClick={handleCancel}
                    className={`${selectedMedia?.isUpdate ? "!text-[#c5c5c5]" : "!text-[#ED1C24]"} !font-semibold`}
                    btnClass={`!rounded-md ${selectedMedia?.isUpdate ? `${styles.grayBorder}` : `${styles.redBorder}`}  !bg-transparent md:!max-w-max !max-w-none`}
                  />
                  <Button
                    type="submit"
                    disabled={selectedMedia?.isUpdate || isShowLibraryProcessCard}
                    isLoading={isLoading?.isSaveUpdate}
                    className={`!text-[#fff] !font-semibold`}
                    btnClass={` !rounded-md  ${selectedMedia?.isUpdate || isShowLibraryProcessCard ? "!bg-[#c5c5c5]" : "!bg-[#ED1C24]"} !min-w-[80px]  md:!max-w-max !max-w-none `}
                    text={libraryId ? "Save Change" : "Add video"}
                  />
                </div>
              </div>

              {/* right */}
              <div
                className={`w-full flex flex-col gap-[10px] border border-[#B8B8B8] rounded-[15px] p-4 `}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[#0F0F0F] md:text-[20px] text-[18px] font-semibold leading-normal">
                      Preview
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <div
                        className={`!text-[#0F0F0F] md:!text-base text-sm  ${isShowLibraryProcessCard ? "cursor-default" : "cursor-pointer"} !font-medium`}
                        onClick={handleChangeVideo}
                      >
                        Replace Video
                      </div>
                      <HandleDownloadCopy
                        isDownload={false}
                        handleEvent={handleCopyDownloadLink}
                        isLoading={isLoading?.isCopyLoading ?? false}
                      />
                      <HandleDownloadCopy
                        isDownload={true}
                        handleEvent={handleDownloadVideo}
                        isLoading={isLoading?.isDownloadLoading ?? false}
                      />
                    </div>
                  </div>
                  {selectedMedia?.isUpdate ? (
                    <div className="flex justify-center items-center h-[150px] md:text-[14px] text-center text-[13px] border border-[#ed1c24] rounded-md shadow-md">
                      Please wait while we process your video and load the thumbnail....
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-[60%_40%] grid-cols-1 gap-3">
                      {isVideoLink ? (
                        <div className="flex justify-center items-center md:h-[300px] h-80 bg-black">
                          <Loader pageLoader={false} loaderClass="!w-[50px] !h-[50px]" />
                        </div>
                      ) : (
                        <VimeoPlayer
                          url={
                            videoUrlLink && checkUrl && checkUrl?.length != 1
                              ? videoUrlLink
                              : videoUrlLink && checkUrl && checkUrl?.length === 1
                                ? `${videoUrlLink}&amp;title=0&amp;amp;byline=0&amp;amp;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`
                                : ""
                          }
                          handleSetVideoTime={handleSetVideoTime}
                        />
                      )}
                      {(libraryId || videoURl) && (
                        <div className="">
                          <div className="flex justify-between items-center">
                            <div className="!text-[#0F0F0F] !text-base !font-medium mb-[1px]">
                              Thumbnail
                            </div>
                          </div>
                          {isLoading?.updateFrame ? (
                            <div className="flex justify-center items-center h-[150px] ">
                              <Loader pageLoader={false} loaderClass="!w-[50px] !h-[50px]" />
                            </div>
                          ) : (
                            <Image
                              data-testid="close-icon"
                              style={{ objectFit: "cover" }}
                              className="!w-[225px] !h-[150px] bg-black"
                              src={selectedMedia?.thumbnailUrl as string}
                              alt="sortUp"
                              height="500"
                              width="500"
                            />
                          )}
                          <div
                            className="text-[#000000] underline text-sm mt-1 cursor-pointer"
                            onClick={handleUpdateThumbnail}
                          >
                            {!videoURl
                              ? isLoading?.updateFrame
                                ? "Loading..."
                                : "Select from video"
                              : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <PreviewFieldCompoenets
                  control={control}
                  errorName={errorName}
                  handleSetNameValue={handleSetNameValue}
                  nameValue={nameValue}
                  producerOptions={producerOptions}
                  register={register}
                  handleDescriptionChange={handleDescriptionChange}
                />
              </div>
            </div>
          </form>
        </div>
      )}

      <div className={`${isChangeVideo?.isFileModal ? styles.transloaditBackground : ""}`}>
        <TransloaditUploadModal
          fieldName={isChangeVideo?.isFileModal}
          setFieldName={handleUploadEventClose}
          allowedFileTypes={[`video/*`]}
          maxNumberOfFiles={1}
          minNumberOfFiles={1}
          droppedFiles={droppedFiles}
          mapUploads={vimeoTransloaditUploadMap as any}
          setUploads={async ({ uploads }: { uploads: any[] }) => {
            setIsUpload(uploads);
            setValue?.("videoURL", uploads?.[0]?.id);
            setValue?.("duration", uploads?.[0]?.duration);
            handleCloseModal();
            handleUploadEventClose();
          }}
          template_id={process.env.NEXT_PUBLIC_TRANSLOADIT_VIMEO_TEMPLATE_ID}
        />
      </div>
      <Modal
        className={styles.bodyVideoChangeModal}
        open={isChangeVideo?.isFile}
        handleClose={handleCloseModal}
        modalWrapper={styles.opacityModal}
      >
        <ChangeVideo
          inputFile={inputFile}
          handleDrop={handleDrop}
          onButtonClick={onButtonClick}
          handleDragOver={handleDragOver}
          handleCloseModal={handleCloseModal}
          handleFileUploads={handleFileUploads}
          handleVideoUrlChange={handleVideoUrlChange}
          videoUrlChange={isChangeVideo?.videoUrlChange}
          handleSetChangeVideoUrl={handleSetChangeVideoUrl}
        />
      </Modal>
    </>
  );
};
export default UpdateLibrary;

const HandleDownloadCopy = ({
  isLoading,
  handleEvent,
  isDownload,
}: {
  isLoading: boolean;
  isDownload: boolean;
  handleEvent: () => void;
}) => {
  return (
    <>
      {isLoading ? (
        <Loader pageLoader={false} loaderClass="!w-[24px] !h-[24px]" />
      ) : (
        <Tooltip
          backClass={styles.tooltipClass}
          text={`${isDownload ? "Download Video" : "Copy Link to Download"}`}
        >
          <Image
            data-testid="close-icon"
            style={{
              cursor: "pointer",
            }}
            className="!w-[24px] !h-[24px]"
            src={`${isDownload ? "/assets/download-under-bracket.svg" : "/assets/copy.svg"}`}
            onClick={handleEvent}
            alt="sortUp"
            height="500"
            width="500"
          />
        </Tooltip>
      )}
    </>
  );
};
