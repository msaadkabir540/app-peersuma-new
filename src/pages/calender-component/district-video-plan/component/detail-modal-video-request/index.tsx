import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Tooltip from "@/src/components/tooltip";
import StatusCompoenet from "../status-component";

import { DetailModalVideoRequestInterface } from "@/src/app/interface/calender-interface/calender-interface";
import moment from "moment";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { sendEmailToUser, updateVideoRequest } from "@/src/app/api/video-request";

import { s3TransloaditUploadMap, statusList } from "@/src/helper/helper";

import { useCalender } from "@/src/(context)/calender-context";

import style from "./index.module.scss";

const DetailModalVideoRequest = ({
  handleOpen,
  isOpenModal,
  loggedInUserId,
  currentUserRole,
  handleCloseModal,
  videoRequestData,
  handleClickAudioModal,
  handleUpdateVideoRequest,
  hanldeIndiviualMailOpen,
  handleClickStatusChange,
  handleClickSampleVideoModal,
}: DetailModalVideoRequestInterface) => {
  const { setVideoThemesData, videoThemesData, schoolYear } = useCalender();

  const inputFile = useRef<HTMLInputElement | null>(null);
  const clickRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [droppedFiles, setDroppedFiles] = useState<any>();
  const [url, setUrl] = useState<string>("");
  const [statusChange, setStatusChange] = useState<{
    isOpen: boolean;
    isLoadingEmail?: boolean;
  }>({
    isOpen: false,
    isLoadingEmail: false,
  });

  const circleColors: any = {
    pending: "#B8B8B8",
    "in-progress": "#f8ae00",
    accept: "#96C9F4",
    rejected: "#FF4C4C",
    completed: "#50B498",
  };

  const color = circleColors[videoRequestData?.status] || "#B8B8B8";

  const activeStatusFilter = statusList.filter(
    (status) => status?.value !== videoRequestData?.status,
  );

  const handleStatusChangeCard = () => {
    setStatusChange((prev) => ({ ...prev, isOpen: true }));
  };

  const handleFileUpload = (e: any) => {
    const { files } = e.target;
    if (files && files.length) {
      if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
        setDroppedFiles(files);
        setIsOpen(true); // Open the Transloadit modal after file drop
      } else {
        createNotification({
          type: "warn",
          message: "Warning!",
          description: "Please select a video only",
        });
      }
    }
  };

  const hexToRgba = ({ hex, opacity }: { hex: string; opacity: number }) => {
    const normalizedHex = hex?.replace(/^#/, "");
    const r = parseInt(normalizedHex?.slice(0, 2), 16);
    const g = parseInt(normalizedHex?.slice(2, 4), 16);
    const b = parseInt(normalizedHex?.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files as any;
    if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
      setDroppedFiles(files);
      setIsOpen(true);
    } else {
      createNotification({
        type: "warn",
        message: "Warning!",
        description: "Please select a video only",
      });
    }
  };

  const onButtonClick = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    inputFile?.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClickEventClose = () => {
    setIsOpen(false);
    setDroppedFiles(null);
  };

  const handleClickOpenModal = () => {
    setIsOpen(true);
    setDroppedFiles(null);
  };

  const handleUploadMedia = async ({ uploads }: { uploads: any }) => {
    await handleUpdateMediaStatus({ upload: uploads?.[0], videoRequestId: videoRequestData?._id });
  };

  const handleUpdateMediaStatus = async ({
    upload,
    videoRequestId,
  }: {
    upload: any;
    videoRequestId: string;
  }) => {
    try {
      setIsLoading(true);
      const addVideoRequestData = {
        url: upload?.url,
        s3Key: upload?.s3Key,
        videoName: upload?.name,
        thumbnailUrl: upload?.thumbnailUrl,
        thumbnailS3Key: upload?.thumbnailS3Key,
      };

      const res: any = await updateVideoRequest({ id: videoRequestId, data: addVideoRequestData });
      if (res.status === 200) {
        setIsLoading(false);
        setUrl(upload?.url);

        const filteredThemes = videoThemesData.reduce((acc, theme) => {
          const updatedVideoRequest = {
            url: upload?.url,
            s3Key: upload?.s3Key,
            videoName: upload?.name,
            thumbnailUrl: upload?.thumbnailUrl,
            thumbnailS3Key: upload?.thumbnailS3Key,
          };

          const updatedVideoRequestIds = theme?.videoRequestIds.map((item: any) => {
            if (item?.videoRequestId?._id === videoRequestId) {
              return {
                ...item,
                videoRequestId: {
                  ...item.videoRequestId,
                  ...updatedVideoRequest,
                },
              };
            }
            return item;
          });
          acc.push({
            ...theme,
            videoRequestIds: updatedVideoRequestIds,
          });

          return acc;
        }, []);

        setVideoThemesData(filteredThemes);
        setStatusChange((prev) => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUrl(videoRequestData?.url as string);
  }, []);

  useEffect(() => {
    if (statusChange?.isOpen) {
      const handleClickOutside = (event: any) => {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          setStatusChange((prev) => ({ ...prev, isOpen: false }));
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [clickRef, statusChange]);

  const videoRequestsArray = [
    {
      label: "Assignee",
      value: videoRequestData?.assignTo?.username,
    },
    {
      label: "Theme Type",
      value: videoRequestData?.category,
    },
    {
      label: "Due Date",
      value: videoRequestData?.dueDate
        ? moment(videoRequestData?.dueDate as string).format("YYYY-MM-DD")
        : "-",
    },
    {
      label: "Created at",
      value: videoRequestData?.createdAt
        ? moment(videoRequestData?.createdAt as string).format("YYYY-MM-DD")
        : "-",
    },
    {
      label: "Created by",
      value: videoRequestData?.userId?.username,
    },
    {
      label: "Status",
      value: videoRequestData?.status,
    },
  ];

  const handleSendEmailToUser = async () => {
    try {
      setStatusChange((prev) => ({ ...prev, isLoadingEmail: true }));
      const data = {
        assignTo: videoRequestData?.assignTo?._id,
        id: videoRequestData?._id,
        schoolYear,
      };
      const res = await sendEmailToUser({ data });
      if (res) {
        setStatusChange((prev) => ({ ...prev, isLoadingEmail: false }));
        createNotification({
          type: "success",
          message: "Success!",
          description: "Email sent successfully",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setStatusChange((prev) => ({ ...prev, isLoadingEmail: false }));
  };

  const handleSampleVideoEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleClickSampleVideoModal();
  };
  const handleClickAudioModalEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleClickAudioModal();
  };

  return (
    <div>
      <Modal
        showCross
        open={isOpenModal}
        modalWrapper={style.scrollbar}
        handleClose={handleCloseModal}
        iconClassName="!w-[12px] !h-[12px]"
        showIconClass="!w-[12px] !h-[12px]"
        className={`md:!max-w-[700px] !max-w-[100vw]`}
      >
        <div>
          <div className=" font-semibold text-[20px] leading-normal text-[#0F0F0F]">
            {videoRequestData?.videoRequestName}
          </div>
          <div className="mt-4">
            <div className=" font-semibold text-[14px] text-[#0F0F0F]">Description</div>
            <div className="font-normal text-[14px] text-[#0F0F0F] mt-3">
              {videoRequestData?.description ? videoRequestData?.description : "-"}
            </div>
          </div>
          <div className="bg-[#F2F2F2] rounded-[10px] p-3 mt-4">
            {videoRequestsArray?.map((data, index) => (
              <div className={`flex justify-between items-center ${index !== 0 ? "mt-4" : ""}`}>
                <div className=" font-semibold text-[14px] text-[#0F0F0F]">{data?.label}</div>
                {data?.label != "Status" ? (
                  <div className="font-normal text-[14px] text-[#0F0F0F]">
                    {data?.value ? data?.value : "-"}
                  </div>
                ) : (
                  <div
                    ref={clickRef}
                    className={`flex capitalize px-[10px] !text-[10px] py-0 justify-end items-center gap-[5px] self-stretch rounded-[5px] border ${data?.label === "Status" ? "cursor-pointer relative" : ""} `}
                    style={{
                      borderColor: color,
                      color: color,
                      background: color ? hexToRgba({ hex: color, opacity: 0.1 }) : "transparent",
                    }}
                    onClick={data?.label === "Status" ? handleStatusChangeCard : undefined}
                  >
                    <div
                      style={{ background: color }}
                      className={`rounded-full w-[12px] h-[12px]`}
                    ></div>
                    {data?.value === "accept"
                      ? "Accepted"
                      : currentUserRole != "producer" && data?.value === "pending"
                        ? "Requested"
                        : data?.value?.replace(/-/g, " ")}
                    {statusChange?.isOpen && (
                      <StatusCompoenet
                        activeStatusFilter={activeStatusFilter}
                        handleClickStatusChange={handleClickStatusChange}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <div className=" font-semibold text-[14px] text-[#0F0F0F]">Upload video</div>
              {videoRequestData?.url && (
                <div
                  className=" font-normal text-[14px] text-[#0F0F0F] !cursor-pointer"
                  onClick={handleClickOpenModal}
                >
                  Replace Video
                </div>
              )}
            </div>
            <div className="font-normal text-[14px] text-[#0F0F0F]  mt-3 w-full !max-w-[670px] !h-full ">
              {videoRequestData?.url ? (
                isLoading ? (
                  <div className="flex justify-center items-center !h-[285px]">
                    <Loader loaderClass="!w-[40px] !h-[40px]" />
                  </div>
                ) : (
                  <video controls className="!h-[285px] w-full bg-black rounded-xl">
                    <source src={url} type="video/mp4" />
                    <track kind="captions" src={url} />
                  </video>
                )
              ) : (
                <div>
                  <input
                    style={{ display: "none" }}
                    ref={inputFile}
                    accept="video/*"
                    onChange={handleFileUpload}
                    type="file"
                  />
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={style.dropVideoContainer}
                  >
                    Drop files here or{" "}
                    <span
                      className="text-red-600  cursor-pointer underline"
                      onClick={onButtonClick}
                    >
                      browser file
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex ${videoRequestData?.sampleThumbnailUrl ? "justify-between" : "justify-end"} items-center gap-[12px] mt-4`}
        >
          <div className="flex gap-1">
            {videoRequestData?.sampleThumbnailUrl && (
              <div
                onClick={handleSampleVideoEvent}
                className="flex px-[10px] cursor-pointer py-[5px] justify-center items-center gap-[10px] rounded-[100px] bg-[#F2F2F2]"
              >
                <Image
                  data-testid="close-icon"
                  src="/assets/video-icon.svg"
                  alt="sortUp"
                  style={{ cursor: "pointer" }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                />
                <div className="text-[10px] font-normal">View Sample Video</div>
              </div>
            )}
            {videoRequestData?.audioUrl && (
              <div
                onClick={handleClickAudioModalEvent}
                className="flex px-[10px] cursor-pointer py-[5px] justify-center items-center gap-[10px] rounded-[100px] bg-[#F2F2F2]"
              >
                <Image
                  data-testid="close-icon"
                  src="/assets/music.png"
                  alt="sortUp"
                  style={{ cursor: "pointer" }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                />
                <div className="text-[10px] font-normal">Play Sample Audio</div>
              </div>
            )}
          </div>
          {(currentUserRole != "producer" || videoRequestData?.userId?._id === loggedInUserId) && (
            <div className=" flex justify-end items-center gap-[12px]">
              {currentUserRole != "producer" &&
                videoRequestData?.status !== "completed" &&
                videoRequestData?.status != "rejected" &&
                (statusChange?.isLoadingEmail ? (
                  <Loader loaderClass="!w-[16px] !h-[16px]" />
                ) : (
                  <Tooltip text="Send Email" backClass="">
                    <Image
                      data-testid="close-icon"
                      src={"/assets/email-box.svg"}
                      alt="sortUp"
                      style={{
                        cursor: "pointer",
                      }}
                      className="!w-[16px] !h-[16px]"
                      height="100"
                      width="100"
                      onClick={handleSendEmailToUser}
                    />
                  </Tooltip>
                ))}
              <Tooltip text="Delete" backClass="">
                <Image
                  data-testid="close-icon"
                  src={"/assets/delete-black.svg"}
                  alt="sortUp"
                  style={{
                    cursor: "pointer",
                  }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                  onClick={handleOpen}
                />
              </Tooltip>
              <Tooltip text="Edit" backClass="">
                <Image
                  data-testid="close-icon"
                  src={"/assets/pen-black.svg"}
                  alt="sortUp"
                  style={{
                    cursor: "pointer",
                  }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                  onClick={handleUpdateVideoRequest}
                />
              </Tooltip>
              {currentUserRole != "producer" &&
                videoRequestData?.status !== "completed" &&
                videoRequestData?.status != "rejected" && (
                  <Tooltip text="Reminder Email" backClass="">
                    <Image
                      data-testid="close-icon"
                      src={"/assets/bell.png"}
                      alt="sortUp"
                      style={{
                        cursor: "pointer",
                      }}
                      className="!w-[16px] !h-[16px]"
                      height="100"
                      width="100"
                      onClick={hanldeIndiviualMailOpen}
                    />
                  </Tooltip>
                )}
            </div>
          )}
        </div>
        <div className={`${isOpen ? style.transloaditBackground : ""}`}>
          <TransloaditUploadModal
            fieldName={isOpen}
            droppedFiles={droppedFiles}
            setFieldName={handleClickEventClose}
            allowedFileTypes={[`video/*`]}
            mapUploads={s3TransloaditUploadMap}
            setUploads={handleUploadMedia}
            fields={{
              prefix: `/video-request/${Math.random().toString()}`,
              timeStamp: moment().format("YYYYMMDD_HHmmss"),
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DetailModalVideoRequest;
