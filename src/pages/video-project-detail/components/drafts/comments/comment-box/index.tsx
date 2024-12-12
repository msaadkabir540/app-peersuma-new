"use client";

import React from "react";
import styles from "../index.module.scss";

const CommentBox = ({
  name,
  time,
  comment,
  color,
}: {
  name: string;
  time: string;
  comment: string;
  color: string;
}) => {
  return (
    <div className={`w-full`}>
      <div className="flex flex-col md:gap-3 gap-1">
        <div className="flex items-center md:justify-start md:gap-[10px] gap-1">
          <div
            className={`md:w-[40px] w-[27px] rounded-full md:h-[40px] h-[25px] md:text-sm flex justify-center items-center ${color} ${styles.character} `}
          >
            {name?.charAt(0)}
          </div>
          <div className="flex justify-between items-center  gap-[10px] md:w-auto w-full">
            <div className={`md:text-lg md:font-semibold ${styles.userName} `}>{name}</div>
            <div className={`md:hidden block text-sm font-normal ${styles.time} `}>{time}</div>
          </div>
        </div>
        <div className={`md:block hidden  text-sm font-normal ${styles.time} `}>{time}</div>
        <div className={`text-sm font-normal ml-1 ${styles.commentsText}`}>{comment}</div>
      </div>
    </div>
  );
};

export default CommentBox;
