import React from "react";

import VideoRequestComponent from "@/src/pages/video-request-component";
import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const VideoRequest = () => {
  return (
    <>
      <AuthenticatedRoute>
        <ContextCollection>
          <VideoRequestComponent />
        </ContextCollection>
      </AuthenticatedRoute>
    </>
  );
};

export default VideoRequest;
