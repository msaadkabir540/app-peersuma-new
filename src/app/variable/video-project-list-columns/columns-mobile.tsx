import React from "react";
import { TableColumnRenderProps, TableColumns } from "@/src/components/table/table-interface";

import styles from "../video-detail/index.module.scss";

const ColumnsMobile: TableColumns[] = [
  {
    key: "name",
    title: "Name",
    sortKey: "name",
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

  { key: "actions", title: "Action" },
];

export default ColumnsMobile;
