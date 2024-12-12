import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import Checkbox from "@/src/components/checkbox";
import DetailModalInventory from "../detail-modal";

import { useCalender } from "@/src/(context)/calender-context";

import {
  InventoryCardInterface,
  IsInventoryDetailInterface,
} from "@/src/app/interface/calender-interface/calender-interface";

import styles from "./inventory-cards.module.scss";

const InventoryCards = ({
  name,
  level,
  color,
  videoUrl,
  audioUrl,
  category,
  complexity,
  imageUrl,
  description,
  inventoryId,
  instructions,
  handleAudioPause,
  handlePlayAndPause,
  currentSongPlaying,
}: InventoryCardInterface) => {
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<{ playAudio: boolean; audioUrl: string }>({
    playAudio: false,
    audioUrl: "",
  });
  const [valueNumber, setValueNumber] = useState<number>(0);
  const [isInventoryDetail, setIsInventoryDetail] = useState<IsInventoryDetailInterface>({
    isOpenModal: false,
  });

  const { handleCheckbox, invontriesId } = useCalender();

  const handleCloseModal = () => setIsInventoryDetail((prev) => ({ ...prev, isOpenModal: false }));
  const handleOpenModal = () => setIsInventoryDetail((prev) => ({ ...prev, isOpenModal: true }));

  useEffect(() => {
    const dragPreview = document.createElement("div");
    dragPreview.id = "video_data";

    dragPreview.innerHTML = ` ${
      imageUrl
        ? `<div style="background:${color} !important" class="${styles.dragElementInner}">
          <div class="${styles.divClass}">
            <img src="${imageUrl}" id="dragImage" />
            <div class="${styles.nameClass}">${name}</div>
            <div class="${styles.desClass}">${description}</div>
          </div>
        </div>`
        : `<div style="background:${color} !important" class="${styles.dragElementInner}">
          <div class="${styles.divClass}">
            <div class="${styles.nameClass}">${name}</div>
            <div class="${styles.desClass}">${description}</div>
          </div>
        </div>`
    }
    `;

    dragPreview.classList.add(styles.dragElement);
    dragPreview.style.position = "absolute";
    dragPreview.style.pointerEvents = "none";
    dragPreview.style.visibility = "hidden";

    document.body.appendChild(dragPreview);
    dragPreviewRef.current = dragPreview;

    return () => {
      document?.body?.removeChild(dragPreview);
    };
  }, [imageUrl, name, color, description, category, inventoryId, valueNumber]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragPreview = dragPreviewRef.current;

    if (dragPreview) {
      // Make the drag preview visible during the drag
      dragPreview.style.visibility = "visible";

      e.dataTransfer.setDragImage(dragPreview, 0, 0);
      e.dataTransfer.setData(
        "video_data",
        JSON.stringify({
          name,
          color,
          category,
          description,
          inventoryId,
        }),
      );
    }
  };

  const handleDragEnd = () => {
    setValueNumber((prev) => prev + 1);
  };

  const handleCheckboxChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInventoryDetail((prev) => ({ ...prev, isOpenModal: false }));
    if (invontriesId === inventoryId) {
      handleCheckbox({ inventoryId: "" });
    } else {
      handleCheckbox({ inventoryId });
    }
    setIsInventoryDetail((prev) => ({ ...prev, isOpenModal: false }));
    setIsShow(false);
  };

  const handleIsExpandable = (e?: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShow(!isShow);
  };

  const levelCheck = useMemo(() => {
    return levelOption.find((data) => data?.value === level);
  }, [levelOption]);

  const handlePlayPause = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    handlePlayAndPause({ currentId: inventoryId });
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleAudioEnd = () => {
        handleAudioPause();
      };

      audio.addEventListener("ended", handleAudioEnd);

      return () => {
        audio.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, []);

  const iconName = useMemo(() => {
    if (currentSongPlaying?.currentSongId === inventoryId && currentSongPlaying?.play) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return currentSongPlaying?.currentSongId === inventoryId && currentSongPlaying?.play
      ? "/assets/video-pause-button.png"
      : "/assets/play-button.png";
  }, [currentSongPlaying, inventoryId, audioRef.current]);

  return (
    <>
      <div
        draggable="true"
        onDragEnd={handleDragEnd}
        onClick={handleOpenModal}
        onDragStart={handleDragStart}
        style={{ background: color ? color : "#F8F8F8" }}
        className={`flex  cursor-grab flex-col items-start gap-[10px] self-stretch p-[10px] rounded-[10px] border border-[#B8B8B8] bg-[#F8F8F8] hover:shadow-[0px_0px_6px_rgba(0,0,0,0.25)] my-3 ${styles.inventoryContainer}`}
      >
        {imageUrl && (
          <div className="w-full h-[150px] rounded-md">
            <Image
              data-testid="close-icon"
              src={imageUrl}
              style={{ borderRadius: "5px", objectFit: "cover" }}
              alt="sortUp"
              className="!w-full !h-full"
              height="500"
              width="500"
            />
          </div>
        )}
        <div className="flex md:justify-start justify-between items-center w-full gap-1">
          <div className={styles.dragClass}>
            <Image
              data-testid="close-icon"
              style={{
                cursor: "grab",
              }}
              width="500"
              height="500"
              alt="sortUp"
              draggable={true}
              src={"/assets/drag.svg"}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              className="!w-[16px] !h-[16px]"
            />
          </div>

          <div
            className={`
    text-[14px]
    !font-medium
    !text-[#0F0F0F]
    !cursor-pointer
    ${styles.inventoryText}
    !break-words
  `}
            onClick={handleOpenModal}
          >
            {name}
          </div>

          <div onClick={handleCheckboxChange} className={styles.selectedInventories}>
            <Checkbox
              checkboxValue={inventoryId}
              className={styles.radioOuter}
              checkCustomClass={styles.radio}
              id={`customCheck1-${inventoryId}`}
              handleClick={handleCheckboxChange}
              checked={invontriesId === inventoryId}
            />
          </div>
        </div>
        <div
          onClick={handleIsExpandable}
          className={` ${styles.textHyper} w-full break-all ${isShow ? "" : "line-clamp-3 overflow-hidden"} text-[#0F0F0F] text-[10px] !cursor-pointer
    !break-words
    !hyphens-auto
    `}
        >
          {description}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className={`w-full text-[#0F0F0F] text-[10px] flex justify-start gap-1`}>
            <div>Level :</div>
            <div className="font-medium">{levelCheck?.label ? levelCheck?.label : level}</div>
          </div>
          {audioUrl && (
            <div className="flex justify-end w-full cursor-pointer" onClick={handlePlayPause}>
              <audio ref={audioRef} className={"hidden"} controls>
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
              <div
                onClick={handlePlayPause}
                className="flex px-[10px] text-center cursor-pointer py-[5px] justify-end border border-[black] items-center gap-[10px] rounded-[100px] bg-[#F2F2F2] "
              >
                <Image
                  src={iconName}
                  alt="sortUp"
                  className="!w-[16px] !h-[16px]"
                  height={100}
                  width={100}
                />
                <div className="text-[10px] font-normal">Play Audio</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DetailModalInventory
        level={level}
        videoUrl={videoUrl}
        audioUrl={audioUrl}
        imageUrl={imageUrl}
        category={category}
        complexity={complexity}
        inventoryName={name}
        description={description}
        instructions={instructions}
        handleCloseModal={handleCloseModal}
        isOpenModal={isInventoryDetail?.isOpenModal}
      />
    </>
  );
};

export default InventoryCards;

const levelOption = [
  { label: "K-2", value: "#00c4cc" },
  { label: "3-5", value: "#74C578" },
  { label: "6-8", value: "#F2C057" },
  { label: "9-12", value: "#CB5B3B" },
  { label: "N/A", value: "#F8F8F8" },
];
