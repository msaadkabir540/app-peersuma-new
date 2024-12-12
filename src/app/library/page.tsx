import React from "react";

import LibraryComponent from "@/src/pages/library-component";

import { LibraryContextCollection } from "@/src/(context)/library-context-collection";
import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";
import LibraryProcessNotification from "@/src/pages/library-process-notification";

const Library = () => {
  return (
    <AuthenticatedRoute>
      <ContextCollection>
        <LibraryContextCollection>
          <LibraryProcessNotification />
          <LibraryComponent />
        </LibraryContextCollection>
      </ContextCollection>
    </AuthenticatedRoute>
  );
};

export default Library;
