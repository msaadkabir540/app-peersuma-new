import { Control } from "react-hook-form";

interface SwitchInterface {
  id?: string;
  name: string;
  label?: string;
  title?: string;
  className?: string;
  mainClass?: string;
  errorMessage?: string;
  silderClass?: string;
  defaultValue?: boolean;
  switchContainer?: string;
  handleClick?: () => void;
  control: Control<any> | undefined;
  handleSwitchChange?: (argu: boolean) => void;
}

export type { SwitchInterface };
