"use client";
import React, { useState } from "react";

import Navbar from "@/src/pages/layout/navbar";
import VideoProjectDetail from "@/src/pages/video-project-detail";

import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const ProduceId = ({ params }: { params: { produce: string } }) => {
  const { produce } = params;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handlePageLoading = ({ value }: { value: boolean }) => {
    setIsLoading(value);
  };

  const handlePageRedirect = () => {
    setIsLoading(true);
  };

  return (
    <div>
      <AuthenticatedRoute>
        <ContextCollection>
          <Navbar handlePageRedirect={handlePageRedirect} />
          <VideoProjectDetail
            isLoading={isLoading}
            videoPageID={produce}
            handlePageLoading={handlePageLoading}
          />
        </ContextCollection>
      </AuthenticatedRoute>
    </div>
  );
};

export default ProduceId;
