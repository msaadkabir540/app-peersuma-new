"use client";

import React from "react";

import Card from "./card";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { MediaDataInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const RelatedVideo = () => {
  const context = useVideoView();
  const widgetMediaData = context && context?.widgetMediaData;

  return (
    <div className={styles.relatedVideoContainer}>
      <div className="text-center w-full">
        <div className={styles.heading}>Recent Videos</div>
        <div className="grid grid-cols-1 gap-2 h-[calc(100vh-210px)] overflow-auto">
          {widgetMediaData?.map((media: MediaDataInterface) => (
            <Card
              media={media}
              key={media?._id}
              name={media?.name}
              duration={media?.duration}
              imagePath={media?.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedVideo;
