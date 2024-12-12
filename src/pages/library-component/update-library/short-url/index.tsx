import Image from "next/image";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";

import { updateShortLink } from "@/src/app/api/library-api";

import style from "./index.module.scss";

// import { LibraryFormInterface } from "@/src/app/interface/library-interface/library-interface";

const ShortUrl = ({
  isEdit,
  mediaId,
  copyLink,
  register,
  shortLinkWatch,
  handleEditEvent,
  handleEditEventClose,
  handleEditEventCloseEvent,
}: {
  mediaId: string;
  isEdit: boolean;
  copyLink: () => void;
  handleEditEvent: () => void;
  register: UseFormRegister<any>;
  handleEditEventClose: () => void;
  handleEditEventCloseEvent: () => void;
  shortLinkWatch: string | undefined;
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEditShotURL = async ({ shortUrl }: { shortUrl: string }) => {
    if (shortUrl?.trim()?.length === 0) {
      setErrorMessage("shortUrl is required");
    } else {
      setErrorMessage("");
      try {
        setIsUpdating(true);
        if (mediaId) {
          const data = {
            shortLink: shortUrl as string,
          };

          const res = await updateShortLink({ id: mediaId, data });

          if (res.status === 200) {
            setIsUpdating(false);
            handleEditEventCloseEvent?.();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    setIsUpdating(false);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setErrorMessage("");
    handleEditEventClose();
  };

  const handleEditEvents = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setErrorMessage("");
    handleEditEvent();
  };
  const handleUpdate = () => {
    handleEditShotURL({ shortUrl: shortLinkWatch as string });
  };

  return (
    <div className="relative my-3">
      <div className=" flex justify-between items-center text-[#0F0F0F] text-base font-normal">
        Short URL
        {mediaId && (
          <div>
            {!isEdit ? (
              <Image
                data-testid="close-icon"
                style={{
                  cursor: "pointer",
                }}
                className="!w-[24px] !h-[24px]"
                src={"/assets/pen-gray.svg"}
                alt="sortUp"
                height="100"
                width="100"
                onClick={handleEditEvents}
              />
            ) : (
              <div className="flex justify-between items-center">
                <Image
                  data-testid="close-icon"
                  style={{
                    cursor: "pointer",
                  }}
                  className="!w-[24px] !h-[24px]"
                  src={"/assets/cross-black.svg"}
                  alt="sortUp"
                  height="100"
                  width="100"
                  onClick={handleClose}
                />
                {isUpdating ? (
                  <Loader pageLoader={false} loaderClass="!w-[24px] !h-[24px]" />
                ) : (
                  <Image
                    data-testid="close-icon"
                    style={{
                      cursor: "pointer",
                    }}
                    className="!w-[24px] !h-[24px]"
                    src={"/assets/tick-black.svg"}
                    alt="sortUp"
                    height="100"
                    width="100"
                    onClick={handleUpdate}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={` md:mb-3 mt-1  ${style.shortUrlScssOuter}`}>
        <div className={`${style.shortUrlScss}`}>
          <div className="md:z-10 md:left-[10px] md:top-[52%] md:text-[16px] text-[14px] text-[#A1A1A1] ">
            {`${process.env.NEXT_PUBLIC_APP_URL}video/`}
          </div>
          <div>
            <Input
              type={"text"}
              name="shortLink"
              container="relative"
              register={register}
              errorMessage={errorMessage}
              placeholder="Enter scene link"
              inputField={`${style.inputShotUrl}`}
              disabled={mediaId === "" ? false : !isEdit}
            />
          </div>
        </div>
        <Image
          data-testid="close-icon"
          style={{
            cursor: "pointer",
          }}
          className="!w-[18px] !h-[18px]"
          src={"/assets/copy.png"}
          alt="sortUp"
          height="100"
          width="100"
          onClick={copyLink}
        />
      </div>
    </div>
  );
};

export default ShortUrl;
