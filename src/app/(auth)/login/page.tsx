"use client";
import React, { Suspense } from "react";

import LogIn from "@/src/pages/auth/login/page";

import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  return (
    <Suspense>
      <LogIn />
    </Suspense>
  );
};

export default Login;
