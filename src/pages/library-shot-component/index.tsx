"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { handleViemoVideo } from "@/src/helper/helper";

import ShareDropDown from "@/src/components/share-dropdown";

import { getLibraryWidgetById } from "@/src/app/api/library-api";

import styles from "./index.module.scss";

const LibraryShotComponent = ({ shotId }: { shotId: string }) => {
  const [widgetData, setWidgetData] = useState<any>({});

  const getLibraryWidget = useCallback(async () => {
    try {
      const res = await getLibraryWidgetById({ params: { id: "", shortLink: shotId } });
      if (res.status === 200) {
        setWidgetData({ ...res.data });
      }
    } catch (error) {
      console.error(error);
    }
  }, [shotId]);

  useEffect(() => {
    shotId && getLibraryWidget();
  }, [shotId, getLibraryWidget]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {widgetData?.videoUrl && (
            <iframe
              src={`${widgetData?.widgetUrl}&amp;title=0&amp;amp;byline=0&amp;amp;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`}
              width="400"
              height="500"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="New Digital Media Class at Amity Middle School Orange"
              data-ready="true"
              style={{ width: "100%", height: "500px" }}
            ></iframe>
          )}
        </div>

        <div className={styles.textContainer}>
          <div className={styles.name}>{widgetData?.name}</div>
          <div className={styles.description}>{widgetData?.description}</div>
          {widgetData?.reference && (
            <div className={styles.referenceClass}> Resource: {widgetData?.reference}</div>
          )}
          {widgetData?.shareable && (
            <div className={styles.btnContainer}>
              <ShareDropDown
                classNameModalProps={styles.menuClassNameModalProps}
                video_name={widgetData?.name}
                video_url={widgetData?.videoUrl}
                isButton={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LibraryShotComponent;
