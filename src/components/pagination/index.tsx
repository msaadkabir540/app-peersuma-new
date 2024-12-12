import { useEffect, useState } from "react";

export const useMockPaginate = (data: any, limit: number) => {
  const [currentPage, setPage] = useState<number>(1);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return data?.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData();

  const prevPage = () => {
    if (currentPage > 1) {
      setPage((previousPage) => previousPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math?.ceil(data?.length / limit)) {
      setPage((previousPage) => previousPage + 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    setPage(1);
  }, [limit]);

  return {
    nextPage,
    prevPage,
    goToPage,
    paginatedData,
    currentPage,
    totalPages: Math?.ceil(data?.length / limit),
  };
};
