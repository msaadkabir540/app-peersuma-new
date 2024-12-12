import React from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";

import style from "./index.module.scss";

const ChangeVideo = ({
  inputFile,
  onButtonClick,
  handleDrop,
  videoUrlChange,
  handleDragOver,
  handleCloseModal,
  handleFileUploads,
  handleVideoUrlChange,
  handleSetChangeVideoUrl,
}: {
  inputFile: any;
  onButtonClick: () => void;
  videoUrlChange: string;
  handleCloseModal: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;

  handleFileUploads: (e: any) => void;
  handleVideoUrlChange: () => void;
  handleSetChangeVideoUrl: () => void;
}) => {
  return (
    <div className={style.UpdateVideoClass}>
      <div>
        <div className="text-xl font-semibold text-[#0F0F0F]  mb-1">Replace Video</div>
        <div>
          <div className="flex justify-between items-center mb-[5px] mt-[20px]">
            <div className="text-base font-medium text-[#0F0F0F]">Upload Video</div>
          </div>
          <input
            style={{ display: "none" }}
            // accept=".zip,.rar"
            ref={inputFile}
            onChange={handleFileUploads}
            type="file"
          />
          <div onDrop={handleDrop} onDragOver={handleDragOver} className={style.dropVideoContainer}>
            Drop files here or{" "}
            <span className="text-red-600 cursor-pointer underline" onClick={onButtonClick}>
              browser file
            </span>
          </div>
        </div>

        <div className="text-center my-[15px]">OR</div>
        <div>
          <div className="text-base font-medium text-[#0F0F0F]  mb-[5px]">Video URL</div>
          <div className="relative">
            <div className="absolute z-10 left-[9px] md:mt-[9px] mt-[8px] text-[#A1A1A1] md:text-base text-sm">
              https://vimeo.com/
            </div>
            <Input
              type={"text"}
              required={true}
              value={videoUrlChange}
              name="videoURL"
              onChange={handleVideoUrlChange}
              inputField={`md:!pl-[167px] !pl-[147px] !bg-transparent  ${style.inputCustom}`}
              container="mb-4 relative"
              placeholder="Enter Id"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 mt-[10px] ">
          <Button
            text="Cancel"
            type="button"
            isLoading={false}
            handleClick={handleCloseModal}
            className={`!text-[#ED1C24] !font-semibold !cursor-pointer md:!text-[14px]`}
            btnClass={`!rounded-md ${style.redBorder} !cursor-pointer !bg-transparent `}
          />
          <Button
            text="Confirm"
            type="button"
            isLoading={false}
            handleClick={handleSetChangeVideoUrl}
            disabled={videoUrlChange ? false : true}
            className={`!text-[#fff] !font-semibold !cursor-pointer`}
            btnClass={` !rounded-md !bg-[#ED1C24]  !cursor-pointer sm:!max-w-max !max-w-none`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangeVideo;
