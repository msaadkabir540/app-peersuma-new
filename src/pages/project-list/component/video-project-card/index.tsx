import moment from "moment";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";

import { lettersValue, useOutsideClickHook } from "@/src/helper/helper";

import { useClients } from "@/src/(context)/context-collection";

import { VideoProjectDataInterface } from "@/src/interface/video-request-interface";

import styles from "../index.module.scss";

const VideoProjectCard = ({
  cardData,
  isDeleted,
  handleOpenModal,
  dragStartHandler,
  handleTemporaryDelete,
  handleStatusChangeMobileView,
}: {
  isDeleted: boolean;
  dragStartHandler: any;
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
  cardData: VideoProjectDataInterface;
  handleOpenModal: ({ videoProjectId }: { videoProjectId: string }) => void;
  handleTemporaryDelete: ({ videoProjectId }: { videoProjectId: string }) => void;
}) => {
  const clickRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenuContributors, setIsOpenMenuContributors] = useState(false);
  const [statusChange, setStatusChange] = useState<{ isMenuOpen: boolean }>({
    isMenuOpen: false,
  });
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const context = useClients();
  const currentUserRole = context && context?.currentUserRole;

  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/produce/${cardData._id}`);
  };

  const mediaCount = useMemo(() => {
    return cardData?.albumId?.albumshots?.reduce((total, albumshot: any) => {
      return total + (albumshot.media ? albumshot.media.length : 0);
    }, 0);
  }, [cardData]);

  const sharedMedia = useMemo(() => {
    if (!cardData?.albumId?.albumshots) return { totalMedia: 0, invite: null };

    return cardData?.albumId?.albumshots?.reduce(
      (result: { totalMedia: number; invite: any }, { invites, media }: any) => {
        const invite = invites?.find(({ id }: any) => id === userId);
        if (!invite || !media) return result;

        const userMediaCount = media?.filter(
          ({ userId: mediaUserId }: any) => mediaUserId === userId,
        )?.length;

        return {
          totalMedia: result.totalMedia + userMediaCount,
          invite: invite?.lastInvited && invite?.lastInvited,
        };
      },
      { totalMedia: 0, invite: null },
    );
  }, [cardData, userId]);

  const isUser = useMemo(() => {
    return userId === cardData?.createdByUser?._id || currentUserRole === "backend";
  }, [userId, cardData]);

  const handleUpdate = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenModal({ videoProjectId: cardData?._id });
  };

  const handleDelete = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };
  //

  const handleDeleteConfirm = () => {
    handleTemporaryDelete({ videoProjectId: cardData?._id });
  };

  const handleClose = () => setIsOpen(false);
  const handleMenuOpen = () => setStatusChange((prev) => ({ ...prev, isMenuOpen: true }));

  const cardInfo = [
    {
      label: isUser ? "Created at" : "Invited at",
      value: isUser
        ? moment(cardData?.createdAt as string).format("YYYY-MM-DD")
        : sharedMedia?.invite
          ? moment(sharedMedia?.invite as string).format("YYYY-MM-DD")
          : "-",
    },
  ];

  const status = [
    {
      numberId: 1,
      id: "in-production",
      title: "In Production",
    },
    {
      numberId: 2,
      id: "in-post-production",
      title: "Post Production",
    },
    {
      numberId: 3,
      id: "in-review",
      title: "Draft Review",
    },
    {
      numberId: 4,
      id: "closed-cancelled",
      title: "Closed/Cancelled",
    },
  ];

  const currentIndex = status?.findIndex(({ id }) => id === cardData?.status);

  const nextStatus =
    currentIndex >= 0 && currentIndex < status.length - 1 ? status[currentIndex + 1] : null;

  const isPrevStatus =
    !cardData?.isEditingProcess && cardData?.status === "in-post-production" ? status[0] : null;

  const handleClickEvent = ({ status }: { status: string }) => {
    handleStatusChangeMobileView({
      status,
      id: cardData?._id,
      oldStatus: cardData?.status,
      videoProjectName: cardData?.name,
    });
  };

  useOutsideClickHook(clickRef, () => {
    setStatusChange((prev) => ({ ...prev, isMenuOpen: false }));
    setIsOpenMenuContributors(false);
  });

  const uniqueContributors = cardData?.contributor
    ?.filter(
      (value: any) => value?.userId && value.userId?._id, // Filter out invalid userId
    )
    .filter(
      (value: any, index: number, self: any[]) =>
        self.findIndex((v: any) => v.userId?._id === value.userId?._id) === index, // Remove duplicates
    );

  const handleOpenMenuContributors = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenMenuContributors(true);
  };

  const createdByUserAvatar = useMemo(() => {
    return lettersValue({ value: cardData?.createdByUser?.username });
  }, [cardData?.createdByUser?.username]);

  const totalMedia = useMemo(() => {
    return isUser ? mediaCount : sharedMedia?.totalMedia;
  }, [isUser, mediaCount, sharedMedia]);

  return (
    <div
      onClick={handleRedirect}
      className={`flex cursor-pointer flex-col items-start gap-2.5 p-3.5 rounded-lg border border-gray-400 bg-white ${
        cardData?.status != "cancelled" && cardData?.status != "closed" && isUser ? "" : ""
      }  ${styles.videoRequestClass}`}
    >
      <div className="flex justify-between w-full items-center">
        <div className={`flex gap-1 items-center w-full `}>
          {cardData?.status != "cancelled" && cardData?.status != "closed" && isUser && (
            <div className={styles.dragClass} draggable onDragStart={dragStartHandler}>
              <Image
                data-testid="close-icon"
                style={{
                  cursor: "grab",
                }}
                className="!w-[16px] !h-[16px]"
                src={"/assets/drag.svg"}
                alt="sortUp"
                height="500"
                width="500"
                draggable={true}
              />
            </div>
          )}

          <div
            onClick={handleRedirect}
            className={`overflow-hidden text-ellipsis text-[#0F0F0F] text-[14px] font-medium leading-normal !cursor-pointer ${styles.cardsNameClass}`}
          >
            {cardData?.name}
          </div>
        </div>
        <div className={`flex w-[24px] h-[24px] justify-center items-center rounded-[50%] `}>
          <Tooltip backClass="" text={`created by : ${cardData?.createdByUser?.username}`}>
            <div
              className={`!w-[24px] !h-[24px] text-[10px] !flex justify-center items-center rounded-full bg-slate-700 text-white `}
            >
              {createdByUserAvatar?.toUpperCase()}
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="flex justify-center items-center w-full">
        <span className="text-center text-[#ED1C24] text-[32px] font-medium">{totalMedia}</span>{" "}
        <span className="text-center text-[#0F0F0F] text-[14px] font-medium ml-[10px]">
          {" "}
          Uploads
        </span>
      </div>

      {cardInfo.map((item, index) => (
        <div key={index} className="flex justify-between w-full text-[#0F0F0F] !text-[12px]">
          <div className="font-medium">{item.label}</div>
          <div className="font-semibold">{item.value ?? "-"}</div>
        </div>
      ))}

      {uniqueContributors?.length > 0 && (
        <div className="flex justify-between w-full text-[#0F0F0F] !text-[12px] relative">
          <div className="font-medium">Contributors</div>
          <div className="relative flex justify-end items-center max-w-[120px]">
            {uniqueContributors
              ?.slice(0, 4)
              .map(({ userId }: any, index) => (
                <ContributorsList
                  name={userId?.username}
                  index={index}
                  totalNumber={uniqueContributors?.length}
                />
              ))}
            {uniqueContributors?.length > 4 && (
              <div
                className="w-[24px] h-[24px] cursor-pointer rounded-full bg-[#B8B8B8] text-[#0F0F0F] text-xs flex items-center justify-center border border-white"
                style={{
                  transform: `translateX(${4 * -6}px)`,
                  zIndex: 0,
                }}
                onClick={handleOpenMenuContributors}
              >
                +{uniqueContributors.length - 4}
              </div>
            )}
          </div>

          {isOpenMenuContributors && (
            <div
              ref={clickRef}
              className="z-50 absolute bottom-[24px] right-[10px] inline-flex flex-col items-start gap-1.25 p-3 h-[120px] overflow-scroll rounded-md !shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] bg-white  w-[170px]"
            >
              <div className=" !text-[12px] font-medium capitalize flex items-center gap-[5px] pb-[5px]">
                Contributors :
              </div>
              {uniqueContributors.map(({ userId }: any, index) => (
                <div
                  key={index}
                  className="flex justify-between w-full text-[#0F0F0F] !text-[12px] py-1"
                >
                  <div className="font-medium">
                    <ContributorsListMenu name={userId?.username} />
                  </div>
                  <div className="font-semibold">{userId?.username}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {cardData?.status != "cancelled" && cardData?.status !== "closed" && isUser && (
        <div className=" md:hidden flex justify-between w-full text-[#0F0F0F] !text-[12px]">
          <div className="font-medium">Status</div>
          <div className="font-semibold capitalize" onClick={handleMenuOpen}>
            {cardData?.status?.replace(/-/g, " ")}
          </div>
        </div>
      )}
      {(cardData?.status === "cancelled" || cardData?.status === "closed") && (
        <div className=" flex justify-between w-full text-[#0F0F0F] !text-[12px]">
          <div className="font-medium">Status</div>
          <div className="font-semibold capitalize">{cardData?.status?.replace(/-/g, " ")}</div>
        </div>
      )}
      {statusChange?.isMenuOpen && (
        <div
          ref={clickRef}
          className=" absolute bottom-[58px] right-[10px] inline-flex flex-col items-start gap-1.25 p-1.25 rounded-md !shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] bg-white  w-[170px]"
        >
          <div className=" !text-[12px] font-medium capitalize flex items-center gap-[5px] pt-2.5 pr-0 pb-0 pl-3">
            Move To :
          </div>
          {isPrevStatus && <Status handleClickEvent={handleClickEvent} nextStatus={isPrevStatus} />}
          {nextStatus && <Status handleClickEvent={handleClickEvent} nextStatus={nextStatus} />}
        </div>
      )}

      <Modal
        open={isOpen}
        handleClose={handleClose}
        className={styles.bodyModal}
        modalWrapper={styles.opacityModal}
      >
        <div className={styles.deleteModal}>
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
          <div className={styles.deleteHeading}>Are you sure you want to delete this Project?</div>
          <div className={styles.text}>You will not be able to recover that Project.</div>

          <div className="flex justify-end items-center gap-3 mt-5">
            <Button
              type="button"
              text="Cancel"
              handleClick={handleClose}
              className={`!text-[#ED1C24] !font-semibold`}
              btnClass={`!rounded-md ${styles.redBorder} ${styles.maxWidth}  !bg-transparent `}
            />
            <Button
              type="button"
              text="Yes, Delete"
              isLoading={isDeleted}
              handleClick={handleDeleteConfirm}
              className={`!text-[#fff] !font-semibold`}
              btnClass={` !rounded-md !bg-[#ED1C24]  ${styles.maxWidth}   `}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoProjectCard;

const Status = ({
  nextStatus,
  handleClickEvent,
}: {
  nextStatus: { id: string; title: string };
  handleClickEvent: ({ status }: { status: string }) => void;
}) => {
  const handleClickEvents = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    handleClickEvent({ status: nextStatus?.id });
  };

  const circleColors: any = {
    "in-production": "#FFE599",
    "in-post-production": "#87CEFA",
    "in-review": "#CAA0FF",
    "closed-cancelled": "#A8E6CF",
  };

  const color = circleColors[nextStatus?.id] || "#B8B8B8";
  return (
    <div
      className=" !text-[12px] font-medium capitalize flex items-center gap-[10px] p-3 cursor-pointer"
      onClick={handleClickEvents}
    >
      <div style={{ background: color }} className={`rounded-full w-[12px] h-[12px]`}></div>
      <div>{nextStatus?.title}</div>
    </div>
  );
};

const ContributorsList = ({
  name,
  index,
  totalNumber,
}: {
  name: string;
  index: number;
  totalNumber: number;
}) => {
  const createdByUserAvatar = useMemo(() => {
    return lettersValue({ value: name });
  }, [name]);

  return (
    <Tooltip backClass="" text={name}>
      <div
        className="relative w-[24px] h-[24px] rounded-full"
        style={{
          transform: `translateX(${index * -6}px)`,
          zIndex: totalNumber - index,
        }}
      >
        <div
          className={`!w-[24px] !h-[24px] text-[10px] !flex justify-center items-center rounded-full bg-slate-700 text-white `}
        >
          {createdByUserAvatar?.toUpperCase()}
        </div>
      </div>
    </Tooltip>
  );
};
const ContributorsListMenu = ({ name }: { name: string }) => {
  const createdByUserAvatar = useMemo(() => {
    return lettersValue({ value: name });
  }, [name]);

  return (
    <div className="relative w-[24px] h-[24px] rounded-full">
      <div
        className={`!w-[24px] !h-[24px] text-[10px] !flex justify-center items-center rounded-full bg-slate-700 text-white `}
      >
        {createdByUserAvatar?.toUpperCase()}
      </div>
    </div>
  );
};
