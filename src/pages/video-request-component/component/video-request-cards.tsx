import moment from "moment";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import PendingRequestCard from "./pending-request-card";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { s3TransloaditUploadMap } from "@/src/helper/helper";

import { VideoRequestInterface } from "@/src/interface/video-request-interface";

import style from "./index.module.scss";

const VideoRequestCards = ({
  videoRequestData,
  handleUpdateStatus,
  handleUpdateMediaStatus,
}: {
  handleUpdateMediaStatus: ({
    videoRequestId,
    upload,
    status,
  }: {
    upload: any;
    videoRequestId: string;
    status: string;
  }) => void;
  videoRequestData: VideoRequestInterface[];
  handleUpdateStatus: ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => void;
}) => {
  const [isModal, setIsModal] = useState<{
    isOpen: boolean;
    isReplace: boolean;
    isReplaced?: boolean;
    status: string;
    videoRequestId: string;
  }>({
    isOpen: false,
    isReplace: false,
    isReplaced: false,
    videoRequestId: "",
    status: "",
  });

  const handleReplace = () => {
    setIsModal((prev) => ({ ...prev, isOpen: true, isReplace: false }));
  };

  const handleConfirmModal = ({
    videoRequestId,
    status,
    isStatus,
  }: {
    videoRequestId: string;
    status: string;
    isStatus: boolean;
  }) => {
    setIsModal((prev) => ({
      ...prev,
      isReplace: true,
      videoRequestId,
      status,
      isReplaced: isStatus,
    }));
  };

  const handleClickEventClose = () => {
    setIsModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, videoRequestId: string) => {
    e.dataTransfer.setData("text/plain", videoRequestId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const videoRequestId = e.dataTransfer.getData("text/plain");
    if (status !== "completed") {
      handleUpdateStatus({
        videoRequestId,
        status: status,
      });
    } else {
      const checkVideoExist = findIsVideoExist({ videoRequestId });

      if (checkVideoExist) {
        handleConfirmModal({ videoRequestId, status, isStatus: true });
      } else {
        handleConfirmModal({ videoRequestId, status, isStatus: false });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleStatusChange = () => {
    handleUpdateStatus({
      status: isModal?.status,
      videoRequestId: isModal?.videoRequestId,
    });
    setIsModal((prev) => ({ ...prev, isReplace: false, videoRequestId: "", status: "" }));
  };

  const setUploads = async ({ uploads }: { uploads: any[] }) => {
    for (const upload of uploads) {
      await uploadMediaLibrary({ upload });
    }
  };

  const uploadMediaLibrary = async ({ upload }: { upload: any }) => {
    if (upload) {
      await handleUpdateMediaStatus({
        status: isModal?.status,
        upload,
        videoRequestId: isModal?.videoRequestId,
      });
    }
  };

  const findIsVideoExist = ({ videoRequestId }: { videoRequestId: string }) => {
    return (
      videoRequestData?.some((data: any) => data?._id === videoRequestId && data?.thumbnailS3Key) ??
      false
    );
  };

  const handleClose = () => {
    setIsModal((prev) => ({ ...prev, isReplace: false, videoRequestId: "", status: "" }));
  };

  const acceptVideoRequest = useMemo(() => {
    return videoRequestData?.filter(({ status }: { status: string }) => status === "accept");
  }, [videoRequestData]);

  const inProgressVideoRequest = useMemo(() => {
    return videoRequestData?.filter(({ status }: { status: string }) => status === "in-progress");
  }, [videoRequestData]);

  const completedVideoRequest = useMemo(() => {
    return videoRequestData?.filter(({ status }: { status: string }) => status === "completed");
  }, [videoRequestData]);

  const rejectedVideoRequest = useMemo(() => {
    return videoRequestData?.filter(({ status }: { status: string }) => status === "rejected");
  }, [videoRequestData]);

  const handleClickStatusChanges = ({
    status,
    videoRequestId,
  }: {
    status: string;
    videoRequestId: string;
  }) => {
    if (status !== "completed") {
      handleUpdateStatus({
        videoRequestId,
        status: status,
      });
    } else {
      const checkVideoExist = findIsVideoExist({ videoRequestId });

      if (checkVideoExist) {
        handleConfirmModal({ videoRequestId, status, isStatus: true });
      } else {
        handleConfirmModal({ videoRequestId, status, isStatus: false });
      }
    }
  };

  const handleUploadVideo = ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => {
    setIsModal((prev) => ({ ...prev, isOpen: true, videoRequestId, status }));
  };

  const dragElement = useMemo(
    () => [
      { id: "accept", title: "Accepted", bgColor: "#96C9F4", items: acceptVideoRequest },
      {
        id: "in-progress",
        title: "In Progress",
        bgColor: "#FFE599",
        items: inProgressVideoRequest,
      },
      { id: "completed", title: "Completed", bgColor: "#50B498", items: completedVideoRequest },
      { id: "rejected", title: "Rejected", bgColor: "#FF4C4C", items: rejectedVideoRequest },
    ],
    [acceptVideoRequest, inProgressVideoRequest, completedVideoRequest, rejectedVideoRequest],
  );

  return (
    <div>
      <div className="w-full flex gap-4 md:mt-3">
        <div
          className={`flex justify-between md:w-[calc(100vw-144px)] h-[calc(100vh-270px)] w-full overflow-auto gap-4 py-3 ${style.scrollbarVisibleClass}`}
        >
          {dragElement.map((column) => (
            <DragItem
              key={column?.id}
              column={column}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleUploadVideo={handleUploadVideo}
              handleClickStatusChanges={handleClickStatusChanges}
            />
          ))}
        </div>
      </div>

      <Modal
        open={isModal?.isReplace}
        handleClose={handleClose}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
      >
        <div className={style.deleteModal}>
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
              textAlign: "center",
              margin: "auto",
            }}
            className={isModal?.isReplaced ? "!w-[60px] !h-[60px]" : "!w-[80px] !h-[80px]"}
            src={isModal?.isReplaced ? "/assets/replace.png" : "/assets/upload.svg"}
            alt="sortUp"
            height="100"
            width="100"
          />
          <div className={style.deleteHeading}>
            {isModal?.isReplaced
              ? "You want to replace uploaded video?"
              : "Do you want to upload video in this request ?"}
          </div>
          <div className={style.text}>
            {isModal?.isReplaced
              ? "You will not be able to recover that old video"
              : "This video will also be visible to the requester."}
          </div>

          <div className="flex justify-end items-center gap-3 mt-5">
            <Button
              type="button"
              text={` ${isModal?.isReplaced ? "No" : "Skip"}`}
              handleClick={handleStatusChange}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
            />
            <Button
              type="button"
              text={` ${isModal?.isReplaced ? "Yes" : "Yes, Upload"}`}
              handleClick={handleReplace}
              className={`!text-[#fff] !font-semibold`}
              btnClass={` !rounded-md !bg-[#ED1C24] ${style.redBorder}  ${style.maxWidth}   `}
            />
          </div>
        </div>
      </Modal>
      <div className={`${isModal?.isOpen ? style.transloaditBackground : ""}`}>
        <TransloaditUploadModal
          fieldName={isModal?.isOpen}
          setFieldName={handleClickEventClose}
          allowedFileTypes={[`video/*`]}
          mapUploads={s3TransloaditUploadMap}
          setUploads={setUploads}
          fields={{
            prefix: `/video-request/${Math.random().toString()}`,
            timeStamp: moment().format("YYYYMMDD_HHmmss"),
          }}
        />
      </div>
    </div>
  );
};

export default VideoRequestCards;

const DragItem = ({
  column,
  handleDrop,
  handleDragOver,
  handleDragStart,
  handleUploadVideo,
  handleClickStatusChanges,
}: {
  column: { id: string; title: string; bgColor: string; items: VideoRequestInterface[] };
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, videoRequestId: string) => void;
  handleClickStatusChanges: ({
    status,
    videoRequestId,
  }: {
    status: string;
    videoRequestId: string;
  }) => void;
  handleUploadVideo: ({
    status,
    videoRequestId,
  }: {
    status: string;
    videoRequestId: string;
  }) => void;
}) => {
  const hexToRgba = ({ hex, opacity }: { hex: string; opacity: number }) => {
    const normalizedHex = hex?.replace(/^#/, "");
    const r = parseInt(normalizedHex?.slice(0, 2), 16);
    const g = parseInt(normalizedHex?.slice(2, 4), 16);
    const b = parseInt(normalizedHex?.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const DropHanlder = (e: React.DragEvent<HTMLDivElement>) => handleDrop(e, column.id);

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
        <div className="overflow-hidden text-[#0F0F0F] truncate whitespace-nowrap text-[16px] font-medium">
          {column.title} ({column.items?.length || 0})
        </div>
      </div>
      <div className="flex flex-col gap-3 p-[15px]">
        {column?.items?.length ? (
          column?.items?.map((data) => {
            const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) =>
              handleDragStart(e, data?._id);
            return (
              <div key={data?._id} draggable onDragStart={dragStartHandler}>
                <PendingRequestCard
                  cardData={data}
                  handleUploadVideo={handleUploadVideo}
                  handleClickStatusChanges={handleClickStatusChanges}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center">No Video Request</div>
        )}
      </div>
    </div>
  );
};
