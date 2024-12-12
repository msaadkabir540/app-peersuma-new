import React from "react";
import Image from "next/image";

import styles from "./index.module.scss";

const Main = () => {
  return (
    <div className={styles.logo}>
      <Image
        data-testid="close-icon"
        style={{
          borderRadius: "10px",
        }}
        src={"/assets/peersuma-logo.png"}
        alt="sortUp"
        height="100"
        width="100"
      />
    </div>
  );
};

export default Main;
