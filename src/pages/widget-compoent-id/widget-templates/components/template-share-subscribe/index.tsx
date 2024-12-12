import React from "react";

import ShareDropDown from "../share-dropdown";

import style from "./index.module.scss";

interface showWidget {
  name: string;
  buttonColor?: string;
  buttonTextColor?: string;
  shareColor?: string;
  textColor?: string;
  enableShare?: boolean;
}

interface TemplateShareSubscribeInterface {
  classNameModalProps?: string;
  widget: showWidget;
  videoUrl?: string;
  allow?: boolean;
}

const TemplateShareSubscribe: React.FC<TemplateShareSubscribeInterface> = ({
  allow,
  widget,
  videoUrl,
  classNameModalProps,
}) => {
  return (
    <div className={style.container}>
      <div className={style.containerInner}>
        {widget?.enableShare && (
          <ShareDropDown
            allow={allow}
            buttonColor={""}
            video_name={widget?.name}
            shareColor={widget?.shareColor}
            video_url={videoUrl || window?.location?.href}
            buttonTextColor={widget?.textColor}
            classNameModalProps={classNameModalProps}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateShareSubscribe;
