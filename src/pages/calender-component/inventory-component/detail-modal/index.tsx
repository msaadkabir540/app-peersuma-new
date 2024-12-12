import React from "react";
import Image from "next/image";

import Modal from "@/src/components/modal";

import { DetailModalInterface } from "@/src/app/interface/calender-interface/calender-interface";

import style from "./index.module.scss";

const DetailModalInventory = ({
  level,
  videoUrl,
  audioUrl,
  imageUrl,
  category,
  description,
  isOpenModal,
  complexity,
  instructions,
  inventoryName,
  handleCloseModal,
}: DetailModalInterface) => {
  const inventoryData = [
    {
      label: "Description",
      value: description,
    },
    {
      label: "Instructions",
      value: instructions,
    },

    {
      label: "Category",
      value: category,
    },
    {
      label: "Complexity",
      value: complexity,
    },
    {
      label: "Level",
      value: level,
    },
  ];

  return (
    <div>
      <Modal
        modalWrapper={style.scrollbar}
        open={isOpenModal}
        handleClose={handleCloseModal}
        showCross
        iconClassName="!w-[12px] !h-[12px]"
        showIconClass="!w-[12px] !h-[12px] left-[6px]"
        className={`md:!max-w-[700px] !max-w-[100vw] !hyphens-auto !break-words !break-all`}
      >
        <div>
          <div
            className={`!cursor-pointer !hyphens-auto !break-words !break-all font-semibold text-[20px] leading-normal text-[#0F0F0F] ${style.dashClass}`}
          >
            {inventoryName}
          </div>
          {inventoryData?.map((data) => (
            <div className="mt-4">
              <div
                className={`font-semibold text-[14px] text-[#0F0F0F] !hyphens-auto !break-words !break-all ${style.dashClass}`}
              >
                {data?.label}
              </div>
              <div
                className={`font-normal text-[14px] text-[#0F0F0F] mt-3 break-all ${style.dashClass}`}
              >
                {data?.value ? data?.value : "-"}
              </div>
            </div>
          ))}
          {imageUrl && !videoUrl && (
            <div className="mt-4">
              <div className=" font-semibold text-[14px] text-[#0F0F0F]">Thumbnail</div>
              <div className="font-normal text-[14px] text-[#0F0F0F] mt-3 w-full !max-w-[670px] !h-full">
                <Image
                  alt="imageUrl"
                  src={imageUrl}
                  width={500}
                  height={500}
                  className="h-[230px] object-cover w-full rounded-md"
                />
              </div>
            </div>
          )}
          {videoUrl && (
            <div className="mt-4">
              <div className=" font-semibold text-[14px] text-[#0F0F0F]">Sample video</div>
              <div className="font-normal text-[14px] text-[#0F0F0F] mt-3 w-full !max-w-[670px] !h-full ">
                <video controls className="!h-[230px] w-full bg-black rounded-xl">
                  <source src={videoUrl} type="video/mp4" />
                  <track kind="captions" src={videoUrl} />
                </video>
              </div>
            </div>
          )}
          {audioUrl && (
            <div className="mt-4">
              <div className=" font-semibold text-[14px] text-[#0F0F0F]">Audio</div>
              <div className="font-normal text-[14px] text-[#0F0F0F] mt-3 w-full !max-w-[670px] !h-full ">
                <audio className="w-full" controls>
                  <source src={audioUrl} type="audio/mpeg" />
                  <track kind="captions" src={audioUrl} />
                </audio>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DetailModalInventory;
