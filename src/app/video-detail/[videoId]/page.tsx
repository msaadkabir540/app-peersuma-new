import React from "react";

import VideoPlayerScreen from "@/src/pages/video";

import { VideoViewContextCollection } from "@/src/(context)/video-context-collection";

const Video = ({
  params,
  searchParams,
}: {
  params: { videoId: string };
  searchParams: { videoplayerId: string };
}) => {
  const videoId = params;
  const videoPlayerId = searchParams;

  return (
    <>
      <VideoViewContextCollection>
        <VideoPlayerScreen
          videoId={videoId?.videoId}
          videoPlayerId={videoPlayerId?.videoplayerId}
        />
      </VideoViewContextCollection>
    </>
  );
};

export default Video;
