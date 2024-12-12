import React from "react";

import MySettingComponent from "@/src/pages/my-setting-component";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

import { ContextCollection } from "@/src/(context)/context-collection";

const MySetting = () => {
  return (
    <>
      <AuthenticatedRoute>
        <ContextCollection>
          <MySettingComponent />
        </ContextCollection>
      </AuthenticatedRoute>
    </>
  );
};

export default MySetting;
