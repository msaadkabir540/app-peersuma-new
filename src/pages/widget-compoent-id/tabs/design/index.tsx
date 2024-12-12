import React, { memo } from "react";
import { UseFormRegister } from "react-hook-form";

import Radio from "@/src/components/radio";
import Switch from "@/src/components/switch";

import { FormSchemaWidget } from "@/src/interface/widget-interface";

import styles from "./index.module.scss";

interface DesignInterface {
  control: any;
  register: UseFormRegister<FormSchemaWidget>;
  nameWatch: any;
}

const Design: React.FC<DesignInterface> = ({ control, register, nameWatch }) => {
  return (
    <>
      <div className="flex flex-col gap-10 mb-[40px]">
        {widgetTemplate.map(({ id, name, description }) => (
          <div key={id}>
            <Radio
              label={name}
              radioValue={id}
              name={"widgetTemplate"}
              register={register}
              customLableClass={styles.radioLabelClass}
              className={styles.radioClassName}
            />
            <p className={styles.description}>{description}</p>
          </div>
        ))}
      </div>
      <hr className={styles.borderLine} />
      <div className="flex flex-col mt-[20px] mb-[20px] gap-[25px]">
        {customizations?.map(({ name, title }, index) => (
          <div key={index} className={styles.customizations}>
            <label className={styles.lables} htmlFor={name}>
              {title}
            </label>
            <Switch
              id={name}
              name={name}
              control={control as any}
              silderClass={styles.silderClass}
              switchContainer={styles.switchContainer}
              defaultValue={nameWatch ? true : false}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(Design);

const widgetTemplate = [
  {
    id: "carousel",
    name: "Carousel",
    description: "This style looks great in the center of a web page",
  },
  {
    id: "slideshow",
    name: "SlideShow",
    description: "Select this style if you are displaying a single video",
  },
  {
    id: "thumbnailGrid",
    name: "Thumbnail Grid",
    description:
      "Select this style if you are displaying all videos in large thumbnail without paginating or carrousel effect",
  },
  {
    id: "verticalStack",
    name: "Vertical Stack",
    description: "This style looks best when aligned along the right side of the web page",
  },
];

const customizations = [
  { title: "Show title", name: "showTitle" },
  { title: "Show description", name: "showDescription" },
  { title: "Show get started", name: "showGetStarted" },
  { title: "Enable social share", name: "enableShare" },
];
