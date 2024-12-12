"use client";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { writeText } from "clipboard-polyfill";

import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import Switch from "@/src/components/switch";
import createNotification from "@/src/components/create-notification";

import { deleteWidget } from "@/src/app/api/widget";

import { RowsInterface } from "@/src/interface/tables-interface";
import { ColumnInterface } from "@/src/interface/widget-interface";
import { TableColumns } from "@/src/components/table/table-interface";

import styles from "./index.module.scss";

const Columns = ({ control, handleStatusChange }: ColumnInterface): TableColumns[] => [
  {
    title: "Name",
    key: "name",
    render: ({ value }) => (value || "-") as string,
  },
  {
    key: "active",
    title: "Status",
    render: ({ row }) => (
      <div className={styles.active}>
        <Switch
          control={control}
          defaultValue={row?.active}
          name={`widget_status[${row._id}]`}
          handleSwitchChange={() => handleStatusChange({ row })}
        />
      </div>
    ),
  },
  {
    key: "updatedAt",
    title: "Updated at",
    render: ({ value }) => {
      return moment(value as string).format("YYYY-MM-DD");
    },
  },
  {
    key: "actions",
    title: "Actions",
  },
];

const TableActions = ({
  row,
  setDeleteAction,
  deleteWidgetsId,
  handleSetLoading,
  removeDeletedWidget,
}: {
  row: RowsInterface;
  setDeleteAction: ({ id }: { id: string }) => void;
  deleteWidgetsId: string;
  removeDeletedWidget: (id: string) => void;
  handleSetLoading: () => void;
}) => {
  const router = useRouter();
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const handleClickEvent = () => {
    writeText(`${window.location.origin}/widgets/${row?._id}`);
    createNotification({
      type: "success",
      message: "Success!",
      description: "Showcase Link copied!",
    });
  };

  const handleClickDelete = () => {
    setDeleteAction({ id: row?._id });
  };

  const handleClickEdit = () => {
    router.push(`/widgets/${row?._id}`);
    handleSetLoading();
  };

  const handleClickModalCancel = () => {
    setDeleteAction({ id: "" });
  };

  const handleDeleteEvents = async () => {
    try {
      setIsDelete(true);
      setDeleteAction({ id: "" });
      await deleteWidget({ _id: row?._id });
      removeDeletedWidget(row?._id);
      setIsDelete(false);
    } catch (error) {
      createNotification({
        type: "error",
        message: "Error!",
        description: "Failed to delete widget.",
      });
    }
  };

  return (
    <>
      <td className="flex justify-center items-center gap-2" key={row?._id}>
        <div className="flex relative justify-center items-center gap-3">
          <Tooltip backClass="" text="Edit">
            <Image
              className="!w-[24px] !h-[24px]"
              src="/assets/pen-black.svg"
              alt="Edit"
              height={100}
              width={100}
              onClick={handleClickEdit}
            />
          </Tooltip>
          <Tooltip backClass="" text="Copy Link">
            <Image
              className="!w-[20px] !h-[20px]"
              src="/assets/copy.png"
              alt="Copy Link"
              height={100}
              width={100}
              onClick={handleClickEvent}
            />
          </Tooltip>
          {isDelete ? (
            <Loader pageLoader={false} loaderClass="!w-[24px] !h-[24px]" />
          ) : (
            <Tooltip backClass="" text="Delete">
              <Image
                className="!w-[24px] !h-[24px]"
                src="/assets/delete-black.svg"
                alt="Delete"
                height={100}
                width={100}
                onClick={handleClickDelete}
              />
            </Tooltip>
          )}
        </div>
      </td>
      <Modal
        open={deleteWidgetsId === row?._id}
        handleClose={handleClickModalCancel}
        className={styles.bodyModalWidgets}
        modalWrapper={styles.opacityModal}
      >
        <div className={styles.deleteModal}>
          <Image
            className="!w-[60px] !h-[60px]"
            src="/assets/delete-red.svg"
            alt="Delete"
            height={100}
            width={100}
          />
          <div className={styles.deleteHeading}>Are you sure you want to delete this widget?</div>
          <div className={styles.text}>You will not be able to recover this widget.</div>
          <div className="flex justify-end items-center w-full gap-3 mt-5">
            <Button
              type="button"
              text="Cancel"
              className="!text-[#ED1C24] !font-semibold !rounded-md !bg-transparent"
              btnClass={`!rounded-md ${styles.redBorder} ${styles.maxWidth}  !bg-transparent `}
              handleClick={handleClickModalCancel}
            />
            <Button
              type="button"
              text="Confirm"
              isLoading={false}
              className="!text-[#fff] !font-semibold !rounded-md !bg-[#ED1C24]"
              btnClass={` !rounded-md !bg-[#ED1C24]  ${styles.maxWidth}   `}
              handleClick={handleDeleteEvents}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export { Columns, TableActions };
