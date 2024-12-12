import React, { useEffect, useState } from "react";

import VideoContainerCards from "./video-container-cards";
import AddVideoRequestModal from "../../../add-video-request";
import createNotification from "@/src/components/create-notification";

import { VideoRequestThemes } from "@/src/app/interface/calender-interface/calender-interface";

import { useCalender } from "@/src/(context)/calender-context";

import {
  deleteVideoRequestThemeById,
  handleDeleteVideoRequest,
  handleRemoveVideoRequest,
} from "@/src/helper/helper";

import style from "./index.module.scss";

const VideoContainer = ({
  handleUpdate,
  videoThemesData,
  handleUpdateVideoPlan,
}: {
  handleUpdate: ({ themeId }: { themeId: string }) => void;
  handleUpdateVideoPlan: ({ addVideoRequestData }: { addVideoRequestData: any }) => void;
  videoThemesData: VideoRequestThemes[];
}) => {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { isUpdateVideoRequest, setIsUpdateVideoRequest } = useCalender();

  const handleIsModalUpdateClose = () => {
    setIsUpdate(false);
    setIsUpdateVideoRequest({ isDrop: false, videRequestId: "", themeId: "", dragMedia: {} });
  };
  const handleIsModalUpdateOpen = () => setIsUpdate(true);

  const handleDragEnd = () => {
    document?.getElementById("drag-player")?.remove();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    const dropContainer = e.currentTarget as HTMLElement;

    const scrollTop = dropContainer.scrollTop;

    const mouseY = e.clientY + scrollTop;

    const cards = Array.from(dropContainer.children);

    let dropIndex = cards.length;

    for (const [index, card] of cards?.entries() as any) {
      const cardRect = card.getBoundingClientRect();

      const cardTop = cardRect.top + scrollTop;
      const cardMiddle = cardTop + cardRect.height / 2;

      if (mouseY < cardMiddle) {
        dropIndex = index;
        e.preventDefault();
        break;
      }
    }
  };

  const onDrop = async ({ e, id }: { e: React.DragEvent; id: string }) => {
    e.preventDefault();
    const dropContainer = e.currentTarget as HTMLElement;
    const scrollTop = dropContainer.scrollTop;
    const mouseY = e.clientY + scrollTop;

    const cards = Array.from(dropContainer.children);
    let dropIndex = cards.length;

    for (const [index, card] of cards?.entries() as any) {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollTop;
      const cardMiddle = cardTop + cardRect.height / 2;
      if (mouseY < cardMiddle) {
        dropIndex = index;
        break;
      }
    }

    const dragMedia = JSON?.parse(e?.dataTransfer?.getData("video_data"));

    if (dragMedia?.id) {
      handleIsModalUpdateOpen();
      setIsUpdateVideoRequest((prev: any) => ({
        ...prev,
        themeId: id,
        isDrop: true,
        videRequestId: dragMedia?.id,
        inventoryId: dragMedia?.inventoryId,
        dropIndex,
      }));
    } else {
      handleIsModalUpdateOpen();
      setIsUpdateVideoRequest((prev: any) => ({
        ...prev,
        dragMedia,
        themeId: id,
        isDrop: true,
        dropIndex,
      }));
    }
  };

  const handleModalOpen = ({ themeId }: { themeId: string }) => {
    handleIsModalUpdateOpen();
    setIsUpdateVideoRequest((prev: any) => ({
      ...prev,
      isDrop: true,
      themeId,
    }));
  };

  const handleDeleteEvent = async ({ id, themeId }: { id: string; themeId: string }) => {
    setIsDeleting(true);
    const [res, response] = await Promise.all([
      handleDeleteVideoRequest({ id }),
      handleRemoveVideoRequest({ id, themeId }),
    ]);
    if (res && response) {
      handleUpdateVideoPlan({ addVideoRequestData: res });
      createNotification({
        type: "success",
        message: "Success!",
        description: "Successfully deleted",
      });
    }
    setIsDeleting(false);
  };

  const handleDeleteThemebyId = async ({ themeId }: { themeId: string }) => {
    setIsDeleting(true);
    const res = await deleteVideoRequestThemeById({ id: themeId });
    if (res) {
      handleUpdateVideoPlan({ addVideoRequestData: res });
    }
    setIsDeleting(false);
  };

  useEffect(() => {
    isUpdateVideoRequest?.isVideo && handleIsModalUpdateOpen();
  }, [isUpdateVideoRequest?.isVideo]);

  return (
    <div
      className={`lg:h-[calc(100vh-195px)] md:h-[calc(100vh-220px)] h-[calc(100vh-270px)] ${style.scrollbarVisibleClass}`}
    >
      <VideoContainerCards
        onDrop={onDrop}
        onDragOver={onDragOver}
        isDeleting={isDeleting}
        handleUpdate={handleUpdate}
        handleOnDragEnd={handleDragEnd}
        handleModalOpen={handleModalOpen}
        videoThemesData={videoThemesData}
        handleDeleteEvent={handleDeleteEvent}
        handleDeleteThemebyId={handleDeleteThemebyId}
      />
      <AddVideoRequestModal
        isOpen={isUpdate}
        isAllow={true}
        isDrop={isUpdateVideoRequest?.isDrop}
        themeId={isUpdateVideoRequest?.themeId}
        id={isUpdateVideoRequest?.videRequestId}
        handleResponseData={handleUpdateVideoPlan}
        dragMedia={isUpdateVideoRequest?.dragMedia}
        handleIsModalClose={handleIsModalUpdateClose}
      />
    </div>
  );
};

export default VideoContainer;
