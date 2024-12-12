import React from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";

import style from "./index.module.scss";

const ChangeVideo = ({
  handleCloseModal,
  videoURLWatch,
  register,
  handleFileUpload,
}: {
  register: any;
  videoURLWatch: string;
  handleCloseModal: () => void;
  handleFileUpload: () => void;
}) => {
  return (
    <div className={style.UpdateVideoClass}>
      <div>
        <div>
          <div className="flex justify-between items-center mb-[5px]">
            <div className="text-base font-medium text-[#0F0F0F]  mb-1">Upload Video </div>
          </div>
          <div className={style.dropVideoContainer} onClick={handleFileUpload}>
            Click here to add into this widget
          </div>
        </div>

        <div className="text-center my-[10px]">OR</div>
        <div>
          <div className="text-base font-medium text-[#0F0F0F]  mb-[5px]">Video URL</div>
          <div className="relative">
            <div className="absolute z-10 left-[9px] md:mt-[9px] mt-[8px] text-[#A1A1A1] md:text-base text-sm">
              https://vimeo.com/
            </div>
            <Input
              type={"text"}
              required={true}
              name="videoURL"
              register={register}
              inputField={`md:!pl-[167px] !pl-[147px]  ${style.inputCustom}`}
              container="mb-4 relative"
              placeholder="Enter Id"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-end items-center gap-3 mt-[10px]">
            <Button
              text="Confirm"
              type="button"
              isLoading={false}
              handleClick={handleCloseModal}
              disabled={videoURLWatch ? false : true}
              className={`!text-[#fff] !font-semibold`}
              btnClass={` !rounded-md !bg-[#ED1C24]  !max-w-[none] `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeVideo;
