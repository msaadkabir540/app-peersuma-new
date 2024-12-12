import React from "react";

import CalendarComponent from "@/src/pages/calender-component";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

import { ContextCollection } from "@/src/(context)/context-collection";
import { CalenderContextCollection } from "@/src/(context)/calender-context";

const Calender = () => {
  return (
    <AuthenticatedRoute>
      <ContextCollection>
        <CalenderContextCollection>
          <CalendarComponent />
        </CalenderContextCollection>
      </ContextCollection>
    </AuthenticatedRoute>
  );
};

export default Calender;
