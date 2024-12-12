import React from "react";

import UpdateCreateLibraryPage from "@/src/pages/update-create-library-page";

import { LibraryContextCollection } from "@/src/(context)/library-context-collection";
import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";
import LibraryProcessNotification from "@/src/pages/library-process-notification";

const UpdateCreateLibrary = ({
  searchParams,
}: {
  searchParams: { libraryId: string; videoUrl?: string };
}) => {
  return (
    <AuthenticatedRoute>
      <ContextCollection>
        <LibraryContextCollection>
          <LibraryProcessNotification />
          <UpdateCreateLibraryPage
            libraryId={searchParams?.libraryId}
            videoURl={searchParams?.videoUrl}
          />
        </LibraryContextCollection>
      </ContextCollection>
    </AuthenticatedRoute>
  );
};

export default UpdateCreateLibrary;
