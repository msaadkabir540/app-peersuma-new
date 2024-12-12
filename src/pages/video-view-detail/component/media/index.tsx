"use client";

import React from "react";

import GridView from "./grid-view";
import VideoTableView from "./video-table-view";

import { useVideoView } from "@/src/(context)/video-context-collection";

const Media = () => {
  const context = useVideoView();
  const activeView = context && context?.activeView;

  return (
    <div style={{ minHeight: "calc(100vh - 460px)" }}>
      {activeView === "table" ? <VideoTableView /> : <GridView />}
    </div>
  );
};

export default Media;
