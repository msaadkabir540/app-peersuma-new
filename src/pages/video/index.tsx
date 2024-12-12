"use client";

import React, { useEffect } from "react";

import Loader from "@/src/components/loader";
import TryNow from "@/src/components/try-now";
import VideoPlayer from "./component/video-player";
import VideoHeader from "./component/video-header";
import RelatedVideo from "./component/related-video";

import { useVideoView } from "@/src/(context)/video-context-collection";

import styles from "./index.module.scss";

const VideoPlayerScreen = ({
  videoId,
  videoPlayerId,
}: {
  videoId: string;
  videoPlayerId: string;
}) => {
  const isToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const context = useVideoView();
  const handleVideoViews = context && context?.handleVideoView;
  const handleSearchParams = context && context?.handleSearchParams;
  const widget = context && context?.widget;
  const isPageLoading = context && context?.isPageLoading;

  useEffect(() => {
    if (videoId) {
      handleVideoViews?.({ id: videoId });
    }
    if (videoPlayerId) {
      handleSearchParams?.({ searchParams: videoPlayerId });
    }
  }, [videoId, handleVideoViews, videoPlayerId, handleSearchParams]);

  return (
    <>
      {isPageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <div className="md:px-10 p-[20px]">
          <VideoHeader />
          <div className={`${styles.videoPlayerViewContainer} md:mt-5 mt-3`}>
            <VideoPlayer />
            <RelatedVideo />
          </div>
          {!isToken && (
            <TryNow
              clientId={widget?.clientId?._id as string}
              widgetName={widget?.name as string}
            />
          )}
        </div>
      )}
    </>
  );
};

export default VideoPlayerScreen;
