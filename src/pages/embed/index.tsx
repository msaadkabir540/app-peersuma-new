"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Loader from "@/src/components/loader";
import CarouselTemplate from "../widget-compoent-id/widget-templates/carousel-widget";
import SlideShowTemplate from "../widget-compoent-id/widget-templates/slide-show-widget";
import VerticalStackTemplate from "../widget-compoent-id/widget-templates/vertical-stack-widget";
import ThumbnailGridTemplate from "../widget-compoent-id/widget-templates/thumbnail-grid-widget";

import { getWidgetById } from "@/src/app/api/widget";

import {
  AssetsInterface,
  ShowcaseDataInterface,
  widgetTemplateInterface,
} from "@/src/interface/embed-interface";
import { MediaFileInterface } from "@/src/interface/showcase-interface";
import { SlideShowTemplateInterface } from "@/src/interface/slide-show-interface";
import { VerticalStackTemplateInterface } from "@/src/interface/vertical-stack-interface";
import { ThumbnailGridTemplateInterface } from "@/src/interface/thumbnail-grid-interface";
import { widgetInterface } from "@/src/interface/carousel-interface";

import styles from "./index.module.scss";
import { default as verticalStack } from "./verticalt-stack.module.scss";
import { default as carouselTemplate } from "./carousel-template.module.scss";
import { default as verticalStackEmbedWidget } from "./vertical-stack-embed-widget.module.scss";

const EmbedComponent = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [showCase, setShoWCase] = useState<ShowcaseDataInterface>({
    data: {} as AssetsInterface,
    loading: true,
  });

  const notifyParent = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ height }, "*");
  };

  useEffect(() => {
    notifyParent();
  });

  useEffect(() => {
    window.addEventListener("resize", notifyParent);
    document.body.style.removeProperty("background");
    return () => {
      window.removeEventListener("resize", notifyParent);
    };
  });

  useEffect(() => {
    if (pathname?.includes("/embed")) {
      const styleElement = document.createElement("style");
      styleElement.textContent = `body { background: none !important;}`;

      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [pathname]);

  const assets = showCase?.data?.media?.map(({ _id }) => _id) as AssetsInterface[];

  useEffect(() => {
    id && handleGetWidgetById();
    const body = document?.getElementById("body");
    if (body) {
      body.style.backgroundColor = "transparent";
    }
  }, [id]);

  const handleGetWidgetById = async () => {
    try {
      const res = await getWidgetById({ _id: id as string });
      if (res?.status === 200) {
        const now = new Date();
        const fromDate = new Date(now?.getFullYear(), 0, 1)?.getTime();
        const toDate = new Date(now?.getFullYear(), 11, 31, 23, 59, 59, 999)?.getTime();

        const filteredData =
          res.data?.media?.filter(({ _id }: { _id: MediaFileInterface }) => {
            const updatedAtTime = new Date(_id?.updatedAt)?.getTime();
            return updatedAtTime >= fromDate && updatedAtTime <= toDate;
          }) ?? [];

        const finalData = { ...res.data, media: filteredData };

        setShoWCase((prev) => ({ ...prev, data: finalData }));
      }
      setShoWCase((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      console.error(error);
    }
  };
  const widgetData = { ...showCase?.data, subscribers: 107 };

  const widgetTemplate: widgetTemplateInterface = {
    carousel: (
      <CarouselTemplate
        {...({
          assets,
          isAllowGetStartedModal: true,
          customStyle: carouselTemplate,
          widget: widgetData as widgetInterface,
        } as any)}
      />
    ),
    slideshow: (
      <SlideShowTemplate
        {...({
          assets,
          isAllowGetStartedModal: true,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
        } as SlideShowTemplateInterface)}
      />
    ),
    thumbnailGrid: (
      <ThumbnailGridTemplate
        {...({
          assets,
          isAllowGetStartedModal: true,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
          height: styles.thumbnailGridHeight,
        } as ThumbnailGridTemplateInterface)}
      />
    ),
    verticalStack: (
      <VerticalStackTemplate
        {...({
          assets,
          isAllowGetStartedModal: true,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
          customStyle: verticalStack as React.CSSProperties,
          customEmbedStyle: verticalStackEmbedWidget as React.CSSProperties,
        } as VerticalStackTemplateInterface)}
      />
    ),
  };

  return (
    <>
      {showCase?.loading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <Loader pageLoader={false} />
        </div>
      ) : (
        <div>
          {widgetTemplate[showCase?.data?.widgetTemplate as keyof widgetTemplateInterface] ||
            widgetTemplate["verticalStack"]}
        </div>
      )}
    </>
  );
};

export default EmbedComponent;
