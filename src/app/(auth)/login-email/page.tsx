import React from "react";

import LogInEmail from "@/src/pages/auth/login-email/page";

import { ContextCollection } from "@/src/(context)/context-collection";

const LoginEmail = () => {
  return (
    <ContextCollection>
      <LogInEmail />
    </ContextCollection>
  );
};

export default LoginEmail;
