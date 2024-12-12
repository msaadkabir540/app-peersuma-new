"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import AuthComponent from "../../auth-component";

import { useClients } from "@/src/(context)/context-collection";

import createNotification from "@/src/components/create-notification";

import styles from "./index.module.scss";
import { axiosApiRequest } from "@/src/helper/api";

const LogInEmail = () => {
  const router = useRouter();

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirect, setIsRedirect] = useState<boolean>(false);

  const onSubmit = async () => {
    setIsLoading(true);
    setIsRedirect(true);

    try {
      const formData = { ...watch() };

      const response: any = await axiosApiRequest({
        method: "post",
        url: "auth/signIn-email",
        data: JSON.stringify({ email: formData?.email }),
      });

      if (response?.status === 200) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user-role", response?.data?.roles[0]);
        localStorage.setItem("userName", response?.data?.fullName || response?.data?.username);
        localStorage.setItem("userId", response?.data?._id);
        router.push("/");
      }
    } catch (error) {
      setIsRedirect(false);
      console.error(error);
      createNotification({
        type: "error",
        message: "Login Fail",
        description: "Fail to Login the User",
      });
      createNotification({ type: "error", message: "error..." });
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleClickBack = ({ path }: { path: string }) => {
    setIsRedirect(true);
    router.push(path);
  };

  return (
    <>
      {isRedirect ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <AuthComponent screenName="Login" title="Get into your account">
          <form
            className="flex w-full flex-col md:gap-24 gap-10 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <div className="mb-2">
                <Input
                  type="text"
                  name={"email"}
                  required={true}
                  register={register}
                  placeholder="Enter your email"
                  inputField={styles.inputField}
                  errorMessage={errors?.email ? errors?.email?.message : null}
                />
              </div>
            </div>

            <div className="flex justify-between flex-col md:gap-5 gap-2 w-full">
              <button type="submit" className={styles.buttonClass} disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </button>
              <Button
                text="Go back"
                className={styles.colorRed}
                btnClass={`${styles.buttonClassBack} `}
                handleClick={(e) => {
                  e.stopPropagation;
                  handleClickBack({ path: "login" });
                }}
              />

              <div
                className={styles.redirectClass}
                onClick={(e) => {
                  e.stopPropagation;
                  handleClickBack({ path: "/sign-up" });
                }}
              >
                Don’t have an account?
                <strong> Sign up</strong>
              </div>
            </div>
          </form>
        </AuthComponent>
      )}
    </>
  );
};

export default LogInEmail;
