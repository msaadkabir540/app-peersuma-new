"use client";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";
import Checkbox from "@/src/components/checkbox";
import Selection from "@/src/components/selection";

import { clientApi } from "@/src/app/api/clients";
import { signUP } from "@/src/app/api/users";

import { OptionType } from "@/src/components/selection/selection-interface";

import styles from "./index.module.scss";

const SignUp = ({
  value,
  handleSendEmailToUser,
}: {
  value: string;
  handleSendEmailToUser: ({ value }: { value: string }) => void;
}) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchParamsSchoolId = searchParams?.get("school");

  const isMobile = useMediaQuery("(max-width: 780px)");
  const { watch, register, control, setValue } = useForm<{
    name: string;
    password: string;
    client: { value: string; label: string };
    email: string;
    contactNumber: string;
  }>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const schoolId = typeof window !== "undefined" ? localStorage.getItem("createdId") : null;

  const [errorName, setErrorName] = useState<string>("");
  const [isSchoolSelected, setIsSchoolSelected] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [numberValue, setNumberValue] = useState<string>();
  const [optionError, setOptionError] = useState<string>("");
  const [errorNumber, setErrorNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isContact, setIsContact] = useState<boolean>(true);
  const [getAllClientList, setGetAllClientList] = useState<{ name: string; _id: string }[]>();
  const [isUserExist, setIsUserExist] = useState<{ messageTitle: string; isUser: boolean }>({
    messageTitle: "",
    isUser: false,
  });

  const handleCheckboxChange = () => setIsContact(!isContact);
  const validateEmail = ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
  };

  const checkValidNumber = ({ value }: { value: string }) => {
    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    const testValue = value?.replace(/[^0-9]/g, "")?.slice(-10) || value;
    const phoneRegex = /^(\+?(92|1))?([1-9]\d{9})$/;
    if (phoneRegex.test(testValue)) {
      return true;
    }

    return false;
  };

  const checkEmailContact = ({ emailContact }: { emailContact: string }) => {
    if (emailContact === "") {
      return false;
    }
    const email = emailContact || "";
    return !email.includes("@");
  };

  const onSubmit = async () => {
    const isNumber = checkEmailContact({ emailContact: numberValue as string });
    const contactNumber = isNumber ? numberValue?.replace(/[^0-9]/g, "").slice(-10) : "";
    const nameValue = watch("name");
    const checkEmail = validateEmail({ value: emailValue as string });
    const checkNumbers = checkValidNumber({ value: contactNumber as string });
    if (!isNumber) {
      setErrorNumber("Enter valid 10-digit number without @.");
    } else {
      if (
        !nameValue &&
        nameValue?.trim()?.length === 0 &&
        !contactNumber &&
        watch("client") === undefined
      ) {
        setOptionError("Select client");
        setErrorName("Name is required.");
        setErrorNumber("Enter valid 10-digit number.");
      } else if (
        !nameValue &&
        nameValue?.trim()?.length === 0 &&
        !emailValue &&
        watch("client") === undefined
      ) {
        setOptionError("Select client");
        setErrorName("Name is required.");
        setErrorEmail("Email is required.");
      } else if (!emailValue) {
        setErrorEmail("Email is required.");
      } else if (!contactNumber) {
        setErrorNumber("Enter valid 10-digit number.");
      } else if (!nameValue && nameValue?.trim()?.length === 0) {
        setErrorName("Name is required.");
      } else if (!checkNumbers) {
        setErrorNumber("Enter valid 10-digit number");
      } else if (!checkEmail) {
        setErrorEmail("Enter Valid Email");
      } else if (watch("client") === undefined || watch("client") === null) {
        setOptionError("Required");
      } else {
        setErrorName("");
        setErrorEmail("");
        setOptionError("");
        setErrorNumber("");
        setIsLoading(true);
        try {
          const createData = {
            name: watch("name"),
            contactNumber: contactNumber,
            email: emailValue.toLocaleLowerCase(),
            clientId: localStorage.getItem("createdId") || watch("client")?.value,
          };

          const res: any = await signUP({ data: createData as any });

          if (res?.status === 200) {
            localStorage.setItem("pin", res?.data?.otp);
            setIsLoading(false);
            router.push("/login-otp");
          } else {
            setIsUserExist((prev) => ({
              ...prev,
              messageTitle: res?.response?.data?.message,
              isUser: true,
            }));
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const isEmailOrNumber = useMemo(() => {
    return value?.includes("@");
  }, [value]);

  useEffect(() => {
    isEmailOrNumber ? setEmailValue(value) : setNumberValue(value);
  }, [isEmailOrNumber, value]);

  const pattern = isEmailOrNumber ? "[0-9+-]*" : "";

  const handleKeyDown: ((e: any) => void) | undefined = (e) => {
    // Allowed keys: numbers, plus, minus, and backspace
    const allowedKeys = ["+", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"];
    if (isEmailOrNumber) {
      if (!allowedKeys.includes(e.key)) {
        // Check if the pressed key is allowed, otherwise prevent default
        e.preventDefault();
      }
    }
  };

  const schoolOption = useMemo(() => {
    return getAllClientList
      ?.filter((data) => data?._id !== process.env.NEXT_PUBLIC_DEMO_SCHOOL_ID)
      ?.map((data) => ({ value: data?._id, label: data?.name }));
  }, [getAllClientList]);

  const handleSendEmail = async () => {
    const value =
      isUserExist && isUserExist?.messageTitle?.split(" ")?.[0] === "Contact"
        ? numberValue
        : emailValue;
    await handleSendEmailToUser({ value: value as string });
  };

  const handleBack = () => {
    setIsUserExist((prev) => ({
      ...prev,
      messageTitle: "",
      isUser: false,
    }));
  };

  const handleGetAllClient = async () => {
    try {
      const res = await clientApi.performAction("get-client-name");

      if (res?.status === 200) {
        setGetAllClientList(res.responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllClient();
  }, []);

  useEffect(() => {
    if (schoolId || searchParamsSchoolId) {
      setIsSchoolSelected(true);
      const selectedSchool = schoolOption?.find((data) => {
        return data?.value === searchParamsSchoolId || data?.value === schoolId;
      });

      setValue("client", selectedSchool!);
    }
  }, [schoolId, schoolOption, searchParamsSchoolId]);

  const handleConfirm = () => {
    if (isContact) {
      onSubmit();
    }
  };

  return (
    <>
      {!isUserExist?.isUser ? (
        <form className="flex w-full flex-col  gap-10 items-center">
          <div className="w-full">
            <div className="md:mb-5 mb-4">
              <Input
                required={true}
                disabled={true}
                value={isEmailOrNumber ? emailValue : numberValue}
                type={isEmailOrNumber ? "email" : "text"}
                name={isEmailOrNumber ? "email" : "contactNumber"}
                onChange={(e) =>
                  isEmailOrNumber ? setEmailValue(e.target.value) : setNumberValue(e.target.value)
                }
                placeholder={isEmailOrNumber ? "Enter your email" : "Enter your contact number"}
                inputField={styles.inputField}
                errorMessage={isEmailOrNumber ? errorEmail : errorNumber}
              />
            </div>
            <div className="md:mb-5 mb-4">
              <Input
                type="text"
                name={"name"}
                required={true}
                register={register}
                placeholder="Enter your name"
                inputField={styles.inputField}
                errorMessage={errorName}
              />
            </div>
            <div className="md:mb-5 mb-4">
              <Input
                onKeyDown={handleKeyDown as any}
                required={true}
                pattern={pattern}
                type={!isEmailOrNumber ? "email" : "text"}
                name={!isEmailOrNumber ? "email" : "contactNumber"}
                onChange={(e) =>
                  !isEmailOrNumber ? setEmailValue(e.target.value) : setNumberValue(e.target.value)
                }
                placeholder={!isEmailOrNumber ? "Enter your email" : "Enter your contact number"}
                inputField={styles.inputField}
                errorMessage={!isEmailOrNumber ? errorEmail : errorNumber}
              />
            </div>
            <div className={`md:mb-5 mb-4 ${styles.selectionCustomStyle}`}>
              <Selection
                name={"client"}
                isClearable={true}
                customColor={"#9CA3B9"}
                isDisabled={isSchoolSelected}
                control={control as any}
                errorMessage={optionError}
                placeholder="Select Client"
                customBorder={"1px solid #B8B8B8"}
                customBackgroundColor={"#ffffff !important"}
                placeholderWidth="200px !important"
                options={schoolOption as OptionType[]}
                customeFontSize={isMobile ? "14px !important" : "18px !important"}
                customeStyles={{
                  height: !isMobile ? "48px" : "33px",
                  borderRadius: !isMobile ? "10px" : "5px",
                }}
                iconClass={isSchoolSelected ? "hidden" : styles.iconSelectionClass}
              />
            </div>
            <div className="w-full ">
              <div className="my-4 flex justify-start items-center gap-2">
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
                <div className="text-[11px] md:text-[14px]">
                  I agree to receive notifications about my video project at the email address and
                  phone number provided. If you wish to stop receiving emails, go to My Settings and
                  update your preferences. See the{" "}
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
          </div>

          <Button
            type="button"
            text={"Confirm"}
            handleClick={handleConfirm}
            isLoading={isLoading}
            className={`!text-[#fff] !font-semibold !md:text-[25px] !text-[18px]`}
            btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-none  !max-w-none `}
          />
        </form>
      ) : (
        isUserExist?.isUser && (
          <div className="flex flex-col items-center md:p-10 p-7 md:gap-10 gap-4 rounded-[20px] border-2 border-[#0f0f0f] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] md:min-h-auto">
            <div>
              <div className="md:text-2xl text-xl text-center font-semibold md:mb-5 mb-4 text-[#ed1c24]">
                {isUserExist?.messageTitle}
              </div>
              <div className="md:text-2xl text-xl font-medium text-center max-w-fit min-w-fit">
                {`This ${
                  isUserExist && isUserExist?.messageTitle?.split(" ")?.[0] === "Contact"
                    ? "Contact Number"
                    : "Email"
                } is already in use by another account, do you want to login with that?`}
              </div>
              <div className="flex flex-row justify-between mt-10 gap-5 w-full">
                <Button
                  type="button"
                  text={"Yes"}
                  handleClick={handleSendEmail}
                  isLoading={isLoading}
                  className="!text-[#fff] !font-semibold !md:text-[25px] !text-[18px]"
                  btnClass="!rounded-md !bg-[#ED1C24] !min-w-fit md:!max-w-none !max-w-none"
                />
                <Button
                  type="button"
                  text={"No"}
                  handleClick={handleBack}
                  className="!text-[#ED1C24] !font-semibold !cursor-pointer md:!text-[14px]"
                  btnClass={`!rounded-md !cursor-pointer !bg-transparent !min-w-fit md:!max-w-none !max-w-none !border !border-[#ed1c24] ${styles.buttonNo}`}
                />
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SignUp;
