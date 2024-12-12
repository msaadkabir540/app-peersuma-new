import Image from "next/image";
import React, { useRef, useState } from "react";

import { updateVideoRequest } from "@/src/app/api/video-request";

import { useOutsideClickHook } from "@/src/helper/helper";

import { VideoRequestInterface } from "@/src/interface/video-request-interface";

import styles from "./index.module.scss";

const PendingRequestCard = ({
  cardData,
  handleUploadVideo,
  handleSetResponseData,
  handleClickStatusChanges,
}: {
  cardData: VideoRequestInterface;
  handleSetResponseData?: ({ responseData }: { responseData: VideoRequestInterface }) => void;
  handleClickStatusChanges?: ({
    status,
    videoRequestId,
  }: {
    status: string;
    videoRequestId: string;
  }) => void;
  handleUploadVideo?: ({
    status,
    videoRequestId,
  }: {
    status: string;
    videoRequestId: string;
  }) => void;
}) => {
  const clickRef = useRef<HTMLDivElement | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusChange, setStatusChange] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  const handleStatusChangeCard = () => {
    setStatusChange((prev) => ({ ...prev, isOpen: true }));
  };

  const handleClickStatusChange = ({ status }: { status: string }) => {
    handleClickStatusChanges?.({ status, videoRequestId: cardData?._id });
    setStatusChange((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCheckStatusWithState = ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => {
    setSelectedStatus(status);
    handleCheckStatus({ videoRequestId, status });
  };

  const handleCheckStatus = async ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => {
    try {
      const addVideoRequestData = {
        status,
      };
      const res: any = await updateVideoRequest({ id: videoRequestId, data: addVideoRequestData });
      if (res.status === 200) {
        handleSetResponseData?.({ responseData: res?.data?.updatedVideoRequest });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const circleColors: any = {
    pending: "#B8B8B8",
    "in-progress": "#f8ae00",
    accept: "#96C9F4",
    rejected: "#FF4C4C",
    completed: "#50B498",
  };

  const color = circleColors[cardData?.status] || "#B8B8B8";

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const statusList = [
    { value: "completed", label: "Completed" },
    { value: "accept", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "in-progress", label: "In Progress" },
  ];

  const activeStatusFilter = statusList.filter((status) => status?.value !== cardData?.status);

  useOutsideClickHook(clickRef, () => {
    setStatusChange((prev) => ({ ...prev, isOpen: false }));
  });

  const handleUploadVideos = () => {
    handleUploadVideo?.({ status: cardData?.status, videoRequestId: cardData?._id });
  };

  return (
    <div
      className={`flex flex-col items-start gap-2.5 p-3.5 rounded-lg border border-gray-400 bg-white ${cardData?.status != "pending" ? "cursor-grab" : ""}  ${styles.videoReqestClass}`}
    >
      <div className={`flex gap-1 items-start w-full `}>
        {cardData?.status !== "pending" && (
          <div className={styles.dragClass}>
            <Image
              data-testid="close-icon"
              style={{
                cursor: "grab",
              }}
              className="!w-[16px] !h-[16px]"
              src={"/assets/drag.svg"}
              alt="sortUp"
              height="100"
              width="100"
              draggable={true}
            />
          </div>
        )}
        <div className="overflow-hidden text-ellipsis text-[#0F0F0F]  text-[14px] font-medium leading-normal">
          {cardData?.videoRequestName}
        </div>
      </div>

      <div
        className={`overflow-hidden text-ellipsis text-[#0F0F0F] text-[10px] font-light leading-normal ${styles.descriptionElips}`}
      >
        {cardData?.description}
      </div>

      <div className=" flex justify-between w-full text-[#0F0F0F]  text-[10px] ">
        <div className=" font-light ">Category</div>
        <div className=" !text-[11px] font-medium">{cardData?.category}</div>
      </div>
      {cardData?.status != "pending" && (
        <div
          className="md:hidden flex justify-between w-full text-[#0F0F0F] text-[10px] relative"
          ref={clickRef}
        >
          <div className=" font-light ">Status</div>
          <div
            className=" !text-[11px] font-medium capitalize flex items-center gap-[5px]"
            onClick={handleStatusChangeCard}
          >
            <div style={{ background: color }} className={` rounded-full w-[12px] h-[12px]`}></div>
            {cardData?.status === "accept" ? "Accepted" : cardData?.status}
          </div>
          {statusChange?.isOpen && (
            <div className=" absolute bottom-[22px] right-0 inline-flex flex-col items-start gap-1.25 p-1.25 rounded-md !shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] bg-white  w-[170px]">
              <div className=" !text-[14px] font-medium capitalize flex items-center gap-[5px] pt-2.5 pr-0 pb-0 pl-3.5">
                Status
              </div>
              {activeStatusFilter?.map((status) => (
                <Status
                  key={status?.value}
                  status={status}
                  handleClickStatusChange={handleClickStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {cardData?.status === "completed" && (
        <div className=" flex justify-end items-center gap-[12px] w-full">
          <div className=" flex justify-between w-full text-[#0F0F0F]  text-[10px] ">
            <div className=" font-light ">{cardData?.url ? "Video" : "Upload Video"}</div>
            {cardData?.url ? (
              <VideoLink videoLink={cardData?.url} openInNewTab={openInNewTab} />
            ) : (
              cardData?.status === "completed" && (
                <Image
                  data-testid="close-icon"
                  src="/assets/upload.svg"
                  alt="sortUp"
                  style={{ cursor: "pointer" }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                  onClick={handleUploadVideos}
                />
              )
            )}
          </div>
        </div>
      )}

      {cardData?.status === "pending" && (
        <div className="flex justify-end items-center gap-3 w-full">
          <div className="flex flex-row-reverse gap-1 items-center">
            <label className="text-[#0F0F0F]  text-[11px]  font-medium">Accept</label>
            <CheckStatus
              status="accept"
              videoRequestId={cardData?._id}
              handleCheck={handleCheckStatusWithState}
              customColor={styles.customColorGreen}
              isChecked={selectedStatus === "accept"}
            />
          </div>
          <div className="flex flex-row-reverse gap-1 items-center">
            <label className="text-[#0F0F0F]  text-[11px]  font-medium">Reject</label>
            <CheckStatus
              status="rejected"
              videoRequestId={cardData?._id}
              handleCheck={handleCheckStatusWithState}
              customColor={styles.customColorRed}
              isChecked={selectedStatus === "reject"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequestCard;

const CheckStatus = ({
  status,
  customColor,
  handleCheck,
  videoRequestId,
  isChecked,
}: {
  videoRequestId: string;
  customColor: string;
  status: string;
  handleCheck: ({ videoRequestId, status }: { videoRequestId: string; status: string }) => void;
  isChecked: boolean;
}) => {
  const handleClickEvent = () => handleCheck({ videoRequestId, status });

  return (
    <div className="mb-[-8px]  !cursor-pointer ">
      <input
        onClick={handleClickEvent}
        type="checkbox"
        checked={isChecked}
        readOnly
        className={`${styles.customCheckbox} ${customColor} `}
      />
    </div>
  );
};

const VideoLink = ({
  openInNewTab,
  videoLink,
}: {
  openInNewTab: (argu: string) => void;
  videoLink: string;
}) => {
  const handleClickEvent = () => openInNewTab(videoLink as string);
  return (
    <>
      <Image
        data-testid="close-icon"
        src={"/assets/video-play.svg"}
        alt="sortUp"
        style={{
          cursor: "pointer",
        }}
        className="!w-[16px] !h-[16px]"
        height="100"
        width="100"
        onClick={handleClickEvent}
      />
    </>
  );
};

const Status = ({
  status,
  handleClickStatusChange,
}: {
  status: { label: string; value: string };
  handleClickStatusChange: ({ status }: { status: string }) => void;
}) => {
  const circleColors: any = {
    pending: "#B8B8B8",
    "in-progress": "#f8ae00",
    accept: "#96C9F4",
    rejected: "#FF4C4C",
    completed: "#50B498",
  };

  const color = circleColors[status?.value] || "#B8B8B8";

  const handleClickEvent = () => handleClickStatusChange({ status: status?.value });
  return (
    <>
      <div
        className=" !text-[14px] font-medium capitalize flex items-center gap-[10px] p-3 cursor-pointer"
        onClick={handleClickEvent}
      >
        <div style={{ background: color }} className={` rounded-full w-[12px] h-[12px]`}></div>
        <div> {status?.label}</div>
      </div>
    </>
  );
};
