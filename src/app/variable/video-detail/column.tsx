import React from "react";
import moment from "moment";

import ImageComponent from "@/src/components/image-component";
import { TableColumnRenderProps, TableColumns } from "@/src/components/table/table-interface";

import styles from "./index.module.scss";

const Columns = ({
  handleOpenVideoModal,
}: {
  handleOpenVideoModal: ({
    imageUrl,
    fileType,
  }: {
    imageUrl: string | undefined;
    fileType: string | undefined;
  }) => void;
}): TableColumns[] => [
  {
    key: "url",
    title: "Name",
    width: "150px",
    sortKey: "name",
    justifyContent: "left",
    render: ({ row }: TableColumnRenderProps) => {
      return (
        <div className={styles.thumbnailContainer}>
          <div
            className={`${styles.iconDiv} flex items-center gap-4`}
            onClick={() =>
              handleOpenVideoModal({
                imageUrl: row?.url || row?.thumbnailUrl,
                fileType: row?.fileType,
              })
            }
          >
            <p>{(row?.index != null ? row.index + 1 : undefined) as number}</p>
            <div className={`flex items-center gap-5  `}>
              {(row as any)?.thumbnailUrl ? (
                <ImageComponent
                  src={row.thumbnailUrl as string}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="60px"
                  containerWidth="100%"
                  stylesProps={{ maxWidth: "98px", minWidth: "98px" }}
                  style={{ borderRadius: "3px" }}
                />
              ) : (row as any)?.fileType === "audio" ? (
                <ImageComponent
                  src={"/assets/headphone.png"}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="60px"
                  containerWidth="100%"
                  stylesProps={{ maxWidth: "98px", minWidth: "98px" }}
                  style={{ borderRadius: "3px" }}
                />
              ) : (
                <ImageComponent
                  src={row.url}
                  alt="themeVideoThumbnailUrl"
                  containerHeight="60px"
                  containerWidth="98px"
                  style={{ borderRadius: "3px" }}
                />
              )}
              <div className={`${styles.text} !cursor-pointer`}>{row?.name}</div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    key: "username",
    title: "Contributor",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "updatedAt",
    title: "Upload Date/Time",
    sortKey: "updatedAt",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD | hh:mm A");
    },
  },

  { key: "actions", title: "Action" },
];

export default Columns;
