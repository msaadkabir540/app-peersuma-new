import { FieldValues, UseFormRegister } from "react-hook-form";

export interface TextareaInterface {
  register?: UseFormRegister<FieldValues | any>;
  container?: string;
  placeholder?: string;
  name: string;
  label?: string;
  count?: number;
  totalCount?: number;
  value?: string;
  isDisabled?: boolean;
  required?: boolean;
  isFontWieght?: boolean;
  rows: number;
  customLabelClass?: string;
  textAreaCustomClass?: string;
  errorMessage?: string;
  errorClass?: string;
  handleChange?: (e: any) => void;
}
