import React, { memo } from "react";
import ReactSelect, { components } from "react-select";

import { Controller } from "react-hook-form";

import ImageComponent from "../image-component";

import style from "./index.module.scss";
import { SelectionInterface } from "./selection-interface";

// Custom Option component to include a color circle
const ColorOption = ({ children, ...props }: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <div
          className={`${props.data.color ? "w-[15px] h-[15px]  mr-2 rounded-full" : ""} `}
          style={{
            backgroundColor: props.data.color,
            border: `${props.data.color ? `1px solid ${props.data.color}` : ""}`,
          }}
        />
        {children}
      </div>
    </components.Option>
  );
};

// Custom SingleValue component to show color circle in the selected value
const SingleValue = ({ children, ...props }: any) => {
  const color = props?.options?.find(
    (option: { value: string }) => option?.value === props?.data?.value,
  );
  return (
    <components.SingleValue {...props}>
      <div
        className="flex items-center"
        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        <div
          className={`${color?.color ? "w-[15px] h-[15px]  mr-2 rounded-full" : ""} `}
          style={{
            backgroundColor: color?.color,
            border: `${color?.color ? `1px solid ${props.data.color}` : ""}`,
          }}
        />
        {children}
      </div>
    </components.SingleValue>
  );
};

const Selection = ({
  id,
  label,
  name,
  isMulti,
  options,
  onFocus,
  control,
  iconClass,
  className,
  stylesProps,
  isClearable = false,
  imageClass,
  customIcon,
  isDisabled,
  isSearchable,
  placeholder,
  errorMessage,
  defaultValue,
  customHeight,
  labelClassName,
  paddingLeft,
  customStyles,
  customWidth,
  customMenuTop,
  customPadding,
  customeMargin,
  customColor,
  customeStyles,
  customBorder,
  customeWeight,
  required = false,
  customBoxShadow,
  customMenuWidth,
  customeFontSize,
  customMinOnly,
  placeholderWidth,
  customPaddingRight,
  customeTextAlign,
  marginRightCustom,
  costumPaddingLeft,
  boderCustomeStyle,
  customeFontWeight,
  customBorderRadius,
  customPaddingBottom,
  singleValueMaxWidth,
  singleValueMinWidth,
  customBackgroundColor,
  customColorSingleValue,
  isOptionDisabled,
  customFuncOnChange,
}: SelectionInterface) => {
  const customStyle = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state?.isSelected ? "black" : "black",
      backgroundColor: state?.isSelected ? "#c7c7c9" : "white",
      cursor: state?.isDisabled ? "not-allowed" : "pointer",
      "&:hover": {
        color: state?.isDisabled ? "black" : "white",
        backgroundColor: state?.isDisabled ? "white" : "#c7c7c9",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: customColor ? customColor : "black",
      fontSize: customeFontSize || "16px",
      paddingRight: customPadding ? "20px !important" : "",
      whiteSpace: "nowrap",
      width: placeholderWidth,
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontWeight: customeWeight,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "black",
      margin: customeMargin,
      paddingBottom: customPaddingBottom ? customPaddingBottom : "2px",
      paddingLeft: paddingLeft ? paddingLeft : "2px",
      fontWeight: customeFontWeight,
    }),
    control: (provided: any) => ({
      ...provided,
      border: customBorder
        ? customBorder
        : customStyles
          ? "1px solid #c0c0c0"
          : "1px solid #c0c0c0",
      borderRadius: customBorderRadius || customStyles ? "8px" : boderCustomeStyle ? "5px" : "1px",
      minHeight: customHeight,
      minWidth: customWidth,
      maxWidth: customWidth,
      backgroundColor: customBackgroundColor,
      boxShadow: customBoxShadow,
      cursor: "pointer",
      ...customeStyles,
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: "99 !important",
      width: "100% !important ",
      overflowX: "auto",
      top: customMenuTop,
      maxWidth: customMinOnly ? "" : customMenuWidth,
      minWidth: customMinOnly ? customMinOnly : customMenuWidth,
      fontSize: customeFontSize,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      textAlign: customeTextAlign && customeTextAlign,
      maxWidth: singleValueMaxWidth,
      minWidth: singleValueMinWidth,
      fontSize: customeFontSize || "16px",
      color: customColorSingleValue || "black",
      paddingRight: customPaddingRight ? customPaddingRight : "16px",
      paddingLeft: costumPaddingLeft && costumPaddingLeft,
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      cursor: "pointer",
      marginRight: marginRightCustom ? marginRightCustom : "25px",
      padding: "0px",
    }),
    indicatorContainer: (provided: any) => ({
      ...provided,
      cursor: "pointer",
      padding: "0px",
    }),
  };

  return (
    <div className={`${style.container} ${className}`}>
      {label && (
        <label htmlFor={id} className={`${style.label} ${labelClassName}`}>
          {label}
        </label>
      )}
      {control && (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              value={value}
              instanceId={id}
              required={required}
              options={options}
              onFocus={onFocus}
              isMulti={isMulti}
              styles={customStyle}
              placeholder={placeholder}
              isClearable={isClearable}
              components={{ Option: ColorOption, SingleValue }}
              isSearchable={isSearchable}
              isDisabled={isDisabled || false}
              isOptionDisabled={isOptionDisabled} // Set option disable logic
              onChange={(selectedOption) => {
                customFuncOnChange?.(selectedOption?.value);
                onChange(selectedOption);
              }}
            />
          )}
        />
      )}

      <div className={`${style.icon} ${iconClass}`}>
        <ImageComponent
          stylesProps={stylesProps}
          src={customIcon || "/assets/down.png"}
          alt="dropdown"
          className={`${style.img} ${imageClass}`}
        />
      </div>

      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

export default memo(Selection);
