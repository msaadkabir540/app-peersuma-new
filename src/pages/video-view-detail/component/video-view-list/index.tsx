"use client";

import React from "react";

import Media from "../media";
import SelectionView from "../selection-view";
import PaginationComponent from "../pagination";

const VideoViewList = () => {
  return (
    <>
      <SelectionView />
      {/* all media of in this component  */}
      <Media />
      {/* pagination here  */}
      <PaginationComponent />
    </>
  );
};

export default VideoViewList;
