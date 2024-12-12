import React from "react";
import moment from "moment";
import Image from "next/image";

import Loader from "@/src/components/loader";
import Switch from "@/src/components/switch";
import Tooltip from "@/src/components/tooltip";

import { TableColumnRenderProps, TableColumns } from "@/src/components/table/table-interface";

import { ColumnInterface } from "../../interface/user-interface/user-interface";

import style from "./index.module.scss";

const Columns = ({ control, handleStatusChange }: ColumnInterface): TableColumns[] => [
  {
    key: "fullName",
    title: "Full Name",
    sortKey: "fullName",
    render: ({ value }: TableColumnRenderProps) => {
      return (value ? value : "-") as string;
    },
  },
  {
    key: "username",
    title: "User Name",
    sortKey: "username",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },

  {
    key: "email",
    title: "Email",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "contactNumber",
    title: "Phone Number",
    render: ({ value }: TableColumnRenderProps) => {
      return (value ? value : "-") as string;
    },
  },
  {
    key: "role",
    title: "Role",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "status",
    title: "Status",
    render: ({ row }: TableColumnRenderProps) => {
      const handleEventChangeStatus = () => handleStatusChange({ id: row?._id });
      return (
        <div className={style.active}>
          <Switch
            control={control}
            defaultValue={row?.status}
            name={`active=${row._id}`}
            handleSwitchChange={handleEventChangeStatus}
          />
        </div>
      );
    },
  },
  {
    key: "updatedAt",
    title: "Updated At",
    sortKey: "updatedAt",
    render: ({ value }: TableColumnRenderProps) => {
      return value ? moment(value as string).format("YYYY-MM-DD | hh:mm A") : "-";
    },
  },

  { key: "actions", title: "Action" },
];

export default Columns;

export const Action = ({
  rowId,
  deletedId,
  isDeleting,
  handleUpdateUser,
  handleDeleteEvent,
}: {
  rowId: string;
  deletedId?: string;
  isDeleting?: boolean;
  handleUpdateUser: ({ rowId }: { rowId: string }) => void;
  handleDeleteEvent: ({ rowId }: { rowId: string }) => void;
}) => {
  const handleUpdate = () => {
    handleUpdateUser({ rowId });
  };
  const handleDelete = () => {
    handleDeleteEvent({ rowId });
  };

  return (
    <td className="flex justify-center items-center gap-2 " key={rowId}>
      <div className="flex relative  justify-center items-center gap-3">
        <Tooltip backClass="" text="Edit">
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
            }}
            className="!w-[24px] !h-[24px]"
            src={"/assets/edit-icon.svg"}
            alt="sortUp"
            height="500"
            width="500"
            onClick={handleUpdate}
          />
        </Tooltip>
        {isDeleting && rowId === deletedId ? (
          <Loader pageLoader={false} loaderClass="!w-[24px] !h-[24px]" />
        ) : (
          <Tooltip backClass="" text="Delete">
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              className="!w-[24px] !h-[24px]"
              src={"/assets/delete-black.svg"}
              alt="sortUp"
              height="100"
              width="100"
              onClick={handleDelete}
            />
          </Tooltip>
        )}
      </div>
    </td>
  );
};
