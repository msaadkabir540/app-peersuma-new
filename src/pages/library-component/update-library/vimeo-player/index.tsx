"use client";

import ReactPlayer from "react-player";
import React, { useRef, memo, useState, useEffect } from "react";

import Loader from "@/src/components/loader";
import createNotification from "@/src/components/create-notification";

import styles from "./index.module.scss";

const VimeoPlayer: React.FC<{
  url: string;
  isAllow?: boolean;
  handleSetVideoTime?: any;
  customeMainClass?: string;
}> = ({ handleSetVideoTime, url, customeMainClass, isAllow = true }) => {
  const valueRef = useRef<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleReady = () => {
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleError = (e: any) => {
    if (e?.message) {
      createNotification({
        type: "warn",
        message: "Warning!",
        description: "Please wait, video is being processed. Please check after few minutes.",
      });
      setTimeout(() => setIsLoading(false), 100);
    }
  };
  useEffect(() => {
    if (url === "") {
      setTimeout(() => setIsLoading(false), 2000);
    }
    if (url) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [url]);

  return (
    <div className={`${styles.container} ${customeMainClass}`}>
      <div className={`${isLoading && styles.loadingClass}`}>
        {isLoading && (
          <Loader loaderClass="!w-[50px] !h-[50px]" pageLoader={false} diffHeight={450} />
        )}
      </div>
      <ReactPlayer
        controls
        width="100%"
        url={url}
        playing={false}
        ref={valueRef as any}
        onReady={handleReady}
        {...(isAllow && { onError: handleError })}
        height={isLoading ? "0px" : "100%"}
        onProgress={() => {
          const currentTime = valueRef.current?.getCurrentTime();
          const newTime = { value: currentTime !== undefined ? currentTime : null };
          handleSetVideoTime?.(newTime);
        }}
      />
    </div>
  );
};

export default memo(VimeoPlayer);
