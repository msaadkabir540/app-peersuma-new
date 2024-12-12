import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { writeText } from "clipboard-polyfill";

import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import Radio from "@/src/components/radio";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Textarea from "@/src/components/textarea";
import createNotification from "@/src/components/create-notification";

import { getWidgetViewById } from "@/src/app/api/widget";

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

const EmbedCode = ({
  selectedWidget,
  embedCodeModal,
  handleEventEmbedModalClose,
}: {
  selectedWidget: string;
  embedCodeModal: boolean;
  handleEventEmbedModalClose: () => void;
}) => {
  const [widget, setWidget] = useState<string>("thumbnailGrid");
  const [loading, setLoading] = useState<boolean>(false);
  const { setValue, register, watch } = useForm<FromSchema>({
    defaultValues: {
      size: "799",
      width: "799",
      type: "responsive",
    },
  });
  const heights: any = {
    thumbnailGrid: "1280px",
    carousel: "870px",
    slideshow: "670px",
    verticalStack: "650px",
  };

  const widgetHeight = heights?.[widget as any];

  const handleCopyEvent = () => {
    writeText(
      iframe({
        id: selectedWidget,
        watchType: watch("type"),
        watchWidth: watch("width"),
        height: widgetHeight,
      }),
    );
    createNotification({
      type: "success",
      message: "Success!",
      description: "Embed code copied to clipboard.",
    });
  };

  const handleSetSize = ({ value }: { value: string }) => {
    setValue("width", value);
  };

  const getWidgetByID = async ({ videoViewId }: { videoViewId: string }) => {
    setLoading(true);
    try {
      const res = await getWidgetViewById({ _id: videoViewId });

      if (res?.status === 200) {
        setWidget(res?.data?.widgetTemplate);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    selectedWidget && getWidgetByID({ videoViewId: selectedWidget });
  }, [selectedWidget]);

  return (
    <Modal
      open={embedCodeModal}
      className={style.modalCustomWrapper}
      handleClose={handleEventEmbedModalClose}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[427px]">
          <Loader />
        </div>
      ) : (
        <div>
          <div>
            <div className="text-xl font-semibold text-[#0F0F0F] ">Embed Code</div>
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
                height: widgetHeight,
                id: selectedWidget,
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
      )}
    </Modal>
  );
};

export default EmbedCode;

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
    ? `<iframe id='W4_4' allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${process.env.NEXT_PUBLIC_APP_URL}embed/${id}' style='width:100%; height:${height};  max-width: ${watchWidth}px' allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer="">
window.addEventListener('message', function(e) {
    var this_frame = document.getElementById('W4_4');
    if (this_frame.contentWindow === e.source) {
        this_frame.style.height = e.data.height + 'px';
    }
});
</script>`
    : `<iframe id='W4_4'  style="height:${height}" allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${process.env.NEXT_PUBLIC_APP_URL}embed/${id}' width='100%'  allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
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
