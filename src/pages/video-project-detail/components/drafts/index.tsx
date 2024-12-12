"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import Comments from "./comments";
import CardContainer from "./card-container";
import Loader from "@/src/components/loader";
import { DraftApi } from "@/src/app/api/draft";
import createNotification from "@/src/components/create-notification";

import { downloadApi } from "@/src/app/api/download-api";

import { useClients } from "@/src/(context)/context-collection";

import { UsersInterface } from "@/src/app/interface/user-interface/user-interface";
import { ClientInterface } from "@/src/app/interface/client-interface/client-interface";
import { VideoDraftInterface } from "@/src/app/interface/draft-interface/draft-interface";

import styles from "./index.module.scss";
import DraftCarouselSection from "./draft-grid-card/draft-carousel-section";
import Button from "@/src/components/button";
import { useMediaQuery } from "usehooks-ts";

const Draft = ({
  handleMediaList,
  selectedUser,
  videoPageId,
  userData,
}: {
  handleMediaList: () => void;
  userData: UsersInterface[] | undefined;
  selectedUser: ClientInterface;
  videoPageId: string;
}) => {
  const isMobile = useMediaQuery("(max-width: 500px)");

  const context = useClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedClientIds = context ? context.selectedClientIds : [];

  const [draftChat, setDraftChat] = useState<string>("draftSide");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoDraft, setVideoDraft] = useState<VideoDraftInterface[] | []>([]);

  const handleShowDraft = () => {
    setDraftChat("draftSide");
  };
  const handleShowChat = () => {
    setDraftChat("chat");
  };

  const handleDownload = async ({
    videoId,
    videoDraftId,
  }: {
    videoId: string;
    videoDraftId: string;
  }) => {
    try {
      const downloadedMedia = videoDraft[0]?.draftVideo?.filter((data: any) => {
        return videoId === data?._id;
      })?.[0];
      const fileName = downloadedMedia?.name;

      const finalFileName = fileName?.includes(".") ? fileName : fileName + ".mp4";

      await downloadApi.performAction({
        action: "download-file",
        data: { s3Key: downloadedMedia?.s3Key, finalFileName: finalFileName },
      });
    } catch (error) {
      console.error(error);
      createNotification({
        type: "error",
        message: "Error!",
        description: "Failed to download the video.",
      });
    }
  };

  const handleAddComments = async ({
    comment,
    videoProjectId,
    clientId,
    currentUser,
    videoDraftId,
  }: {
    comment: string;
    videoProjectId: string;
    clientId: string;
    currentUser: { name: string | undefined; userId: string | undefined };
    videoDraftId: string;
  }) => {
    const data = {
      comment,
      videoProjectId,
      clientId,
      userId: currentUser?.userId,
      videoDraftId,
    };

    const addCommentsResponse = await DraftApi.performAction({
      action: "add-comment",
      data,
    });
    if (addCommentsResponse?.status === 200) {
      const updatedDraftVideo = addCommentsResponse?.responseData?.draftVideo;

      const draftVideoIndex = videoDraft?.findIndex(
        ({ _id }: { _id: string }) => _id === updatedDraftVideo?._id,
      ) as number;
      if (videoDraft) {
        if (draftVideoIndex !== -1) {
          const updatedVideoDrafts = [...videoDraft];
          updatedVideoDrafts[draftVideoIndex] = updatedDraftVideo;

          setVideoDraft(updatedVideoDrafts);
        }
      }
    }
  };

  const handleChangeVideoName = async ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    mediaId: string;
    videoDraftId: string;
  }) => {
    const updateData = {
      videoDraftId,
      bodyData: {
        name: value,
        mediaId,
      },
    };
    const renameResponse = await DraftApi.performAction({
      action: "update-draft-name",
      data: updateData,
    });
    if (renameResponse?.status === 200) {
      const updatedDraftVideo = renameResponse?.responseData?.getDraftVideo;

      const draftVideoIndex = videoDraft?.findIndex(
        ({ _id }: { _id: string }) => _id === updatedDraftVideo?._id,
      ) as number;

      if (videoDraft) {
        if (draftVideoIndex !== -1) {
          const updatedVideoDrafts = [...videoDraft];
          updatedVideoDrafts[draftVideoIndex] = updatedDraftVideo;
          setVideoDraft(updatedVideoDrafts);
        }
      }
      return true;
    } else {
      createNotification({ type: "error", message: renameResponse?.msg });
    }
  };

  const handleGetVideoDrafts = async ({
    videoPageId,
    selectedClientId,
  }: {
    videoPageId: string;
    selectedClientId: string;
  }) => {
    setIsLoading(true);
    const data = { videoProjectId: videoPageId, selectedClientId };
    try {
      const videoDraftResponse = await DraftApi.performAction({
        action: "get-all-video-drafts",
        data,
      });
      if (videoDraftResponse?.status === 200) {
        setVideoDraft(videoDraftResponse?.getDraftVideo || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    videoPageId &&
      selectedUser &&
      handleGetVideoDrafts({ videoPageId, selectedClientId: selectedClientIds as string });
  }, [videoPageId, selectedUser, selectedClientIds]);

  const currentUser = { name: selectedUser?.username, userId: selectedUser?._id };

  return (
    <>
      {/* {activeList === "drafts" && ( */}
      <div className="flex md:justify-between justify-end  md:h-12 md:mb-2 my-2 md:flex-row flex-col">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start gap-2 items-center w-full">
            <div
              className={`md:text-[25px] text-[16px] font-medium ${
                draftChat === "draftSide" && isMobile
                  ? "!text-[#ed1c24] !underline cursor-pointer "
                  : "text-[#0F0F0F]"
              }`}
              onClick={() => {
                if (isMobile) {
                  handleShowDraft();
                }
              }}
            >
              Drafts
            </div>
            <div
              className={`md:hidden block md:text-[25px] text-[16px] font-medium  ${
                draftChat === "chat"
                  ? "!text-[#ed1c24] !underline cursor-pointer"
                  : "text-[#0F0F0F]"
              }`}
              onClick={handleShowChat}
            >
              Chat
            </div>
          </div>
          <Button
            text="Back to Upload Media"
            imgClass={"md:!w-[20px] md:!h-[20px] !h-[24px] !w-[24px]"}
            btnClass={styles.btnCreateClass}
            iconStart={"/assets/back-red.svg"}
            handleClick={handleMediaList}
            className={`${styles.btnCreateClassText} !text-lg`}
          />
        </div>
      </div>
      {/* )} */}
      {isLoading ? (
        <div className="">
          <Loader diffHeight={445} pageLoader={true} />
        </div>
      ) : (videoDraft?.length as any) <= 0 ? (
        <>
          <div
            className={`h-[50vh] flex justify-center items-center mt-10  ${styles.draftNoComment}`}
          >
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              src={"/assets/nodata.png"}
              alt="Close Nav Bar"
              height="100"
              width="100"
            />
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.backgroundColor}`}>
            <div className="flex-1 md:w-[75%] w-full p-4" id="draft-video-container">
              <DraftCarouselSection
                assets={videoDraft?.[0]?.draftVideo}
                videoDraftId={videoDraft?.[0]?._id}
                handleDownload={handleDownload}
                handleChangeVideoName={handleChangeVideoName}
              />
            </div>

            <div
              className={`w-[25%] ${styles.mainContainerHeightClass}`}
              style={{
                overflow: "auto",
              }}
            >
              <Comments
                currentUser={currentUser}
                currentAllUser={userData}
                draftId={videoDraft?.[0]?._id}
                clientId={selectedClientIds as string}
                handleAddComments={handleAddComments}
                commentsData={videoDraft?.[0]?.comments}
                videoProjectId={videoDraft?.[0]?.videoProjectId}
              />
            </div>
          </div>

          <div className="md:hidden block">
            {draftChat === "draftSide" ? (
              <DraftCarouselSection
                assets={videoDraft?.[0]?.draftVideo}
                videoDraftId={videoDraft?.[0]?._id}
                handleDownload={handleDownload}
                handleChangeVideoName={handleChangeVideoName}
              />
            ) : (
              <Comments
                currentUser={currentUser}
                currentAllUser={userData}
                draftId={videoDraft?.[0]?._id}
                clientId={selectedClientIds as string}
                handleAddComments={handleAddComments}
                commentsData={videoDraft?.[0]?.comments}
                videoProjectId={videoDraft?.[0]?.videoProjectId}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Draft;
