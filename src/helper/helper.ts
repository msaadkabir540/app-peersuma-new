"use client";
import React, { useEffect } from "react";

import { deleteVideoRequest } from "@/src/app/api/video-request";

import { deleteVideoRequestTheme, removeVideoRequestIds } from "@/src/app/api/video-request-themes";

import { getViemoPrivateVideo } from "../app/api/library-api";

import {
  S3TransloaditFiledInterface,
  VideoInfo,
  VimeoTransloaditUploadMapInterface,
} from "../app/interface/helper-interface/helper-interface";

export const s3TransloaditUploadMap = (resp: any, fields: any) => {
  const files: any[] = [];

  const allFiles = [...(resp?.data?.results?.[":original"] || [])];

  allFiles?.forEach((file: any) => {
    if (file.ext === "mov") {
      const data = resp?.data?.results?.["convert_to_mp4"]?.find(
        (data: any) => data.original_id === file?.original_id,
      );
      files?.push(data);
    } else {
      files?.push(file);
    }
  });

  if (!files.length) return [];

  return files?.map((file: S3TransloaditFiledInterface) => {
    const urlName = file?.ssl_url?.split(fields?.prefix)[1];

    const thumbnailUrl =
      file?.type === "video"
        ? resp?.data?.results?.["thumbnail"]?.find(
            ({ original_id }: { original_id: string }) => original_id === file?.original_id,
          )?.ssl_url
        : "";

    const thumbnailUrlName = thumbnailUrl ? thumbnailUrl?.split(fields?.prefix)[1] : "";

    return {
      name: urlName || "",
      url: file?.ssl_url || "",
      fileType: getFileType(file?.ext as string, file?.type as string),
      fileSize: file?.size || 0,
      duration: file?.meta?.duration || 0,
      s3Key: (fields?.prefix && fields?.prefix?.slice(1) + urlName) || "",
      ...(file?.type === "video" && {
        thumbnailUrl: thumbnailUrl || "",
        thumbnailS3Key: fields?.prefix?.slice(1) + thumbnailUrlName || "",
      }),
    };
  });
};

const fontExtensions = ["ttf", "otf", "woff", "woff2", "eot"];
const audioExtensions = ["m4a"];

const getFileType: (extension: string, type: string) => string = (extension, type) =>
  (fontExtensions.includes(extension)
    ? "font"
    : audioExtensions.includes(extension)
      ? "audio"
      : type) || "";

export const useOutsideClickHook: (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => void = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export const convertTime: (decimalTime: number) => string = (decimalTime) => {
  const totalSeconds = Math.floor(decimalTime);
  const milliseconds = Math.round((decimalTime - totalSeconds) * 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours ? `${hours} ${hours > 1 ? "hrs " : "hr "}` : ""}${
    minutes ? `${minutes} ${minutes > 1 ? "mins " : "min "}` : ""
  }${seconds || milliseconds ? `${seconds + milliseconds / 1000} sec` : ""}`;
};

export const vimeoTransloaditUploadMap: (
  resp: VimeoTransloaditUploadMapInterface,
) => VideoInfo[] = (resp) => {
  return (
    resp?.data?.results?.[":original"]?.map((file) => ({
      id: file?.ssl_url?.split("/").pop(),
      duration: file?.meta?.duration,
    })) || []
  );
};

export const handleDeleteVideoRequest = async ({ id }: { id: string }) => {
  try {
    const res: any = await deleteVideoRequest({
      id,
    });
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting video request:", error);
    return false;
  }
};

export const handleViemoVideo = async ({ videoId }: { videoId: string }) => {
  try {
    const res: any = await getViemoPrivateVideo({
      videoId,
    });

    if (res.status === 200) {
      return res?.data?.viemoVideo;
    }
  } catch (error) {
    console.error("Error deleting video request:", error);
    return false;
  }
};

export const handleRemoveVideoRequest = async ({
  id,
  themeId,
}: {
  id: string;
  themeId: string;
}) => {
  try {
    const res: any = await removeVideoRequestIds({
      id: themeId,
      data: { videoRequestId: id },
    });
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting video request:", error);
    return false;
  }
};

export const deleteVideoRequestThemeById = async ({ id }: { id: string }) => {
  try {
    const res: any = await deleteVideoRequestTheme({
      id,
    });
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting video request:", error);
    return false;
  }
};

export const handleDownload = async ({ url, name }: { url: string; name: string }) => {
  if (!url) {
    console.error("No URL provided");
    return;
  }
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const fileName = name;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export const categoryOptions = [
  { label: "Teachers", value: "Teachers" },
  { label: "Curriculum", value: "Curriculum" },
  { label: "Enrichment", value: "Enrichment" },
  { label: "Wellness", value: "Wellness" },
  { label: "Environment", value: "Environment" },
  { label: "Leadership", value: "Leadership" },
];

export const statusList = [
  { value: "completed", label: "Completed" },
  { value: "accept", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "in-progress", label: "In Progress" },
];

export const lettersValue = ({ value }: { value: string }) => {
  const lettersValue = value?.trim()?.split(" ");
  return lettersValue?.length === 1
    ? value
        ?.trim()
        ?.split("")?.[0]
        ?.concat(value?.trim()?.split("")?.at(-1) as string)
    : `${value?.trim()?.[0]?.[0]}${value?.trim().split(" ")?.[1]?.at(0)?.[0]}`;
};
