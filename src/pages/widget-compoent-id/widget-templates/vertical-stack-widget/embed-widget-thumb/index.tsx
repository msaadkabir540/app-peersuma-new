import React, { useMemo, memo } from "react";

import {
  EmbedWidgetInterface,
  customEmbedWidgetThumbInterface,
} from "../../../../../interface/embed-widget-interface";

import { default as defaultStyle } from "./index.module.scss";

function EmbedWidgetThumb({
  item,
  selected,
  handleSelect,
  thumbnailTitleColor,
  customEmbedWidgetThumb,
}: {
  selected: boolean;
  item: EmbedWidgetInterface;
  thumbnailTitleColor?: string;
  customEmbedWidgetThumb: customEmbedWidgetThumbInterface;
  handleSelect: ({ item }: { item: EmbedWidgetInterface }) => void;
}) {
  const style = customEmbedWidgetThumb || defaultStyle;
  const formattedDuration = useMemo(() => {
    const durationRound = Math?.round(item?.duration || 60);

    const hours = Math?.floor(durationRound / 3600);
    const minutes = Math?.floor((durationRound % 3600) / 60);
    const seconds = durationRound % 60;

    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "00")}:${String(seconds).padStart(2, "00")}`
      : `${minutes}:${String(seconds).padStart(2, "00")}`;
  }, [item]);

  return (
    <div
      onClick={() => handleSelect({ item })}
      className={style.thumbMain}
      aria-label={item?.name}
      aria-hidden="true"
    >
      <div
        className={`${style.thumbImage} ${selected && style.beforeClassPlayNows}`}
        aria-label={"thumbnailUrl"}
      >
        <img
          style={{
            borderRadius: "5px",
          }}
          src={item?.thumbnailUrl}
          alt={item?.name}
          aria-label={"thumbnailUrl"}
        />
        {!selected && (
          <div className={style.playButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="34"
              viewBox="0 0 33 34"
              fill="none"
            >
              <path
                d="M11.3438 23.9111C11.0702 23.9111 10.8079 23.8024 10.6145 23.609C10.4211 23.4156 10.3125 23.1533 10.3125 22.8798V10.5048C10.3126 10.3291 10.3576 10.1563 10.4432 10.0029C10.5288 9.84944 10.6522 9.72041 10.8017 9.62806C10.9512 9.5357 11.1218 9.48307 11.2974 9.47517C11.4729 9.46726 11.6475 9.50434 11.8047 9.58288L24.1797 15.7704C24.3508 15.8561 24.4946 15.9878 24.5951 16.1506C24.6957 16.3134 24.7489 16.501 24.7489 16.6923C24.7489 16.8837 24.6957 17.0712 24.5951 17.2341C24.4946 17.3969 24.3508 17.5285 24.1797 17.6143L11.8047 23.8018C11.6616 23.8735 11.5038 23.9109 11.3438 23.9111Z"
                fill="white"
              />
              <path
                d="M16.5 2.25482C13.6445 2.25482 10.8532 3.10157 8.47896 4.68798C6.10473 6.27439 4.25424 8.52922 3.1615 11.1673C2.06876 13.8054 1.78284 16.7083 2.33992 19.5089C2.89699 22.3095 4.27203 24.8821 6.29115 26.9012C8.31027 28.9203 10.8828 30.2953 13.6834 30.8524C16.484 31.4095 19.3869 31.1236 22.025 30.0308C24.6631 28.9381 26.9179 27.0876 28.5043 24.7134C30.0908 22.3391 30.9375 19.5478 30.9375 16.6923C30.9375 12.8633 29.4164 9.19102 26.7089 6.48347C24.0013 3.77591 20.3291 2.25482 16.5 2.25482ZM24.1797 17.6153L11.8047 23.8028C11.6475 23.8814 11.4727 23.9184 11.2971 23.9105C11.1215 23.9025 10.9508 23.8498 10.8013 23.7573C10.6518 23.6649 10.5284 23.5357 10.4428 23.3821C10.3573 23.2285 10.3124 23.0556 10.3125 22.8798V10.5048C10.3126 10.3291 10.3576 10.1563 10.4432 10.0029C10.5288 9.84944 10.6522 9.72042 10.8017 9.62806C10.9512 9.5357 11.1218 9.48307 11.2974 9.47517C11.4729 9.46726 11.6475 9.50434 11.8047 9.58288L24.1797 15.7704C24.3508 15.8561 24.4946 15.9878 24.5951 16.1506C24.6957 16.3134 24.7489 16.501 24.7489 16.6923C24.7489 16.8837 24.6957 17.0712 24.5951 17.2341C24.4946 17.3969 24.3508 17.5285 24.1797 17.6143"
                fill="black"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        )}
        {!selected && <div className={style.thumbTimeContainer}>{formattedDuration}</div>}
        {selected && (
          <div
            className={`z-10 text-white absolute top-[40%] md:left-[30%] left-[40%] text-[14px]`}
          >
            Playing Now
          </div>
        )}
      </div>
      <div
        className={style.thumbText}
        style={{ color: thumbnailTitleColor }}
        aria-label={item?.name}
      >
        {item?.name}
      </div>
    </div>
  );
}

export default memo(EmbedWidgetThumb);
