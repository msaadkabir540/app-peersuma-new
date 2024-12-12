import React from "react";

import ImageComponent from "@/src/components/image-component";

import styles from "./index.module.scss";

const PageMainHeader = ({ name }: { name: string }) => {
  return (
    <div className="">
      <div className={`${styles.imageClass} relative rounded-lg`}>
        <ImageComponent
          alt="header image"
          style={{
            objectFit: "cover",
            height: "100%",
            borderRadius: "10px",
          }}
          className={`${styles.headerImage} rounded-lg`}
          src={"/assets/background-image.png"}
        />
        <div
          className={`${styles.textClass} flex justify-center items-center gap-1 text-white text-4xl font-medium `}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default PageMainHeader;
