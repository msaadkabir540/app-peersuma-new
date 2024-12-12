import React from "react";

import VideoViewDetail from "@/src/pages/video-view-detail";

import { VideoViewContextCollection } from "@/src/(context)/video-context-collection";

const VideoView = ({ params }: { params: { videoViewId: string } }) => {
  const videoViewId = params;

  return (
    <>
      <VideoViewContextCollection>
        <VideoViewDetail videoViewId={videoViewId?.videoViewId} />
      </VideoViewContextCollection>
    </>
  );
};

export default VideoView;
