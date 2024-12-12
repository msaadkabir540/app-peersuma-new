"use client";
import React, { useState } from "react";

import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import Loading from "@/src/components/loading";
import ImageComponent from "@/src/components/image-component";

import styles from "./index.module.scss";

const DraftGridCard = ({
  name,
  mediaId,
  videoUrl,
  imageUrl,
  videoDraftId,
  handleDownload,
  handleChangeVideoName,
  // mediaDownload,
}: {
  // mediaDownload;
  name: string;
  mediaId: string;
  imageUrl?: string;
  videoUrl?: string;
  videoDraftId: string;
  handleDownload: ({ videoId, videoDraftId }: { videoId: string; videoDraftId: string }) => void;
  handleChangeVideoName: ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    mediaId: string;
    videoDraftId: string;
  }) => void;
}) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isClipOpen, setIsClipOpen] = useState<{ isOpen: boolean; videoUrl: string }>({
    isOpen: false,
    videoUrl: "",
  });
  const [isVideoRename, setIsVideoRename] = useState<boolean>(false);
  const [isRename, setIsRename] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleChangeName = async ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    videoDraftId: string;
    mediaId: string;
  }) => {
    if (value.trim().length === 0) {
      setError("Enter the Comment");
    } else {
      setIsRename(true);
      await handleChangeVideoName({ value, videoDraftId, mediaId });
      setIsRename(false);
      setIsVideoRename(false);
    }
  };

  return (
    <div
      className={`flex md:gap-5 gap-2  w-full flex-col items-start justify-between  md:p-5 ${styles.draftPadding}`}
    >
      <div className="flex items-center w-full md:gap-8 gap-2">
        <div className={`${styles.mobileText} md:text-xl font-medium`}>{name}</div>
        <div className=" ">
          <div className="flex items-center justify-end gap-2">
            <Tooltip backClass="" text="Edit">
              <Button
                iconStart={"/assets/pen.png"}
                btnClass={`!bg-transparent !p-0`}
                imgClass={styles.iconClass}
                type="button"
                handleClick={() => {
                  setIsVideoRename(true);
                  setValue(name);
                }}
              />
            </Tooltip>
            {isDownloading ? (
              <Loading loaderClass={`${styles.loaderClass}`} />
            ) : (
              <Tooltip backClass="" text="Download">
                <Button
                  iconStart={"/assets/download.png"}
                  btnClass={`!bg-transparent !p-0`}
                  imgClass={styles.iconClass}
                  type="button"
                  isLoading={isDownloading}
                  handleClick={async () => {
                    setIsDownloading(true);
                    await handleDownload({ videoId: mediaId, videoDraftId });
                    setIsDownloading(false);
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div
        className={`rounded-lg  w-full h-full ${styles.cardImage}`}
        onClick={() => setIsClipOpen((prev: any) => ({ ...prev, isOpen: true, videoUrl }))}
      >
        {/* <DraftCarouselSection /> */}
        <ImageComponent
          src={imageUrl || "/assets/backgroundimage.jpg"}
          alt="themeVideoThumbnailUrl"
          containerWidth="100%"
          stylesProps={{
            cursor: "pointer",
            borderRadius: "10px",
            backgroundColor: "red !important",
          }}
        />
      </div>
      {isVideoRename && (
        <Modal
          showCross={true}
          className={styles.modalContentWrapper2}
          {...{
            open: isVideoRename,
            handleClose: () => setIsVideoRename(false),
          }}
        >
          <div>
            <div className="md:text-2xl text-xl font-semibold mb-3">Rename Draft</div>
          </div>

          <div className="">
            <div className="">
              <Input
                name={"videoDraftName"}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                required={true}
                inputField={styles.input}
                errorMessage={error}
                type="text"
              />
            </div>

            <div className="mt-2 flex gap-2 justify-end">
              <Button
                text="Cancel"
                btnClass={styles.btnClass}
                className={styles.btnCreateClassText}
                handleClick={() => setIsVideoRename(false)}
              />
              <Button
                isLoading={isRename}
                text={isRename ? <Loading loaderClass={`${styles.loaderSaveClass}`} /> : "Save"}
                className={"!w-12"}
                handleClick={() => handleChangeName({ value, videoDraftId, mediaId })}
              />
            </div>
          </div>
        </Modal>
      )}

      <>
        <Modal
          {...{
            open: isClipOpen?.isOpen,
            handleClose: () =>
              setIsClipOpen((prev: any) => ({
                ...prev,
                isOpen: false,
                videoUrl: "",
              })),
          }}
          className={styles.classModal}
        >
          {isClipOpen ? (
            <video className={styles.videoPlayer} controls>
              <source src={isClipOpen?.videoUrl} type="video/mp4" />
              <track kind="captions" src={isClipOpen?.videoUrl} />
            </video>
          ) : (
            ""
          )}
        </Modal>
      </>
    </div>
  );
};

export default DraftGridCard;
