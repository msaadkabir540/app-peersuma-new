import React from "react";

import Download from "@/src/pages/download-video";

const LibraryVideoDownloadPage = async (params: { params: { id: string } }) => {
  let largestVideo;
  let libraryName;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/library/download-library-video?id=${params?.params?.id}`,
      {
        method: "Get",
      },
    );
    const posts = await res.json();
    libraryName = posts?.viemoVideo?.libraryName;
    largestVideo = posts?.viemoVideo?.download.reduce((prev: any, curr: any) => {
      return curr.size > prev.size ? curr : prev;
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <h1>
        <Download downloadLink={largestVideo?.link} libraryName={libraryName} />
      </h1>
    </div>
  );
};

export default LibraryVideoDownloadPage;
