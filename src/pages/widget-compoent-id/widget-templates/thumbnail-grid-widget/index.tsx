import React, { useState, useEffect, useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TryNow from "../../try-now";
import Loader from "@/src/components/loader";
import ViewAll from "@/src/components/view-all";
import EmbedWidgetThumb from "../components/embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import { handleViemoVideo } from "@/src/helper/helper";

import { ThumbnailGridTemplateInterface } from "../../../../interface/thumbnail-grid-interface";
import { EmbedWidgetInterface } from "../../../../interface/embed-widget-thumb-interface";

import style from "./thumbnail-grid.module.scss";

const ThumbnailGridTemplate: React.FC<ThumbnailGridTemplateInterface> = ({
  assets,
  widget,
  height,
  isAllowGetStartedModal,
}) => {
  const [selected, setSelected] = useState({
    _id: "",
    name: "",
    assetId: "",
    videoUrl: "",
    videoLink: "",
    widgetUrl: "",
    description: "",
    showHide: false,
    isVideoLoading: false,
  });

  useEffect(() => {
    if (assets && assets?.length) {
      setSelected({
        ...(assets[0] as any),
      });
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
    <div className={style.main} style={{ backgroundColor: widget?.backgroundColor }}>
      <div className={style.widgetContainer} aria-label="video player vimeo">
        {selected?.videoUrl && (
          <>
            {selected?.isVideoLoading ? (
              <div
                className={`flex  justify-center items-center ${height ? height : style.height}`}
              >
                <Loader pageLoader={false} />
              </div>
            ) : (
              <iframe
                className={`embed-responsive-item  ${height ? height : style.height}`}
                src={`${selected?.widgetUrl ? `${selected?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp ;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0` : `https://player.vimeo.com/video/${selected?.videoUrl?.split("/")?.pop()}`} `}
                title="videoFrame"
                width="100%"
                height="100%"
                aria-label="video player vimeo"
              ></iframe>
            )}
          </>
        )}
      </div>
      <div className="mt-[10px]">
        {widget?.showTitle && (
          <div className="flex justify-between items-center my-3">
            <div style={{ color: widget?.titleColor }} className={style.title} aria-label={"Title"}>
              {selected?.name}
            </div>
            {shareButton && <TemplateShareSubscribe widget={widget as any} />}
          </div>
        )}
        {widget?.showDescription && (
          <div
            className={`${selected?.showHide ? style?.showDescription : style.description}`}
            style={{ color: widget?.textColor }}
            aria-label={"description"}
            onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
          >
            {selected?.description ? selected?.description : ""}
          </div>
        )}
      </div>
      <div className={style.grid}>
        {assets?.map((item, index) => (
          <EmbedWidgetThumb
            key={index}
            item={item}
            handleSelect={handleSelect}
            thumbnailTitleColor={widget?.thumbnailTitleColor}
            selected={selected?._id === item?._id ? true : false}
          />
        ))}
      </div>
      <div className={style.shareBox}>
        <div className={style.shareViewClass}>
          <ViewAll widget={widget as any} />
        </div>
      </div>
      {widget?.showGetStarted && (
        <div className={style.tryNowDiv}>
          <TryNow widget={widget} isAllow={isAllowGetStartedModal} />
        </div>
      )}
    </div>
  );
};

export default ThumbnailGridTemplate;
