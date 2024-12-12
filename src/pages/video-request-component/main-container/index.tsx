import React, { useMemo } from "react";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Selection from "@/src/components/selection";
import VideoRequestCards from "../component/video-request-cards";

import { VideoRequestInterface } from "@/src/interface/video-request-interface";

import styles from "./index.module.scss";

const MainContainer = ({
  control,
  searchParams,
  videoRequestData,
  handleSearchEvent,
  handleUpdateStatus,
  handleSetEventCross,
  loadingVideoRequest,
  handleUpdateMediaStatus,
}: {
  control: any;
  searchParams: string;
  loadingVideoRequest: boolean;
  handleSearchEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetEventCross: () => void;
  handleUpdateStatus: ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => void;
  handleUpdateMediaStatus: ({
    videoRequestId,
    status,
    upload,
  }: {
    upload: any;
    videoRequestId: string;
    status: string;
  }) => void;
  videoRequestData: VideoRequestInterface[];
}) => {
  const yearList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const endYear = currentYear + 10;
    const yearList = [];

    for (let i = startYear; i < endYear; i++) {
      const yearObject = {
        label: `${i} - ${i + 1}`,
        value: `${i}-${i + 1}`,
      };
      yearList.push(yearObject);
    }

    return yearList;
  }, []);

  return (
    <div className="w-full overflow-scroll">
      <div className="flex justify-between flex-wrap items-center w-full  border-b border-b-[#B8B8B8] ">
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
        <div className="flex justify-end items-end md:mb-0 mb-[10px]">
          <div className={styles.inventorySelectionBox}>
            <Selection
              control={control}
              isClearable={true}
              name={"schoolYear"}
              options={yearList}
              customPadding={true}
              boderCustomeStyle={true}
              placeholder="Select School Year"
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
        <VideoRequestCards
          videoRequestData={videoRequestData}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdateMediaStatus={handleUpdateMediaStatus}
        />
      )}
    </div>
  );
};

export default MainContainer;
