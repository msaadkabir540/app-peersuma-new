import React from "react";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Selection from "@/src/components/selection";
import CardsContainer from "../component/cards-container";

import { VideoProjectDataInterface } from "@/src/interface/video-request-interface";

import styles from "./index.module.scss";

const MainContainer = ({
  control,
  isDeleted,
  isCreated,
  searchParams,
  videoProjectId,
  handleOpenModal,
  videoProjectData,
  handleSearchEvent,
  handleStatusChange,
  handleSetEventCross,
  loadingVideoRequest,
  handleTemporaryDelete,
  handleCreateVideoProject,
}: {
  control: any;
  isDeleted: boolean;
  isCreated: boolean;
  searchParams: string;
  videoProjectId: string;
  loadingVideoRequest: boolean;
  handleSetEventCross: () => void;
  handleCreateVideoProject: () => void;
  videoProjectData: VideoProjectDataInterface[];
  handleSearchEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: ({ videoProjectId }: { videoProjectId: string }) => void;
  handleStatusChange: ({
    status,
    name,
    oldStatus,
    videoRequestId,
  }: {
    status: string;
    name: string;
    oldStatus?: string;
    videoRequestId?: string;
  }) => void;
  handleTemporaryDelete: ({ videoProjectId }: { videoProjectId: string }) => void;
}) => {
  return (
    <div className="w-full overflow-scroll">
      <div className="flex md:justify-between  justify-end flex-wrap items-center w-full  border-b border-b-[#B8B8B8] ">
        <div className={`my-3  ${styles.width100}`}>
          <Input
            type="text"
            crossIcons={true}
            name={"searchTerm"}
            value={searchParams}
            showSearchIcon={true}
            searchIcon=" !top-[13px]"
            onChange={handleSearchEvent}
            placeholder="Type and search"
            inputField={styles.inputSearch}
            handleClickCross={handleSetEventCross}
            container={styles.inputSearchContainer}
          />
        </div>
        <div className="flex md:flex-row flex-col gap-2 justify-end items-end md:mb-0 mb-[10px]">
          <Button
            isLoading={isCreated}
            text="Create Video Project"
            imgClass={styles.iconClass}
            loaderClass={styles.loadingClass}
            iconStart={"/assets/plus-red.png"}
            handleClick={handleCreateVideoProject}
            btnClass={` !border-none  !bg-transparent  ${styles.btnPadding} `}
            className={`!text-[#ED1C24] !font-normal !text-[14px]`}
          />
          <div className={styles.inventorySelectionBox}>
            <Selection
              control={control}
              isClearable={false}
              isSearchable={false}
              name={"projectStatus"}
              options={option}
              customPadding={true}
              boderCustomeStyle={true}
              iconClass={"!top-[8px]"}
              placeholder="Select Project"
              className={styles.seletionClassName}
              customBorder={"1px solid #B8B8B8"}
            />
          </div>
          <div className={styles.inventorySelectionBox}>
            <Selection
              control={control}
              isClearable={false}
              isSearchable={false}
              name={"sortOrder"}
              options={sortOptions}
              customPadding={true}
              boderCustomeStyle={true}
              iconClass={"!top-[8px]"}
              placeholder="Sort"
              className={styles.seletionClassName}
              customBorder={"1px solid #B8B8B8"}
            />
          </div>
        </div>
      </div>
      {loadingVideoRequest ? (
        <div className="flex justify-center items-center w-full h-[700px]">
          <Loader loaderClass={styles.LoadingClass} pageLoader={false} />
        </div>
      ) : (
        <CardsContainer
          isDeleted={isDeleted}
          videoProjectId={videoProjectId}
          handleOpenModal={handleOpenModal}
          videoProjectData={videoProjectData}
          handleStatusChange={handleStatusChange}
          handleTemporaryDelete={handleTemporaryDelete}
        />
      )}
    </div>
  );
};

export default MainContainer;

const option = [
  {
    label: "All Projects",
    value: "all-Projects",
  },
  {
    label: "My Projects",
    value: "my-projects",
  },
  {
    label: "Shared Projects",
    value: "shared-projects",
  },
];

const sortOptions = [
  { label: "Last Modified", value: "Last Modified" },
  { label: "Oldest", value: "Oldest" },
  { label: "Alphabetical ascending", value: "Alphabetical ascending" },
  { label: "Alphabetical descending", value: "Alphabetical descending" },
];
