"use client";
import React, { memo, useCallback } from "react";
import { InputInterface } from "./input-interface";

import ImageComponent from "../image-component";

import style from "./input.module.scss";

const Input = ({
  id,
  name,
  label,
  type,
  customPaddingLeft,
  value,
  onBlur,
  onFocus,
  register,
  disabled,
  required,
  onChange,
  container,
  onKeyDown,
  crossIcons,
  searchIcon,
  inputField,
  labelClass,
  errorClass,
  placeholder,
  errorMessage,
  crossIconClass,
  showSearchIcon,
  handleClickCross,
  inputWrapperClass,
  isContactNumber = false,
}: InputInterface) => {
  const getValidationRules = useCallback(() => {
    if (required) {
      return { required: "Required." };
    } else if (isContactNumber) {
      return {
        required: "Contact number must be 10 digits",
        minLength: {
          value: 10,
          message: "Contact number must be 10 digits",
        },
        maxLength: {
          value: 10,
          message: "Contact number must be 10 digits",
        },
      };
    } else {
      return {};
    }
  }, [required, isContactNumber]);

  return (
    <div className={`${style.inputContainer} ${container && container}`}>
      {label && <label className={`text-base font-semibold	${labelClass}`}>{label}</label>}
      <div
        className={`${style.inputWrapper} ${inputWrapperClass && inputWrapperClass}`}
        style={{
          position: "relative",
        }}
      >
        {showSearchIcon && (
          <ImageComponent
            src={"/assets/search.png"}
            className={`${style.icon1} ${searchIcon}`}
            alt="Search"
          />
        )}
        {crossIcons && (
          <ImageComponent
            src={"/assets/cross-gray.png"}
            className={`${style.iconCross} ${crossIconClass}`}
            alt="Search"
            onClick={handleClickCross}
          />
        )}
        <input
          id={id}
          disabled={disabled}
          name={name || ""}
          value={value && value}
          onKeyDown={type === "number" ? onKeyDown : () => {}}
          className={`${style.input} ${inputField} w-full border-gray-600 rounded-md py-2 ${showSearchIcon ? `px-8 ` : `px-4`}`}
          type={type ? type : "text"}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          style={{
            paddingLeft: customPaddingLeft,
            marginTop: label && "4px",
            border: errorMessage ? "1px solid red" : "",
          }}
          onChange={onChange || (() => {})}
          {...(register && !onChange && register(name || "", getValidationRules()))}
        />
        {errorMessage && (
          <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
        )}
      </div>
    </div>
  );
};

export default memo(Input);
