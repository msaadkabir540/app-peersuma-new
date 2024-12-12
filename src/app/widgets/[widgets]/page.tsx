import React from "react";

import { ContextCollection } from "@/src/(context)/context-collection";

import UpdateWidget from "@/src/pages/widget-compoent-id";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const Widgets = ({ params }: { params: { widgets: string } }) => {
  const { widgets } = params;

  return (
    <>
      <AuthenticatedRoute>
        <ContextCollection>
          <UpdateWidget _id={widgets} />
        </ContextCollection>
      </AuthenticatedRoute>
    </>
  );
};

export default Widgets;
