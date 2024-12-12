"use clinet";

import React from "react";
import Image from "next/image";

import Card from "./card";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { MediaDataInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const GridView = () => {
  const context = useVideoView();
  const widgetMediaData = context && context?.widgetMediaData;

  return (
    <>
      {widgetMediaData?.length === 0 ? (
        <div className=" flex justify-center items-center mt-10">
          <Image
            className="md:w-52 w-36"
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
            }}
            src={"/assets/nodata.png"}
            alt="Close Nav Bar"
            height="100"
            width="100"
          />
        </div>
      ) : (
        <div className={styles.customGrid}>
          {widgetMediaData?.map((media: MediaDataInterface) => (
            <Card
              media={media}
              key={media?._id}
              name={media?.name}
              assetId={media?.assetId}
              duration={media?.duration}
              imagePath={media?.thumbnailUrl}
              isShareable={media?.shareable as boolean}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GridView;
