import React from "react";

import { ViewAllInterface } from "./view-all-interface";

import style from "./index.module.scss";

const ViewAll = ({ widget }: ViewAllInterface) => {
  return (
    <div
      style={{
        color: widget?.buttonColor ? widget?.buttonColor : "white",
        borderColor: widget?.buttonColor ? widget?.buttonColor : "black",
      }}
      className={style.viewAllClass}
      onClick={() => {
        window.open(`${process.env.NEXT_PUBLIC_APP_URL}showcase/${widget?._id}`, "_blank");
      }}
    >
      View All
    </div>
  );
};

export default ViewAll;
