"use clinet";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Tooltip from "@/src/components/tooltip";
import TemplateShareSubscribe from "@/src/pages/widget-compoent-id/widget-templates/components/template-share-subscribe";

import { convertTime } from "@/src/helper/helper";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { MediaDataInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const Card = ({
  name,
  media,
  assetId,
  duration,
  imagePath,
  isShareable,
}: {
  name: string;
  assetId: string;
  duration: number;
  imagePath: string;
  isShareable: boolean;
  media: MediaDataInterface | undefined;
}) => {
  const route = useRouter();
  const context = useVideoView();
  const handleSearchParams = context && context?.handleSearchParams;
  const handlePageLoading = context && context?.handlePageLoading;
  const handleSelectedVideo = context && context?.handleSelectedVideo;
  const handleVideoViewScreen = context && context?.handleVideoViewScreen;
  const widget = context && context?.widget;

  const handleRedirectVideoPlayer = ({ media }: { media: MediaDataInterface }) => {
    handlePageLoading?.({ active: true });
    handleVideoViewScreen?.({ value: true });
    handleSelectedVideo?.({ media: media });
    handleSearchParams?.({ searchParams: media?._id });
    route.push(`/video-detail/${widget?._id}?videoplayerId=${media?.assetId}`);
  };

  const videoUrl = `${process.env.NEXT_PUBLIC_APP_URL}video-detail/${widget?._id}?videoplayerId=${assetId}`;

  return (
    <>
      <div
        style={{
          background: widget?.backgroundColor,
          border: `2px solid ${widget?.backgroundColor}`,
        }}
        className={`${styles.cardContainer} w-full `}
      >
        <div>
          <div className={styles.cardHeader}>
            <div style={{ color: widget?.titleColor }} className={styles.heading}>
              {name}
            </div>
            <div className="flex justify-between items-center gap-1">
              {isShareable && widget && (
                <TemplateShareSubscribe widget={widget} videoUrl={videoUrl} />
              )}
              <Tooltip text="Open Video" backClass="">
                <div
                  onClick={() => {
                    handleRedirectVideoPlayer?.({ media: media as MediaDataInterface });
                  }}
                  className={styles.shortText}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 28 27"
                    fill="none"
                  >
                    <path
                      d="M12.6106 8.00983C12.1892 8.04625 11.8772 8.41731 11.9136 8.83863C11.9501 9.25994 12.3211 9.57196 12.7424 9.53554L12.6106 8.00983ZM20.2669 8.11655L21.0298 8.05061C21.0123 7.84828 20.9151 7.6612 20.7597 7.5305C20.6043 7.3998 20.4033 7.3362 20.201 7.35369L20.2669 8.11655ZM20.1602 15.7729C20.1966 16.1942 20.5677 16.5063 20.989 16.4698C21.4103 16.4334 21.7223 16.0624 21.6859 15.641L20.1602 15.7729ZM20.3714 9.18202C20.6436 8.85835 20.6018 8.37534 20.2782 8.10318C19.9545 7.83102 19.4715 7.87277 19.1993 8.19644L20.3714 9.18202ZM12.1687 16.5575C11.8966 16.8812 11.9383 17.3642 12.262 17.6364C12.5856 17.9085 13.0687 17.8668 13.3408 17.5431L12.1687 16.5575ZM11.4126 2.15096H21.0209V0.619552H11.4126V2.15096ZM26.3561 7.48608V17.0944H27.8875V7.48608H26.3561ZM21.0209 22.4295H11.4126V23.9609H21.0209V22.4295ZM6.07752 17.0944V7.48609H4.54611V17.0944H6.07752ZM11.4126 22.4295C8.46614 22.4295 6.07752 20.0409 6.07752 17.0944H4.54611C4.54611 20.8867 7.62037 23.9609 11.4126 23.9609V22.4295ZM26.3561 17.0944C26.3561 20.0409 23.9674 22.4295 21.0209 22.4295V23.9609C24.8132 23.9609 27.8875 20.8867 27.8875 17.0944H26.3561ZM21.0209 2.15096C23.9674 2.15096 26.3561 4.53957 26.3561 7.48608H27.8875C27.8875 3.6938 24.8132 0.619552 21.0209 0.619552V2.15096ZM11.4126 0.619552C7.62036 0.619552 4.54611 3.69381 4.54611 7.48609H6.07752C6.07752 4.53958 8.46614 2.15096 11.4126 2.15096V0.619552ZM12.7424 9.53554L20.3329 8.87941L20.201 7.35369L12.6106 8.00983L12.7424 9.53554ZM19.5041 8.18249L20.1602 15.7729L21.6859 15.641L21.0298 8.05061L19.5041 8.18249ZM19.1993 8.19644L12.1687 16.5575L13.3408 17.5431L20.3714 9.18202L19.1993 8.19644ZM0.859298 9.66808V19.7869H2.3907V9.66808H0.859298ZM7.72583 26.6534H18.0972V25.122H7.72583V26.6534ZM18.0972 26.6534C20.2048 26.6534 21.9134 24.9449 21.9134 22.8373H20.382C20.382 24.0991 19.359 25.122 18.0972 25.122V26.6534ZM0.859298 19.7869C0.859298 23.5792 3.93355 26.6534 7.72583 26.6534V25.122C4.77932 25.122 2.3907 22.7334 2.3907 19.7869H0.859298ZM6.14819 4.37919C3.22722 4.37919 0.859298 6.74711 0.859298 9.66808H2.3907C2.3907 7.59288 4.07299 5.91059 6.14819 5.91059V4.37919Z"
                      fill={widget?.textColor}
                    />
                  </svg>
                </div>
              </Tooltip>
            </div>
          </div>
          <div
            className={styles.imageContainer}
            onClick={() => {
              handleRedirectVideoPlayer?.({ media: media as MediaDataInterface });
            }}
          >
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: " 0px  0px 7px 7px",
              }}
              alt="sortUp"
              height="500"
              width="500"
              src={imagePath || "/assets/backgroundimage.jpg"}
            />
            <div className={styles.videoDuration}>{convertTime(duration) || "0 sec"}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
