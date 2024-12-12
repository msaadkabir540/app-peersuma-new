import React from "react";

export interface ButtonProps {
  text?: string | JSX.Element | React.ReactNode;
  iconStart?: string;
  iconEnd?: string;
  loaderClass?: string;

  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  isLoading?: boolean;
  btnClass?: string;
  toolTip?: string;
  disabled?: boolean;
  form?: string;
  imgClass?: string;
  styles?: any;
  titleStyles?: any;
  [key: string]: any; // Allows any additional props
}
