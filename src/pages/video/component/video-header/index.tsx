import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { ShowInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const VideoHeader = () => {
  const route = useRouter();

  const context = useVideoView();
  const widget: ShowInterface | undefined = context && context?.widget;
  const handleVideoViewScreen = context && context?.handleVideoViewScreen;
  const imagePath = (widget?.clientId?.url as string) || "/assets/noImage.png";
  const clientName = widget?.clientId?.name as string;

  const handleRedirectVideoView = () => {
    route.push(`/showcase/${widget?._id}`);
    handleVideoViewScreen?.({ value: false });
  };

  return (
    <>
      <div className="flex justify-between md:items-start md:flex-row flex-col">
        <div>
          <div className={`${styles.avatarContainer}`}>
            <div title="Go Back" className="!cursor-pointer" onClick={handleRedirectVideoView}>
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
        </div>
      </div>
    </>
  );
};

export default VideoHeader;
