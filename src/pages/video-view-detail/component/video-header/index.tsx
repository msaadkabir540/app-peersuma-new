import React from "react";
import Image from "next/image";

import Input from "@/src/components/input";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { ShowInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const VideoHeader = () => {
  const context = useVideoView();
  const widget: ShowInterface | undefined = context && context?.widget;
  const register = context && context?.register;
  const isVideoScreen = context && context?.isVideoScreen;
  const handleVideoViewScreen = context && context?.handleVideoViewScreen;
  const setValue = context && context?.setValue;
  const imagePath = (widget?.clientId?.url as string) || "/assets/noImage.png";
  const clientName = widget?.clientId?.name as string;
  const widgetName = widget?.name as string;

  return (
    <>
      <div className="flex justify-between md:items-start md:flex-row flex-col">
        <div>
          <div className={`${styles.avatarContainer}`}>
            {isVideoScreen && (
              <div
                title="Go Back"
                className="!cursor-pointer"
                onClick={() => {
                  handleVideoViewScreen?.({ value: false });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                >
                  <path
                    d="M24.375 15.9722H5.625M5.625 15.9722L12.6562 8.47217M5.625 15.9722L12.6562 23.4722"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className={styles.avatar}>
              <Image
                className="md:w-52 w-36"
                style={{
                  borderRadius: "10px",
                }}
                src={imagePath}
                alt={clientName}
                height="100"
                width="100"
              />
            </div>
            <div className="md:text-2xl font-normal">{clientName}</div>
          </div>
          {!isVideoScreen && (
            <div className="my-1 md:mt-5 mt-3">
              <span className="md:text-lg text-base font-normal">Name: </span>{" "}
              <span className="md:text-lg text-base font-normal">{widgetName}</span>
            </div>
          )}
        </div>
        {isVideoScreen === false && (
          <div className="md:w-1/3 w-full">
            <Input
              type="text"
              name={"search"}
              crossIcons={true}
              register={register}
              showSearchIcon={true}
              crossIconClass={styles.videoSearchIcon}
              searchIcon={styles.videoSearchIcon}
              placeholder="Type your search here..."
              inputField={styles.inputVideoViewClass}
              handleClickCross={() => setValue?.("search", "")}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VideoHeader;
