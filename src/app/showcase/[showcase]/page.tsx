import React from "react";

import VideoViewDetail from "@/src/pages/video-view-detail";

import { VideoViewContextCollection } from "@/src/(context)/video-context-collection";

const VideoView = ({ params }: { params: { showcase: string } }) => {
  const showcase = params;

  return (
    <>
      <VideoViewContextCollection>
        <VideoViewDetail videoViewId={showcase?.showcase} />
      </VideoViewContextCollection>
    </>
  );
};

export default VideoView;
