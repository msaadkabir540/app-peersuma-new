import React from "react";

import LibraryShotComponent from "@/src/pages/library-shot-component";

const Video = ({ params }: { params: { video: string } }) => {
  const { video } = params;
  return <LibraryShotComponent shotId={video as string} />;
};

export default Video;
