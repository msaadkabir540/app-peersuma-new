import React, { memo } from "react";
import Image from "next/image";

import Tooltip from "../tooltip";
import Selection from "../selection";

import { selectOptions } from "./helper";

import { PaginationInterface } from "./pagination-interface";

import styles from "./pagination.module.scss";

const CustomPagination: React.FC<PaginationInterface> = ({
  page = 1,
  control,
  setValue,
  totalCount,
  perPageText,
  pageSize = 30,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const handleLeft = () => setValue("page", page === 1 ? 1 : page - 1);
  const handleRight = () =>
    setValue(
      "page",
      page === Math.ceil(totalCount / pageSize) ? Math.ceil(totalCount / pageSize) : page + 1,
    );

  const handleEvent = () => setValue("page", page - 1);
  const handleEventAddOne = () => setValue("page", page + 1);
  const handleEventAddTwo = () => setValue("page", page + 2);
  const handleEventAddThree = () => setValue("page", page + 3);
  const handleEventAddFour = () => setValue("page", page + 4);

  return (
    <div className={styles.position}>
      <div className={styles.pagination}>
        <div className={styles.leftFlex}>
          <p style={{ marginLeft: "0px", marginRight: "10px" }}>View</p>
          <div style={{ maxWidth: "100px", minWidth: "60px" }}>
            <Selection
              name="pageSize"
              options={selectOptions}
              control={control}
              customMenuTop={"-260px !important"}
              iconClass="!top-[9px]"
              isSearchable={false}
            />
          </div>
          <p>{perPageText ? perPageText : "user per page"}</p>
        </div>
        <div className={styles.rightFlex}>
          <Tooltip backClass="" text="Previous page">
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              className="!w-[24px] !h-[24px]"
              src={"/assets/arrow-left-p.svg"}
              alt="sortUp"
              height="100"
              width="100"
              onClick={handleLeft}
            />
          </Tooltip>
          {page > 1 && (
            <span onClick={handleEvent} style={{ cursor: "pointer" }}>
              {page - 1 === 1 ? "1" : page - 1}{" "}
            </span>
          )}
          <span>
            <b style={{ color: "#000000" }}>{page}</b>
          </span>
          {page < Math.ceil(totalCount / pageSize) && (
            <>
              <span>
                <b onClick={handleEventAddOne}>{page + 1 > 5 ? "..." : page + 1}</b>
              </span>
              {page + 2 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={handleEventAddTwo}>{page + 2 > 5 ? "..." : page + 2}</b>
                </span>
              )}
              {page + 3 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={handleEventAddThree}>{page + 3 > 5 ? "..." : page + 3}</b>
                </span>
              )}
              {page + 4 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={handleEventAddFour}>{page + 4 > 5 ? "..." : page + 4}</b>
                </span>
              )}
            </>
          )}

          <>
            {totalPages > 1 && (
              <Tooltip backClass="" text="Next page">
                <Image
                  data-testid="close-icon"
                  style={{
                    borderRadius: "10px",
                  }}
                  className="!w-[24px] !h-[24px]"
                  src={"/assets/arrow-right-p.svg"}
                  alt="sortUp"
                  height="100"
                  width="100"
                  onClick={handleRight}
                />
              </Tooltip>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default memo(CustomPagination);
