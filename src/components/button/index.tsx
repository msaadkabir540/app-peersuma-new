import React, { memo } from "react";

import Loader from "../loader";
import ImageComponent from "../image-component";

import { ButtonProps } from "./button-interface";

import style from "./button.module.scss";

const Button = ({
  text,
  form,
  type,
  styles,
  toolTip,
  iconEnd,
  imgClass,
  disabled,
  iconStart,
  className,
  isLoading,
  btnClass,
  loaderClass,
  handleClick,
  titleStyles,
  ...restOfProps
}: ButtonProps) => {
  return (
    <>
      {isLoading ? (
        <div className={`${style.btn} ${btnClass && btnClass}`}>
          <Loader pageLoader={false} loaderClass={loaderClass ? loaderClass : style.loadingClass} />
        </div>
      ) : (
        <button
          title={toolTip}
          className={`${style.btn} ${btnClass && btnClass}`}
          type={type}
          form={form}
          onClick={handleClick}
          disabled={isLoading || disabled ? true : false}
          style={{
            pointerEvents: isLoading || disabled ? "none" : "auto",
            position: "relative",
            ...styles,
          }}
          {...restOfProps}
        >
          {iconStart && (
            <ImageComponent
              src={iconStart}
              alt="icon-start"
              className={`${style.img} ${imgClass}`}
            />
          )}
          {text && (
            <span className={`${style.btnTitle} ${className}`} style={{ ...titleStyles }}>
              {" "}
              {text}
            </span>
          )}
          {iconEnd && (
            <ImageComponent src={iconEnd} alt="icon-end" className={`${style.img} ${imgClass}`} />
          )}
        </button>
      )}
    </>
  );
};

export default memo(Button);
