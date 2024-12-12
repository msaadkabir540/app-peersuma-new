import React from "react";

type FileType = {
  label: string;
  value: string;
};

interface RowsInterface {
  role?: string;
  videoUrl: string;
  assetId: string;
  fullName?: string;
  contactNumber?: string;

  shareable?: boolean;
  website?: string;
  id?: string;
  index?: number;
  createdByUserName?: string;
  status?: boolean;
  username?: string;
  email?: string;
  roles?: any;
  actions?: string;
  active?: boolean;
  count?: number;
  yourName?: string;
  projectName?: string;
  categories?: FileType[] | string[];
  fileSize?: string;
  description?: string;
  clientId: any;
  videoProjectShot: string[];
  createdByUser?: string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  isVisible: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  createdBy?: string;
  themesDescription?: string;
}

interface TableColumnRenderProps {
  value: string | number | boolean | string[] | FileType[];
  index: number;
  row: RowsInterface;
  editing: any;
}

interface TableColumns {
  justifyContent?: string;
  width?: string;
  key: keyof RowsInterface;
  title: string;
  sortKey?: string;
  render?: (
    value: TableColumnRenderProps,
  ) => string | number | boolean | JSX.Element | JSX.Element[];
}

interface TableInterface {
  rows: Array<RowsInterface>;
  columns: Array<TableColumns>;
  editing?: any;
  mainTableClass?: string;
  customTableClass?: string;
  noDataClass?: string;
  trClassName?: string;
  headingClassName?: string;
  actions?: (actionValues: { row: RowsInterface; index: number }) => JSX.Element | JSX.Element[];
  isLoading: boolean;
  sortColumn?: {
    sortBy: string;
    sortOrder: "asc" | "desc";
  };

  handleSort?: (sortingArgs: { sortBy: string; sortOrder: "asc" | "desc" }) => void | undefined;

  handleRowClick?: (row: RowsInterface) => void;
  redirectPath?: string;

  rowStyles?: (row: RowsInterface) => React.CSSProperties;
}

export type { TableColumns, TableInterface, TableColumnRenderProps, RowsInterface };
