import React from "react";
import ImageComponent from "@/src/components/image-component";
import { TableColumnRenderProps, TableColumns } from "@/src/components/table/table-interface";

import styles from "./index.module.scss";

const ColumnMobile: TableColumns[] = [
  {
    key: "url",
    title: "Name",
    sortKey: "name",
    render: ({ row }: TableColumnRenderProps) => {
      return (
        <div className={styles.thumbnailContainer}>
          <div className={`${styles.iconDiv} flex items-center gap-4`}>
            <p>{(row?.index != null ? row.index + 1 : undefined) as number}</p>
            <div className="flex items-center gap-5">
              {(row as any)?.thumbnailUrl ? (
                <ImageComponent
                  src={row.thumbnailUrl as string}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="64px"
                  containerWidth="64px"
                  style={{ borderRadius: "3px" }}
                />
              ) : (row as any)?.fileType === "audio" ? (
                <ImageComponent
                  src={"/assets/headphone.png"}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="64px"
                  containerWidth="64px"
                  style={{ borderRadius: "3px" }}
                />
              ) : (
                <ImageComponent
                  src={row.url}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="64px"
                  containerWidth="64px"
                  style={{ borderRadius: "3px" }}
                />
              )}
              <div className={styles.text}>{row?.name}</div>
            </div>
          </div>
        </div>
      );
    },
  },

  { key: "actions", title: "Action" },
];

export default ColumnMobile;
