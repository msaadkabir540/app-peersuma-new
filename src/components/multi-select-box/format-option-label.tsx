import _ from "lodash";
import React from "react";
import Tags from "../tags";
import { FormatOptionLabelInterface } from "@/src/app/interface/multi-select-interface/multi-select-box-interface";

const formatOptionLabel: React.FC<FormatOptionLabelInterface> = (props) => {
  // const { label, value, color, checkbox, box } = props?.data?.data;
  const { label, value, color, checkbox, box } = props?.data?.data ?? {};
  const { context, selectValue } = props?.data?.metaData || {};
  const badge = props?.data.badge;
  return (
    <>
      {!_.isEmpty(selectValue) && label === "showLine" && value === "showLine" ? (
        <div
          style={{
            display: "block",
            height: "1px",
            border: "0",
            borderTop: "1px solid #ccc",
            margin: "4px 0",
            padding: "",
            cursor: "pointer !important",
          }}
        ></div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: props?.data?.mediaOption ? "12px" : "14px",
            fontWeight: "500",
          }}
        >
          {checkbox && context !== "value" && (
            <input
              checked={selectValue?.find((e: any) => e?.value == value) ?? false}
              type={"checkbox"}
              style={{ marginRight: "5px", cursor: "pointer" }}
              onChange={() => {}}
            />
          )}
          {context !== "value" && box && (
            <div
              style={{
                background: color,
                width: "13px",
                height: "13px",
                borderRadius: "2px",
                margin: "0px 5px",
              }}
            />
          )}
          {badge && context === "value" ? (
            <Tags color={color} text={label} />
          ) : (
            <div
              style={{
                fontWeight: 600,
                ...(context === "value" && {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
              }}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default formatOptionLabel;
