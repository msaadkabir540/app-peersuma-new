"use client";

import React, { useCallback, useEffect, useState } from "react";

import Loader from "@/src/components/loader";

import { handleViemoVideo } from "@/src/helper/helper";

import { getLibraryWidgetById } from "@/src/app/api/library-api";

import styles from "./index.module.scss";

const PublishSingleVideo = ({ id }: { id: string }) => {
  const [widgetData, setWidgetData] = useState<any>({});
  const [selected, setSelected] = useState({
    showHide: false,
    isLoading: true,
  });

  const getLibraryWidget = useCallback(async () => {
    setSelected((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await getLibraryWidgetById({ params: { id: id, shortLink: "" } });
      if (res.status === 200) {
        setWidgetData({ ...res.data });
      }
    } catch (error) {
      console.error(error);
    }
    setSelected((prev) => ({ ...prev, isLoading: false }));
  }, [id]);

  useEffect(() => {
    id && getLibraryWidget();
  }, [id, getLibraryWidget]);

  const handleShowHide = () => {
    setSelected((prev) => ({ ...prev, showHide: !prev.showHide }));
  };

  useEffect(() => {
    const notifyParent = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ height }, "*");
    };

    notifyParent();

    window.addEventListener("resize", notifyParent);

    document.body.style.removeProperty("background");

    return () => {
      window.removeEventListener("resize", notifyParent);
    };
  }, []);

  return (
    <>
      {selected?.isLoading ? (
        <div className={`flex justify-center items-center  h-[100vh]`}>
          <Loader pageLoader={false} />
        </div>
      ) : (
        <div
          className={styles.main}
          style={{ backgroundColor: widgetData?.backgroundColor ?? "#000000" }}
        >
          <>
            <div className={styles.widgetContainer} aria-label="video player vimeo">
              {widgetData?.videoUrl && (
                <iframe
                  src={`${widgetData?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className={`embed-responsive-item  ${styles.height}`}
                  title="New Digital Media Class at Amity Middle School Orange"
                  width="100%"
                  height="100%"
                  aria-label="video player vimeo"
                ></iframe>
              )}
            </div>

            <div className="mt-[10px]" style={{ color: widgetData?.textColor ?? "#ffffff" }}>
              <div className={styles.title}>{widgetData?.name}</div>
              <div
                onClick={handleShowHide}
                aria-label={"description"}
                className={`${selected?.showHide ? styles?.showDescription : styles.description}`}
              >
                {widgetData?.description ? widgetData?.description : ""}
              </div>
              {widgetData?.reference && (
                <div className={styles.referenceClass}> Resource: {widgetData?.reference}</div>
              )}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default PublishSingleVideo;
