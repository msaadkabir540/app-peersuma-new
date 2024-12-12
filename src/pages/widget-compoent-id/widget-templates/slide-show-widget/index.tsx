import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect, useRef, useMemo } from "react";

import TryNow from "../../try-now";
import Loader from "@/src/components/loader";
import ViewAll from "@/src/components/view-all";
import TemplateShareSubscribe from "../components/template-share-subscribe";
import VimeoPlayer from "@/src/pages/library-component/update-library/vimeo-player";

import {
  ReactPlayerRefInterface,
  SlideShowTemplateInterface,
} from "../../../../interface/slide-show-interface";

import style from "./slideshow.module.scss";

const SlideShowTemplate: React.FC<SlideShowTemplateInterface> = ({
  assets,
  widget,
  isAllowGetStartedModal,
}) => {
  const showHideRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<ReactPlayerRefInterface | null>(null);

  const [selected, setSelected] = useState<{
    _id: string;
    name: string;
    videoUrl: string;
    assetId?: string;
    showHide?: boolean;
    widgetUrl?: string;
    videoLink?: string;
    description: string;
    isVideoLoading?: boolean;
  }>({
    _id: "",
    name: "",
    assetId: "",
    widgetUrl: "",
    videoUrl: "",
    videoLink: "",
    description: "",
    showHide: false,
    isVideoLoading: false,
  });

  useEffect(() => {
    if (assets && assets.length) {
      setSelected({
        ...assets[0],
      });
    }
  }, [assets]);

  const handleAfterChange = (index: number) => {
    setSelected({
      ...assets[index],
    });
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
      <div className={style.main} style={{ backgroundColor: widget?.backgroundColor }}>
        <div className={style.slidShowVideoContainer}>
          <div className={style.sliderWrapper}>
            <div
              aria-hidden="true"
              className={style.btnLeft}
              style={{
                backgroundColor: widget?.buttonColor
                  ? widget?.buttonColor
                  : widget?.buttonTextColor || "#ffffff",
              }}
              aria-label="Slide Left Side Button"
              onClick={() => sliderRef?.current?.slickPrev()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <circle cx="20" cy="20" r="20" fill={widget?.textColor} />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.7489 14.2511C24.0837 14.5858 24.0837 15.1285 23.7489 15.4632L19.2122 20L23.7489 24.5368C24.0837 24.8715 24.0837 25.4142 23.7489 25.7489C23.4142 26.0837 22.8715 26.0837 22.5368 25.7489L17.3939 20.6061C17.0592 20.2714 17.0592 19.7286 17.3939 19.3939L22.5368 14.2511C22.8715 13.9163 23.4142 13.9163 23.7489 14.2511Z"
                  fill={widget?.backgroundColor}
                />
              </svg>
            </div>
            {
              <div className={style.SliderMain}>
                {selected?.isVideoLoading ? (
                  <div className={`flex justify-center items-center ${style.sliderMainClass}`}>
                    <Loader pageLoader={false} />
                  </div>
                ) : (
                  <Slider
                    {...settings(assets as any)}
                    ref={sliderRef as any}
                    afterChange={handleAfterChange}
                  >
                    {assets?.map(({ videoUrl }, index) => {
                      return (
                        videoUrl && (
                          <VimeoPlayer
                            isAllow={false}
                            customeMainClass={`embed-responsive-item rounded-xl ${style.sliderMainClass}`}
                            url={`${
                              selected?.widgetUrl
                                ? `${selected?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp ;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`
                                : `https://player.vimeo.com/video/${videoUrl?.split("/")?.pop()}`
                            } `}
                          />
                        )
                      );
                    })}
                  </Slider>
                )}
              </div>
            }
            <div
              aria-hidden="true"
              className={style.btnRight}
              style={{
                backgroundColor: widget?.buttonColor
                  ? widget?.buttonColor
                  : widget?.buttonTextColor || "#ffffff",
              }}
              aria-label="Slide Right Button"
              onClick={() => sliderRef?.current?.slickNext()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  transform="matrix(-1 0 0 1 40 0)"
                  fill={widget?.textColor}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.2511 14.2511C16.9163 14.5858 16.9163 15.1285 17.2511 15.4632L21.7878 20L17.2511 24.5368C16.9163 24.8715 16.9163 25.4142 17.2511 25.7489C17.5858 26.0837 18.1285 26.0837 18.4632 25.7489L23.6061 20.6061C23.9408 20.2714 23.9408 19.7286 23.6061 19.3939L18.4632 14.2511C18.1285 13.9163 17.5858 13.9163 17.2511 14.2511Z"
                  fill={widget?.backgroundColor}
                />
              </svg>
            </div>
          </div>

          {widget?.showTitle && (
            <div className="flex justify-between items-center mt-[10px]">
              <div
                style={{ color: widget?.titleColor }}
                className={style.title}
                aria-label={`Title": ${selected?.name}`}
              >
                {selected?.name}
              </div>
              <div className={style.shareBox}>
                <div className={style.shareViewClass}>
                  {shareButton && <TemplateShareSubscribe allow={false} widget={widget as any} />}
                </div>
              </div>
            </div>
          )}
          {widget?.showDescription && (
            <div
              ref={showHideRef}
              aria-label={"description"}
              style={{ color: widget?.textColor }}
              onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
              className={`${selected?.showHide ? style?.showDescription : style.description}`}
            >
              {selected?.description ? selected?.description : ""}
            </div>
          )}

          <div className={style.shareContainer}>
            <div className={style.viewContainer}>
              <ViewAll widget={widget as any} />
            </div>
          </div>
          {widget?.showGetStarted && (
            <div>
              <TryNow widget={widget} isAllow={isAllowGetStartedModal} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideShowTemplate;

const settings = (assets = []) => {
  return {
    centerPadding: "100px",
    slidesToShow: 1,
    arrows: false,
    infinite: assets.length > 1 ? true : false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
};
