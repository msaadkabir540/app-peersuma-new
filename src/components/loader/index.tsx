import Image from "next/image";
import React, { memo } from "react";

import style from "./loading.module.scss";

interface LoadingInterface {
  loaderClass?: string;
  pageLoader?: boolean | string;
  diffHeight?: number;
}

const Loader: React.FC<LoadingInterface> = ({ loaderClass, pageLoader, diffHeight }) => {
  return (
    <>
      {pageLoader ? (
        // if `pageLoader` prop is true, a full screen loader is rendered
        <div
          className={style.flex}
          style={{ height: `calc(100vh - ${diffHeight ? diffHeight : 210}px)` }}
        >
          <div style={{ position: "absolute" }}>
            <Image
              data-testid="close-icon"
              className="!w-[100px] !h-[100px] "
              src={"/assets/peersuma-logo.png"}
              alt="sortUp"
              height="500"
              width="500"
            />
          </div>
          <div className={`${style.loader} ${loaderClass}`}></div>
        </div>
      ) : (
        // if `pageLoader` prop is false, a smaller loader is rendered
        <div className={`${style.loader} ${loaderClass}`}></div>
      )}
    </>
  );
};

export default memo(Loader);
