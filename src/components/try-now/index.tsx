import React, { useState } from "react";

import TryNowModal from "./try-now-modal";

import styles from "./index.module.scss";

const TryNow = ({ clientId, widgetName }: { clientId: string; widgetName: string }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className={`${styles.mainContainer} mt-3`}>
      <div className={styles.readyClass}>Ready to create your own video?</div>
      <button className={styles.buttonClass} onClick={() => setOpenModal(true)}>
        Get started
      </button>
      {openModal && (
        <TryNowModal
          clientId={clientId}
          openModal={openModal}
          widgetName={widgetName}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default TryNow;
