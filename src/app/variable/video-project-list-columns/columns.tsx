import React from "react";
import moment from "moment";

import { TableColumnRenderProps, TableColumns } from "@/src/components/table/table-interface";

import styles from "../video-detail/index.module.scss";

const Columns: TableColumns[] = [
  {
    key: "name",
    title: "Name",
    width: "150px",
    sortKey: "name",
    justifyContent: "left",
    render: ({ row }: TableColumnRenderProps) => {
      return (
        <div className={styles.videoListTable}>
          <div className={` flex items-center gap-4`}>
            <p>{(row?.index != null ? row?.index + 1 : 0) as number}</p>
            <div className="flex items-center gap-5">
              <div style={{ color: "red !important" }}>{row?.name}</div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    key: "createdByUserName",
    title: "Created By",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "createdAt",
    title: "Created At",
    sortKey: "createdAt",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD | hh:mm A");
    },
  },

  {
    key: "status",
    title: "Video Project Status",
    render: ({ value }: TableColumnRenderProps) => {
      const status = typeof value === "string" ? value.replaceAll("-", " ") : String(value);
      return <div className="capitalize">{status as string}</div>;
    },
  },
];

export default Columns;
