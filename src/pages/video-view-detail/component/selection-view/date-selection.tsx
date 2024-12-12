"use client";

import moment from "moment";
import DatePicker from "react-datepicker";
import React, { MouseEvent, useRef, useState } from "react";

import Button from "@/src/components/button";
import ImageComponent from "@/src/components/image-component";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { useOutsideClickHook } from "@/src/helper/helper";

import styles from "./index.module.scss";

const DateSelection = () => {
  const dateRef = useRef<HTMLInputElement>(null);

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [fillDate, setFillDate] = useState<string>("Date");
  const [dateMenuOpen, setDateMenuOpen] = useState<boolean>(false);

  const context = useVideoView();
  const startDate = context && context?.startDate;
  const handleApplyFilter = context && context?.handleApplyFilter;
  const handleFromDate = context && context?.handleFromDate;
  const handleToDate = context && context?.handleToDate;
  const handleStaticApplyFilter = context && context?.handleStaticApplyFilter;
  const toDate = context && context?.toDate;

  const handleApplyDate = ({ range }: { range: string }) => {
    setOpenMenu(false);
    setDateMenuOpen(false);
    setFillDate(range);
    handleStaticApplyFilter?.({ range: range });
  };

  useOutsideClickHook(dateRef, () => {
    setDateMenuOpen(false);
    setOpenMenu(false);
  });

  const handleClearDate = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setFillDate("Date");
    handleApplyFilter?.({ fromDate: null, toDate: null });
    handleFromDate?.({ fromDate: null });
    handleToDate?.({ toDate: null });
  };

  const handleApplyFilterDate = () => {
    setFillDate(
      moment(startDate)?.format("YYYY-MM-DD") + "  -  " + moment(toDate)?.format("YYYY-MM-DD"),
    );
    handleApplyFilter?.({ fromDate: startDate, toDate: toDate });
    setDateMenuOpen(false);
    setOpenMenu(false);
  };

  return (
    <>
      <div className="relative w-full" ref={dateRef}>
        {/* border div */}
        <div
          className={`flex justify-between items-center  ${styles.dateContainer}`}
          onClick={() => {
            setOpenMenu(!openMenu);
            setDateMenuOpen(false);
          }}
        >
          <p className={`w-full ${styles.dateBox}`}>{fillDate}</p>
          {fillDate != "Date" && (
            <div
              title="clear Date"
              className={`${styles.crossIcon}`}
              onClick={(e) => handleClearDate(e)}
            >
              <ImageComponent src={"/assets/cross.png"} alt="dropdown" className={styles.img} />
            </div>
          )}
          <div className={`${styles.dateIcon}`}>
            <ImageComponent src={"/assets/down.png"} alt="dropdown" className={styles.img} />
          </div>
        </div>

        {openMenu && (
          <div className={`absolute  ${styles.dateMenu}  `}>
            <p onClick={() => handleApplyDate({ range: "Today" })}>Today</p>
            <p onClick={() => handleApplyDate({ range: "Last 7 days" })}>Last 7 days</p>
            <p onClick={() => handleApplyDate({ range: "Last 30 days" })}>Last 30 days</p>
            <p onClick={() => handleApplyDate({ range: "This year" })}>This year</p>
            <p onClick={() => handleApplyDate({ range: "Last year" })}>Last year</p>
            <p
              onClick={() => setDateMenuOpen(!dateMenuOpen)}
              style={{ background: dateMenuOpen ? "#f2f2f2" : "" }}
            >
              Custom Date Range
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.331496 0.974562C0.0874181 1.21864 0.0874181 1.61437 0.331496 1.85845L3.63955 5.1665L0.331496 8.47456C0.0874181 8.71864 0.0874181 9.11437 0.331496 9.35845C0.575573 9.60252 0.971302 9.60252 1.21538 9.35845L4.96538 5.60845C5.20946 5.36437 5.20946 4.96864 4.96538 4.72456L1.21538 0.974562C0.971302 0.730484 0.575573 0.730484 0.331496 0.974562Z"
                    fill="#0F172A"
                  />
                </svg>
              </span>
            </p>
          </div>
        )}
        {dateMenuOpen && (
          <div className={`absolute right-36 ${styles.dropdown}  `}>
            <div className={styles.customDateHeading}>Custom- Select Dates:</div>
            <div className={styles.customDateRange}>
              <div className="pt-3 relative">
                <label htmlFor="" className={styles.dateLabelClass}>
                  From:
                </label>
                <DatePicker
                  name={"from"}
                  selected={startDate}
                  dateFormat="yyyy-MM-dd"
                  className={styles.DatePicker}
                  onChange={(date) => handleFromDate?.({ fromDate: date })}
                />
                <div className={styles.imgDate}>
                  <ImageComponent src={"/assets/date.svg"} alt="dropdown" />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="" className={styles.dateLabelClass}>
                  To:
                </label>
                <DatePicker
                  name={"to"}
                  selected={toDate}
                  dateFormat="yyyy-MM-dd"
                  className={styles.DatePicker}
                  onChange={(date) => handleToDate?.({ toDate: date })}
                />
                <div className={styles.imgDateTo}>
                  <ImageComponent src={"/assets/date.svg"} alt="dropdown" />
                </div>
              </div>
              <div className={styles.buttons}>
                <Button
                  text="Cancel"
                  btnClass={styles.cancelBtn}
                  className={styles.cancelText}
                  handleClick={() => {
                    setDateMenuOpen(false);
                  }}
                />
                <Button
                  text="Apply"
                  btnClass={styles.applyBtn}
                  className={styles.applyText}
                  handleClick={handleApplyFilterDate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DateSelection;
