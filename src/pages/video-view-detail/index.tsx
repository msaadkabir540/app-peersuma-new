"use client";

import React, { useEffect } from "react";

import Loader from "@/src/components/loader";
import TryNow from "@/src/components/try-now";
import VideoHeader from "./component/video-header";
import VideoViewList from "./component/video-view-list";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { ShowInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

const VideoViewDetail = ({ videoViewId }: { videoViewId: string }) => {
  const isToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const context = useVideoView();
  const handleVideoViews = context && context?.handleVideoView;
  const isPageLoading = context && context?.isPageLoading;

  const widget: ShowInterface | undefined = context && context?.widget;

  useEffect(() => {
    if (videoViewId) {
      handleVideoViews?.({ id: videoViewId });
    }
  }, [videoViewId, handleVideoViews]);

  return (
    <>
      {isPageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <div className="md:px-10  p-[20px] ">
          {/* this is header search bar and client name  */}
          <VideoHeader />
          {/* this is for thr view selection and selection the date and contributors */}
          <VideoViewList />
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

export default VideoViewDetail;
