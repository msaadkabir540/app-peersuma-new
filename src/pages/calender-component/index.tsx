"use client";
import Image from "next/image";
import React from "react";

import Layout from "../layout/page";
import Loader from "@/src/components/loader";
import InventoryComponent from "./inventory-component";
import DistrictVideoPlanComponent from "./district-video-plan";

import { useCalender } from "@/src/(context)/calender-context";

import styles from "./index.module.scss";

const CalendarComponent = () => {
  const { handleActive, active, pageLoader } = useCalender();

  return (
    <>
      {pageLoader ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <Layout>
          <div className="grid grid-cols-1 md:grid-cols-[350px_auto] md:px-4 md:py-3 px-4 pt-2  gap-3 md:overflow-hidden">
            <div className="hidden md:block max-w-[350px] rounded-[15px] border bg-[#FFF] border-[#B8B8B8] p-4">
              <InventoryComponent />
            </div>

            <div className="flex flex-col h-[calc(100vh-110px)] md:w-[calc(100vw-395px)] gap-3">
              <div className="md:hidden flex justify-between items-center">
                <div className="overflow-hidden text-[#0F0F0F] truncate text-[20px] font-medium ">
                  Plan
                </div>
                <div className="flex justify-center items-center gap-2" onClick={handleActive}>
                  <div>Inventory</div>
                  <Image
                    data-testid="close-icon"
                    src={"/assets/arrow-top.svg"}
                    style={{ cursor: "pointer", transform: "rotate(271deg)" }}
                    alt="sortUp"
                    className="!w-[24px] !h-[24px]"
                    height="100"
                    width="100"
                    onClick={handleActive}
                  />
                </div>
              </div>
              <div className="bg-[#FFF] flex-1 p-4 rounded-[15px] border border-[#B8B8B8]">
                <DistrictVideoPlanComponent />
              </div>
            </div>
          </div>

          {active && (
            <div className={styles.backDropDiv}>
              <InventoryComponent handleActive={handleActive} />
            </div>
          )}
        </Layout>
      )}
    </>
  );
};

export default CalendarComponent;
