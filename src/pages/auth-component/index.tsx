"use client";
import React from "react";

import Image from "next/image";

import styles from "./index.module.scss";
const AuthComponent = ({
  children,
  screenName,
  title,
}: {
  screenName: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="">
        <div className="flex items-center justify-center h-svh">
          <div
            className={`flex justify-center flex-col w-full md:gap-[40px] gap-6 bg-[#fff] ${styles.boxMargin}`}
          >
            <div className={`flex justify-center items-center flex-col gap-2`}>
              <div>
                <Image
                  data-testid="close-icon"
                  style={{
                    objectFit: "cover",
                  }}
                  src={"/assets/peersuma-logo.png"}
                  alt="image-logo"
                  className="md:!w-[170px] md:!h-[170px] !w-[100px] !h-[100px]"
                  width={"500"}
                  height={"500"}
                />
              </div>
              <div className="flex justify-center items-center flex-col  md:gap-3 gap-1">
                <div className="md:text-5xl text-3xl  font-semibold">{screenName}</div>
                <div className={`${styles.titleClass}`}>{title}</div>
              </div>
            </div>
            <>{children}</>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
