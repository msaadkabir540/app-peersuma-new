import React, { memo } from "react";

import style from "./loading.module.scss";

interface LoadingInterface {
  loaderClass?: string;
  pageLoader?: boolean | string;
  diffHeight?: number;
}

const Loading: React.FC<LoadingInterface> = ({ loaderClass, pageLoader, diffHeight }) => {
  return (
    <>
      {pageLoader ? (
        // if `pageLoader` prop is true, a full screen loader is rendered
        <div
          className={style.flex}
          style={{ height: `calc(100vh - ${diffHeight ? diffHeight : 210}px)` }}
        >
          <div className={`${style.loader} ${loaderClass}`}></div>
        </div>
      ) : (
        // if `pageLoader` prop is false, a smaller loader is rendered
        <div className={`${style.loader} ${loaderClass}`}></div>
      )}
    </>
  );
};

Loading.defaultProps = {};

export default memo(Loading);
