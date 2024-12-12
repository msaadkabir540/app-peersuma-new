import { RowsInterface } from "@/src/components/table/table-interface";
import { Control, FieldValues, UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

interface ColumnInterface {
  control: Control<FieldValues | any>;
  handleStatusChange: (data: { row: RowsInterface }) => void;
}

interface FormSchemaWidget {
  name: string | undefined;
  description: string;
  producers: any;
  colorPalette: { value: string; label: string } | undefined;
  widgetTemplate: string;
  active: string;
  backgroundColor?: string;
  textColor?: string;
  thumbnailColor: string;
  buttonColor?: string;
  buttonTextColor: string;
  thumbnailHeadingColor?: string;
  leafColor?: string;
  thumbnailTextColor?: string;
  hyperTextColor?: string;
  hyperTitleColor?: string;
  shareColor: string;
  titleColor: string;
  tryNowButtonTextColor: string;
  tryNowButtonColor: string;
  thumbnailTitleColor?: string;
}

interface WidgetInitialFieldsInterface {
  watch?: UseFormWatch<FormSchemaWidget> | undefined;
  register: UseFormRegister<FormSchemaWidget>;
  errors: FieldErrors<FormSchemaWidget>;
  control: Control<FormSchemaWidget>;
}
export type { ColumnInterface, WidgetInitialFieldsInterface, FormSchemaWidget };
