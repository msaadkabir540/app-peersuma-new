import React from "react";

import styles from "./index.module.scss";

interface TabsInterface {
  title: string;
  handleClick: (args: { tab?: TabsInterface; index?: number }) => void;
}
interface TabComponentInterface {
  active: number;
  tabs: TabsInterface[];
}

const Tabs: React.FC<TabComponentInterface> = ({ tabs, active }) => {
  return (
    <div className={styles.tabContainer}>
      {tabs?.map((tab: TabsInterface, index: number) => {
        const { title, handleClick } = tab;
        return (
          <div
            key={index}
            className={`${styles.tab} ${active === index && styles.tabActive}`}
            onClick={() => {
              handleClick && handleClick({ tab, index });
            }}
          >
            <span>{title || ""}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
