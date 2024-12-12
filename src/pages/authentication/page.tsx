"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import Loader from "@/src/components/loader";

import createNotification from "@/src/components/create-notification";

import { useClients } from "@/src/(context)/context-collection";

import { isAuthentication } from "@/src/app/api/authentication";

const AuthenticationScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const context = useClients();

  const accessToken = searchParams?.get("accessToken");

  const redirectUrl = typeof window !== "undefined" ? localStorage.getItem("redirect_url") : null;

  const isAuth = async ({ accessToken }: { accessToken: string }) => {
    if (accessToken) {
      const response: any = await isAuthentication({ accessToken });

      if (response?.status === 200) {
        localStorage.setItem("token", response?.data?.token);
        response?.data?.selectedClientId &&
          localStorage.setItem("selectedClient", response?.data?.selectedClientId);
        localStorage.setItem("user-role", response?.data?.roles[0]);
        localStorage.setItem("userName", response?.data?.username || response?.data?.fullName);
        localStorage.setItem("userId", response?.data?._id);
        if (response?.data?.contributor) {
          localStorage.setItem("contributor", response?.data?.contributor);
        }
        response?.data?.videoProject
          ? router.push(`/produce/${response?.data?.videoProject?._id}`)
          : redirectUrl
            ? router.push(redirectUrl)
            : router.push(`/`);
      } else {
        createNotification({ type: "error", message: response?.msg || "Not Found" });
      }
    } else {
      createNotification({ type: "error", message: "Token not Found" });
    }
  };

  useEffect(() => {
    if (accessToken) {
      isAuth({ accessToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <Suspense fallback={<Loader diffHeight={34} pageLoader={true} />}>
      <div className="flex h-screen justify-center items-center">
        <Loader diffHeight={34} pageLoader={true} />
      </div>
    </Suspense>
  );
};

export default AuthenticationScreen;
