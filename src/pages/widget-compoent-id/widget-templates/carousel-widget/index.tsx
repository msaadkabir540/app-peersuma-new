import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TryNow from "../../try-now";
import Loader from "@/src/components/loader";
import ViewAll from "@/src/components/view-all";
import EmbedWidgetThumb from "../components/embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import {
  CarouselTemplateInterface,
  CustomStyle,
  ReactPlayerRefInterface,
} from "../../../../interface/carousel-interface";
import { EmbedWidgetInterface } from "../../../../interface/embed-widget-thumb-interface";

import { default as defaultStyle } from "./carousel.module.scss";

const CarouselTemplate: React.FC<CarouselTemplateInterface> = ({
  assets,
  widget,
  customStyle,
  isAllowGetStartedModal,
}) => {
  const sliderRef = useRef<ReactPlayerRefInterface | null>(null);
  const style = (customStyle || defaultStyle) as CustomStyle;

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
  }, [widget, style.shareBox]);

  return (
    <>
      <div
        className={style.main}
        style={{ backgroundColor: widget?.backgroundColor }}
        aria-label={` Title": ${selected?.name}`}
      >
        <div className={style.widgetContainer} aria-label={"Video Player"}>
          {selected?.videoUrl && (
            <>
              {selected?.isVideoLoading ? (
                <div className={`flex  justify-center items-center ${style.embedResponsiveItem}`}>
                  <Loader pageLoader={false} />
                </div>
              ) : (
                <iframe
                  src={
                    selected?.widgetUrl
                      ? `${selected?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`
                      : `https://player.vimeo.com/video/${selected.videoUrl?.split("/")?.pop()}`
                  }
                  className={style.embedResponsiveItem}
                  frameBorder="0"
                  title="videoFrame"
                  width="100%"
                  height="100%"
                  aria-label="video player"
                ></iframe>
              )}
            </>
          )}
        </div>
        {widget?.showTitle && (
          <div className="flex justify-between items-center mt-[10px]">
            <div
              style={{ color: widget?.titleColor || widget?.textColor }}
              className={style.name}
              aria-label={"Title"}
            >
              {selected?.name}
            </div>
            <TemplateShareSubscribe widget={widget as any} />
          </div>
        )}
        {widget?.showDescription && (
          <div
            className={`${selected?.showHide ? style.showDescription : style.description}`}
            style={{ color: widget?.textColor }}
            aria-label={"description"}
            onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
          >
            {selected.description ? selected.description : ""}
          </div>
        )}

        {shareButton && (
          <div className={style.shareBox}>
            <div className={style.shareViewClass}>
              <ViewAll widget={widget as any} />
            </div>
          </div>
        )}
        {/* / */}
        <div className={style.sliderWrapper}>
          <div
            aria-hidden="true"
            className={style.btnLeft}
            style={{
              backgroundColor: widget?.buttonColor ? widget?.buttonColor : widget?.buttonTextColor,
            }}
            aria-label={"Shift Left Side Button"}
            onClick={() => sliderRef?.current?.slickPrev?.()}
          >
            <p style={{ color: widget?.textColor ? widget?.textColor : "#000000" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.2183 0.807333C7.55744 1.14647 7.55744 1.69633 7.2183 2.03547L2.62184 6.63193L7.2183 11.2284C7.55744 11.5675 7.55744 12.1174 7.2183 12.4565C6.87916 12.7957 6.32931 12.7957 5.99017 12.4565L0.779643 7.24599C0.440503 6.90685 0.440503 6.357 0.779643 6.01786L5.99017 0.807333C6.32931 0.468194 6.87916 0.468194 7.2183 0.807333Z"
                  fill={widget?.leafColor ? widget?.leafColor : widget?.buttonTextColor}
                />
              </svg>
            </p>
          </div>
          <div className={style.SliderMain}>
            <Slider {...(settings(assets as any) as any)} ref={sliderRef}>
              {/* <Slider {...settings} ref={sliderRef}> */}
              {assets?.map((item: any) => {
                return (
                  <div key={item?._id}>
                    <div>
                      <EmbedWidgetThumb
                        item={item}
                        handleSelect={handleSelect}
                        thumbnailTitleColor={widget?.thumbnailTitleColor}
                        selected={selected?._id === item?._id ? true : false}
                      />
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div
            aria-hidden="true"
            className={style.btnRight}
            style={{
              backgroundColor: widget?.buttonColor ? widget?.buttonColor : widget?.buttonTextColor,
            }}
            aria-label={"Shift Right Side Button"}
            onClick={() => {
              sliderRef?.current?.slickNext?.();
            }}
          >
            <p style={{ color: widget?.textColor ? widget?.textColor : "#000000" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.430136 0.807333C0.0909964 1.14647 0.0909964 1.69633 0.430136 2.03547L5.0266 6.63193L0.430136 11.2284C0.0909964 11.5675 0.0909964 12.1174 0.430136 12.4565C0.769275 12.7957 1.31913 12.7957 1.65827 12.4565L6.86879 7.24599C7.20793 6.90685 7.20793 6.357 6.86879 6.01786L1.65827 0.807333C1.31913 0.468194 0.769275 0.468194 0.430136 0.807333Z"
                  fill={widget?.leafColor ? widget?.leafColor : widget?.buttonTextColor}
                />
              </svg>
            </p>
          </div>
        </div>
        {widget?.showGetStarted && (
          <div className="md:mt-[30px] mt-[20px]">
            <TryNow widget={widget} isAllow={isAllowGetStartedModal} />
          </div>
        )}
      </div>
    </>
  );
};

export default CarouselTemplate;

const settings = (assets = []) => {
  return {
    centerPadding: "60px",
    centerMode: true,
    slidesToShow: assets.length > 3 ? 3 : 2,
    slidesToScroll: 4,
    dots: true,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 300,
    infinite: assets.length > 1 ? true : false,
    speed: 300,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: assets.length > 3 ? 3 : assets.length,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: assets.length > 3 ? 3 : assets.length,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: assets.length > 2 ? 2 : assets.length,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },

      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
};
