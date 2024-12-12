import { FieldValues, UseFormRegister } from "react-hook-form";

type InputType = "text" | "number" | "password" | "email" | "date" | "checkbox" | "color";

export interface InputInterface {
  register?: UseFormRegister<FieldValues | any>;
  showSearchIcon?: boolean;
  disabled?: boolean;
  crossIcons?: boolean;
  isContactNumber?: boolean;
  container?: string;
  customPaddingLeft?: any;
  id?: string;
  searchIcon?: string;
  onKeyDown?: ((e: any) => void) | undefined;
  onFocus?: (() => void) | undefined;
  onBlur?: (() => void) | undefined;
  labelClass?: string;
  inputWrapperClass?: string;
  value?: string;
  inputField?: string;
  pattern?: string;
  errorClass?: string;
  label?: string;
  crossIconClass?: string;
  placeholder?: string;
  type?: InputType;
  errorMessage?: string | null;
  name: string;
  onChange?: (value: any) => void;
  handleClickCross?: () => void;

  required?: boolean;
}
