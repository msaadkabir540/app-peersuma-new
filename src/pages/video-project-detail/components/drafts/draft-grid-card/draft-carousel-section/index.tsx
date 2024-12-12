import React from "react";
import Slider from "react-slick";
import { useState, useEffect, useRef, useMemo } from "react";

import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import DraftSubCard from "./draft-sub-card";
import Button from "@/src/components/button";
import Loader from "@/src/components/loader";
import Loading from "@/src/components/loading";
import Tooltip from "@/src/components/tooltip";

import style from "./index.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DraftCarouselSection: React.FC<any> = ({
  assets,
  widget,
  handleChangeVideoName,
  videoDraftId,
  handleDownload,
}) => {
  const sliderRef = useRef<Slider | null>(null);

  const [selected, setSelected] = useState<{
    _id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
  }>({
    _id: "",
    url: "",
    name: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    if (assets && assets?.length) {
      setSelected({ ...assets[0] } as any);
    }
  }, []);

  const handleSelect = ({ item }: { item: any }) => {
    setSelected({ ...item } as any);
  };

  //
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isClipOpen, setIsClipOpen] = useState<{ isOpen: boolean; videoUrl: string }>({
    isOpen: false,
    videoUrl: "",
  });
  const [isVideoRename, setIsVideoRename] = useState<boolean>(false);
  const [isRename, setIsRename] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleChangeName = async ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    videoDraftId: string;
    mediaId: string;
  }) => {
    if (value.trim().length === 0) {
      setError("Enter the Comment");
    } else {
      setIsRename(true);
      await handleChangeVideoName({ value, videoDraftId, mediaId });
      setIsRename(false);
      setIsVideoRename(false);
      setSelected((prev) => ({ ...prev, name: value }));
    }
  };

  const handleUpdateName = () => {
    setIsVideoRename(true);
    setValue(selected?.name);
  };

  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    await handleDownload({ videoId: selected?._id, videoDraftId });
    setIsDownloading(false);
  };
  return (
    <>
      <div className={style.main} aria-label={` Title": ${selected?.name}`} id="draft-video-main">
        <div className={style.widgetContainer} aria-label={"Video Player"}>
          <div className="flex items-center justify-between md:mb-3 mb-1 w-full md:gap-8 gap-2">
            <div className={`${style.mobileText} md:text-xl font-medium`}> {selected?.name}</div>
            <div className=" ">
              <div className="flex items-center justify-end gap-1">
                <Tooltip backClass="" text="Edit">
                  <Button
                    iconStart={"/assets/pen-black.svg"}
                    btnClass={`!bg-transparent !p-0`}
                    imgClass={style.iconClass}
                    type="button"
                    handleClick={handleUpdateName}
                  />
                </Tooltip>
                {isDownloading ? (
                  <Loader pageLoader={false} loaderClass={`${style.loaderClass}`} />
                ) : (
                  // <Loading loaderClass={`${style.loaderClass}`} />
                  <Tooltip backClass="" text="Download">
                    <Button
                      iconStart={"/assets/arrow-right-w.svg"}
                      btnClass={`!bg-transparent !p-0`}
                      imgClass={style.iconClass2}
                      type="button"
                      isLoading={isDownloading}
                      handleClick={handleDownloadVideo}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          <video
            key={selected?.url}
            controls
            className="md:!h-[427px] !h:[200px] w-full bg-black rounded-xl"
          >
            <source src={selected?.url} type="video/mp4" />
            <track kind="captions" src={selected?.url} />
          </video>
        </div>

        {/* / */}
        <div className={style.sliderWrapper}>
          <div className={style.SliderMain}>
            <div className="text-[#0F0F0F] text-[18px] font-medium leading-normal my-3">
              Previous Drafts
            </div>
            <div
              aria-hidden="true"
              className={style.btnLeft}
              style={{
                backgroundColor: "white",
              }}
              aria-label={"Shift Left Side Button"}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                sliderRef?.current?.slickPrev?.();
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
                    d="M7.2183 0.807333C7.55744 1.14647 7.55744 1.69633 7.2183 2.03547L2.62184 6.63193L7.2183 11.2284C7.55744 11.5675 7.55744 12.1174 7.2183 12.4565C6.87916 12.7957 6.32931 12.7957 5.99017 12.4565L0.779643 7.24599C0.440503 6.90685 0.440503 6.357 0.779643 6.01786L5.99017 0.807333C6.32931 0.468194 6.87916 0.468194 7.2183 0.807333Z"
                    fill="#000"
                  />
                </svg>
              </p>
            </div>

            <Slider {...(settings(assets as any) as any)} ref={sliderRef}>
              {assets?.map((item: any) => {
                return (
                  <div key={item?._id}>
                    <div>
                      <DraftSubCard
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
            <div
              aria-hidden="true"
              className={style.btnRight}
              style={{
                backgroundColor: "white",
              }}
              aria-label={"Shift Right Side Button"}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
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
                    fill="#000"
                  />
                </svg>
              </p>
            </div>
          </div>

          <div className={style.mobileClass}>
            <div className="text-[#0F0F0F] text-[18px] font-medium leading-normal my-3">
              Previous Drafts
            </div>

            {assets?.map((item: any) => {
              return (
                <div key={item?._id}>
                  <div>
                    <DraftSubCard
                      item={item}
                      handleSelect={handleSelect}
                      thumbnailTitleColor={widget?.thumbnailTitleColor}
                      selected={selected?._id === item?._id ? true : false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isVideoRename && (
        <Modal
          showCross={true}
          className={style.modalContentWrapper}
          {...{
            open: isVideoRename,
            handleClose: () => setIsVideoRename(false),
          }}
        >
          <div>
            <div className="md:text-2xl text-xl font-semibold mb-3">Rename Draft</div>
          </div>

          <div className="">
            <div className="">
              <Input
                name={"videoDraftName"}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                required={true}
                inputField={style.input}
                errorMessage={error}
                type="text"
              />
            </div>

            <div className="mt-2 flex gap-2 justify-end">
              <Button
                text="Cancel"
                btnClass={style.btnClass}
                className={style.btnCreateClassText}
                handleClick={() => setIsVideoRename(false)}
              />
              <Button
                isLoading={isRename}
                text={isRename ? <Loading loaderClass={`${style.loaderSaveClass}`} /> : "Save"}
                className={"!w-12"}
                handleClick={() =>
                  handleChangeName({
                    value,
                    videoDraftId,
                    mediaId: selected?._id,
                  })
                }
              />
            </div>
          </div>
        </Modal>
      )}

      <>
        <Modal
          {...{
            open: isClipOpen?.isOpen,
            handleClose: () =>
              setIsClipOpen((prev: any) => ({
                ...prev,
                isOpen: false,
                videoUrl: "",
              })),
          }}
          className={style.classModal}
        >
          {isClipOpen ? (
            <video className={style.videoPlayer} controls>
              <source src={isClipOpen?.videoUrl} type="video/mp4" />
              <track kind="captions" src={isClipOpen?.videoUrl} />
            </video>
          ) : (
            ""
          )}
        </Modal>
      </>
    </>
  );
};

export default DraftCarouselSection;

const settings = (assets = []) => {
  return {
    centerPadding: "60px",
    centerMode: true,
    slidesToShow: assets.length > 3 ? 3 : 3,
    slidesToScroll: 4,
    dots: false,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 300,
    infinite: assets.length > 1 ? true : false,
    speed: 300,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: assets.length > 4 ? 4 : assets.length,
          slidesToScroll: 4,
          initialSlide: 4,
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
          slidesToShow: assets.length > 3 ? 3 : assets.length,
          slidesToScroll: 3,
          initialSlide: 3,
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
