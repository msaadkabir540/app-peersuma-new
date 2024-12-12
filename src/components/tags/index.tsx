import { memo } from "react";

import { TagsPropsInterface } from "./tags-interface";

import style from "./tags.module.scss";

const Tags: React.FC<TagsPropsInterface> = ({ color, text }) => {
  return (
    <div
      className={style.main}
      style={{
        backgroundColor: color,
      }}
    >
      <div
        className={style.text}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text && text?.length > 15 ? <p className={style.selectBoxEllipses}>{text}</p> : text}
      </div>
    </div>
  );
};
export default memo(Tags);
