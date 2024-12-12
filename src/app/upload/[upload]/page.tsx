"use client";
import React from "react";

import UploadMedias from "@/src/pages/upload-media";

const Upload = ({
  params,
  searchParams,
}: {
  params: { upload: string };
  searchParams: { uploaded?: string };
}) => {
  const { upload } = params;
  const { uploaded } = searchParams;

  return (
    <>
      <UploadMedias shotUrl={upload} userId={uploaded} />
    </>
  );
};

export default Upload;
