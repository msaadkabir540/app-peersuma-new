import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";

import CardMenu from "./card-menu";
import DeleteModal from "./delete-modal";
import Modal from "@/src/components/modal";
import Checkbox from "@/src/components/checkbox";
import EmbedCodeSingleVideo from "./embed-code-single-video";
import createNotification from "@/src/components/create-notification";

import { useLibrary } from "@/src/(context)/library-context-collection";

import {
  removeLibraryMedia,
  updateThumbnailOnReplaceVideoFromVimeo,
} from "@/src/app/api/library-api";

import { useOutsideClickHook } from "@/src/helper/helper";

import style from "../index.module.scss";

const CardsComponent = ({
  date,
  status,
  mediaId,
  duration,
  videoName,
  shortLink,
  imagePath,
  videoAssetId,
  selectedMediaId,
  isUpdated = false,
  isMobile = false,
  handleGetAllValues,
}: {
  date: string;
  status: boolean;
  isUpdated: boolean;
  mediaId: string;
  duration: number;
  imagePath: string;
  isMobile?: boolean;
  videoName: string;
  videoAssetId?: string;
  handleGetAllValues?: any;
  selectedMediaId?: string[];
  shortLink: string | undefined;
}) => {
  const route = useRouter();
  const cardRef = useRef<HTMLInputElement>(null);

  const [isEmbedCodeModal, setIsEmbedCodeModal] = useState<boolean>(false);
  const [isMenu, setIsMenu] = useState<{
    isMenu: boolean;
    isDelete: boolean;
    isThumbnailUpdating?: boolean;
  }>({
    isMenu: false,
    isDelete: false,
    isThumbnailUpdating: false,
  });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const context = useLibrary();
  const handleDragEnd = context && context?.handleDragEnd;
  const selectedClient = context && context?.selectedClient;
  const handleMediaDeleted = context && context?.handleMediaDeleted;
  const handleUpdateThumbnailOnReplaceVimeoVideo =
    context && context?.handleUpdateThumbnailOnReplaceVimeoVideo;

  const handleClickEvent = () => {
    if (!isMobile) {
      route.push(`/update-library/?libraryId=${mediaId}`);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const crt = document.createElement("div");
    crt.id = "drag-player";
    crt.innerHTML = `
    <div class="${style.dragElementInner}">
      <img src="${imagePath}" alt="video-thumbnail" />
      <div class="${style.divClass}">
        <span class='${style.nameClass}' >${videoName}</span>
        <div class='${style.numberClass}'>
        <span class="${style.dateDrag}">${moment(date as string)?.format("YYYY-MM-DD")}</span>
         <span class=" ${status ? style.statusClassDrag : style.statusNotClassDrag}">    ${status ? "Active" : "Archived"} </span>
          </div>
      </div>
    </div>
  `;
    crt.classList.add(style.dragElement);

    document.body.appendChild(crt);

    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData(
      "video_data",
      JSON.stringify({
        duration,
        _id: mediaId,
        active: status,
        name: videoName,
        thumbnailUrl: imagePath,
      }),
    );
  };

  const formattedDuration = useMemo(() => {
    const durationRound = Math?.round(duration);

    const hours = Math?.floor(durationRound / 3600);
    const minutes = Math?.floor((durationRound % 3600) / 60);
    const seconds = durationRound % 60;

    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "00")}:${String(seconds).padStart(2, "00")}`
      : `${minutes}:${String(seconds).padStart(2, "00")}`;
  }, [duration]);

  const handleMenuEvent = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenu((prev) => ({ ...prev, isMenu: !prev?.isMenu }));
  };

  const handleEventDelete = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenu((prev) => ({ ...prev, isDelete: true }));
  };

  const handleEventDeleteVideo = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
    try {
      const response = await removeLibraryMedia({ mediaId, clientId: selectedClient as string });
      if (response?.status === 200) {
        handleMediaDeleted?.({ mediaId });
        createNotification({
          type: "success",
          message: "Success!",
          description: "Library media deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      createNotification({
        type: "error",
        message: "Error!",
        description: "Failed to delete library",
      });
    }
    setIsMenu((prev) => ({ ...prev, isMenu: false }));
    setIsDeleting(false);
  };

  const handleCloseEvent = () => setIsMenu((prev) => ({ ...prev, isMenu: false, isDelete: false }));

  const handleCheckboxChange = () => {
    handleGetAllValues({ mediaId });
  };

  useOutsideClickHook(cardRef, () => {
    setIsMenu((prev) => ({ ...prev, isMenu: false }));
  });

  const handleCloseMenu = () => {
    setIsMenu((prev) => ({ ...prev, isMenu: false }));
  };

  const handleEmbedCode = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEmbedCodeModal(true);
  };

  const handleEventEmbedModalClose = () => {
    setIsEmbedCodeModal(false);
  };

  const handleUpdateThumbnailEvent = async () => {
    setIsMenu((prev) => ({ ...prev, isThumbnailUpdating: true, isMenu: false }));
    try {
      const res = await updateThumbnailOnReplaceVideoFromVimeo({
        data: { id: mediaId, assetId: videoAssetId!, time: duration },
      });

      if (res?.status === 200 && res?.data?.updatedLibrary) {
        handleUpdateThumbnailOnReplaceVimeoVideo({
          updateLibrary: res?.data?.updatedLibrary,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsMenu((prev) => ({ ...prev, isThumbnailUpdating: false }));
  };

  return (
    <>
      <div ref={cardRef} className={`${style.cards}`} onClick={handleClickEvent}>
        <div className="relative w-full object-cover">
          {!isUpdated && !isMenu?.isThumbnailUpdating ? (
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                position: "relative",
              }}
              className="!w-full !h-[200px] bg-black"
              src={imagePath}
              alt="sortUp"
              height="700"
              width="700"
            />
          ) : (
            <div className={style.cardsClassLoader}>
              <div className={`${style.cardClassLoader} ${style.isLoadingClass}`}>
                <div className={style.imageLoader}></div>
              </div>
            </div>
          )}

          {!isMobile && (
            <div
              className={`${isMenu?.isMenu ? style.menuButton2 : style.menuButton} bg-black rounded-full absolute`}
            >
              <Image
                data-testid="close-icon"
                style={{
                  borderRadius: "10px",
                }}
                src={"/assets/three-dot-white.png"}
                alt="play button"
                height="5"
                width="5"
                onClick={handleMenuEvent}
              />
            </div>
          )}
          {isMenu?.isMenu && (
            <CardMenu
              mediaId={mediaId}
              name={videoName}
              isMenuOpen={isMenu?.isMenu}
              handleCloseMenu={handleCloseMenu}
              handleEmbedCode={handleEmbedCode}
              shortLink={shortLink as string}
              handleClickEvent={handleClickEvent}
              videoAssetId={videoAssetId as string}
              handleEventDelete={handleEventDelete}
              isThumbnailUpdate={isMenu?.isThumbnailUpdating!}
              handleUpdateThumbnailEvent={handleUpdateThumbnailEvent}
            />
          )}

          <div className={`${style.duration} flex justify-center items-center absolute bg-white `}>
            <div className={`${style.playButtonClass} bg-white rounded-full`}>
              <Image
                data-testid="close-icon"
                src={"/assets/playbutton.png"}
                alt="play button"
                height="5"
                width="5"
              />
            </div>
            <div className="text-xs">{formattedDuration}</div>
          </div>
        </div>

        <div className="text-lg font-medium flex justify-between items-center md:gap-2 relative">
          <div className={style.dragClass}>
            <Image
              data-testid="close-icon"
              className="!w-[10px] !h-[20px]"
              src={"/assets/drag.svg"}
              alt="sortUp"
              height="100"
              width="100"
              draggable={true}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
          {isMobile && (
            <div className={style.selectedVideo}>
              <input
                type="checkbox"
                className={style.checkBoxCustom}
                id={`customCheck1-${mediaId}`}
                onChange={handleCheckboxChange}
                checked={selectedMediaId?.includes?.(mediaId)}
              />
              <Checkbox
                checkboxValue={mediaId}
                className={style.radio}
                id={`customCheck1-${mediaId}`}
                handleChange={handleCheckboxChange}
                checked={selectedMediaId?.includes(mediaId)}
              />
            </div>
          )}
          <div className={style.headingText}>{videoName || "Untitled"}</div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm font-normal text-[#A1A1A1]">
            {moment(date as string)?.format("YYYY-MM-DD")}
          </div>
          <div className={` ${status ? style.statusClass : style.statusNotClass}`}>
            {status ? "Active" : "Archived"}
          </div>
        </div>
      </div>
      <Modal
        open={isMenu?.isDelete}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
        handleClose={handleCloseEvent}
      >
        <DeleteModal
          isDeleting={isDeleting}
          handleCloseEvent={handleCloseEvent}
          handleEventDeleteVideo={handleEventDeleteVideo}
        />
      </Modal>

      {isEmbedCodeModal && (
        <EmbedCodeSingleVideo
          embedCodeModal={isEmbedCodeModal}
          videoAssetId={mediaId as string}
          handleEventEmbedModalClose={handleEventEmbedModalClose}
        />
      )}
    </>
  );
};

export default CardsComponent;
