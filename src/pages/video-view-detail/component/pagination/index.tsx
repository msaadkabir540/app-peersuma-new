import React from "react";

import { useVideoView } from "@/src/(context)/video-context-collection";

import styles from "./index.module.scss";

const PaginationComponent = () => {
  const context = useVideoView();
  const limit = context && context?.limit;
  const nextPage = context && context?.nextPage;
  const prevPage = context && context?.prevPage;
  const goToPage = context && context?.goToPage;
  const totalPages = context && context?.totalPages;
  const currentPage = context && context?.currentPage;
  const totalWidgetMedia = context && context?.totalWidgetMedia;
  // const paginatedData = context && context?.paginatedData;
  const paginatedData = context && context?.filterContributor;

  const currentItems = (currentPage - 1) * (limit as number) + 1;
  const totalItems = Math?.min(currentPage * (limit as number), paginatedData?.length as number);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5; // Number of page buttons to display
    const halfMaxDisplayed = Math?.floor(maxDisplayedPages / 2);

    const startPage = Math?.max(1, currentPage - halfMaxDisplayed);
    const endPage = Math?.min(totalPages, currentPage + halfMaxDisplayed);

    // Show the first page
    if (startPage > 1) {
      pageNumbers?.push(
        <div key={1} onClick={() => goToPage(1)} className={currentPage === 1 ? styles.active : ""}>
          1
        </div>,
      );

      if (startPage > 2) {
        pageNumbers?.push(
          <span key="dots1" className={styles.dots}>
            ...
          </span>,
        );
      }
    }

    // Show the pages around the current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers?.push(
        <div key={i} onClick={() => goToPage(i)} className={currentPage === i ? styles.active : ""}>
          {i}
        </div>,
      );
    }

    // Show the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers?.push(
          <span key="dots2" className={styles.dots}>
            ...
          </span>,
        );
      }
      pageNumbers?.push(
        <div
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={currentPage === totalPages ? styles.active : ""}
        >
          {totalPages}
        </div>,
      );
    }

    return pageNumbers;
  };
  return (
    <div>
      <div className={styles.pagination_container}>
        <div className={styles.pagination_buttons}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            {"<"}
          </button>
          {renderPageNumbers()}
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            {">"}
          </button>
        </div>
        <div className={styles.pagination_info}>
          Showing {currentItems} to {totalItems} of {totalWidgetMedia as number} entries
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
