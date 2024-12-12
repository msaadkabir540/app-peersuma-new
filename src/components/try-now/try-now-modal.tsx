import React, { useForm } from "react-hook-form";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import Input from "../input";
import Modal from "../modal";
import Button from "../button";
import createNotification from "../create-notification";

import { TryNowFormInterface, TryNowModalInterface } from "./try-now-interface";

import { checkUserByEmailContact } from "@/src/app/api/users";
import { widgetEmailSend } from "@/src/app/api/widget";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import styles from "./index.module.scss";

const defaultFormValues = {
  email: "",
  contactNumber: "",
  name: "",
};

const TryNowModal = ({
  clientId,
  openModal,
  widgetName,
  setOpenModal,
  buttonColor,
  buttonTextColor,
}: TryNowModalInterface) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TryNowFormInterface>({
    defaultValues: defaultFormValues,
  });

  const watchContactNumber = watch("contactNumber");
  const watchEmail = watch("email");

  const [isForm, setIsForm] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
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

  const checkValidNumber = ({ value }: { value: string }) => {
    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(value)) {
      return true;
    }
    if (value === undefined) {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    if (watch("name") === "") {
      setNameError("Required");
    }
    setIsLoading(true);
    const isValidEmail = validateEmail({ value: watchEmail });
    const contactNumberData = watchContactNumber?.replace(/[^0-9]/g, "")?.slice(-10);
    const isValidNumber = checkValidNumber({ value: contactNumberData });
    const emailData = {
      ...watch(),
      clientId,
      widgetName,
      contactNumber: contactNumberData,
      email: watchEmail?.toLocaleLowerCase(),
    };

    if (isValidEmail && isValidNumber) {
      setNameError("");
      setErrorMessage("");
      try {
        const resp: any = await widgetEmailSend({ data: emailData });

        if (resp.status === 200) {
          createNotification({
            type: "success",
            message: "Success!",
            description: resp?.data?.msg,
          });
          setOpenModal(false);
          setIsLoading(false);
          reset();
        } else {
          setIsLoading(false);
          createNotification({
            type: "error",
            message: "Error!",
            description: resp?.response?.data?.msg,
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (!isValidEmail) {
        setErrorMessage("Enter Valid Email");
        setIsLoading(false);
      } else if (!isValidNumber) {
        setErrorMessage("Enter valid 10-digit number");
        setIsLoading(false);
      }
    }
  };

  const debouncedFindUser = useDebounce({ value: inputValue, milliSeconds: 2000 });

  const validateEmailOrPhoneNumber = ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
  };

  const handleCallApi = useCallback(
    async ({ userValue }: { userValue: string }) => {
      const isValid = validateEmailOrPhoneNumber({ value: userValue });

      const isNumber = checkEmailContact({ emailContact: userValue });

      let isValidNumber;
      if (isNumber) {
        isValidNumber = checkValidNumber({
          value: userValue?.replace(/[^0-9]/g, "")?.slice(-10),
        });
      }
      if (isValidNumber || isValid) {
        let emailContactNumber;
        if (isNumber) {
          emailContactNumber = userValue?.replace(/[^0-9]/g, "")?.slice(-10);
        } else {
          emailContactNumber = userValue.toLocaleLowerCase();
        }

        if (emailContactNumber) {
          try {
            setErrorMessage("");
            setIsLoading(true);
            setIsDisable(false);

            const res: any = await checkUserByEmailContact({ searchTerm: emailContactNumber });

            if (res?.status === 200) {
              setValue?.("contactNumber", res?.data?._doc?.contactNumber);
              setValue?.("email", res?.data?._doc?.email);
              setIsDisable(false);
              setIsForm(false);
            } else if (res?.response?.status === 404) {
              setValue?.("contactNumber", "");
              setValue?.("email", "");
              setIsDisable(false);
              setIsForm(true);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
          if (userValue.includes("@")) {
            setErrorMessage("Enter Valid Email");
          } else {
            setErrorMessage("Enter valid 10-digit number");
          }
        }
      } else {
        const error = userValue?.includes("@")
          ? "Enter valid email"
          : isNumber
            ? "Enter valid 10-digit number"
            : "Enter valid email";
        setErrorMessage(error);
      }
    },
    [setValue],
  );

  useEffect(() => {
    if (debouncedFindUser != "") handleCallApi({ userValue: debouncedFindUser as string });
    if (debouncedFindUser === "") setIsDisable(true);
  }, [debouncedFindUser, handleCallApi]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setInputValue(value);
  };

  useEffect(() => {
    if (isForm) {
      inputValue?.includes("@")
        ? setValue?.("email", inputValue)
        : setValue?.("contactNumber", inputValue);
    }
  }, [inputValue, isForm, setValue]);

  const isEmailOrNumber = inputValue?.includes("@");

  useEffect(() => {
    if (isEmailOrNumber && watchEmail === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("email", "");
    } else if (!isEmailOrNumber && watchContactNumber === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("contactNumber", "");
    }
  }, [setValue, isEmailOrNumber, watchContactNumber, watchEmail]);

  return (
    <div>
      <Modal
        open={openModal}
        showCross={true}
        handleClose={() => setOpenModal(false)}
        className={`${styles.tryNowModal} `}
        iconClassName={styles.iconClassName}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.createContainer}>
          <div className={styles.heading}>Create your own video.</div>
          <div className={styles.nameFields}>
            <div className={styles.fields}>
              {!isForm && (
                <div className="my-3">
                  <Input
                    label={"Enter Email or Phone Number *"}
                    required
                    name="name"
                    type="text"
                    onChange={handleChange}
                    errorMessage={errorMessage}
                  />
                </div>
              )}

              {isForm && (
                <div className={`${styles.fields} ${styles.emailFields}`}>
                  <div className="my-3">
                    <Input
                      disabled={true}
                      label={isEmailOrNumber ? "Email *" : "Phone Number *"}
                      required
                      name={isEmailOrNumber ? "email" : "contactNumber"}
                      type="text"
                      register={register}
                    />
                  </div>
                  <div className="my-3">
                    <Input
                      label={"User Name *"}
                      required
                      name="name"
                      type="text"
                      register={register}
                      errorMessage={
                        errors.name?.message ? errors.name?.message : nameError ? nameError : ""
                      }
                    />
                  </div>
                  <div className="my-3">
                    <Input
                      // required
                      type="text"
                      name={!isEmailOrNumber ? "email" : "contactNumber"}
                      label={!isEmailOrNumber ? "Email *" : "Phone Number *"}
                      register={register}
                      errorMessage={errorMessage ? errorMessage : ""}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.btnGroup}>
            <Button
              type="submit"
              text="Submit"
              disabled={isDisable}
              isLoading={isLoading}
              titleStyles={{ color: buttonTextColor ? buttonTextColor : "#ffffff" }}
              btnClass={isDisable ? styles.disableClass : isLoading ? styles.w_65px : ""}
              styles={{ borderRadius: "5px", background: buttonColor ? buttonColor : "#000000" }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TryNowModal;
