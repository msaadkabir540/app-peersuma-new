import { Control, FieldValues, UseFormSetValue } from "react-hook-form";

interface PaginationInterface {
  setValue: UseFormSetValue<FieldValues | any>;
  page: number;
  pageSize: number;
  totalCount: number;
  control: Control<FieldValues | any>;
  perPageText: string;
}

export type { PaginationInterface };
