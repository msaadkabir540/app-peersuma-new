"use client";
import React from "react";

import { useLibrary } from "@/src/(context)/library-context-collection";

import style from "../index.module.scss";

const WidgetListCard = ({ widgetName, widgetId }: { widgetName: string; widgetId: string }) => {
  const context = useLibrary();
  const handleSelectedWidget = context && context?.handleSelectedWidget;

  const handleClickEvent = () => handleSelectedWidget?.({ selectedWidgetId: widgetId as string });
  return (
    <div className={style.widgetListContainer} onClick={handleClickEvent}>
      {widgetName}
    </div>
  );
};

export default WidgetListCard;
