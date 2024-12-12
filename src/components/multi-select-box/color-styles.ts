import chroma from "chroma-js";

import { ControlProps, OptionProps, StylesConfig } from "react-select";

const colorStyles = ({
  iconColor,
  clearOption,
  mediaOption,
  errorMessage,
  customeStyles,
  placeholderCustomColor,
  placeholderCustomfont,
}: {
  iconColor?: string;
  placeholderCustomColor?: string;
  placeholderCustomfont?: number;
  errorMessage: string;
  clearOption: boolean;
  mediaOption?: boolean;
  customeStyles?: any;
}): any => {
  return {
    control: (styles: StylesConfig, state: ControlProps) => ({
      ...styles,
      background: "transparent !important",
      border: errorMessage ? "1px solid red !important" : "1px solid #c0c0c0 !important",
      boxShadow: "none",
      borderRadius: "4px",
      display: "flex !important",
      alignItems: "center !important",
      padding: "0px 10px",
      minHeight: mediaOption ? "20px" : "36px",
      maxHeight: mediaOption ? "26px" : "",
      cursor: "pointer",
      "&:hover": {
        outline: state.isFocused ? 0 : 0,
      },
      ...customeStyles,
    }),

    option: (styles: any, { isDisabled, isFocused, isSelected }: OptionProps) => {
      const color = chroma("#333333");

      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? "#e1e1e1"
            : isFocused
              ? color.alpha(0.1).css()
              : undefined,

        color: isDisabled ? "#ccc" : isSelected ? "#000" : "#333333",
        cursor: isDisabled ? "not-allowed" : "#fff",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled ? (isSelected ? "#fff" : color.alpha(0.3).css()) : "#fff",
          zIndex: "5000 !important",
        },
      };
    },
    placeholder: (styles: StylesConfig) => ({
      ...styles,
      fontSize: mediaOption ? "14px" : "18px",
      // fontSize: "18px",
      color: placeholderCustomColor ? placeholderCustomColor : "#c0c0c0",
      fontWeight: placeholderCustomfont ? placeholderCustomfont : 400,
      marginTop: mediaOption ? "-10px" : "",
    }),
    singleValue: (styles: StylesConfig) => ({
      ...styles,
      fontWeight: 400,
      marginTop: mediaOption ? "-10px" : "",
    }),
    multiValue: (styles: StylesConfig, { data }: any) => {
      return {
        ...styles,
        borderRadius: "10px",
        backgroundColor: "#ed1c24",
      };
    },
    multiValueLabel: (styles: StylesConfig, { data }: any) => ({
      ...styles,
      color: data?.color || "#fff",
      overflow: "hidden",
      maxWidth: "150px ",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    multiValueRemove: (styles: StylesConfig, { data }: any) => ({
      ...styles,
      display: !clearOption ? "none" : "flex",
      color: data?.color || "white",
      ":hover": {
        backgroundColor: data?.color || "#ed1c24",
        borderRadius: "10px",
        color: "white",
        marginTop: "4px",
        height: "20px",
      },
    }),
    dropdownIndicator: (_: any, context: any) => {
      return {
        transform: `rotate(${context.selectProps.menuIsOpen ? "180deg" : "0deg"})`,
        transition: "transform 0.2s",
        color: iconColor ? iconColor : "#0000",
        padding: "0px 0 0 0",
      };
    },
    clearIndicator: () => {
      return {
        padding: "0px 0 0 0",
      };
    },
    valueContainer: (styles: StylesConfig) => {
      return {
        ...styles,
        // padding: 0,
      };
    },
    indicatorsContainer: (styles: StylesConfig) => {
      return {
        ...styles,
        color: iconColor ? iconColor : "#0000",
        padding: mediaOption ? "0px !important" : "",
        marginTop: mediaOption ? "-8px" : "",
      };
    },
  };
};

export default colorStyles;
