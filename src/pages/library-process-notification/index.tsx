"use client";
import Image from "next/image";
import React, { useEffect } from "react";

import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";

const LibraryProcessNotification = () => {
  const libraryId = typeof window !== "undefined" ? localStorage.getItem("libraryId") : null;
  const videoId = typeof window !== "undefined" ? localStorage.getItem("videoId") : null;

  const clientContent = useClients();
  const isShowLibraryProcessCard = clientContent && clientContent?.isShowLibraryProcessCard;
  const handleShowLibraryProcessCard = clientContent && clientContent?.handleShowLibraryProcessCard;
  const handleHideLibraryProcessCard = clientContent && clientContent?.handleHideLibraryProcessCard;

  const handleShowLibraryUploadingVideoNotification = () => {
    if (videoId && libraryId) {
      handleShowLibraryProcessCard?.();
    } else {
      handleHideLibraryProcessCard?.();
    }
  };

  useEffect(() => {
    handleShowLibraryUploadingVideoNotification();
  }, [videoId, libraryId, isShowLibraryProcessCard]);

  return (
    <>
      {isShowLibraryProcessCard && (
        <div className="absolute flex w-[333px] px-6 py-5 justify-center items-center gap-[20px] rounded-[10px] bg-[#FFF] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] md:bottom-[30px] bottom-[20px] md:right-[35px] right-[20px] z-[1000000000000]">
          <div className={styles.notificationLoader}></div>
          <span className="text-[#0F0F0F] text-[14px] font-normal leading-normal">
            Please wait while we process your video and load the thumbnail...
          </span>
        </div>
      )}
    </>
  );
};

export default LibraryProcessNotification;
