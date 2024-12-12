"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import Layout from "../layout/page";
import Input from "@/src/components/input";
import Tooltip from "@/src/components/tooltip";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Checkbox from "@/src/components/checkbox";
import createNotification from "@/src/components/create-notification";

import { getUserById, updateUser } from "@/src/app/api/users";

import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";

const MySettingComponent = () => {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const {
    setValue,
    register,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<{
    fullName: string;
    email: string;
    roles: string;
    username: string;
    contactNumber: string;
  }>({
    defaultValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      roles: "",
      username: "",
    },
  });

  const [userData, setUserData] = useState<any>();
  const [isContact, setIsContact] = useState<boolean>(true);
  const [errorsMessage, setErrorsMessage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const context = useClients();
  const selectedClientIds = context ? context.selectedClientIds : [];
  const selectedClient = context ? context.selectedClient : [];
  const selectedClientId = selectedClientIds || selectedClient;

  const handlePageLoading = ({ value }: { value: boolean }) => {
    setIsLoading(value);
  };

  const checkValidNumber = ({ value }: { value: string }) => {
    // Remove all non-digit characters
    const testValue = value.replace(/[^0-9]/g, "");

    // Ensure the length of testValue is exactly 10 digits
    if (testValue.length !== 10) {
      return false;
    }

    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    const phoneRegex = /^(\+?(92|1))?([1-9]\d{9})$/;
    if (phoneRegex.test(testValue)) {
      return true;
    }

    return false;
  };

  const onSubmit = async (data: any) => {
    const contactNumber = data?.contactNumber?.replace(/[^0-9]/g, "").slice(-10);
    const checkNumbers = checkValidNumber({ value: contactNumber as string });
    const newData = {
      ...data,
      selectedClientId,
      isAllowContact: isContact,
      email: data?.email?.toLocaleLowerCase(),
      contactNumber: data?.contactNumber?.replace(/[^0-9]/g, "")?.slice(-10),
    };

    if (!checkNumbers) {
      setErrorsMessage("Enter valid 10-digit number.");
    } else {
      try {
        setErrorsMessage("");
        const res: any = await updateUser({ id: userId as string, data: newData });

        if (res.status === 200) {
          localStorage.setItem("userName", newData?.username || newData?.fullName);
          createNotification({
            type: "success",
            message: "Success!",
            description: "User updated successfully!",
          });
        } else {
          createNotification({
            type: "error",
            message: "Error!",
            description: res?.response?.data?.msg || "Failed to update user.",
          });
        }
      } catch (error) {
        createNotification({
          type: "error",
          message: "Error!",
          description: "Failed to update user.",
        });
      }
    }
  };

  const handleResetValue = () => {
    const selectedClient = userData?.clientId?.find(
      (client: any) => client?.clientId?._id === selectedClientId,
    );
    clearErrors();
    setErrorsMessage("");
    setIsContact(userData?.isAllowContact);
    setValue("fullName", userData?.fullName);
    setValue("username", userData?.username);
    setValue("email", userData?.email);
    setValue("contactNumber", userData?.contactNumber);
    setValue("roles", selectedClient?.role);
  };

  const handleGetUserById = async ({ userId }: { userId: string }) => {
    try {
      const res = await getUserById({ userId });

      if (res.status === 200) {
        const selectedClient = res.data.clientId.find(
          (client: any) => client?.clientId?._id === selectedClientId,
        );
        setUserData(res?.data);
        setValue("fullName", res?.data?.fullName);
        setValue("username", res?.data?.username);
        setValue("email", res?.data?.email);
        setValue("contactNumber", res?.data?.contactNumber);
        setValue("roles", selectedClient.role);
        setIsContact(res?.data?.isAllowContact);
        handlePageLoading({ value: false });
      }
    } catch (error) {
      handlePageLoading({ value: false });
      throw new Error(error as any);
    }
  };

  useEffect(() => {
    if (userId || selectedClientId) {
      handleGetUserById({ userId: userId as string });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedClientId]);

  const handlePageRedirect = () => setIsLoading(true);
  const handleCheckboxChange = () => setIsContact(!isContact);

  return (
    <div>
      {isLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <Layout handlePageRedirect={handlePageRedirect}>
            {/* <Navbar /> */}
            <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
              <div className="w-full max-w-[700px] m-auto">
                <div className="md:mt-24 mt-20 sm:mx-8 mx-2 p-3 flex flex-col gap-4">
                  <div className="font-medium text-2xl text-[#000]">My Settings</div>
                  <div className="w-full ">
                    <Input
                      type="text"
                      name={"fullName"}
                      label="Full Name"
                      register={register}
                      placeholder="Enter your full name "
                      inputField={styles.inputPlaceHolder}
                      errorMessage={errors?.fullName && errors.fullName.message}
                    />
                  </div>
                  <div className="w-full ">
                    <Input
                      type="text"
                      required={true}
                      register={register}
                      name={"username"}
                      inputField={styles.inputPlaceHolder}
                      label="User Name"
                      placeholder="Enter your user name "
                      errorMessage={errors?.username && errors.username.message}
                    />
                  </div>
                  <div className="w-full ">
                    <Input
                      type="email"
                      required={true}
                      register={register}
                      name={"email"}
                      inputField={styles.inputPlaceHolder}
                      label="Email"
                      placeholder="Enter your email "
                      errorMessage={errors?.email && errors.email.message}
                    />
                  </div>
                  <div className="w-full ">
                    <Input
                      type="text"
                      required={true}
                      register={register}
                      inputField={styles.inputPlaceHolder}
                      name={"contactNumber"}
                      label="Phone Number"
                      placeholder="Enter your phone number "
                      errorMessage={
                        errors?.contactNumber ? errors?.contactNumber?.message : errorsMessage
                      }
                    />
                  </div>
                  <div className="w-full ">
                    <Tooltip text="Cannot update role" backClass={styles.BackClassCustom}>
                      <Input
                        type="text"
                        inputField={`${styles.inputPlaceHolder} ${styles.disableClass}`}
                        disabled={true}
                        required={true}
                        register={register}
                        name={"roles"}
                        label="Role"
                      />
                    </Tooltip>
                  </div>
                  <div className="w-full ">
                    <div className="flex justify-start items-center gap-2">
                      <div className={styles.selectedInventories}>
                        <Checkbox
                          className={styles.radioOuter}
                          checkCustomClass={styles.radio}
                          id={`customCheck1-${isContact}`}
                          checkboxValue={isContact?.toString()}
                          handleClick={handleCheckboxChange}
                          checked={isContact}
                        />
                      </div>
                      <div>
                        {" "}
                        I agree to receive notifications about my video project at the email address
                        and Phone number provided. See{" "}
                        <a
                          href="https://www.peersuma.com/privacy-policy"
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          {" "}
                          Privacy Policy
                        </a>{" "}
                        for more information.
                      </div>
                    </div>
                  </div>

                  {/* {showButtons && ( */}
                  <div className="flex justify-end items-center gap-3">
                    <Button
                      type="button"
                      text="Cancel"
                      className={`!text-[#ED1C24] !font-semibold`}
                      btnClass={`!rounded-md ${styles.redBorder}  !bg-transparent `}
                      handleClick={handleResetValue}
                    />
                    <Button
                      type="submit"
                      text="Update"
                      isLoading={isSubmitting}
                      className={`!text-[#fff] !font-semibold`}
                      btnClass={` !rounded-md !bg-[#ED1C24]  `}
                    />
                  </div>
                  {/* )} */}
                </div>
              </div>
            </form>
          </Layout>
        </>
      )}
    </div>
  );
};

export default MySettingComponent;
