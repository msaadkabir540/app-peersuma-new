"use client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import SignUp from "../sign-up";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import AuthComponent from "../../auth-component";
import Checkbox from "@/src/components/checkbox";
import CustomInstallPWA from "../../custom-install-pwa";

import { axiosApiRequest } from "@/src/helper/api";

import styles from "./index.module.scss";

const LogIn = () => {
  const router = useRouter();
  const {
    watch,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ emailContact: string }>({
    defaultValues: {
      emailContact: "",
    },
  });

  const searchParams = useSearchParams();
  const searchParamsSchoolId = searchParams?.get("school");

  const schoolId = typeof window !== "undefined" ? localStorage.getItem("createdId") : null;

  const emailContactWatch = watch("emailContact");

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signUpValue, setSignUpValue] = useState<string>("");
  const [isContact, setIsContact] = useState<boolean>(true);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateEmailOrPhoneNumber = ({ value }: { value: string }) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the input is an email
    if (emailRegex.test(value)) {
      return true;
    }
    // Phone number validation
    if (value.startsWith("+92")) {
      // If it starts with +92, it should be exactly 12 characters
      return value.length === 13;
    } else {
      // If it does not start with +92, it should be exactly 10 characters
      const phoneRegex = /^\d{10}$/;

      return phoneRegex.test(value);
    }
  };

  const handleCheckboxChange = () => setIsContact(!isContact);

  const containsOnlyDigits = (str: string) => {
    return /^(\+?\d+)$/.test(str);
  };

  const handleSendEmailToUser = async ({ value }: { value: string }) => {
    await onSubmit({ emailContact: value });
  };

  const onSubmit = async (data: { emailContact: string }) => {
    setIsLoading(true);

    const isNumber = checkEmailContact({ emailContact: data?.emailContact });
    const emailContactNumber = isNumber
      ? data?.emailContact?.replace(/[^0-9]/g, "")?.slice(-10)
      : data?.emailContact?.toLocaleLowerCase();
    const validInput = validateEmailOrPhoneNumber({ value: emailContactNumber });

    if (validInput) {
      setErrorMessage("");
      try {
        const response: any = await axiosApiRequest({
          method: "post",
          url: "auth/user-verification",
          data: JSON.stringify({
            emailContact: emailContactNumber,
            isContact: isContact,
            clientId: schoolId || searchParamsSchoolId,
          }),
        });

        if (response?.status === 200) {
          if (response?.data?.userData) {
            localStorage.setItem("token", response?.data?.userData?.token);

            localStorage.setItem(
              "selectedClient",
              response?.data?.userData?.clientId?.[0]?.clientId?._id,
            );
            localStorage.setItem("user-role", response?.data?.userData?.roles[0]);
            localStorage.setItem(
              "userName",
              response?.data?.userData?.username || response?.data?.userData?.fullName,
            );
            localStorage.setItem("userId", response?.data?.userData?._id);
            router.push("/");
          } else {
            localStorage.setItem("pin", response?.data?.otp);
            router.push("/login-otp");
          }
        } else if (response?.response?.status === 404) {
          setIsSignUp(true);
          setSignUpValue(watch("emailContact"));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const isNumber = containsOnlyDigits(emailContactNumber);
      const error = emailContactNumber?.includes("@")
        ? "Enter valid email"
        : isNumber
          ? "Enter valid 10-digit number"
          : "Enter valid email";
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  const checkEmailContact = useCallback(({ emailContact }: { emailContact: string }) => {
    if (emailContact === "") {
      return false;
    }
    const email = emailContact || "";
    const regex = /^[0-9()\-+ !#$%^&*_=+<>?,.:;'"{}[\]|\\/~`]+$/;
    const checkEmail = regex.test(email);

    return !email.includes("@") && checkEmail;
  }, []);

  useEffect(() => {
    const isNumber = checkEmailContact({ emailContact: emailContactWatch });

    isNumber ? setInfoMessage("Number should be 10 digits e.g. (1234567890)") : setInfoMessage("");
  }, [emailContactWatch, checkEmailContact]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <CustomInstallPWA />
      <AuthComponent screenName="Get Started" title="Let’s begin with your video projects!">
        <form
          className="flex w-full flex-col md:gap-24 gap-10 items-center relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isSignUp ? (
            <>
              <SignUp value={signUpValue} handleSendEmailToUser={handleSendEmailToUser} />
            </>
          ) : (
            <>
              <div className="w-full flex flex-col gap-6">
                <div className="mb-4">
                  <Input
                    type="text"
                    required={true}
                    register={register}
                    name={"emailContact"}
                    inputField={styles.inputField}
                    placeholder="Enter your email or Phone Number"
                    errorMessage={errors?.emailContact ? errors.emailContact.message : errorMessage}
                  />
                  <p className="absolute md:top-[63px] top-[45px] text-[11px]">{infoMessage}</p>
                </div>
                <div className="w-full flex justify-start items-center gap-2">
                  <Checkbox
                    className={styles.radioOuter}
                    checkCustomClass={styles.radio}
                    id={`customCheck1-${isContact}`}
                    checkboxValue={isContact?.toString()}
                    handleClick={handleCheckboxChange}
                    checked={isContact}
                  />
                  <div className="text-[11px] md:text-[14px]">
                    I agree to receive notifications about my video project at the email address and
                    phone number provided. See the{" "}
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

              <div className="flex justify-between flex-col gap-5 w-full">
                <Button
                  type="submit"
                  text={"Next"}
                  isLoading={isLoading}
                  className={`!text-[#fff] !font-semibold !md:text-[25px] !text-[18px]`}
                  btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-none  !max-w-none `}
                />
              </div>
            </>
          )}
        </form>
      </AuthComponent>
    </>
  );
};

export default LogIn;
