import Image from "next/image";
import { writeText } from "clipboard-polyfill";
import React, { useMemo, useState } from "react";

import Loader from "@/src/components/loader";
import { handleViemoVideo } from "@/src/helper/helper";
import createNotification from "@/src/components/create-notification";

import styles from "../index.module.scss";

const CardMenu = ({
  name,
  mediaId,
  shortLink,
  isMenuOpen,
  videoAssetId,
  handleEmbedCode,
  handleCloseMenu,
  handleClickEvent,
  handleEventDelete,
  isThumbnailUpdate,
  handleUpdateThumbnailEvent,
}: {
  name: string;
  mediaId: string;
  shortLink: string;
  isMenuOpen: boolean;
  videoAssetId: string;
  isThumbnailUpdate: boolean;
  handleCloseMenu: () => void;
  handleEmbedCode: (e?: any) => void;
  handleClickEvent: (e?: any) => void;
  handleEventDelete: (e: any) => void;
  handleUpdateThumbnailEvent: (e?: any) => void;
}) => {
  const [isCopyDownload, setIsCopyDownload] = useState<{ isCopy: boolean; isDownload: boolean }>({
    isCopy: false,
    isDownload: false,
  });

  const shortLinkUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_APP_URL}video/${shortLink}`;
  }, [shortLink]);

  const handleEventCopyLink = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    writeText?.(shortLinkUrl);
    createNotification({
      type: "success",
      message: "Success!",
      description: "Short link copied to clipboard",
    });
  };

  const handleGetViemoVideo = async ({ id, isCopy }: { id: string; isCopy: boolean }) => {
    try {
      setIsCopyDownload((prev) => ({ ...prev, isCopy, isDownload: isCopy ? false : true }));
      const data = await handleViemoVideo({ videoId: id as string });

      if (data && data.download) {
        // Find the video with the largest size
        const largestVideo = data.download.reduce((prev: any, curr: any) => {
          return curr.size > prev.size ? curr : prev;
        });

        if (largestVideo && largestVideo.link) {
          if (isCopy) {
            writeText?.(largestVideo.link);
            createNotification({
              type: "success",
              message: "Success!",
              description: "Download link copied to clipboard",
            });
          } else {
            const link = document.createElement("a");
            link.href = largestVideo.link;
            link.download = `${name}.mp4`;
            link.setAttribute("download", "video.mp4");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          createNotification({
            type: "error",
            message: "Error!",
            description: "Download link not found",
          });
        }
      }
    } catch (error) {
      throw new Error("Error while get the video");
    }
    setIsCopyDownload((prev) => ({ ...prev, isCopy: false, isDownload: false }));
    handleCloseMenu();
  };

  const handleDownloadEvent = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    handleGetViemoVideo({ id: videoAssetId as string, isCopy: false });
  };

  const libraryAssetId = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_APP_URL}library-video-download/${mediaId}`;
  }, [videoAssetId]);

  const handleDownloadCopyEvent = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    writeText?.(libraryAssetId);
    createNotification({
      type: "success",
      message: "Success!",
      description: "Short link copied to clipboard",
    });
    // handleGetViemoVideo({ id: videoAssetId as string, isCopy: true });
  };

  const handleUpdateThumbnail = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    handleUpdateThumbnailEvent();
  };

  const menuList = [
    {
      name: "Edit",
      icons: "/assets/pen-black.svg",
      handleEventClick: handleClickEvent,
    },
    {
      name: "Reload Thumbnail",
      icons: "/assets/replace.svg",
      isLoading: isThumbnailUpdate,
      handleEventClick: handleUpdateThumbnail,
    },
    {
      name: "Video Embed Code",
      icons: "/assets/code.svg",
      handleEventClick: handleEmbedCode,
    },
    {
      name: "Copy Link",
      icons: "/assets/copy.svg",
      handleEventClick: handleEventCopyLink,
    },
    {
      name: "Copy Download Link",
      icons: "/assets/copy.svg",
      isLoading: isCopyDownload?.isCopy,
      handleEventClick: handleDownloadCopyEvent,
    },
    {
      name: "Download",
      icons: "/assets/download-icon.png",
      isLoading: isCopyDownload?.isDownload,
      handleEventClick: handleDownloadEvent,
    },
    {
      name: "Delete",
      icons: "/assets/delete-red.svg",
      handleEventClick: handleEventDelete,
    },
  ];

  return (
    <>
      <div className={`absolute flex p-1 ${isMenuOpen ? styles.subMenu2 : styles.subMenu}`}>
        {menuList?.map((data) => (
          <div
            key={data?.name}
            className="flex gap-[10px] p-[10px] hover:bg-[#F2F2F2] hover:rounded-[5px]"
            onClick={data?.handleEventClick}
          >
            {data?.isLoading ? (
              <Loader pageLoader={false} loaderClass="!w-[20px] !h-[20px]" />
            ) : (
              <Image
                data-testid="close-icon"
                style={{
                  cursor: "pointer",
                }}
                className="!w-[24px] !h-[24px]"
                src={data?.icons}
                alt="sortUp"
                height="400"
                width="400"
              />
            )}
            {data?.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default CardMenu;
