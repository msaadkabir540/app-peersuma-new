import { ChangeEvent } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface CheckboxInterface {
  id?: string;
  name?: string;
  error?: string;
  label?: string;
  checked?: boolean;
  register?: UseFormRegister<FieldValues | any>;
  className?: string;
  checkCustomClass?: string;
  checkboxValue: string;
  handleClick?: any;
  handleChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
  defaultChecked?: boolean;
}

export type { CheckboxInterface };
