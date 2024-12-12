import Image from "next/image";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";

import { updateShortLink } from "@/src/app/api/library-api";

import style from "./index.module.scss";
import Tooltip from "@/src/components/tooltip";

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
          } else {
            setErrorMessage("Taken, try a different custom URL");
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
    <div>
      <div className="text-[#0F0F0F] text-[16px] font-medium leading-normal">
        Share link for email, social posts
      </div>

      <div className="relative">
        <div className={`${style.shortUrlScssOuter}`}>
          <div className={`${style.shortUrlScss}`}>
            <div className="md:z-10 md:left-[10px] md:top-[52%] md:text-[16px] text-[12px] text-[#A1A1A1] ">
              {`${process.env.NEXT_PUBLIC_APP_URL}video/`}
            </div>
            <div>
              <Input
                type={"text"}
                name="shortLink"
                container="relative"
                register={register}
                placeholder="Enter scene link"
                inputField={`${style.inputShotUrl}`}
                disabled={mediaId === "" ? false : !isEdit}
              />
            </div>
          </div>

          {mediaId && (
            <>
              {!isEdit ? (
                <div className="flex gap-[10px]">
                  <Tooltip backClass="" text="Edit">
                    <Image
                      data-testid="close-icon"
                      style={{
                        cursor: "pointer",
                      }}
                      className="md:!w-[29px] !w-[24px] !h-[24px]"
                      src={"/assets/pen-black.svg"}
                      alt="sortUp"
                      height="500"
                      width="500"
                      onClick={handleEditEvents}
                    />
                  </Tooltip>
                  {mediaId && (
                    <Tooltip backClass="" text="Copy">
                      <Image
                        data-testid="close-icon"
                        className="!w-[25px] !h-[25px] !cursor-pointer "
                        src={"/assets/copy.svg"}
                        alt="sortUp"
                        style={{
                          cursor: "pointer !important",
                        }}
                        height="500"
                        width="500"
                        onClick={copyLink}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center  ">
                  <Tooltip backClass="" text="Cancle">
                    <Image
                      data-testid="close-icon"
                      style={{
                        cursor: "pointer",
                      }}
                      className="!w-[24px] !h-[24px]"
                      src={"/assets/cross-black.svg"}
                      alt="sortUp"
                      height="500"
                      width="500"
                      onClick={handleClose}
                    />
                  </Tooltip>
                  {isUpdating ? (
                    <div>
                      <Loader pageLoader={false} loaderClass="!w-[24px] !h-[24px]" />
                    </div>
                  ) : (
                    <Tooltip backClass="" text="Save">
                      <Image
                        data-testid="close-icon"
                        style={{
                          cursor: "pointer",
                        }}
                        className="!w-[24px] !h-[24px]"
                        src={"/assets/tick-black.svg"}
                        alt="sortUp"
                        height="500"
                        width="500"
                        onClick={handleUpdate}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {errorMessage && <span className={`${style.errorMessageUrl}`}>{errorMessage}</span>}
      </div>
    </div>
  );
};

export default ShortUrl;
