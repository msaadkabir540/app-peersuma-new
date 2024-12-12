"use client";
import React from "react";

import ProjectList from "@/src/pages/project-list";

import AuthenticatedRoute from "@/src/pages/authenticated-route/page";

const Produce = () => {
  return (
    <>
      <AuthenticatedRoute>
        <ProjectList />
      </AuthenticatedRoute>
    </>
  );
};

export default Produce;
