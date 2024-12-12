"use client";

import Image from "next/image";
import { writeText } from "clipboard-polyfill";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ShortUrl from "./short-url";
import ChangeVideo from "./change-video";
import VimeoPlayer from "./vimeo-player";
import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Textarea from "@/src/components/textarea";
import Checkbox from "@/src/components/checkbox";
import Selection from "@/src/components/selection";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import { useClients } from "@/src/(context)/context-collection";
import { useLibrary } from "@/src/(context)/library-context-collection";

import { handleViemoVideo, vimeoTransloaditUploadMap } from "@/src/helper/helper";

import {
  addLibraryMedia,
  getLibraryWidgetById,
  updateLibraryMedia,
  updateThumbnailFromFrame,
} from "@/src/app/api/library-api";

import { OptionType } from "@/src/components/selection/selection-interface";
import { UsersInterface } from "@/src/app/interface/user-interface/user-interface";

import styles from "./index.module.scss";

interface CheckboxOption {
  label: string;
  value: boolean;
}

const UpdateLibrary: React.FC = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<{
    isPageLoading: boolean;
    isSaveUpdate: boolean;
    updateFrame: boolean;
  }>({
    isPageLoading: false,
    updateFrame: false,
    isSaveUpdate: false,
  });
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [videoUrlLink, setVideoUrlLink] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [isVideoLink, setIsVideoLink] = useState<boolean>(true);
  const [shareable, setShareable] = useState<boolean>(true);
  const [nameValue, setNameValue] = useState<string>("");
  const [isChangeVideo, setIsChangeVideo] = useState<{
    isFileModal: boolean;
    isFile: boolean;
  }>({
    isFileModal: false,
    isFile: false,
  });
  const [videoTime, setVideoTime] = useState<number | null>(0);
  const [errorName, setErrorName] = useState<string>("");

  const clinetContext = useClients();
  const allUser = clinetContext ? clinetContext?.allUser : [];
  const selectedClientIds = clinetContext && clinetContext?.selectedClientIds;

  const libraryContext = useLibrary();
  const watch = libraryContext?.watch;
  const register = libraryContext?.register;
  const handleSubmit = libraryContext?.handleSubmit;
  const control = libraryContext && libraryContext?.control;
  const createUpdateMedia = libraryContext?.createUpdateMedia;
  const setValue = libraryContext && libraryContext?.setValue;
  const handleCreated = libraryContext && libraryContext?.handleCreated;
  const handleCloseCreateUpdate = libraryContext?.handleCloseCreateUpdate;

  const viemoId = useDebounce({ value: watch?.("videoURL"), milliSeconds: 2000 });
  const checkUrl = viemoId?.split("/");

  const handleCancel = () => {
    setValue?.("description", "");
    setValue?.("reference", "");
    setValue?.("videoURL", "");
    setValue?.("producers", undefined);
    setValue?.("shortLink", "");
    setSelectedMedia(null);
    setNameValue("");
    handleCloseCreateUpdate?.();
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
    setValue("shortLink", selectedMedia?.shortLink);
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

  const handleGetLibraryWidgetById = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, isPageLoading: true }));
    try {
      const res = await getLibraryWidgetById({ params: { id: createUpdateMedia?.mediaId } });

      if (res.status === 200) {
        const handleFilterData = allUser?.find(
          (data: UsersInterface) => data?._id === res?.data?.producers[0],
        );

        const formattedData = handleFilterData
          ? {
              value: handleFilterData._id,
              label: handleFilterData.username || handleFilterData.fullName,
            }
          : [{ value: "", label: "" }];

        setSelectedMedia(res?.data);
        setActive(res?.data?.active);
        setNameValue(res?.data?.name);
        setShareable(res?.data?.shareable);
        setValue?.("shortLink", res?.data?.shortLink);
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
  }, [createUpdateMedia?.mediaId, setSelectedMedia, setNameValue]);

  useEffect(() => {
    createUpdateMedia?.mediaId && handleGetLibraryWidgetById();
  }, [handleGetLibraryWidgetById, createUpdateMedia?.mediaId]);

  const handleGetViemoVideo = async () => {
    try {
      setIsVideoLink(true);
      const data = await handleViemoVideo({ videoId: watch?.("videoURL") as string });

      if (data) {
        const videoLinkFile = data?.player_embed_url;
        setVideoUrlLink(videoLinkFile);
      } else {
        setVideoUrlLink("");
        createNotification({
          type: "error",
          message: "Error!",
          description: "Video not found",
        });
      }
    } catch (error) {
      throw new Error("Error while get the video");
    }
    setIsVideoLink(false);
  };

  useEffect(() => {
    const checkUrl = viemoId?.split("/");

    if (checkUrl && checkUrl?.length != 1) {
      setVideoUrlLink(`https://vimeo.com/${watch?.("videoURL")}`);
      setIsVideoLink(false);
    } else if (viemoId) {
      handleGetViemoVideo();
    }
  }, [viemoId]);

  const handleSubmitEvent = async (data: any) => {
    if (nameValue?.trim()?.length === 0 || !nameValue) {
      setErrorName("Required");
    } else {
      setErrorName("");
      data.shareable = shareable;
      data.active = active;
      data.name = nameValue;
      data.backgroundColor = data?.backgroundColor || "#000000";
      data.textColor = data?.textColor || "#ffffff";
      data.producers = data?.producers?.value;
      data.thumbnailUrl = selectedMedia?.thumbnailUrl;
      data.videoUrl = `https://vimeo.com/${data?.videoURL}`;
      if (!createUpdateMedia?.mediaId) {
        data.videoUrl = `https://vimeo.com/${watch?.("videoURL")}`;
        data.clientId = selectedClientIds as string;
      }
      setIsLoading((prev) => ({ ...prev, isSaveUpdate: true }));
      try {
        const res = createUpdateMedia?.mediaId
          ? await updateLibraryMedia({ id: createUpdateMedia?.mediaId, data })
          : await addLibraryMedia({ data: data });

        if (res.status === 200) {
          setValue?.("description", "");
          setValue?.("reference", "");
          setValue?.("videoURL", "");
          setValue?.("shortLink", "");
          setValue?.("producers", undefined);
          handleCloseCreateUpdate?.();
          handleCreated?.();
        }
      } catch (error) {
        console.error(error);
      }
    }

    setIsLoading((prev) => ({ ...prev, isSaveUpdate: false }));
  };

  const handleSetNameValue = (e: any) => setNameValue(e.target.value);
  const handleChangeVideo = () => setIsChangeVideo((prev) => ({ ...prev, isFile: true }));
  const handleCloseModal = () => setIsChangeVideo((prev) => ({ ...prev, isFile: false }));
  const handleFileUpload = () => setIsChangeVideo((prev) => ({ ...prev, isFileModal: true }));
  const handleUploadEventClose = () =>
    setIsChangeVideo((prev) => ({ ...prev, isFileModal: false }));
  const handleSetVideoTime = ({ value }: { value: number | null }) => setVideoTime(value);

  const handleUpdateThumbnail = async () => {
    setIsLoading((prev) => ({ ...prev, updateFrame: true }));
    try {
      const res = await updateThumbnailFromFrame({
        data: {
          id: createUpdateMedia?.mediaId,
          time: videoTime || 0,
          assetId: checkUrl && checkUrl?.length < 1 ? watch("videoURL") : checkUrl?.[0],
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

  const handleActive = (e: any) => setActive(JSON.parse(e.target.value));
  const handleShareAble = (e: any) => setShareable(JSON.parse(e.target.value));

  return (
    <>
      {isLoading?.isPageLoading ? (
        <div className="flex justify-center  items-center h-[730px]">
          <Loader loaderClass="!w-[50px] !h-[50px]" pageLoader={false} diffHeight={450} />
        </div>
      ) : (
        <form onSubmit={handleSubmit?.(handleSubmitEvent)}>
          <div className={styles.updateMediaContainer}>
            {/* left  */}
            <div>
              <Input
                name="name"
                label="Name"
                value={nameValue}
                type={"text"}
                required={true}
                labelClass="!text-[#0F0F0F] !text-base  !font-medium"
                errorMessage={errorName}
                container="mb-4 relative"
                placeholder="Enter the name"
                onChange={handleSetNameValue}
              />
              <Textarea
                rows={2}
                label="Description"
                name="description"
                register={register}
                isFontWieght={true}
                container="mb-4 relative"
                customLabelClass={styles.labelClass}
                placeholder={"Enter description here"}
              />
              <Input
                type={"text"}
                name="reference"
                label="Reference"
                register={register}
                container="mb-4 relative"
                placeholder="Enter the reference"
                labelClass="!text-[#0F0F0F] !text-base !font-medium"
              />

              <Selection
                label="Producers"
                name={"producers"}
                placeholder="Select"
                boderCustomeStyle={true}
                className={styles.labelCustom}
                customIcon="/assets/down-gray.svg"
                iconClass={styles.iconCustomClass}
                imageClass={styles.imageCustomClass}
                control={control as any}
                options={producerOptions as OptionType[]}
              />
              {colorFields?.map(({ title, name }) => (
                <div className="flex justify-between my-2">
                  <label className="md:!text-[18px] !text-[14px]" htmlFor={name}>
                    {title}
                  </label>
                  <Input
                    id={name}
                    name={name}
                    type={"color"}
                    register={register}
                    container={"!w-[40px]"}
                    inputField={
                      "!p-0.5 h-[30px] text-sm rounded border border-[#d5d5d5] bg-transparent"
                    }
                  />
                </div>
              ))}

              {createUpdateMedia?.mediaId && (
                <div className="mt-1">
                  <div className="flex justify-between items-center">
                    <div className="!text-[#0F0F0F] !text-base  !font-medium mb-[1px]">
                      Thumbnail
                    </div>
                    <div
                      className="text-[#A1A1A1] text-sm cursor-pointer"
                      onClick={handleUpdateThumbnail}
                    >
                      {isLoading?.updateFrame ? "Loading..." : "Select from video"}
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
                      src={selectedMedia?.thumbnailUrl}
                      alt="sortUp"
                      height="500"
                      width="500"
                    />
                  )}
                </div>
              )}
            </div>
            {/* right */}
            <div className={`w-full md:!pr-5`}>
              <div className="flex justify-between items-center mb-[10px]">
                <div className="!text-[#0F0F0F] !text-base  !font-medium">Video Preview</div>
                <div
                  className="flex justify-between items-center gap-1"
                  onClick={handleChangeVideo}
                >
                  <Image
                    data-testid="close-icon"
                    style={{
                      cursor: "pointer",
                    }}
                    className="!w-[24px] !h-[24px]"
                    src={"/assets/replace-image.png"}
                    alt="sortUp"
                    height="500"
                    width="500"
                  />
                  <div className="!text-[#0F0F0F] !text-base  cursor-pointer !font-medium">
                    Change Video
                  </div>
                </div>
              </div>
              {isChangeVideo?.isFile ? (
                <ChangeVideo
                  register={register}
                  videoURLWatch={watch?.("videoURL")}
                  handleCloseModal={handleCloseModal}
                  handleFileUpload={handleFileUpload}
                />
              ) : (
                <>
                  {isVideoLink ? (
                    <div className="flex justify-center items-center md:h-[360px] h-80 bg-black">
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
                </>
              )}

              {/* this is component for the shot url edit  */}
              <ShortUrl
                isEdit={isEdit}
                copyLink={copyLink}
                register={register as any}
                shortLinkWatch={watch?.("shortLink")}
                handleEditEvent={handleEditEvent}
                mediaId={createUpdateMedia?.mediaId as string}
                handleEditEventClose={handleEditEventClose}
                handleEditEventCloseEvent={handleEditEventCloseEvent}
              />

              <div className="my-3">
                <div className={styles.switchContainer}>
                  <div>
                    <div className="!text-[#0F0F0F] !text-base !font-medium">Privacy</div>
                    <div>People can share this video</div>
                  </div>
                  <div className={`flex gap-3 ${styles.btnSwitch}`}>
                    {options.map((option, index) => (
                      <Checkbox
                        key={index}
                        label={option.label}
                        className={styles.radioOuter}
                        handleClick={handleShareAble}
                        checkCustomClass={styles.radio}
                        id={`shareable-${option?.value}`}
                        checked={shareable === option?.value}
                        checkboxValue={option?.value.toString()}
                      />
                    ))}
                  </div>
                </div>

                {createUpdateMedia?.mediaId && (
                  <div className={styles.switchContainer}>
                    <div>
                      <div className="!text-[#0F0F0F] !text-base  !font-medium">Status</div>
                      <div>This video is active</div>
                    </div>
                    <div className={`flex gap-3 ${styles.btnSwitch}`}>
                      {options.map((option, index) => (
                        <Checkbox
                          key={index}
                          label={option.label}
                          handleClick={handleActive}
                          className={styles.radioOuter}
                          checkCustomClass={styles.radio}
                          id={`active-${option.value}`}
                          checked={active === option?.value}
                          checkboxValue={option?.value.toString()}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end items-center gap-3 mt-5">
                  <Button
                    type="button"
                    text="Cancel"
                    handleClick={handleCancel}
                    className={`!text-[#ED1C24] !font-semibold`}
                    btnClass={`!rounded-md ${styles.redBorder} !bg-transparent`}
                  />
                  <Button
                    type="submit"
                    isLoading={isLoading?.isSaveUpdate}
                    className={`!text-[#fff] !font-semibold`}
                    btnClass={` !rounded-md !bg-[#ED1C24]  !min-w-[80px] `}
                    text={createUpdateMedia?.mediaId ? "Save" : "Add video"}
                  />
                </div>
              </div>
            </div>
            {/* button container */}
          </div>
        </form>
      )}

      <div className={`${isChangeVideo?.isFileModal ? styles.transloaditBackground : ""}`}>
        <TransloaditUploadModal
          fieldName={isChangeVideo?.isFileModal}
          setFieldName={handleUploadEventClose}
          allowedFileTypes={[`video/*`]}
          mapUploads={vimeoTransloaditUploadMap as any}
          setUploads={async ({ uploads }: { uploads: any[] }) => {
            setValue?.("videoURL", uploads?.[0]?.id);
            setValue?.("duration", uploads?.[0]?.duration);
          }}
          template_id={process.env.NEXT_PUBLIC_TRANSLOADIT_VIMEO_TEMPLATE_ID}
        />
      </div>
    </>
  );
};
export default UpdateLibrary;

const options: CheckboxOption[] = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const colorFields = [
  {
    title: "Background Color",
    name: "backgroundColor",
  },
  {
    title: "Text Color",
    name: "textColor",
  },
];
