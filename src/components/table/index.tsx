"use client";

import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import React, { CSSProperties, Fragment, memo, useMemo } from "react";

import Loading from "../loading";
import Tooltip from "../tooltip";

import { TableInterface } from "./table-interface";

import style from "./table.module.scss";

const Table: React.FC<TableInterface> = ({
  rows,
  columns,
  editing,
  actions,
  isLoading,
  rowStyles,
  sortColumn,
  handleSort,
  noDataClass,
  trClassName,
  redirectPath,
  mainTableClass,
  handleRowClick,
  headingClassName,
  customTableClass,
}) => {
  const isMobile = useMediaQuery("(max-width: 770px)");

  const getStatusColor = useMemo(
    () =>
      ({ columnName }: { columnName: string | undefined }) => {
        const statusColors: { [key: string]: string } = {
          "in-review": "!text-yellow-400",
          "in-production": "!text-orange-400",
          closed: "!text-yellow-400 !capitalize",
          cancelled: "!text-rose-500 capitalize",
          "in-post-production": "!text-green-400",
          "on-hold": "!text-yellow-400 !capitalize",
        };

        return statusColors[columnName || ""] || "!text-[#0000]";
      },
    [],
  );

  return (
    <>
      {!isLoading ? (
        <>
          <div className={`${style.TBodyCustom} ${mainTableClass}`}>
            <table className={`${style.tableClass} ${customTableClass}`}>
              <thead>
                <tr>
                  {columns?.map((column, index) => {
                    return (
                      <th key={index}>
                        <div
                          style={{
                            paddingLeft: isMobile ? "6px" : "8px",
                            justifyContent: column?.justifyContent
                              ? column?.justifyContent
                              : "center",
                            width: column?.width,
                          }}
                          className={`${style.headingStyle} ${column?.key === "status" ? style.lastChild : ""}${headingClassName}`}
                          onClick={() => {
                            if (column?.sortKey) {
                              !sortColumn || column?.sortKey !== sortColumn?.sortBy
                                ? handleSort &&
                                  handleSort({ sortBy: column?.sortKey || "", sortOrder: "asc" })
                                : sortColumn.sortOrder === "asc"
                                  ? handleSort &&
                                    handleSort({ sortBy: column.sortKey, sortOrder: "desc" })
                                  : handleSort &&
                                    handleSort({ sortBy: column.sortKey, sortOrder: "asc" });
                            }
                          }}
                        >
                          {column?.title}
                          {column?.sortKey && (
                            <div className={style.imageClass}>
                              {!sortColumn || column?.sortKey !== sortColumn?.sortBy ? (
                                <Tooltip backClass={style.backClassCustom} text="Sort">
                                  <Image
                                    data-testid="close-icon"
                                    style={{
                                      borderRadius: "10px",
                                    }}
                                    src={"/assets/sorting-black.svg"}
                                    alt="sort"
                                    height="100"
                                    width="100"
                                  />
                                </Tooltip>
                              ) : sortColumn?.sortOrder === "asc" ? (
                                <Tooltip backClass={style.backClassCustom} text="Ascending">
                                  <Image
                                    data-testid="close-icon"
                                    src={"/assets/sorting-red.svg"}
                                    alt="sortUp"
                                    height="100"
                                    width="100"
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip backClass={style.backClassCustom} text="Descending">
                                  <Image
                                    data-testid="close-icon"
                                    src={"/assets/sorting-red.svg"}
                                    alt="sortDown"
                                    height="100"
                                    width="100"
                                  />
                                </Tooltip>
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {rows?.length > 0 && (
                <tbody>
                  {rows?.map((row, index) => {
                    return (
                      <Fragment key={index}>
                        <tr
                          key={row?._id}
                          className={`${trClassName}`}
                          style={rowStyles ? rowStyles(row) : {}}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick && handleRowClick(row);
                          }}
                        >
                          {columns?.map((column, index) => {
                            if (column.key === "actions") return actions && actions({ row, index });

                            return (
                              <td
                                style={{ textAlign: "center" } as CSSProperties}
                                key={`${index}-${column?.key}`}
                                className={
                                  column?.key === "status"
                                    ? getStatusColor({ columnName: row?.[column.key] } as {
                                        columnName: string | undefined;
                                      })
                                    : ""
                                }
                              >
                                {column.key === "name" && redirectPath ? (
                                  <Link href={`${redirectPath}/${row?._id}`}>
                                    <div className="">
                                      {column?.render &&
                                        column?.render({
                                          row,
                                          index,
                                          value: row?.[column?.key] || "",
                                          editing,
                                        })}
                                    </div>
                                  </Link>
                                ) : (
                                  column?.render &&
                                  column?.render({
                                    row,
                                    index,
                                    value: row?.[column?.key] || "",
                                    editing,
                                  })
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
          {rows?.length === 0 && (
            <div className={`${style.flex} ${noDataClass}`}>
              <h5
                className={"!align-middle !w-full"}
                style={{ textAlign: "center", width: "100%" }}
              >
                No Data
              </h5>
            </div>
          )}
        </>
      ) : (
        <div className="">
          <Loading pageLoader={true} diffHeight={600} />
        </div>
      )}
    </>
  );
};

export default memo(Table);
