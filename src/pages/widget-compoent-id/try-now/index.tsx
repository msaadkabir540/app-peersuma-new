import React, { useState } from "react";

import TryNowModal from "@/src/components/try-now/try-now-modal";

import styles from "./index.module.scss";

const TryNow = ({ widget, isAllow }: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleClickEvent = () => {
    if (isAllow) {
      setOpenModal(true);
    }
  };

  return (
    <div
      className={`${
        widget?.widgetTemplate === "verticalStack" ? styles.mainClass : styles.mainContainer
      }`}
    >
      <div style={{ color: widget?.hyperTextColor }} className={styles.readyClass}>
        Ready to create your own video?
      </div>
      <button
        className={styles.buttonClass}
        onClick={handleClickEvent}
        style={{ color: widget?.hyperTextColor }}
      >
        Get started
      </button>
      {openModal && (
        <TryNowModal
          openModal={openModal}
          widgetName={widget?.name}
          setOpenModal={setOpenModal}
          clientId={widget?.clientId}
          buttonColor={widget?.tryNowButtonColor}
          buttonTextColor={widget?.tryNowButtonTextColor}
        />
      )}
    </div>
  );
};

export default TryNow;
