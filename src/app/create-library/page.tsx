"use client";
import React from "react";

import CreateLibraryPage from "@/src/pages/create-library-page";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

import { ContextCollection } from "@/src/(context)/context-collection";
import { LibraryContextCollection } from "@/src/(context)/library-context-collection";
import LibraryProcessNotification from "@/src/pages/library-process-notification";

const UpdateCreateLibrary = () => {
  return (
    <AuthenticatedRoute>
      <ContextCollection>
        <LibraryProcessNotification />
        <LibraryContextCollection>
          <CreateLibraryPage />
        </LibraryContextCollection>
      </ContextCollection>
    </AuthenticatedRoute>
  );
};

export default UpdateCreateLibrary;
