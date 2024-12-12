import { useController, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import AuthComponent from "@/src/pages/auth-component";
import CodeInputField from "../otp-code/code-input-field";
import CustomInstallPWA from "@/src/pages/custom-install-pwa";
import createNotification from "@/src/components/create-notification";

import { loginByOTP } from "@/src/app/api/authentication";
import { useClients } from "@/src/(context)/context-collection";

import style from "./index.module.scss";

const Verification = () => {
  const router = useRouter();
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const { control, watch, reset } = useForm<{ otpFields: string }>({
    defaultValues: { otpFields: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const otpField = watch("otpFields");

  const storedOtp = typeof window !== "undefined" ? localStorage.getItem("pin") : null;
  const redirectUrl = typeof window !== "undefined" ? localStorage.getItem("redirect_url") : null;

  const onSubmit = async () => {
    if (otpField) {
      setError("");
      if (storedOtp === otpField) {
        try {
          setIsLoading(true);

          const response: any = await loginByOTP({ otp: otpField });

          if (response?.status === 200) {
            localStorage.removeItem("pin");
            setIsPageLoading(true);

            localStorage.setItem("token", response?.data?.token);
            response?.data?.selectedClientId &&
              localStorage.setItem("selectedClient", response?.data?.selectedClientId);
            localStorage.setItem("user-role", response?.data?.roles[0]);
            localStorage.setItem("userName", response?.data?.username || response?.data?.fullName);
            localStorage.setItem("userId", response?.data?._id);
            if (response?.data?.contributor) {
              localStorage.setItem("contributor", response?.data?.contributor);
            }
            setIsPageLoading(false);
            response?.data?.videoProject
              ? router.push(`/produce/${response?.data?.videoProject?._id}`)
              : redirectUrl
                ? router.push(redirectUrl)
                : router.push(`/`);

            localStorage.removeItem("redirect_url");
            setIsPageLoading(false);
          } else {
            reset({});
            createNotification({ type: "error", message: response?.msg || "Enter Correct OTP" });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setError("Enter Correct OTP");
        createNotification({ type: "error", message: "Error!", description: "Enter Correct OTP" });
        setIsLoading(false);
      }

      setIsLoading(false);
    } else {
      setError("Enter OTP");
      console.error("OTP field is empty");
    }
    setIsPageLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const { field } = useController({
    name: "otpFields",
    control,
    defaultValue: "",
  });

  const handleInputChange = useCallback(
    ({ index, event }: { index: number; event: React.ChangeEvent<HTMLInputElement> }) => {
      const value = event?.target?.value;
      const newInputValue = field?.value?.slice(0, index) + value + field?.value.slice(index + 1);
      field.onChange(newInputValue);

      if (value?.length === 1 && index < inputsRef?.current?.length - 1) {
        inputsRef?.current?.[index + 1]?.focus();
      }
    },
    [field],
  );

  const handleInputKeyDown = useCallback(
    ({ index, event }: { index: number; event: React.KeyboardEvent<HTMLInputElement> }) => {
      if (event.key === "Backspace" && index > 0 && !event.currentTarget.value) {
        const newInputValue = field?.value?.slice(0, index - 1) + field?.value?.slice(index);
        field.onChange(newInputValue);
        inputsRef?.current[index - 1]?.focus();
      }
    },
    [field],
  );

  return (
    <>
      {isPageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <CustomInstallPWA />
          <AuthComponent screenName="Get Started" title="Let’s begin with your video projects!">
            <div className="flex flex-col items-center">
              <div className="text-center text-[#0F0F0F] md:text-[24px] text-[18px] font-normal leading-normal">
                Enter OTP here
              </div>
              <div>
                <div className={` ${style.inputContainer}`}>
                  <div className={style.inputs}>
                    {[...Array(4)].map((_, index) => {
                      return (
                        <CodeInputField
                          key={index}
                          index={index}
                          field={field}
                          inputName={"otpFields"}
                          inputsRef={inputsRef}
                          handleInputKeyDown={handleInputKeyDown}
                          handleInputChange={handleInputChange}
                        />
                      );
                    })}
                  </div>
                </div>
                {error && <p className="text-[#ff5050] text-[12px]">{error}</p>}
              </div>
              <div className={` md:p-[15px] p-3 md:gap-10 gap-3 ${style.verificationContainer}`}>
                <div className="  ">
                  <div className="md:text-[24px] text-left font-semibold md:mb-5 mb-4">
                    OTP and login Link Sent
                  </div>
                  <div className={`md:text-[18px]  font-medium text-left  ${style.text}`}>
                    {`An OTP and a login link have been sent to your email and phone number.`}
                  </div>
                </div>
              </div>
              <div className="flex justify-between flex-col md:mt-[40px] mt-[20px] w-full ">
                <Button
                  type="submit"
                  text={"Continue"}
                  handleClick={onSubmit}
                  isLoading={isLoading}
                  className={`!text-[#fff] !font-semibold !md:text-[25px] !text-[18px]`}
                  btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-none  !max-w-none `}
                />
              </div>
            </div>
          </AuthComponent>
        </>
      )}
    </>
  );
};

export default Verification;
