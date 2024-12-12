import React, { useState, useEffect, useMemo, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TryNow from "../../try-now";
import Loader from "@/src/components/loader";
import ViewAll from "@/src/components/view-all";
import EmbedWidgetThumb from "./embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import { EmbedWidgetInterface } from "../../../../interface/embed-widget-interface";
import { VerticalStackTemplateInterface } from "@/src/interface/vertical-stack-interface";

import { default as defaultStyle } from "./vertical-stack.module.scss";

const VerticalStackTemplate: React.FC<VerticalStackTemplateInterface> = ({
  assets,
  widget,
  customStyle,
  customEmbedStyle,
  isAllowGetStartedModal,
}) => {
  const style = customStyle || defaultStyle;
  const showHideRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<{
    _id: string;
    name: string;
    videoUrl: string;
    assetId?: string;
    showHide?: boolean;
    videoLink?: string;
    description: string;
    widgetUrl: string;
    isVideoLoading?: boolean;
  }>({
    _id: "",
    name: "",
    assetId: "",
    videoUrl: "",
    widgetUrl: "",
    videoLink: "",
    description: "",
    showHide: false,
    isVideoLoading: false,
  });

  useEffect(() => {
    if (assets && assets?.length) {
      setSelected({ ...assets[0] } as any);
    }
  }, [assets]);

  const handleSelect = ({ item }: { item: EmbedWidgetInterface }) => {
    setSelected({ ...item } as any);
  };

  const shareButton = useMemo(() => {
    return (
      widget?.enableShare ||
      widget?.show_statistic ||
      widget?.showSubscribers ||
      widget?.enableSubscribe
    );
  }, [widget]);

  return (
    <>
      <div
        className={style.main}
        style={{
          backgroundColor: widget?.backgroundColor ? widget?.backgroundColor : "transparent",
        }}
      >
        <div className={style.mainContainer}>
          <div className={style.rightPane}>
            <div
              className={
                widget?.showDescription ? style.widgetContainer : style.widgetContainerNoDescription
              }
            >
              {selected?.videoUrl && (
                <>
                  {selected?.isVideoLoading ? (
                    <div className={`flex justify-center items-center ${style.widgetContainer} `}>
                      <Loader pageLoader={false} />
                    </div>
                  ) : (
                    <iframe
                      src={`${selected?.widgetUrl ? `${selected?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp ;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0` : `https://player.vimeo.com/video/${selected?.videoUrl?.split("/")?.pop()}`} `}
                      className={`embed-responsive-item ${style.iframStyle}`}
                      frameBorder="0"
                      title="videoFrame"
                      width="100%"
                      height="100%"
                      aria-label=" Video Player Vimeo"
                    ></iframe>
                  )}
                </>
              )}
            </div>
            <div
              className={`flex ${widget?.showTitle ? "justify-between" : "justify-end"} items-center`}
            >
              {widget?.showTitle && (
                <div>
                  <div
                    style={{ color: widget?.titleColor ? widget?.titleColor : "#000000" }}
                    className={style.name}
                    aria-label={"Title"}
                  >
                    {selected?.name}
                  </div>
                </div>
              )}
              <div className={style.shareBox}>
                {shareButton && (
                  <div className={style.shareViewClass}>
                    <TemplateShareSubscribe widget={widget as any} />
                  </div>
                )}
              </div>
            </div>
            {widget?.showDescription && (
              <div
                onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
                className={`${selected?.showHide ? style?.showDescription : style.description}`}
                style={{ color: widget?.textColor ? widget?.textColor : "white" }}
                aria-label={"description"}
                ref={showHideRef}
              >
                {selected?.description ? selected?.description : ""}
              </div>
            )}
          </div>

          <div className={style.leftDiv}>
            <div
              className={`${style.grid} ${widget?.showDescription ? style.maxHeightDescription : style.maxHeightDescriptionHidden}`}
            >
              {assets?.map((item: any, index: number) => (
                <EmbedWidgetThumb
                  key={index}
                  item={item}
                  handleSelect={handleSelect}
                  thumbnailTitleColor={widget?.thumbnailTitleColor}
                  customEmbedWidgetThumb={customEmbedStyle as any}
                  selected={selected?._id === item?._id ? true : false}
                />
              ))}
            </div>

            <ViewAll widget={widget as any} />
          </div>
        </div>
        {widget?.showGetStarted && (
          <div className="my-5 flex justify-center items-center">
            <TryNow widget={widget as any} isAllow={isAllowGetStartedModal} />
          </div>
        )}
      </div>
    </>
  );
};

export default VerticalStackTemplate;
