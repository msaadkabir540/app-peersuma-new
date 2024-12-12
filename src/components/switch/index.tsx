import React, { memo } from "react";
import { Controller } from "react-hook-form";

import { SwitchInterface } from "./switch-interface";
import style from "./switch.module.scss";

const Switch = ({
  id,
  name,
  label,
  title,
  control,
  mainClass,
  className,
  silderClass,
  handleClick,
  errorMessage,
  defaultValue,
  switchContainer,
  handleSwitchChange,
}: SwitchInterface) => {
  if (!control) {
    console.error(`Control is not defined for Switch component with name ${name}`);
    return null;
  }

  return (
    <div>
      <label htmlFor={name} className={`${style.titleClass} ${mainClass}`}>
        {label || ""}
        <div className={`${style.mainClass} ${className}`} onClick={handleClick && handleClick}>
          <label htmlFor={name} className={`${style.switch} ${switchContainer}`}>
            <Controller
              name={name}
              control={control}
              defaultValue={defaultValue}
              render={({ field: { onChange, value } }) => {
                return (
                  <input
                    id={id || name || ""}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => {
                      onChange?.(e.target.checked);
                      handleSwitchChange?.(e.target.checked);
                    }}
                  />
                );
              }}
            />
            <span className={`${style.slider} ${style.round} ${silderClass}`}></span>
          </label>
          {title && <h6>{title}</h6>}
        </div>
      </label>
      {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ""}
    </div>
  );
};

export default memo(Switch);
