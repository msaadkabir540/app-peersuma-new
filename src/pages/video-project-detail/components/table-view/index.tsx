"use client";

import React, { useMemo, useState } from "react";

import Table from "@/src/components/table";
import Button from "@/src/components/button";
import createNotification from "@/src/components/create-notification";

import Column from "@/src/app/variable/video-detail/column";

import { handleDownload, useOutsideClickHook } from "@/src/helper/helper";

import { RowsInterface, TableColumns } from "@/src/components/table/table-interface";
import { ShotMediaInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";

const TableView = ({
  tableRef,
  handleSort,
  sortColumn,
  shotsOption,
  allMediaShot,
  selectedShot,
  isContributor,
  isEditingProcess,
  handleDeleteShotMedia,
  handleMoveMediaShot,
  handleRenameShotModal,
  handleOpenVideoModal,
}: {
  handleOpenVideoModal: ({
    imageUrl,
    fileType,
  }: {
    imageUrl: string | undefined;
    fileType: string | undefined;
  }) => void;
  handleMoveMediaShot: ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: string;
    moveShot: string;
    media: any;
  }) => void;
  shotsOption: { value: string; label: string }[];
  selectedShot: any;
  isContributor: boolean | undefined;
  isEditingProcess: boolean;
  tableRef: any;
  handleDeleteShotMedia: ({ shotId }: { shotId: string }) => void;
  handleRenameShotModal: ({
    shotId,
    name,
    s3key,
  }: {
    name: string;
    shotId: string;
    s3key: string;
  }) => void;
  handleSort: ({ sort }: { sort: { sortBy: string; sortOrder: "asc" | "desc" } }) => void;
  sortColumn: { sortBy: string; sortOrder: "asc" | "desc" };
  allMediaShot: ShotMediaInterface[];
}) => {
  const mediaShotRowData = useMemo(() => {
    return allMediaShot?.map((shotMedia: ShotMediaInterface, index: number) => ({
      ...shotMedia,
      index: index,
    }));
  }, [allMediaShot]);

  const [isDownload, setIsDownload] = useState<{
    isLoading: boolean;
    rowId: string;
  }>({
    isLoading: false,
    rowId: "",
  });
  const [openListIndex, setOpenListIndex] = useState<string | null>(null);

  const toggleList = (index: string) => {
    setOpenListIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleMoveMedia = ({
    shotId,
    media,
    selectedShot,
  }: {
    shotId: string;
    media: any;
    selectedShot: string;
  }) => {
    handleMoveMediaShot({
      moveShot: shotId,
      media,
      selectedShot,
    });
  };

  useOutsideClickHook(tableRef, () => {
    setOpenListIndex(null);
  });

  const handleDownloadEvent = async ({
    url,
    name,
    rowId,
  }: {
    url: string;
    name: string;
    rowId: string;
  }) => {
    try {
      setIsDownload((prev) => ({ ...prev, isLoading: true, rowId }));
      await handleDownload({ name, url: url as string });
    } catch (error) {
      console.error(error);
      createNotification({
        type: "error",
        message: "Error!",
        description: "Error downloading video",
      });
    }
    setIsDownload((prev) => ({ ...prev, isLoading: false, rowId: "" }));
  };

  return (
    <div ref={tableRef}>
      <Table
        rows={mediaShotRowData as any}
        columns={Column({ handleOpenVideoModal }) as TableColumns[]}
        sortColumn={sortColumn}
        handleSort={(sort) => handleSort({ sort })}
        isLoading={false}
        headingClassName={styles.headingClassName}
        actions={({ row }) => {
          return (
            <Action
              row={row}
              tableRef={tableRef}
              toggleList={toggleList}
              shotsOption={shotsOption}
              rowId={isDownload?.rowId}
              selectedShot={selectedShot}
              isContributor={isContributor}
              openListIndex={openListIndex}
              handleMoveMedia={handleMoveMedia}
              isDownload={isDownload?.isLoading}
              isEditingProcess={isEditingProcess}
              setOpenListIndex={setOpenListIndex}
              handleDownloadEvent={handleDownloadEvent}
              handleRenameShotModal={handleRenameShotModal}
              handleDeleteShotMedia={handleDeleteShotMedia}
            />
          );
        }}
      />
    </div>
  );
};
export default TableView;

const Action = ({
  row,
  rowId,
  tableRef,
  toggleList,
  shotsOption,
  isDownload,
  selectedShot,
  isContributor,
  openListIndex,
  handleMoveMedia,
  isEditingProcess,
  setOpenListIndex,
  handleDownloadEvent,
  handleRenameShotModal,
  handleDeleteShotMedia,
}: {
  isEditingProcess: boolean;
  rowId: string;
  tableRef: any;
  isDownload?: any;
  row: RowsInterface;
  handleRenameShotModal: ({
    shotId,
    name,
    s3key,
  }: {
    name: string;
    shotId: string;
    s3key: string;
  }) => void;
  handleDownloadEvent: ({
    url,
    name,
    rowId,
  }: {
    url: string;
    name: string;
    rowId: string;
  }) => Promise<void>;
  isContributor: boolean | undefined;
  shotsOption: { value: string; label: string }[];
  toggleList: (index: string) => void;
  handleDeleteShotMedia: ({ shotId }: { shotId: string }) => void;
  openListIndex: string | null;
  selectedShot: any;
  handleMoveMedia: ({
    shotId,
    media,
    selectedShot,
  }: {
    shotId: string;
    media: any;
    selectedShot: string;
  }) => void;
  setOpenListIndex: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const handleEventsDownload = () => {
    handleDownloadEvent?.({
      rowId: row?._id,
      name: row?.name,
      url: row?.url,
    });
  };
  const hadnleOpenShot = () => {
    handleRenameShotModal?.({
      shotId: row?._id,
      name: row?.name,
      s3key: row?.s3Key,
    });
  };
  const handleTogglesList = () => {
    toggleList(row?._id);
  };
  const handleDeleteEvent = () => {
    handleDeleteShotMedia({ shotId: row?._id });
  };
  const handleMoveEvent = ({ data }: { data: any }) => {
    handleMoveMedia({
      shotId: data,
      media: row,
      selectedShot: selectedShot,
    });
    setOpenListIndex(null);
  };

  return (
    <td ref={tableRef} className="flex justify-center items-center gap-2  relative" key={row?._id}>
      <div className="md:flex flex justify-center items-center gap-3 h-12">
        <Button
          type="button"
          toolTip={"Download media"}
          btnClass={styles.btnClass}
          imgClass={styles.iconClass}
          loaderClass={styles.loaderClass}
          iconStart={"/assets/download.png"}
          handleClick={handleEventsDownload}
          isLoading={rowId === row?._id && isDownload}
        />
        <Button
          type="button"
          toolTip={"Edit media"}
          disabled={isEditingProcess}
          btnClass={styles.btnClass}
          imgClass={styles.iconClass}
          iconStart={"/assets/pen.png"}
          handleClick={hadnleOpenShot}
        />
        {(!isContributor || (isContributor && shotsOption?.length > 1)) && (
          <Button
            iconStart={"/assets/editing.png"}
            btnClass={styles.btnClass}
            disabled={isEditingProcess}
            imgClass={styles.iconClass}
            toolTip={"Move media"}
            type="button"
            handleClick={handleTogglesList}
          />
        )}
        <Button
          iconStart={"/assets/delete.png"}
          btnClass={styles.btnClass}
          imgClass={styles.iconClass}
          disabled={isEditingProcess}
          toolTip={"Delete media"}
          type="button"
          handleClick={handleDeleteEvent}
        />
      </div>
      {openListIndex === row?._id && (
        <div className={`absolute ${styles.list1}`}>
          <ul>
            {shotsOption?.length != 1 && (
              <li className="border-b border-solid border-gray-400 font-semibold hover:!bg-white">
                Move to
              </li>
            )}
            {shotsOption?.length === 1 && (
              <li className=" !cursor-default hover:!bg-white text-gray-500">No shot</li>
            )}

            {shotsOption
              ?.filter((data: any) => data?.value != selectedShot?.value)
              ?.map((data: any) => {
                return (
                  <LabelComponent key={data?._id} data={data} handleMoveEvent={handleMoveEvent} />
                );
              })}
          </ul>
        </div>
      )}
    </td>
  );
};

const LabelComponent = ({
  data,
  handleMoveEvent,
}: {
  data: any;
  handleMoveEvent: ({ data }: { data: any }) => void;
}) => {
  const handleEvent = () => {
    handleMoveEvent?.(data);
  };
  return (
    <li key={data?.value} onClick={handleEvent}>
      {data?.label}
    </li>
  );
};
