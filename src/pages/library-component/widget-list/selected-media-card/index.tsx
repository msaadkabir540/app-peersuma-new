import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef } from "react";

import Tooltip from "@/src/components/tooltip";

import { useLibrary } from "@/src/(context)/library-context-collection";

import { removeWidgetMedia } from "@/src/app/api/library-api";

import style from "../index.module.scss";

const SelectedMediaCard = ({
  name,
  mediaId,
  duration,
  imagePath,
  selectedWidget,
}: {
  name: string;
  mediaId: string;
  duration: number;
  imagePath: string;
  selectedWidget: string;
}) => {
  const route = useRouter();
  const dateRef = useRef<HTMLInputElement>(null);

  const libraryContext = useLibrary();
  const handleRemoveWidgetMediaLibrary = libraryContext?.handleRemoveWidgetMediaLibrary;

  const handelRemoveWidget = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRemoveWidgetMedia(e);
  };

  const handleRemoveWidgetMedia = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await removeWidgetMedia({ params: { id: selectedWidget, mediaId: mediaId } });
      if (res.status === 200) {
        handleRemoveWidgetMediaLibrary({ widgetID: mediaId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    route.push(`/update-library?libraryId=${mediaId}`);
  };

  const formattedDuration = useMemo(() => {
    const durationRound = Math?.round(duration || 60);

    const hours = Math?.floor(durationRound / 3600);
    const minutes = Math?.floor((durationRound % 3600) / 60);
    const seconds = durationRound % 60;

    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "00")}:${String(seconds).padStart(2, "00")}`
      : `${minutes}:${String(seconds).padStart(2, "00")}`;
  }, [duration]);

  return (
    <div
      className="flex justify-between items-center gap-4 p-4 bg-white rounded-lg h-[80px] cursor-pointer"
      ref={dateRef}
      onClick={handleClickEvent as () => void}
    >
      <div className="flex gap-4 items-center justify-between w-full">
        <div>
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
              cursor: "grab",
            }}
            className="!w-[10px] !h-[20px]"
            src={"/assets/drag.svg"}
            alt="sortUp"
            height="100"
            width="100"
          />
        </div>
        <div className={`${style.imageShadow} relative`}>
          <Image
            style={{
              borderRadius: "3px",
              position: "relative",
              objectFit: "contain",
            }}
            data-testid="close-icon"
            className={style.selectedCards}
            src={imagePath}
            alt="sortUp"
            height="100"
            width="100"
          />
          <div className="flex max-w-fit bg-slate-500 p-[2px] rounded-sm text-white text-[8px] absolute right-1 items-center justify-center bottom-1">
            {formattedDuration}
          </div>
        </div>
        <div className={`${style.selectedName} flex-1`}>{name || "Untitled"}</div>
        <div className="relative">
          <Tooltip backClass={style.tooltipClass} text="Delete">
            <Image
              data-testid="close-icon"
              style={{
                cursor: "pointer",
              }}
              height="100"
              width="100"
              alt="sortUp"
              src="/assets/delete-red.svg"
              className="!w-[24px] !h-[24px]"
              onClick={handelRemoveWidget as () => void}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SelectedMediaCard;
