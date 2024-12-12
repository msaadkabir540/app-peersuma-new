"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Login from "./(auth)/login/page";
import Loader from "../components/loader";
import ProjectList from "../pages/project-list";
import AuthenticatedRoute from "../pages/authenticated-route/page";

import { videoProjectApi } from "./api/video-projects";

import { ContextCollection, useClients } from "../(context)/context-collection";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  const [isRedirect, setIsRedirect] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const context = useClients();

  const loginUser = context && context.loggedInUser;

  const userRole = useMemo(() => {
    const selectedClient =
      typeof window !== "undefined" ? localStorage.getItem("selectedClient") : null;
    return loginUser?.clientId?.find(
      ({ clientId }: { clientId: { _id: string } }) => clientId?._id === selectedClient,
    )?.role;
  }, [loginUser]);

  const handleCreateVideoProject = useCallback(async () => {
    setIsRedirect(true);
    const token = localStorage?.getItem("token");
    let clientId = localStorage?.getItem("selectedClient");
    const userName = localStorage?.getItem("userName");
    const userId = localStorage?.getItem("userId");
    const isClient = localStorage?.getItem("clientId");
    if (clientId != undefined || clientId != "undefined") {
      clientId = isClient?.split(",")?.[0] || "";
    }
    if (isClient || clientId != undefined || clientId != "undefined") {
      try {
        const createVideoProjectData = {
          userName,
          userId,
          clientId,
          token,
        };

        const { responseData }: any = await videoProjectApi.performAction(
          "create-video-project",
          createVideoProjectData,
        );
        if (responseData?.data?.status === 200) {
          router.push(`produce/${responseData?.data?.newVideoProject?._id}`);
        } else {
          setIsRedirect(true);
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      } finally {
        localStorage.removeItem("from");
      }
    }
  }, [router]);

  useEffect(() => {
    const search = typeof window !== "undefined" ? window?.location?.search : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("user-role") : null;
    const redirectUrlLink =
      typeof window !== "undefined" ? localStorage.getItem("redirect_url") : null;

    const params = new URLSearchParams(search as string);

    const redirectUrl = params.get("from");
    const from = localStorage.getItem("from");
    if (token && redirectUrlLink) {
      router.push(redirectUrlLink);
      if (redirectUrlLink === "/" || redirectUrl === "/produce") {
        setIsRedirect(false);
        setIsLoggedIn(true);
      }
    } else if (!token) {
      router.push("/login");
      search && localStorage.setItem("from", redirectUrl as string);
      setIsLoggedIn(false);
      setIsRedirect(false);
    } else if (redirectUrl === "peersuma.new" || from === "peersuma.new") {
      handleCreateVideoProject();
    } else {
      if ((role === "producer" || role === userRole) && redirectUrlLink === "/library") {
        localStorage.setItem("redirect_url", "/" as string);
        router.push(`/`);
      } else {
        redirectUrlLink ? router.push(redirectUrlLink) : router.push(`/`);
      }
      setIsRedirect(false);
      setIsLoggedIn(true);
    }
  }, [handleCreateVideoProject, router, userRole]);

  const componentData = !isLoggedIn ? <Login /> : <ProjectList />;

  return (
    <>
      {isRedirect ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <AuthenticatedRoute>
          <ContextCollection>{componentData}</ContextCollection>
        </AuthenticatedRoute>
      )}
    </>
  );
}
