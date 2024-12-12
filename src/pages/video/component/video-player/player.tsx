"use client";

import React, { useEffect, useState } from "react";

import Loader from "@/src/components/loader";
import createNotification from "@/src/components/create-notification";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { handleViemoVideo } from "@/src/helper/helper";

import styles from "./index.module.scss";

const Player = () => {
  const [videoUrlLink, setVideoUrlLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const context = useVideoView();
  const selectedVideo = context && context?.selectedVideo;

  const handleGetViemoVideo = async () => {
    try {
      setIsLoading(true);
      const data = await handleViemoVideo({ videoId: selectedVideo?.assetId as string });

      if (data) {
        const videoLinkFile = data?.player_embed_url;
        setVideoUrlLink(videoLinkFile);
      } else {
        createNotification({ type: "error", message: "Error!", description: "Video not found" });
      }
    } catch (error) {
      createNotification({ type: "error", message: "Error!", description: "" });
      throw new Error("Error while get the video");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUrl = selectedVideo?.videoUrl?.split("/");
    if (selectedVideo?.widgetUrl) {
      setVideoUrlLink(selectedVideo?.widgetUrl as any);
    } else if (selectedVideo?.videoUrl) {
      handleGetViemoVideo();
    }
  }, [selectedVideo?.videoUrl]);

  return (
    <div className={styles.playerContainer}>
      {isLoading ? (
        <Loader pageLoader={false} />
      ) : (
        <iframe
          className={styles.embedResponsiveItem}
          src={videoUrlLink}
          frameBorder="0"
          title="videoFrame"
          width="100%"
          height="100%"
          aria-label="video player"
        ></iframe>
      )}
    </div>
  );
};

export default Player;
