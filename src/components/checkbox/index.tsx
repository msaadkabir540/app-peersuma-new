import React from "react";

import { CheckboxInterface } from "./checkbox-interface";

import style from "./checkbox.module.scss";

const Checkbox: React.FC<CheckboxInterface> = ({
  id,
  name,
  error,
  label,
  checked,
  className,
  handleClick,
  checkboxValue,
  defaultChecked,
  checkCustomClass,
}) => {
  return (
    <>
      <label className={`${style.container} ${className}`} htmlFor={id}>
        <p>{label}</p>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          value={checkboxValue}
          onClick={handleClick}
          defaultChecked={defaultChecked}
        />
        <span
          className={`${style.checkMark} ${checkCustomClass}`}
          style={{ borderColor: error ? "red" : "" }}
        ></span>
      </label>
    </>
  );
};

export default Checkbox;
