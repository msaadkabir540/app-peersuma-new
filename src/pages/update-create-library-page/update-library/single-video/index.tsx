import React from "react";
import Link from "next/link";
import Image from "next/image";
import { writeText } from "clipboard-polyfill";
import { UseFormRegister } from "react-hook-form";

import Input from "@/src/components/input";
import Tooltip from "@/src/components/tooltip";
import Textarea from "@/src/components/textarea";
import createNotification from "@/src/components/create-notification";

import style from "./index.module.scss";

const SingleVideo = ({
  register,
  mediaId,
}: {
  mediaId: string;
  register: UseFormRegister<any>;
}) => {
  const handleCopyEvent = () => {
    writeText(
      iframe({
        id: mediaId,
      }),
    );
    createNotification({
      type: "success",
      message: "Success!",
      description: "Embed code copied to clipboard.",
    });
  };
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="relative w-full">
        <div className="absolute flex justify-end items-center gap-[10px] right-0 z-10 xl:top-0 top-5  !cursor-pointer">
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}single-video/${mediaId}`}
            target={"_blank"}
          >
            <Tooltip backClass="" text="Preview">
              <Image
                data-testid="close-icon"
                className="!w-[24px] !h-[24px] "
                src={"/assets/eye.svg"}
                alt="sortUp"
                style={{
                  cursor: "pointer !important",
                }}
                height="500"
                width="500"
              />
            </Tooltip>
          </Link>
          <Tooltip backClass="" text="Copy">
            <Image
              data-testid="close-icon"
              className="!w-[24px] !h-[24px] "
              src={"/assets/copy.svg"}
              alt="sortUp"
              style={{
                cursor: "pointer !important",
              }}
              height="500"
              width="500"
              onClick={handleCopyEvent}
            />
          </Tooltip>
        </div>
        <div className="relative">
          <Textarea
            rows={10}
            label="Embedded Code to display video in a web page"
            isDisabled={true}
            name="embeddedCode"
            register={register}
            placeholder={iframe({
              id: mediaId,
            })}
            customLabelClass={style.labelClass}
          />
        </div>
      </div>

      {colorFields?.map(({ title, name }) => (
        <div className="flex justify-between  ">
          <label className="md:!text-[16px] !text-[14px] font-medium py-1" htmlFor={name}>
            {title}
          </label>
          <Input
            id={name}
            name={name}
            type={"color"}
            register={register}
            container={"!w-[36px]"}
            inputField={"!p-0.5 text-sm rounded border border-[#d5d5d5] bg-transparent"}
          />
        </div>
      ))}
    </div>
  );
};

export default SingleVideo;

const colorFields = [
  {
    title: "Background Color",
    name: "backgroundColor",
  },
  {
    title: "Text Color",
    name: "textColor",
  },
];

const iframe = ({ id }: { id: string }) =>
  `<iframe id='W4_4'  style="height:820px" allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${process.env.NEXT_PUBLIC_APP_URL}single-video/${id}' width='100%'  allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer="">
window.addEventListener('message', function(e) {
    var this_frame = document.getElementById('W4_4');
    if (this_frame.contentWindow === e.source) {
        this_frame.style.height = e.data.height + 'px';
    }
});
</script>`;
