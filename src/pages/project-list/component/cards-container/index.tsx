import Image from "next/image";
import moment from "moment";
import React, { useMemo, useState } from "react";

import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import VideoProjectCard from "../video-project-card";
import createNotification from "@/src/components/create-notification";

import { VideoProjectDataInterface } from "@/src/interface/video-request-interface";

import style from "../index.module.scss";

const CardsContainer = ({
  isDeleted,
  videoProjectId,
  videoProjectData,
  handleOpenModal,
  handleStatusChange,
  handleTemporaryDelete,
}: {
  videoProjectId: string;
  isDeleted: boolean;
  handleStatusChange: ({
    status,
    name,
    oldStatus,
    videoRequestId,
  }: {
    status: string;
    name: string;
    oldStatus?: string;
    videoRequestId?: string;
  }) => void;
  videoProjectData: VideoProjectDataInterface[];
  handleOpenModal: ({ videoProjectId }: { videoProjectId: string }) => void;
  handleTemporaryDelete: ({ videoProjectId }: { videoProjectId: string }) => void;
}) => {
  const [isState, setIsState] = useState<{
    isModalOpen: boolean;
    isCanceled: boolean;
    isClosed: boolean;
    videoProjectName: string;
    videoRequestId: string;
    oldStatus: string;
  }>({
    oldStatus: "",
    isClosed: false,
    isCanceled: false,
    videoRequestId: "",
    isModalOpen: false,
    videoProjectName: "",
  });

  const handleDragStart = ({
    e,
    videoRequestId,
    prevId,
    prevTitle,
    videoProjectName,
    data,
    isEditingProcess,
  }: {
    data: any;
    isEditingProcess: boolean;
    e: React.DragEvent<HTMLDivElement>;
    videoRequestId: string;
    prevTitle: string;
    videoProjectName: string;
    prevId: number;
  }) => {
    const crt = document.createElement("div");
    crt.id = "video-project";
    crt.innerHTML = `
    <div class="${style.dragElementInner}">
    <div style='width:100%'>
    <span>${videoProjectName}</span>
      <div class="${style.list}"><div>Created at</div><div>${moment(data?.updatedAt)?.format("YYYY-MM-DD")}</div></div>
      <div class="${style.list}"><div>Created by</div><div>${data?.createdByUser?.username}</div></div>  
    </div>
    </div>
    `;
    crt.classList.add(style.dragElement);
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData(
      "video-project",
      JSON.stringify({
        videoRequestId,
        prevId,
        prevTitle,
        videoProjectName,
        isEditingProcess,
      }),
    );
  };

  const handleDrop = ({
    e,
    status,
    currentId,
    title,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    status: string;
    title: string;
    currentId: number;
  }) => {
    e.preventDefault();
    const videoRequest = JSON.parse(e.dataTransfer.getData("video-project"));
    const { videoRequestId, prevId, prevTitle, videoProjectName, isEditingProcess } = videoRequest;

    if (1 === currentId && !isEditingProcess) {
      handleStatusChange({
        status: status,
        oldStatus: prevTitle,
        videoRequestId: videoRequestId,
        name: videoProjectName,
      });
      createNotification({
        type: "info",
        duration: 5000,
        message: `${`Your project is moved to '${title}'.`}`,
        description: `${`Your project is moved to '${title}'.`}`,
      });
    } else if (prevId - 1 === currentId && isEditingProcess) {
      createNotification({
        type: "error",
        duration: 5000,
        message: "Moving Back to a Previous Column",
        description:
          "You cannot move this project back to a previous status because of editing in progress",
      });
    } else if (prevId === currentId - 3 && status === "closed-cancelled") {
      setIsState((prev) => ({
        ...prev,
        isModalOpen: true,
        videoRequestId,
        videoProjectName,
        oldStatus: prevTitle,
      }));
    } else if (prevId === currentId - 1 && status === "closed-cancelled") {
      setIsState((prev) => ({
        ...prev,
        isModalOpen: true,
        videoRequestId,
        videoProjectName,
        oldStatus: prevTitle,
      }));
    } else if (prevId > currentId) {
      createNotification({
        type: "error",
        duration: 5000,
        message: "Moving Back to a Previous Column",
        description: "You cannot move this project back to a previous status.",
      });
    } else if (prevId === currentId - 1) {
      handleStatusChange({
        status: status,
        oldStatus: prevTitle,
        videoRequestId: videoRequestId,
        name: videoProjectName,
      });
      createNotification({
        type: "info",
        duration: 5000,
        message: `Moved from "${prevTitle}" to "${title}"`,
        description: `${
          status === "in-review"
            ? `Your project is moved to '${title}', it can't be reverted back to previous statuses`
            : status === "in-post-production"
              ? `Your project is moved to '${title}'.`
              : `Your project is moved to '${title}', it can't be reverted back to previous statuses.`
        }`,
      });
    } else if (currentId - 1 > prevId) {
      createNotification({
        type: "error",
        duration: 5000,
        message: `Skipping statuses`,
        description:
          "Skipping stages is not permitted. Please complete each phase in the correct order.",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const inProductionData = useMemo(() => {
    return videoProjectData?.filter(({ status }: { status: string }) => status === "in-production");
  }, [videoProjectData]);

  const cancelledOrClosedData = useMemo(() => {
    return videoProjectData?.filter(
      ({ status }: { status: string }) => status === "cancelled" || status === "closed",
    );
  }, [videoProjectData]);

  const draftReviewData = useMemo(() => {
    return videoProjectData?.filter(({ status }: { status: string }) => status === "in-review");
  }, [videoProjectData]);

  const inPostProductionData = useMemo(() => {
    return videoProjectData?.filter(
      ({ status }: { status: string }) => status === "in-post-production",
    );
  }, [videoProjectData]);

  const dragElement = useMemo(
    () => [
      {
        numberId: 1,
        id: "in-production",
        title: "In Production",
        bgColor: "#D8EFD3",
        items: inProductionData,
      },
      {
        numberId: 2,
        id: "in-post-production",
        title: "Post Production",
        bgColor: "#95D2B3",
        items: inPostProductionData,
      },
      {
        numberId: 3,
        id: "in-review",
        title: "Draft Review",
        bgColor: "#55AD9B",
        items: draftReviewData,
      },
      {
        numberId: 4,
        id: "closed-cancelled",
        title: "Closed / Cancelled",
        bgColor: "#000000",
        items: cancelledOrClosedData,
      },
    ],
    [draftReviewData, inProductionData, inPostProductionData, cancelledOrClosedData],
  );

  const handleCloseStatus = async () => {
    try {
      setIsState((prev) => ({
        ...prev,
        isClosed: true,
      }));
      const res: any = await handleStatusChange({
        status: "closed",
        videoRequestId: isState?.videoRequestId,
        name: isState?.videoProjectName,
        oldStatus: isState?.oldStatus,
      });

      if (res) {
        setIsState((prev) => ({
          ...prev,
          oldStatus: "",
          isClosed: false,
          isCanceled: false,
          videoRequestId: "",
          isModalOpen: false,
          videoProjectName: "",
        }));
      }
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const handleCancelledStatus = async () => {
    try {
      setIsState((prev) => ({
        ...prev,
        isCanceled: true,
      }));
      const res: any = await handleStatusChange({
        status: "cancelled",
        name: isState?.videoProjectName,
        oldStatus: isState?.oldStatus,
        videoRequestId: isState?.videoRequestId,
      });

      if (res) {
        setIsState((prev) => ({
          ...prev,
          oldStatus: "",
          isClosed: false,
          isCanceled: false,
          videoRequestId: "",
          isModalOpen: false,
          videoProjectName: "",
        }));
      }
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const handleCloseModal = () => {
    setIsState((prev) => ({ ...prev, isModalOpen: false }));
  };

  const handleStatusChangeMobileView = ({
    status,
    id,
    oldStatus,
    videoProjectName,
  }: {
    id: string;
    status: string;
    oldStatus: string;
    videoProjectName: string;
  }) => {
    const prevTitle = dragElement?.find((data) => data?.id === oldStatus)?.title;
    const newTitle = dragElement?.find((data) => data?.id === status)?.title;

    if (status === "closed-cancelled") {
      setIsState((prev) => ({
        ...prev,
        isModalOpen: true,
        videoRequestId: id,
        videoProjectName,
        oldStatus: prevTitle as string,
      }));
    } else {
      handleStatusChange({
        status,
        oldStatus,
        videoRequestId: id,
        name: videoProjectName,
      });

      const message = `Moved from "${prevTitle}" to "${newTitle}"`;
      const description =
        status === "in-review"
          ? `Your project is moved to '${newTitle}', it can't be reverted back to previous statuses`
          : status === "in-post-production" || status === "in-production"
            ? `Your project is moved to '${newTitle}'.`
            : `Your project is moved to '${newTitle}', it can't be reverted back to previous statuses.`;

      createNotification({
        type: "info",
        message,
        description,
        duration: 5000,
      });
    }
  };

  return (
    <div>
      <div className="w-full flex gap-4 md:mt-3">
        <div
          className={`flex justify-between md:h-[calc(100vh-210px)] h-[calc(100vh-245px)] w-full overflow-auto gap-4 py-3 ${style.scrollbarVisibleClass}`}
        >
          {dragElement.map((column) => (
            <DragItem
              key={column?.id}
              column={column}
              isDeleted={isDeleted}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              videoProjectId={videoProjectId}
              handleDragStart={handleDragStart}
              handleOpenModal={handleOpenModal}
              handleTemporaryDelete={handleTemporaryDelete}
              handleStatusChangeMobileView={handleStatusChangeMobileView}
            />
          ))}
        </div>
      </div>

      <Modal
        showCross
        open={isState?.isModalOpen}
        className={style.bodyModal}
        handleClose={handleCloseModal}
        modalWrapper={style.opacityModal}
        iconClassName={"!w-[15px] !h-[15px]"}
      >
        <div className={style.deleteModal}>
          <Image
            data-testid="close-icon"
            style={{
              textAlign: "center",
              margin: "auto",
            }}
            className={"!w-[100px] !h-[100px]"}
            src={"/assets/warning-red.svg"}
            alt="sortUp"
            height="100"
            width="100"
          />
          <div className={style.deleteHeading}>Status Change Confirmation</div>
          <div className={style.text}>Select the status of your project</div>

          <div className="flex justify-end items-center gap-3 mt-5">
            <Button
              type="button"
              text={`Cancelled`}
              isLoading={isState?.isCanceled}
              loaderClass={style.loadingClass}
              handleClick={handleCancelledStatus}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
            />
            <Button
              type="button"
              text={`Closed`}
              loaderClass={style.loadingClass}
              isLoading={isState?.isClosed}
              handleClick={handleCloseStatus}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CardsContainer;

const DragItem = ({
  column,
  isDeleted,
  handleDrop,
  handleDragOver,
  handleDragStart,
  handleOpenModal,
  handleTemporaryDelete,
  handleStatusChangeMobileView,
}: {
  videoProjectId: string;
  isDeleted: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: ({
    e,
    status,
    currentId,
    title,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    status: string;
    title: string;
    currentId: number;
  }) => void;
  handleStatusChangeMobileView: ({
    status,
    id,
    oldStatus,
    videoProjectName,
  }: {
    id: string;
    status: string;
    oldStatus: string;
    videoProjectName: string;
  }) => void;
  handleOpenModal: ({ videoProjectId }: { videoProjectId: string }) => void;
  handleTemporaryDelete: ({ videoProjectId }: { videoProjectId: string }) => void;
  column: {
    numberId: number;
    id: string;
    title: string;
    bgColor: string;
    items: VideoProjectDataInterface[];
  };
  handleDragStart: ({
    e,
    data,
    prevId,
    prevTitle,
    videoRequestId,
    videoProjectName,
    isEditingProcess,
  }: {
    data: any;
    prevId: number;
    prevTitle: string;
    videoRequestId: string;
    videoProjectName: string;
    isEditingProcess: boolean;
    e: React.DragEvent<HTMLDivElement>;
  }) => void;
}) => {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const hexToRgba = ({ hex, opacity }: { hex: string; opacity: number }) => {
    const normalizedHex = hex?.replace(/^#/, "");
    const r = parseInt(normalizedHex?.slice(0, 2), 16);
    const g = parseInt(normalizedHex?.slice(2, 4), 16);
    const b = parseInt(normalizedHex?.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const DropHanlder = (e: React.DragEvent<HTMLDivElement>) => {
    const currentId = column?.numberId;
    const title = column?.title;
    handleDrop({ e, status: column.id, currentId, title });
  };

  return (
    <div
      key={column.id}
      className={`flex w-full min-w-[300px] flex-col border flex-1 rounded-[15px]`}
      style={{
        background: hexToRgba({ hex: column.bgColor, opacity: 0.4 }),
        height: column.items?.length > 0 ? "fit-content" : "50px",
        minHeight: "110px",
        overflowY: "auto",
      }}
      onDrop={DropHanlder}
      onDragOver={handleDragOver}
    >
      <div
        style={{ background: column.bgColor }}
        className="flex justify-between items-center w-full gap-1 rounded-tl-[15px] rounded-tr-[15px] p-4 cursor-pointer"
      >
        <div
          style={{ color: column.bgColor === "#000000" ? "white" : "black" }}
          className="overflow-hidden text-[#0F0F0F] truncate whitespace-nowrap text-[16px] font-medium"
        >
          {column.title} ({column.items?.length || 0})
        </div>
      </div>
      <div className="flex flex-col gap-3 p-[15px]">
        {column?.items?.length ? (
          column?.items?.map((data) => {
            const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
              if (userId === data?.createdByUser?._id) {
                const prevId = column?.numberId;
                const prevTitle = column?.title;
                const videoProjectName = data?.name;
                handleDragStart({
                  e,
                  data,
                  prevId,
                  prevTitle,
                  videoProjectName,
                  videoRequestId: data?._id,
                  isEditingProcess: data?.isEditingProcess,
                });
              }
            };
            return (
              <div key={data?._id}>
                <VideoProjectCard
                  cardData={data}
                  isDeleted={isDeleted}
                  handleOpenModal={handleOpenModal}
                  dragStartHandler={dragStartHandler}
                  handleTemporaryDelete={handleTemporaryDelete}
                  handleStatusChangeMobileView={handleStatusChangeMobileView}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center">No Video Project</div>
        )}
      </div>
    </div>
  );
};
