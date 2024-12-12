import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import { useDebounce } from "@/src/app/custom-hook/debounce";
import createNotification from "@/src/components/create-notification";

import { widgetEmailSend } from "@/src/app/api/widget";
import { userByEmailOrNumber } from "@/src/app/api/users";

import { TryNowFormInterface, TryNowModalInterface } from "@/src/interface/try-now-interface";

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
  buttonColor,
  setOpenModal,
  buttonTextColor,
}: TryNowModalInterface) => {
  const { watch, register, handleSubmit, setValue, reset } = useForm<TryNowFormInterface>({
    defaultValues: defaultFormValues,
  });
  const [isForm, setIsForm] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
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

  const checkValidNumber = ({ value }: { value: string }) => {
    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    const phoneRegex = /^(\+?(92|1))?([1-9]\d{9})$/;
    if (phoneRegex.test(value)) {
      return true;
    }
    if (value === undefined) {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const emailData = {
      ...watch(),
      widgetName,
      clientId,
    };
    const email = watch("email");
    const isValidEmail = validateEmail({ value: email });
    const contactNumberData = watch("contactNumber");
    const isValidNumber = checkValidNumber({ value: contactNumberData });

    if (isValidEmail && isValidNumber) {
      try {
        const resp: any = await widgetEmailSend({ data: emailData });
        if (resp.status === 200) {
          createNotification({ type: "success", message: "Success!", description: resp.data.msg });
          setOpenModal(false);
          setIsLoading(false);
          reset();
        } else {
          setIsLoading(false);
          createNotification({ type: "error", message: "Error!", description: resp.data.msg });

          setOpenModal(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (!isValidEmail) {
        setErrorMessage("Enter Valid Email");
        setIsLoading(false);
      } else if (!isValidNumber) {
        setErrorMessage("Enter Valid Contact Number");
        setIsLoading(false);
      }
    }
  };

  const debouncedFindUser = useDebounce({ value: inputValue, milliSeconds: 2000 });

  const validateEmailOrPhoneNumber = ({ value }: { value: string }) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression for phone number validation
    const phoneRegex = /^(\+?(92|1))?([1-9]\d{9})$/;
    // Check if the input is an email
    if (emailRegex.test(value)) {
      return true;
    }

    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    if (phoneRegex.test(value)) {
      return true;
    }

    return false;
  };

  const handleCallApi = async ({ userValue }: { userValue: string }) => {
    const isValid = validateEmailOrPhoneNumber({ value: userValue });
    if (isValid) {
      try {
        setErrorMessage("");
        setIsLoading(true);
        const res: any = await userByEmailOrNumber({ searchTerm: userValue });
        if (res.status === 200) {
          setValue?.("contactNumber", res?.data?._doc?.contactNumber);
          setValue?.("email", res?.data?._doc?.email);
          setIsDisable(false);
          setIsForm(false);
          setIsLoading(false);
        } else if (res.status === 404) {
          setValue?.("contactNumber", "");
          setValue?.("email", "");
          setIsDisable(false);
          setIsForm(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    } else {
      setIsLoading(false);
      if (userValue.includes("@")) {
        setErrorMessage("Enter Valid Email");
      } else {
        setErrorMessage("Enter valid 10-digit number");
      }
    }
  };

  useEffect(() => {
    if (debouncedFindUser != "") handleCallApi({ userValue: debouncedFindUser as string });
    if (debouncedFindUser === "") setIsDisable(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFindUser]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (isEmailOrNumber && watch("email") === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("email", "");
    } else if (!isEmailOrNumber && watch("contactNumber") === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("contactNumber", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, isEmailOrNumber, watch("contactNumber"), watch("email")]);

  return (
    <div>
      <Modal
        {...{
          open: openModal,
        }}
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
                <Input
                  label={"Enter Email or Phone Number *"}
                  required
                  name="name"
                  type="text"
                  onChange={handleChange}
                  labelClass={styles.labelClass}
                  inputField={styles.inputClass}
                  errorMessage={errorMessage}
                />
              )}

              {isForm && (
                <div className={`${styles.fields} ${styles.emailFields}`}>
                  <Input
                    disabled={true}
                    label={isEmailOrNumber ? "Email *" : "Phone Number *"}
                    required
                    name={isEmailOrNumber ? "email" : "contactNumber"}
                    type="text"
                    register={register}
                    labelClass={styles.labelClass}
                    inputField={styles.inputClass}
                  />
                  <Input
                    label={"Full Name *"}
                    required
                    name="name"
                    type="text"
                    register={register}
                    labelClass={styles.labelClass}
                    inputField={styles.inputClass}
                  />

                  <Input
                    required
                    type="text"
                    name={!isEmailOrNumber ? "email" : "contactNumber"}
                    label={!isEmailOrNumber ? "Email *" : "Phone Number *"}
                    register={register}
                    labelClass={styles.labelClass}
                    inputField={styles.inputClass}
                    errorMessage={errorMessage ? errorMessage : ""}
                  />
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
              titleStyles={{ color: buttonTextColor }}
              className={isDisable ? styles.disableClass : ""}
              styles={{ background: buttonColor ? buttonColor : "black", borderRadius: "5px" }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TryNowModal;
