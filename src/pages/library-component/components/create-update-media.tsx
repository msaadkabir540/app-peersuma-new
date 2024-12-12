"use client";
import React from "react";
import { useRouter } from "next/navigation";

import Input from "@/src/components/input";
import Button from "@/src/components/button";
import UpdateLibrary from "../update-library";

import { useLibrary } from "@/src/(context)/library-context-collection";

import style from "./index.module.scss";

const CreateUpdateMedia = ({ handleClickEvent }: { handleClickEvent: () => void }) => {
  const route = useRouter();
  const libraryContext = useLibrary();
  const watch = libraryContext?.watch;
  const register = libraryContext && libraryContext?.register;
  const createUpdateMedia = libraryContext && libraryContext?.createUpdateMedia;
  const handleCloseCreateUpdate = libraryContext && libraryContext?.handleCloseCreateUpdate;

  const handleUpdateMedia = () => {
    route.push(`/update-library/?videoUrl=${watch?.("videoURL")}`);
  };

  return (
    <>
      <div>
        <div className="text-xl font-semibold text-[#0F0F0F] mb-[10px]">
          {createUpdateMedia?.mediaId ? "Edit Video" : "Add Video to library"}
        </div>

        {createUpdateMedia?.isCreate ? (
          <div>
            <div>
              <div className={`text-base font-font-medium text-[#0F0F0F] mb-1 ${style.labelModal}`}>
                Upload Video
              </div>
              <div className={style.dropVideoContainer} onClick={handleClickEvent}>
                Click here to add into this widget
              </div>
            </div>

            <div className="text-center my-4">OR</div>
            <div>
              <div className={`text-base font-font-medium text-[#0F0F0F] mb-1 ${style.labelModal}`}>
                Video URL
              </div>
              <div className="relative">
                <div className="absolute z-10 left-[11px] md:mt-[9px] mt-[11px] text-[#A1A1A1] md:text-base text-sm">
                  https://vimeo.com/
                </div>
                <Input
                  type={"text"}
                  required={true}
                  name="videoURL"
                  register={register}
                  placeholder="Enter Id"
                  container="mb-4 relative"
                  inputField={`md:!pl-[167px] !pl-[147px]  ${style.inputCustom}`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-end items-center gap-3 mt-5">
                <Button
                  type="button"
                  text="Cancel"
                  handleClick={handleCloseCreateUpdate}
                  className={`!text-[#ED1C24] !font-semibold`}
                  btnClass={`!rounded-md ${style.redBorder} !bg-transparent`}
                />
                <Button
                  text="Next"
                  type="button"
                  isLoading={false}
                  handleClick={handleUpdateMedia}
                  disabled={watch?.("videoURL") ? false : true}
                  className={`!text-[#fff] !font-semibold`}
                  btnClass={` !rounded-md ${watch?.("videoURL") ? "!bg-[#ED1C24]" : "!bg-[#c3c2c2]"}  !min-w-[80px] `}
                />
              </div>
            </div>
          </div>
        ) : (
          <UpdateLibrary />
        )}
      </div>
    </>
  );
};

export default CreateUpdateMedia;
