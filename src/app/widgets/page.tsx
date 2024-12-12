import React from "react";

import WidgetsComponent from "@/src/pages/widgets-components";

import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const Widgets = () => {
  return (
    <>
      <AuthenticatedRoute>
        <ContextCollection>
          <WidgetsComponent />
        </ContextCollection>
      </AuthenticatedRoute>
    </>
  );
};

export default Widgets;
