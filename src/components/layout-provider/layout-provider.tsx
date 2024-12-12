import React from "react";
import { ToastContainer } from "react-toastify";

import { ContextCollection } from "@/src/(context)/context-collection";

import "react-toastify/dist/ReactToastify.css";
import LibraryProcessNotification from "@/src/pages/library-process-notification";

export const LayoutProvider = ({ children }: any) => {
  return (
    <>
      <ContextCollection>
        <ToastContainer />
        <LibraryProcessNotification />
        {children}
      </ContextCollection>
    </>
  );
};
