import React from "react";

import Button from "@/src/components/button";
import DateSelection from "./date-selection";
import Selection from "@/src/components/selection";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { OptionType } from "@/src/components/selection/selection-interface";

import styles from "./index.module.scss";

const SelectionView = () => {
  const context = useVideoView();
  const handleActiveView = context && context?.handleActiveView;
  const control = context && context?.control;
  const contributors = context && context?.contributors;
  const activeView = context && context?.activeView;
  return (
    <>
      <div className="flex justify-between md:items-center sm:flex-row flex-col">
        <div>
          <div className={styles.videoSelectionBox}>
            <div>
              <DateSelection />
            </div>
            <Selection
              control={control as any}
              isClearable={true}
              className="!w-36"
              name={"contributor"}
              options={contributors as OptionType[]}
              placeholder="Contributor"
              customBorderRadius={"10px"}
              customBorder={"1px solid #B8B8B8"}
              placeholderWidth="200px !important"
            />
          </div>
        </div>
        <div className="">
          <div className="flex justify-end items-center md:m-0 mb-2">
            <Button
              toolTip={"Table view"}
              imgClass={styles.imgClass}
              btnClass={`${styles.hamburgerClass} ${activeView === "table" ? styles.activeViewClass : ""}`}
              iconStart={"/assets/humburger.png"}
              handleClick={() => handleActiveView?.({ active: "table" })}
            />
            <Button
              toolTip={"Grid view"}
              imgClass={styles.imgClass}
              btnClass={`${styles.gridClass} ${activeView === "grid" ? styles.activeViewClass : ""}`}
              iconStart={"/assets/grid.png"}
              handleClick={() => handleActiveView?.({ active: "grid" })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectionView;
