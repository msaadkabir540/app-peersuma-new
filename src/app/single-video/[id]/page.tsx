import PublishSingleVideo from "@/src/pages/publish-single-video";
import React from "react";

const SingleVideo = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <PublishSingleVideo {...{ id }} />;
};

export default SingleVideo;
