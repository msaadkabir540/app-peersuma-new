import React from "react";

import Button from "@/src/components/button";

import styles from "./index.module.scss";

function MediaDraftTab({
  activeList,
  handleMediaList,
  handleDraftsList,
  isContributor,
}: {
  activeList: string;
  isContributor?: boolean | undefined;
  handleDraftsList: () => void;
  handleMediaList: () => void;
}) {
  return (
    <div className="flex md:gap-5 gap-3 ">
      <div
        className={`text-xl   ${activeList === "media" ? "" : ""}`}
        style={{ cursor: "pointer" }}
      >
        <Button
          text={"Media"}
          btnClass={styles.btnMedias}
          className={`${styles.btnClassName} ${activeList === "media" ? styles.activeBTnClass : ""}`}
          handleClick={() => handleMediaList()}
        />
      </div>
    </div>
  );
}

export default MediaDraftTab;
