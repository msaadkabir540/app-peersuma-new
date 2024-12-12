"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import DropDownMenu from "@/src/components/drop-down-menu";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { useClients } from "@/src/(context)/context-collection";
import { useLibrary } from "@/src/(context)/library-context-collection";

import { vimeoTransloaditUploadMap } from "@/src/helper/helper";

import { addMultipleLibraryMedia } from "@/src/app/api/library-api";

import CreateUpdateMedia from "./create-update-media";

import styles from "../index.module.scss";

const SelectionSection = () => {
  const route = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const clientContext = useClients();
  const allClients = clientContext && clientContext?.allClients;
  const loggedInUser = clientContext && clientContext?.loggedInUser;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const isShowLibraryProcessCard = clientContext && clientContext?.isShowLibraryProcessCard;

  const context = useLibrary();
  const searchParams = context && context?.searchParams;
  const handleCreated = context && context?.handleCreated;
  const setSearchParams = context && context?.setSearchParams;
  const showWidgetSlider = context && context?.showWidgetSlider;
  const handleCloseWidget = context && context?.handleCloseWidget;
  const createUpdateMedia = context && context?.createUpdateMedia;
  const handleSelectedValue = context && context?.handleSelectedValue;
  const handleCloseCreateUpdate = context && context?.handleCloseCreateUpdate;
  const handleSetShowWidgetSlider = context && context?.handleSetShowWidgetSlider;

  const handleSetEvent = (e: any) => setSearchParams(e.target.value);
  const handleSetEventCross = () => setSearchParams("");

  const handleClickEvent = () => setIsOpen(true);

  const handleClickEventClose = () => setIsOpen(false);

  const uploadMediaLibrary = async (uploads: any) => {
    try {
      const res = await addMultipleLibraryMedia({
        data: {
          uploads: uploads?.uploads as any,
          clientId: selectedClientIds as string,
          userId: loggedInUser?._id,
          folderId: allClients?.find((x: any) => x._id === selectedClientIds)?.vimeoFolderId || "",
        },
      });

      if (res.status === 200) {
        handleCloseCreateUpdate?.();
        handleCreated?.();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between  md:flex-row flex-col gap-3 items-center md:my-5 mt-1 mb-3">
        <Input
          type="text"
          crossIcons={true}
          name={"searchTerm"}
          value={searchParams}
          showSearchIcon={true}
          searchIcon=" !top-[13px]"
          onChange={handleSetEvent}
          placeholder="Type and search"
          inputField={styles.inputSearch}
          handleClickCross={handleSetEventCross}
          container={styles.inputSearchContainer}
        />
        <div
          className={`flex md:justify-end justify-between w-full items-center gap-3 ${styles.customWidth}`}
        >
          <div>
            <DropDownMenu
              placeholder={"Type"}
              option={statusOptions as any}
              handleSelectedValue={handleSelectedValue as any}
              menuCustomClass=" !mt-[10px]"
            />
          </div>
          <Link
            href={isShowLibraryProcessCard ? "#" : "/create-library"}
            onClick={(e) => {
              if (isShowLibraryProcessCard) {
                e.preventDefault();
              }
            }}
          >
            <Button
              type="button"
              text="New"
              disabled={isShowLibraryProcessCard}
              className={`!text-[#fff] !font-semibold ${isShowLibraryProcessCard ? `!cursor-default` : `!cursor-pointer`}`}
              btnClass={` ${isShowLibraryProcessCard ? `!bg-[#B8B8B8] !cursor-default` : `!bg-[#ED1C24]`} !rounded-md  md:!flex !hidden !max-w-20`}
            />
          </Link>
          <div
            className="text-sm font-normal flex gap-1 items-center  !cursor-pointer"
            onClick={handleSetShowWidgetSlider}
          >
            Widgets
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              className="!w-[24px] !h-[24px]"
              src={showWidgetSlider ? "/assets/arrow-right-w.svg" : "/assets/arrow-left-w.svg"}
              alt="sortUp"
              height="100"
              width="100"
              onClick={handleCloseWidget}
            />
          </div>
        </div>

        <Modal
          modalWrapper={styles.modalCustomClass}
          open={createUpdateMedia?.isModal}
          className={
            createUpdateMedia?.isCreate
              ? styles.modalCustomWrapper
              : styles.modalCustomWrapperUpdate
          }
          handleClose={handleCloseCreateUpdate}
        >
          <CreateUpdateMedia handleClickEvent={handleClickEvent} />
        </Modal>
      </div>
      <div className={`${isOpen ? styles.transloaditBackground : ""}`}>
        <TransloaditUploadModal
          fieldName={isOpen}
          setFieldName={handleClickEventClose}
          allowedFileTypes={[`video/*`]}
          mapUploads={vimeoTransloaditUploadMap as any}
          setUploads={async ({ uploads }: { uploads: any[] }) => {
            handleCloseCreateUpdate?.();
            await uploadMediaLibrary({ uploads } as any);
          }}
          template_id={process.env.NEXT_PUBLIC_TRANSLOADIT_VIMEO_TEMPLATE_ID}
        />
      </div>
    </>
  );
};

export default SelectionSection;

const statusOptions = [
  { label: "Active Videos", value: true },
  { label: "Archived Videos", value: false },
  { label: "All Videos", value: "" },
];
