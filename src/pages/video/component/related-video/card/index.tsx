"use client";

import React from "react";
import Image from "next/image";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { convertTime } from "@/src/helper/helper";

import { MediaDataInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const Card = ({
  name,
  media,
  duration,
  imagePath,
}: {
  name: string;
  duration: number;
  imagePath: string;
  media: MediaDataInterface;
}) => {
  const context = useVideoView();
  const handleSelectedVideo = context && context?.handleSelectedVideo;
  const selectedVideo = context && context?.selectedVideo;

  return (
    <>
      <div
        className={`${styles.cardContainer} w-full`}
        style={{ border: selectedVideo?._id === media?._id ? "1px solid #cfcfcf" : "0px solid" }}
        onClick={() => handleSelectedVideo?.({ media: media })}
      >
        <div className={styles.imageContainer}>
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
              position: "relative",
            }}
            alt="sortUp"
            height="500"
            width="500"
            src={imagePath || "/assets/backgroundimage.jpg"}
          />{" "}
          <div className={`${styles.playButtonClass} rounded-full`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
            >
              <path
                d="M18.5625 38.8136C18.1149 38.8136 17.6857 38.6358 17.3693 38.3193C17.0528 38.0028 16.875 37.5736 16.875 37.1261V16.8761C16.8752 16.5885 16.9488 16.3058 17.0889 16.0547C17.229 15.8036 17.4309 15.5925 17.6755 15.4413C17.9202 15.2902 18.1993 15.2041 18.4866 15.1912C18.7738 15.1782 19.0596 15.2389 19.3168 15.3674L39.5668 25.4924C39.8467 25.6327 40.0821 25.8481 40.2466 26.1146C40.4111 26.381 40.4982 26.6879 40.4982 27.0011C40.4982 27.3142 40.4111 27.6211 40.2466 27.8875C40.0821 28.154 39.8467 28.3694 39.5668 28.5097L19.3168 38.6347C19.0827 38.752 18.8244 38.8133 18.5625 38.8136Z"
                fill="white"
              />
              <path
                d="M27 3.375C22.3274 3.375 17.7598 4.76058 13.8747 7.35653C9.98955 9.95248 6.96148 13.6422 5.17336 17.9591C3.38524 22.276 2.91738 27.0262 3.82896 31.609C4.74053 36.1918 6.9906 40.4014 10.2946 43.7054C13.5986 47.0094 17.8082 49.2595 22.391 50.171C26.9738 51.0826 31.724 50.6148 36.0409 48.8267C40.3578 47.0385 44.0475 44.0105 46.6435 40.1253C49.2394 36.2402 50.625 31.6726 50.625 27C50.625 20.7343 48.136 14.7251 43.7054 10.2946C39.2749 5.86405 33.2657 3.375 27 3.375ZM39.5668 28.5103L19.3168 38.6353C19.0595 38.7639 18.7735 38.8246 18.4862 38.8116C18.1988 38.7985 17.9195 38.7123 17.6748 38.5609C17.4302 38.4096 17.2283 38.1983 17.0883 37.9469C16.9483 37.6956 16.8749 37.4127 16.875 37.125V16.875C16.8752 16.5875 16.9488 16.3047 17.0889 16.0536C17.229 15.8026 17.4309 15.5914 17.6756 15.4403C17.9202 15.2892 18.1993 15.203 18.4866 15.1901C18.7738 15.1772 19.0596 15.2378 19.3168 15.3664L39.5668 25.4914C39.8467 25.6317 40.0821 25.8471 40.2466 26.1135C40.4111 26.3799 40.4982 26.6869 40.4982 27C40.4982 27.3131 40.4111 27.6201 40.2466 27.8865C40.0821 28.1529 39.8467 28.3683 39.5668 28.5086"
                fill="black"
                fillOpacity="0.6"
              />
            </svg>
          </div>
          <div className={styles.videoDuration}>{convertTime(duration) || "0 sec"}</div>
        </div>
        <div className={styles.cardHeader}>
          <div
            className={`w-full line-clamp-4 overflow-hidden text-start text-[#0F0F0F] text-[16px] cursor-pointer ${styles.heading}`}
          >
            {name}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
