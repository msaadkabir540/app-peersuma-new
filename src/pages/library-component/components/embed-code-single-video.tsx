import Link from "next/link";
import Image from "next/image";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { writeText } from "clipboard-polyfill";

import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import Radio from "@/src/components/radio";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import Textarea from "@/src/components/textarea";
import createNotification from "@/src/components/create-notification";

import style from "./index.module.scss";

interface FromSchema {
  size: string;
  width: string;
  type: string;
  active: number;
  search: string;
  description: string;
  selectedWidgetId: string;
}

const EmbedCodeSingleVideo = ({
  videoAssetId,
  embedCodeModal,
  handleEventEmbedModalClose,
}: {
  videoAssetId: string;
  embedCodeModal: boolean;
  handleEventEmbedModalClose: () => void;
}) => {
  const { setValue, register, watch } = useForm<FromSchema>({
    defaultValues: {
      size: "799",
      width: "799",
      type: "responsive",
    },
  });

  const handleCopyEvent = () => {
    writeText(
      iframe({
        id: videoAssetId,
        watchType: watch("type"),
        watchWidth: watch("width"),
        height: "820px",
      }),
    );
    createNotification({
      type: "success",
      message: "Success!",
      description: "Embed code copied to clipboard.",
    });
    handleEventEmbedModalClose();
  };

  const handleSetSize = ({ value }: { value: string }) => {
    setValue("width", value);
  };

  return (
    <Modal
      open={embedCodeModal}
      className={style.modalCustomWrapper}
      handleClose={handleEventEmbedModalClose}
    >
      <div>
        <div>
          <div className="flex justify-between">
            <div className="text-xl font-semibold text-[#0F0F0F] ">Embed Code-Single Video</div>

            <Tooltip backClass="!py-[2px] !px-[12px]" text={"Single Video Preview"}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}single-video/${videoAssetId}`}
                target={"_blank"}
              >
                <div className={style.widgetLinkDiv} onClick={handleEventEmbedModalClose}>
                  <Image
                    data-testid="close-icon"
                    className="!w-[24px] !h-[24px]"
                    src={"/assets/eye.svg"}
                    alt="sortUp"
                    height="500"
                    width="500"
                  />
                </div>
              </Link>
            </Tooltip>
          </div>
          <div className="flex justify-start items-center gap-2 md:mt-5 md:mb-4">
            <Radio
              name="type"
              label="Responsive"
              register={register}
              radioValue="responsive"
              className={style.radio}
            />
            <Radio
              name="type"
              label="Fixed"
              radioValue="fixed"
              register={register}
              className={style.radio}
            />
          </div>
          {watch("type") === "fixed" && (
            <>
              <div className="flex justify-start items-center gap-3 flex-wrap">
                {sizeOptions?.map((size) => {
                  return (
                    <Fragment key={size?.value}>
                      <SizeComponent
                        name={size?.label}
                        width={watch("width")}
                        size={size?.value}
                        handleSetSize={handleSetSize}
                      />
                    </Fragment>
                  );
                })}
              </div>
              <div className="flex justify-start items-center my-4">
                <div className="flex justify-start items-center relative w-full">
                  <div className="w-28 text-[#0F0F0F] text-base font-medium"> Max Width:</div>
                  <Input name="width" type="number" inputField="!w-full" register={register} />
                </div>
                <div className="absolute right-7">px</div>
              </div>
            </>
          )}
          <Textarea
            rows={10}
            isDisabled={true}
            name="description"
            register={register}
            placeholder={iframe({
              height: "820px",
              id: videoAssetId,
              watchType: watch("type"),
              watchWidth: watch("width"),
            })}
          />
        </div>
        <div className={style.modalBtnContainer}>
          <Button
            type="button"
            text="Copy Code"
            handleClick={handleCopyEvent}
            imgClass="!w-[16px] !h-[20px]"
            iconStart="/assets/code-white.svg"
            btnClass={` !rounded-md !bg-[#ED1C24]  !mt-[15px] !w-full !max-w-[none] `}
            className={`!text-[#fff] !text-[14px] !font-semibold `}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EmbedCodeSingleVideo;

const SizeComponent = ({
  name,
  size,
  width,
  handleSetSize,
}: {
  name: string;
  size: string;
  width: string;
  handleSetSize: ({ value }: { value: string }) => void;
}) => {
  const handleClickEvent = () => handleSetSize?.({ value: size });

  return (
    <div
      className={`${width === size ? style.activeTab : style.sizeContainer}`}
      onClick={handleClickEvent}
    >
      {name}
    </div>
  );
};

const iframe = ({
  id,
  height,
  watchWidth,
  watchType,
}: {
  id: string;
  height: string;
  watchType: string;
  watchWidth: any;
}) =>
  watchType === "fixed"
    ? `<iframe id='W4_4' allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${process.env.NEXT_PUBLIC_APP_URL}single-video/${id}' style='width:100%; height:${height};  max-width: ${watchWidth}px' allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer="">
window.addEventListener('message', function(e) {
    var this_frame = document.getElementById('W4_4');
    if (this_frame.contentWindow === e.source) {
        this_frame.style.height = e.data.height + 'px';
    }
});
</script>`
    : `<iframe id='W4_4'  style="height:${height}" allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${process.env.NEXT_PUBLIC_APP_URL}single-video/${id}' width='100%'  allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer="">
window.addEventListener('message', function(e) {
    var this_frame = document.getElementById('W4_4');
    if (this_frame.contentWindow === e.source) {
        this_frame.style.height = e.data.height + 'px';
    }
});
</script>`;

const sizeOptions = [
  { label: "Extra Small", value: "480" },
  { label: "Small", value: "635" },
  { label: "Medium", value: "799" },
  { label: "Large", value: "960" },
];
