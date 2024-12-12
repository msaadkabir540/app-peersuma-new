"use client";

import React, { useState } from "react";

import Player from "./player";
import ShareDropDown from "@/src/components/share-dropdown";

import { useVideoView } from "@/src/(context)/video-context-collection";

import styles from "./index.module.scss";

const VideoPlayer = () => {
  const [showHide, setShowHide] = useState(false);

  const context = useVideoView();
  const selectedVideo = context && context?.selectedVideo;
  const widget = context && context?.widget;
  const videoName = selectedVideo?.name;
  const description = selectedVideo?.description;
  const lengthOfDescription = description?.length || 0;

  const videoUrl = `${process.env.NEXT_PUBLIC_APP_URL}video-detail/${widget?._id}?videoplayerId=${selectedVideo?.assetId}`;

  return (
    <div className={styles.videoPlayerContainer}>
      <div>
        <Player />
      </div>
      <div className="flex flex-col gap-5 ">
        <div className="flex justify-between items-start">
          <div className={`font-medium ${styles.videoNameClass}`}>{videoName}</div>

          <div>
            {widget?.enableShare && (
              <ShareDropDown
                isButton={true}
                video_name={videoName as string}
                video_url={videoUrl as string}
              />
            )}
          </div>
        </div>
        <div>
          <span className={`${showHide ? styles?.showDescription : styles.description}`}>
            {description}
          </span>
          {lengthOfDescription > 175 && (
            <span
              onClick={() => setShowHide(!showHide)}
              className="md:text-xl text-base cursor-pointer font-semibold"
            >
              {showHide ? " less" : " see more"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
