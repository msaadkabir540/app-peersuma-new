import Image from "next/image";
import React from "react";

import style from "../index.module.scss";
import Button from "@/src/components/button";

const DeleteModal = ({
  handleCloseEvent,
  isDeleting,
  handleEventDeleteVideo,
}: {
  isDeleting: boolean;
  handleCloseEvent: () => void;
  handleEventDeleteVideo: (e: any) => void;
}) => {
  return (
    <div className={style.deleteModal}>
      <Image
        data-testid="close-icon"
        style={{
          borderRadius: "10px",
          textAlign: "center",
          margin: "auto",
        }}
        className="!w-[60px] !h-[60px]"
        src={"/assets/delete-red.svg"}
        alt="sortUp"
        height="100"
        width="100"
      />
      <div className={style.deleteHeading}>Are you sure you want to delete this video?</div>
      <div className={style.text}>You will not be able to recover that video.</div>

      <div className="flex justify-end items-center gap-3 mt-5">
        <Button
          type="button"
          text="Cancel"
          className={`!text-[#ED1C24] !font-semibold`}
          btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
          handleClick={handleCloseEvent}
        />
        <Button
          type="button"
          text="Confirm"
          isLoading={isDeleting}
          className={`!text-[#fff] !font-semibold`}
          btnClass={` !rounded-md !bg-[#ED1C24]  ${style.maxWidth}   `}
          handleClick={handleEventDeleteVideo}
        />
      </div>
    </div>
  );
};

export default DeleteModal;
