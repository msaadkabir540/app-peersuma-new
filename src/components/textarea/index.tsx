import React, { ChangeEvent, memo, useCallback, useState } from "react";

import { TextareaInterface } from "./textarea-interface";
import style from "./textarea.module.scss";

const Textarea = ({
  container,
  register,
  name,
  label,
  placeholder,
  errorMessage,
  count,
  errorClass,
  totalCount,
  value,
  isDisabled = false,
  required = false,
  isFontWieght = false,
  rows = 2,
  customLabelClass,
  handleChange,
  textAreaCustomClass,
}: TextareaInterface) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const getValidationRules = useCallback(() => {
    if (required) {
      return { required: "Required." };
    } else {
      return {};
    }
  }, [required]);

  return (
    <div className={`${style.inputContainer} ${container && container}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {label && (
          <label
            className={`{ ${customLabelClass} ${isFontWieght ? "!font-semibold" : ""} text-base 	}`}
          >
            {label}
          </label>
        )}
        {count && (
          <p>
            {count}/{totalCount}
          </p>
        )}
      </div>
      <div
        className={style.inputWrapper}
        style={{
          position: "relative",
        }}
      >
        <textarea
          disabled={isDisabled}
          rows={rows}
          name={name}
          className={`${style.input} ${textAreaCustomClass}`}
          placeholder={placeholder}
          {...(register && register(name || "", getValidationRules()))}
          style={{
            marginTop: label && "4px",
          }}
          value={inputValue || value}
          onChange={handleChange || handleInputChange}
        />
        {errorMessage && (
          <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
        )}
      </div>
    </div>
  );
};

export default memo(Textarea);
