import { FieldValues, UseFormRegister } from "react-hook-form";

interface RadioInterface {
  id?: string;
  name: string;
  error?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  radioValue: string;
  defaultChecked?: boolean;
  customLableClass?: string;
  handleClick?: () => void;
  handleChange?: () => void;
  register: UseFormRegister<FieldValues | any>;
}

export type { RadioInterface };
