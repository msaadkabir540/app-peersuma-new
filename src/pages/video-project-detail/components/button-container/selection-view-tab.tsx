import { useMediaQuery } from "usehooks-ts";
import React, { useMemo, useState } from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";
import Selection from "@/src/components/selection";

import { SelectionViewTabInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import { OptionType } from "@/src/components/selection/selection-interface";

import styles from "./index.module.scss";

const SelectionViewTab = ({
  control,
  activeView,
  mediaLength,
  setActiveView,

  isContributor,
  contributorOption,
  handleSearchEvent,
  searchParams,
  searchParamsValue,
  handleSetEventCross,
}: SelectionViewTabInterface) => {
  const isMobile = useMediaQuery("(max-width: 770px)");
  return (
    <div className="flex gap-3 justify-between items-center my-[22px] md:flex-row flex-col ">
      <div className="flex justify-between items-center w-full">
        <div>Uploads ({mediaLength ?? 0})</div>
        <div className="md:hidden flex">
          <div className="flex justify-end items-center">
            <Button
              toolTip={"Table view"}
              iconStart={"/assets/humburger.png"}
              handleClick={() => setActiveView("table")}
              btnClass={`${styles.hamburgerClass} ${activeView === "table" ? styles.activeViewClass : ""}`}
            />
            <Button
              iconStart={"/assets/grid.png"}
              toolTip={"Grid view"}
              handleClick={() => setActiveView("grid")}
              btnClass={`${styles.gridClass} ${activeView === "grid" ? styles.activeViewClass : ""}`}
            />
          </div>
        </div>
      </div>
      {/* <div className="md:w-auto  w-full">
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
      </div> */}
      <div className="flex flex-row-reverse w-full  gap-3 !cursor-pointer">
        <div className="md:block hidden">
          <div className="flex justify-end items-center">
            <Button
              toolTip={"Table view"}
              iconStart={"/assets/humburger.png"}
              handleClick={() => setActiveView("table")}
              btnClass={`${styles.hamburgerClass} ${activeView === "table" ? styles.activeViewClass : ""}`}
            />
            <Button
              iconStart={"/assets/grid.png"}
              toolTip={"Grid view"}
              handleClick={() => setActiveView("grid")}
              btnClass={`${styles.gridClass} ${activeView === "grid" ? styles.activeViewClass : ""}`}
            />
          </div>
        </div>
        {/* {!isContributor && (
          <div className={`${styles.filterClassName} `}>
            <Selection
              isClearable
              id="contributor"
              name="contributor"
              control={control}
              customPadding={true}
              isSearchable={false}
              customeFontSize={`${isMobile ? "13px" : "16px"}`}
              customBorder="none !important"
              placeholder="Contributor"
              iconClass={styles.iconClassSelection}
              options={contributorOption as OptionType[]}
            />
          </div>
        )} */}
        <div className={`${styles.filterClassName} `}>
          <Selection
            id="sort"
            name="sortMedia"
            control={control}
            isClearable={false}
            customPadding={true}
            isSearchable={false}
            placeholder="Sort"
            customBorder="none !important"
            iconClass={styles.iconClassSelection}
            options={sortOption as OptionType[]}
            customeFontSize={`${isMobile ? "13px" : "16px"}`}
          />
        </div>
        <div className={` ${styles.filterClassNameMedia}`}>
          <Selection
            iconClass={styles.iconClassSelection}
            name="type"
            id="type"
            isSearchable={false}
            placeholder="All Media Type"
            customBorder="none !important"
            control={control}
            customeFontSize={`${isMobile ? "13px" : "16px"}`}
            customPadding={true}
            options={typeOption}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionViewTab;

const typeOption = [
  { label: "All", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
];

const sortOption = [
  { label: "Ascending (A-Z)", value: "name-asc" },
  { label: "Descending (Z-A)", value: "name-desc" },
  { label: "Oldest to Newest", value: "date-acs" },
  { label: "Newest to Oldest", value: "date-desc" },
];
