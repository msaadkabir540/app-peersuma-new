"use client";
import React from "react";

import DraftGridCard from "../draft-grid-card";

import styles from "./index.module.scss";
import DraftCarouselSection from "../draft-grid-card/draft-carousel-section";

const CardContainer = ({
  draftId,
  imageUrl,
  videoUrl,
  videoDraftId,
  videDraftName,
  handleDownload,
  handleChangeVideoName,

  //

  draftData,
}: {
  draftData: any;
  //
  videDraftName: string;
  imageUrl: string;
  videoUrl: string;
  draftId: string;
  videoDraftId: string;
  handleDownload: ({ videoId, videoDraftId }: { videoId: string; videoDraftId: string }) => void;
  handleChangeVideoName: ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    mediaId: string;
    videoDraftId: string;
  }) => void;
}) => {
  return (
    <div className={`${styles.backgroundColor}`}>
      <div className="w-full md:h-[420px] h-[200px] md:gap-6 gap-3  ">
        <DraftCarouselSection assets={draftData} />
      </div>
    </div>
  );
};

export default CardContainer;
