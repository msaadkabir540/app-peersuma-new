import React from "react";

import UserComponent from "@/src/pages/user-component";
import { ContextCollection } from "@/src/(context)/context-collection";
import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const User = () => {
  return (
    <AuthenticatedRoute>
      <ContextCollection>
        <UserComponent />
      </ContextCollection>
    </AuthenticatedRoute>
  );
};

export default User;
