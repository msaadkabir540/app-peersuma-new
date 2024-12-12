import React from "react";
import { RadioInterface } from "./radio-interface";

import style from "./radio.module.scss";

const Radio: React.FC<RadioInterface> = ({
  id,
  name,
  error,
  label,
  checked,
  disabled,
  register,
  className,
  radioValue,
  handleClick,
  handleChange,
  defaultChecked,
  customLableClass,
}) => {
  return (
    <div>
      <label
        className={`${style.container} ${className} ${disabled ? style.disabledLabel : ""}`} // Apply disabled class when radio is disabled
        htmlFor={id}
      >
        <p className={`${customLableClass} ${disabled ? style.disabledText : ""}`}>{label}</p>
        <input
          id={id}
          name={name}
          type="radio"
          disabled={disabled}
          checked={checked && checked}
          value={radioValue}
          onClick={handleClick}
          defaultChecked={defaultChecked && defaultChecked}
          onChange={handleChange}
          {...(register && !handleChange && register(name))}
        />
        <span
          className={`${style.checkMark} ${disabled ? style.disabledCheckMark : ""}`}
          style={{ borderColor: error ? "red" : "" }}
        ></span>
      </label>
    </div>
  );
};

export default Radio;
