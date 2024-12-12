import AuthenticatedRoute from "@/src/pages/authenticated-route/page";
import SchoolSettingComponent from "@/src/pages/school-setting-component";
import React from "react";

const SchoolSetting = () => {
  return (
    <>
      <AuthenticatedRoute>
        <SchoolSettingComponent />
      </AuthenticatedRoute>
    </>
  );
};

export default SchoolSetting;
