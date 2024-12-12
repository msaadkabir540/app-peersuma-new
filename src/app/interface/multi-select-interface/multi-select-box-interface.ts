import { Control, FieldValues } from "react-hook-form";

interface OptionsInterface {
  value: string | number;
  label: string | number;
  checkbox?: boolean;
}

interface SelectBoxInterface {
  name: string;
  badge?: boolean;
  showCount?: boolean;
  label?: string;
  isMulti?: boolean;
  iconColor?: string;
  required?: boolean;
  disabled?: boolean;
  customeStyles?: any;
  placeholder?: string;
  isClearable?: boolean;
  wrapperClass?: string;
  showSelected?: boolean;
  mediaOption?: boolean;
  errorMessage?: boolean;
  isSearchable?: boolean;
  selectBoxClass?: string;
  placeholderCustomfont?: number;
  placeholderCustomColor?: string;
  options: Array<OptionsInterface>;
  control: Control<FieldValues | any>;
  defaultValue?: string | number | OptionsInterface | OptionsInterface[] | null;
  handleChange?: (value: string | number | OptionsInterface | OptionsInterface[] | null) => void;
}

interface FormatOptionLabelDataInterface {
  label: string;
  value: string | number;
  color: string;
  checkbox: boolean;
  box: boolean;
}

interface FormatOptionMetaDataInterface {
  context?: string;
  selectValue: any;
}

interface FormatOptionLabelInterface {
  data: {
    data: any;
    metaData?: FormatOptionMetaDataInterface;
    badge: boolean;
    mediaOption?: boolean;
  };
}

export type { SelectBoxInterface, OptionsInterface, FormatOptionLabelInterface };
