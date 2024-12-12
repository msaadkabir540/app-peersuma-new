import React from "react";
import style from "./tooltip.module.scss";

const Tooltip = ({
  backClass,
  text,
  children,
}: {
  backClass: string;
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={style.hover}>
      {children}
      <div className={`${style.tooltip} ${backClass}`}>
        <div className={style.text}>{text}</div>
      </div>
    </div>
  );
};

export default Tooltip;
