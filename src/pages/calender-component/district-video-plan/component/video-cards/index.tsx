"use client";
import Image from "next/image";
import React, { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import StatusCompoenet from "../status-component";
import DetailModalVideoRequest from "../detail-modal-video-request";

import AddVideoRequestModal from "../../../add-video-request";
import createNotification from "@/src/components/create-notification";

import { handleDownload, statusList } from "@/src/helper/helper";

import { useClients } from "@/src/(context)/context-collection";
import { useCalender } from "@/src/(context)/calender-context";

import {
  sendEmailVideoRequest,
  sendReminderEmailVideoRequest,
  updateVideoRequest,
} from "@/src/app/api/video-request";

import style from "./index.module.scss";

const VideoCards = ({
  id,
  name,
  status,
  videoUrl,
  category,
  videoName,
  audioUrl,
  assignTo,
  isDeleting,
  assignToName,
  videoRequestData,
  handleDeleteEvent,
}: {
  id: string;
  name: string;
  s3Key?: string;
  status: string;
  audioUrl?: string;
  category: string;
  assignTo?: string;
  videoName?: string;
  videoUrl?: string;
  videoRequestData: any;
  isDeleting: boolean;
  assignToName?: string;
  handleDeleteEvent: ({ id }: { id: string }) => void;
}) => {
  const circleColors: any = {
    pending: "#B8B8B8",
    "in-progress": "#f8ae00",
    accept: "#96C9F4",
    rejected: "#FF4C4C",
    completed: "#50B498",
  };
  const clickRef = useRef<HTMLDivElement>(null);
  const statusclickRef = useRef<HTMLDivElement>(null);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [individual, setIndividual] = useState<boolean>(false);
  const [videoModal, setVideoModal] = useState<boolean>(false);
  const [isAssign, setIsAssign] = useState<{
    isAssignTo: boolean;
    isSendTo: boolean;
  }>({
    isSendTo: false,
    isAssignTo: false,
  });
  const [isModalState, setIsModalState] = useState<{
    isModalOpen: boolean;
    isAudioFile?: boolean;
    isOpenStatusModal?: boolean;
    isSampleVideo?: boolean;
  }>({
    isModalOpen: false,
    isAudioFile: false,
    isSampleVideo: false,
    isOpenStatusModal: false,
  });

  const [updatedVideoRequest, setUpdatedVideoRequest] = useState<{
    isModalOpen: boolean;
    VideoRequestId: string;
    isDownload?: boolean;
  }>({
    isModalOpen: false,
    isDownload: false,
    VideoRequestId: "",
  });

  const { schoolYear, handleGetAllThemes, videoThemesData, setVideoThemesData } = useCalender();

  const contextData = useClients();
  const allUser = contextData && contextData?.allUser;
  const loggedInUser = contextData && contextData?.loggedInUser;
  const currentUserRole = contextData && contextData?.currentUserRole;

  const activeStatusFilter = statusList.filter(({ value }) => value !== status);

  const handleStatusChangeCard = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalState((prev) => ({ ...prev, isOpenStatusModal: true }));
  };

  const handleUpdateStatus = async ({
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

      if (res?.status === 200) {
        createNotification({
          type: "success",
          message: "Success!",
          description: "Status updated successfully.",
        });

        const filteredThemes = videoThemesData?.reduce((acc, theme) => {
          const matchingId = theme?.videoRequestIds?.find(
            (id: any) => id?.videoRequestId?._id === videoRequestId,
          );

          if (matchingId) {
            const updatedVideoRequest = {
              ...matchingId.videoRequestId,
              status,
            };

            const updatedVideoRequestIds = theme.videoRequestIds.map((id: any) =>
              id?.videoRequestId?._id === videoRequestId
                ? {
                    ...id,
                    videoRequestId: updatedVideoRequest,
                  }
                : id,
            );

            acc.push({
              ...theme,
              videoRequestIds: updatedVideoRequestIds,
            });
          } else {
            acc.push(theme);
          }

          return acc;
        }, []);

        setVideoThemesData(filteredThemes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickStatusChange = async ({ status }: { status: string }) => {
    await handleUpdateStatus({ status, videoRequestId: id });
    setIsModalState((prev) => ({ ...prev, isOpenStatusModal: false }));
  };

  const userData = useMemo(() => {
    return (
      allUser
        // ?.filter((data) => data?._id != loggedInUser?._id)
        ?.map((data) => {
          return { label: data?.username || data?.fullName, value: data?._id };
        })
    );
  }, [allUser]);

  const handleDelete = () => {
    handleDeleteEvent({ id });
  };

  const handleResponseData = () => {
    handleGetAllThemes();
  };

  const handleOpen = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleModalClose();
    setIsOpen(true);
  };
  const handleClose = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleUpdateVideoRequest = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleModalClose();
    setUpdatedVideoRequest((prev) => ({ ...prev, isModalOpen: true, VideoRequestId: id }));
  };
  const handleIsModalUpdateClose = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setUpdatedVideoRequest((prev) => ({ ...prev, isModalOpen: false, VideoRequestId: "" }));
  };

  const handleOpenUserMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenu(true);
  };

  const handleClickUser = async ({ assignTo }: { assignTo: string }) => {
    setIsAssign((prev) => ({ ...prev, isAssignTo: true }));
    try {
      setIsMenu(false);
      const response: any = await sendEmailVideoRequest({
        data: { id, assignTo, schoolYear },
      });
      if (response.status === 200) {
        handleResponseData();
        createNotification({
          type: "success",
          message: "Success!",
          description: "Successfully assigned.",
        });
        setIsMenu(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsAssign((prev) => ({ ...prev, isAssignTo: false }));
  };

  const hanldeIndiviualMailOpen = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleModalClose();
    setIndividual(true);
  };

  const handleCloseIndividualModal = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIndividual(false);
  };

  const handleSendEmialEvent = async () => {
    setIsAssign((prev) => ({ ...prev, isSendTo: true }));
    try {
      const sendEmail = [{ videoRequestId: id, assignTo }] as [
        { videoRequestId: string; assignTo: string },
      ];
      const res: any = await sendReminderEmailVideoRequest({
        sendEmail,
        requestedById: loggedInUser?._id,
      });
      if (res.status === 200) {
        createNotification({
          type: "success",
          message: "Success!",
          description: "Email sent successfully.",
        });
        setIndividual(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsAssign((prev) => ({ ...prev, isSendTo: false }));
  };

  const handleVideoModal = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoModal(true);
  };

  const handleClickSampleVideoModal = (e?: any) => {
    setVideoModal(true);
    setIsModalState((prev) => ({
      ...prev,
      isSampleVideo: true,
      isModalOpen: false,
      isOpenStatusModal: false,
    }));
  };
  const handleClickAudioModal = (e?: any) => {
    setVideoModal(true);
    setIsModalState((prev) => ({
      ...prev,
      isAudioFile: true,
      isModalOpen: false,
      isOpenStatusModal: false,
    }));
  };

  const handleCloseVideoMoadl = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setVideoModal(false);
    setIsModalState((prev) => ({
      ...prev,
      isSampleVideo: false,
      isModalOpen: false,
      isAudioFile: false,
      isOpenStatusModal: false,
    }));
  };

  const color = circleColors[status] || "#B8B8B8";

  const words = assignToName ? assignToName?.trim()?.split(" ") : "-";

  const assignToLetters = useMemo(() => {
    return words?.length === 1 ? words?.[0]?.[0] : `${words?.[0]?.[0]}${words?.at(-1)?.[0]}`;
  }, [words]);

  const handleDownloads = async () => {
    try {
      setUpdatedVideoRequest((prev) => ({ ...prev, isDownload: true }));
      await handleDownload({ url: videoUrl as string, name: videoName as string });
    } catch (error) {
      console.error(error);
      createNotification({
        type: "error",
        message: "Error!",
        description: "Error downloading video",
      });
    }
    setUpdatedVideoRequest((prev) => ({ ...prev, isDownload: false }));
  };

  const hanldeisExpandable = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsModalState((prev) => ({ ...prev, isModalOpen: true }));
    setIsShow(!isShow);
  };

  const handleModalOpen = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalState((prev) => ({ ...prev, isModalOpen: true }));
  };

  const handleModalClose = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsModalState((prev) => ({ ...prev, isModalOpen: false }));
  };

  useEffect(() => {
    if (isMenu) {
      const handleClickOutside = (event: any) => {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          setIsMenu(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [clickRef, isMenu]);

  useEffect(() => {
    if (isModalState?.isOpenStatusModal) {
      const handleClickOutside = (event: any) => {
        if (statusclickRef.current && !statusclickRef.current.contains(event.target)) {
          setIsModalState((prev) => ({ ...prev, isOpenStatusModal: false }));
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [statusclickRef, isModalState?.isOpenStatusModal]);

  const statusProducer = [
    {
      label: "Rejected",
      value: "rejected",
      colorStatus: "#FF4C4C",
    },
    { label: "Accept", value: "accept", colorStatus: "#96C9F4" },
  ];

  return (
    <>
      <div
        onClick={handleModalOpen}
        className=" w-full flex flex-col  p-[10px] gap-[10px] rounded-[10px] border border-[#B8B8B8] bg-[#F8F8F8]"
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-1">
            <Image
              data-testid="close-icon"
              style={{
                cursor: "grab",
              }}
              width="500"
              height="500"
              alt="sortUp"
              draggable={true}
              src={"/assets/drag.svg"}
              className="!w-[16px] !h-[16px]"
            />
            <div
              onClick={hanldeisExpandable}
              className={`
              text-[14px]
              font-medium
              text-[#0F0F0F]
              cursor-pointer
               !hyphens-auto !break-words !break-all 
              ${style.dashClassThemes}
              `}
            >
              {name}
            </div>
          </div>

          <div className="relative" ref={clickRef}>
            {isAssign?.isAssignTo ? (
              <Loader pageLoader={false} loaderClass={style.loadingClassUser} />
            ) : (
              <Tooltip text={assignToName ? assignToName : ("Unassigned" as string)} backClass="">
                {assignTo ? (
                  <div
                    onClick={handleOpenUserMenu}
                    className={`!w-[24px] !h-[24px] text-[10px] !flex justify-center items-center rounded-full bg-slate-700 text-white ${status !== "completed" && status != "rejected" ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {assignToLetters?.toUpperCase()}
                  </div>
                ) : (
                  <div
                    onClick={handleOpenUserMenu}
                    className={`!w-[70px] !h-[24px] text-[10px] !flex justify-center items-center rounded-3xl bg-slate-500 text-white ${status !== "completed" && status != "rejected" ? "cursor-pointer" : "cursor-default"}`}
                  >
                    Unassigned
                  </div>
                )}
              </Tooltip>
            )}
            {isMenu && currentUserRole != "producer" && status !== "completed" && (
              <div
                className={`flex flex-col h-[200px] z-10  overflow-scroll w-[230px] p-[5px] items-start gap-[5px] absolute right-[0px] top-[30px] rounded-[5px] bg-white shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] ${style.scrollBarClass}`}
              >
                {userData?.map((data) => (
                  <UserComponent
                    key={data?.value}
                    id={data?.value}
                    name={data?.label as string}
                    handleClickUser={handleClickUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {(videoRequestData?.thumbnailUrl || videoRequestData?.sampleThumbnailUrl) && (
          <div className="w-full h-[150px] rounded-md">
            <Image
              data-testid="close-icon"
              src={
                videoRequestData?.thumbnailUrl
                  ? videoRequestData?.thumbnailUrl
                  : videoRequestData?.sampleThumbnailUrl
              }
              style={{ borderRadius: "5px", objectFit: "cover" }}
              alt="sortUp"
              className="!w-full !h-full"
              height="500"
              width="500"
            />
          </div>
        )}
        <div className=" flex justify-between w-full text-[#0F0F0F]  text-[12px] ">
          <div className=" font-light ">Category</div>
          <div className=" !text-[12px] font-medium">{category ? category : "-"}</div>
        </div>
        <div className=" flex justify-between w-full text-[#0F0F0F]  text-[12px] relative ">
          <div className=" font-light ">Status</div>
          {assignTo ? (
            currentUserRole != "producer" || status != "pending" ? (
              <div
                ref={statusclickRef}
                className={`!text-[12px] font-medium capitalize flex items-center gap-[5px] cursor-pointer relative`}
                onClick={handleStatusChangeCard}
              >
                <div
                  style={{ background: color }}
                  className={` rounded-full w-[12px] h-[12px]`}
                ></div>
                {status === "accept"
                  ? "Accepted"
                  : currentUserRole != "producer" && status === "pending"
                    ? "Requested"
                    : status}
                {isModalState?.isOpenStatusModal && (
                  <StatusCompoenet
                    activeStatusFilter={activeStatusFilter}
                    handleClickStatusChange={handleClickStatusChange}
                  />
                )}
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                {statusProducer?.map((data) => {
                  return <Status handleClickStatusChange={handleClickStatusChange} status={data} />;
                })}
              </div>
            )
          ) : (
            <div>-</div>
          )}
        </div>
        {(currentUserRole != "producer" || videoRequestData?.userId?._id === loggedInUser?._id) && (
          <div className=" flex justify-end items-center gap-[12px]">
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
            {assignTo &&
              status !== "completed" &&
              status != "rejected" &&
              currentUserRole != "producer" && (
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
            {videoUrl && (
              <Tooltip text="Video" backClass="">
                <Image
                  data-testid="close-icon"
                  src="/assets/video-play.svg"
                  alt="sortUp"
                  style={{ cursor: "pointer" }}
                  className="!w-[16px] !h-[16px]"
                  height="100"
                  width="100"
                  onClick={handleVideoModal}
                />
              </Tooltip>
            )}
          </div>
        )}
        {updatedVideoRequest?.isModalOpen && (
          <AddVideoRequestModal
            isUpdate={true}
            handleResponseData={handleResponseData}
            id={updatedVideoRequest?.VideoRequestId}
            isOpen={updatedVideoRequest?.isModalOpen}
            isAllow={status != "completed" ? true : false}
            handleIsModalClose={handleIsModalUpdateClose}
          />
        )}
      </div>
      {
        <DetailModalVideoRequest
          handleOpen={handleOpen}
          loggedInUserId={loggedInUser?._id}
          handleCloseModal={handleModalClose}
          videoRequestData={videoRequestData}
          isOpenModal={isModalState?.isModalOpen}
          currentUserRole={currentUserRole as string}
          handleClickAudioModal={handleClickAudioModal}
          handleClickStatusChange={handleClickStatusChange}
          handleUpdateVideoRequest={handleUpdateVideoRequest}
          hanldeIndiviualMailOpen={hanldeIndiviualMailOpen}
          handleClickSampleVideoModal={handleClickSampleVideoModal}
        />
      }

      <Modal
        open={isOpen}
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
            className="!w-[60px] !h-[60px]"
            src={"/assets/delete-red.svg"}
            alt="sortUp"
            height="100"
            width="100"
          />
          <div className={style.deleteHeading}>
            Are you sure you want to delete this video request?
          </div>
          <div className={style.text}>You will not be able to recover that video request.</div>

          <div className="flex justify-end items-center gap-3 mt-5">
            <Button
              type="button"
              text="Cancel"
              handleClick={handleClose}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
            />
            <Button
              type="button"
              text="Confirm"
              isLoading={isDeleting}
              handleClick={handleDelete}
              className={`!text-[#fff] !font-semibold`}
              btnClass={` !rounded-md !bg-[#ED1C24]  ${style.maxWidth}   `}
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={individual}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
        handleClose={handleCloseIndividualModal}
      >
        <div className={style.deleteModal}>
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
              textAlign: "center",
              margin: "auto",
            }}
            className="!w-[60px] !h-[60px]"
            src={"/assets/notify.svg"}
            alt="sortUp"
            height="100"
            width="100"
          />
          <div className={style.deleteHeading}>Video Request Due Reminder</div>
          <div className={style.text}>{`This Reminder email will be sent to ${assignToName}`}</div>

          <div className="flex justify-end items-center gap-3 mt-5">
            <Button
              type="button"
              text="Cancel"
              handleClick={handleCloseIndividualModal}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
            />
            <Button
              type="button"
              text="Confirm"
              isLoading={isAssign?.isSendTo}
              handleClick={handleSendEmialEvent}
              className={`!text-[#fff] !font-semibold`}
              btnClass={` !rounded-md !bg-[#ED1C24]  ${style.maxWidth}   `}
            />
          </div>
        </div>
      </Modal>

      {/* sample and video modal  */}
      {videoModal && (
        <>
          <div
            className={`absolute top-0 left-0 flex justify-between items-center w-full bg-black p-[20px] text-white ${style.zIndexClass}`}
          >
            <div className="text-white text-base font-normal leading-normal">{`' ${isModalState?.isSampleVideo ? "Sample Video" : name} '`}</div>
            <div className="flex gap-3">
              {!isModalState?.isSampleVideo && !isModalState?.isAudioFile && (
                <div
                  onClick={handleDownloads}
                  className="cursor-pointer md:flex hidden justify-center items-center p-2.5 gap-2.5 border border-white rounded-md"
                >
                  {updatedVideoRequest?.isDownload ? (
                    <div className="w-24 md:flex hidden justify-center items-center">
                      <Loader pageLoader={false} loaderClass="!w-[20px] !h-[20px]" />
                    </div>
                  ) : (
                    "Download"
                  )}
                </div>
              )}
              <Image
                width="100"
                height="100"
                alt="sortUp"
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  margin: "auto",
                }}
                data-testid="close-icon"
                className="!w-[24px] !h-[24px]"
                src={"/assets/corss-white.png"}
                onClick={handleCloseVideoMoadl}
              />
            </div>
          </div>

          <Modal
            open={videoModal}
            className={style.videoModalBody}
            handleClose={handleCloseVideoMoadl}
            modalWrapper={style.opacityModalVideoModal}
          >
            {isModalState?.isAudioFile ? (
              <div className="bg-[#333333] w-full h-36 flex justify-center items-center rounded-md p-1">
                <audio className={"w-full"} controls>
                  <source src={audioUrl} type="audio/mpeg" />
                  <track kind="captions" src={audioUrl} />
                </audio>
              </div>
            ) : (
              <video className={style.videoPlayer} controls>
                <source
                  src={isModalState?.isSampleVideo ? videoRequestData?.sampleUrl : videoUrl}
                  type="video/mp4"
                />
                <track
                  kind="captions"
                  src={isModalState?.isSampleVideo ? videoRequestData?.sampleUrl : videoUrl}
                />
              </video>
            )}
          </Modal>
          <div
            className={`md:hidden absolute bottom-0 left-0 flex justify-center items-center w-full bg-black p-[20px] text-white ${style.zIndexClass}`}
          >
            {!isModalState?.isSampleVideo && !isModalState?.isAudioFile && (
              <div className="flex gap-3">
                <div
                  onClick={handleDownloads}
                  className=" cursor-pointer flex md:hidden justify-center items-center p-2.5 gap-2.5 border border-white rounded-md"
                >
                  {updatedVideoRequest?.isDownload ? (
                    <div className="w-24 md:flex hidden justify-center items-center">
                      <Loader pageLoader={false} loaderClass="!w-[20px] !h-[20px]" />
                    </div>
                  ) : (
                    "Download"
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VideoCards;

const UserComponent = ({
  name,
  id,
  handleClickUser,
}: {
  name: string;
  id: string;
  handleClickUser: ({ assignTo }: { assignTo: string }) => void;
}) => {
  const handleClickEvent = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleClickUser({ assignTo: id });
  };
  return (
    <div
      onClick={handleClickEvent}
      className={`flex p-[10px]  items-center gap-[10px] w-fill cursor-pointer rounded-[5px]   ${style.hoverUserClass}`}
    >
      <Image
        data-testid="close-icon"
        src={"/assets/user-black.svg"}
        alt="sortUp"
        style={{ cursor: "pointer" }}
        className="!w-[24px] !h-[24px]"
        height="100"
        width="100"
      />
      <span className={`overflow-hidden text-ellipsis`}> {name}</span>
    </div>
  );
};

const Status = ({
  status,
  handleClickStatusChange,
}: {
  status: { value: string; label: string; colorStatus: string };
  handleClickStatusChange: ({ status }: { status: string }) => void;
}) => {
  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    handleClickStatusChange({ status: status?.value });
  };
  return (
    <div className="flex justify-center items-center gap-1 cursor-pointer" onClick={handleClick}>
      <div
        style={{ borderColor: status?.colorStatus, border: `1px solid ${status?.colorStatus}` }}
        className={` rounded-full w-[12px] h-[12px]`}
      ></div>
      <div>{status?.label}</div>
    </div>
  );
};
