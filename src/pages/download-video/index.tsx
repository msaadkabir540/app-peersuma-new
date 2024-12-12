"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import createNotification from "@/src/components/create-notification";

const Download = ({ downloadLink, libraryName }: { downloadLink: string; libraryName: string }) => {
  const hasDownloaded = useRef(false);

  const downloadFile = useCallback(async () => {
    if (!downloadLink || !libraryName) return;

    try {
      const response = await fetch(downloadLink);
      if (response.ok) {
        const finalUrl = response.url;
        const link = document.createElement("a");
        link.href = finalUrl;
        link.download = libraryName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        createNotification({ type: "success", message: "Download Successful!" });
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("File download error:", error);
      createNotification({ type: "error", message: "Failed to download the file." });
    }
  }, [downloadLink, libraryName]);

  useEffect(() => {
    if (downloadLink && libraryName && !hasDownloaded.current) {
      createNotification({ type: "warn", message: "Downloading..." });
      downloadFile();
      hasDownloaded.current = true;
    }
  }, [downloadLink, libraryName, downloadFile]);

  return null;
};
export default Download;
