/* eslint-disable react-hooks/exhaustive-deps */
// contexts/PostsContext.tsx
"use client";

import { useForm } from "react-hook-form";
import React, { useContext, createContext, useState, useEffect, useMemo, useCallback } from "react";

import { getWidgetViewById } from "../app/api/widget";
import {
  MediaDataInterface,
  ShowInterface,
  VideoViewContextInterface,
} from "../app/interface/video-view-interface/video-view-interface";
import { useDebounce } from "../app/custom-hook/debounce";
import { useMockPaginate } from "../components/pagination";

const VideoViewContext = createContext<VideoViewContextInterface | undefined>(undefined);
// hello worldf
export const VideoViewContextCollection = ({ children }: { children: React.ReactNode }) => {
  const { register, watch, control, setValue } = useForm();
  const [widget, setWidget] = useState<ShowInterface | undefined>();
  const [videoViewId, setVideoViewId] = useState<string>("");
  const [searchParams, setSearchParams] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>("");
  const [isVideoScreen, setIsVideoScreen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaDataInterface | undefined>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [toDate, setToDate] = useState<Date | null>();
  const [applyFilter, setApplyFilter] = useState<{
    fromDate: Date | string | null;
    toDate: Date | string | null;
  }>({
    fromDate: null,
    toDate: null,
  });

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>("grid");

  const limit = searchParams ? 6 : 25;
  const totalWidgetMedia = widget?.media?.length;

  const contributors = useMemo(() => {
    const getUniqueContributors =
      widget?.media?.reduce<{ value: string; label: string }[]>((acc, { _id }) => {
        const fullNameOrUsername = !_id?.userId?.username?.includes("@")
          ? _id?.userId?.username
          : _id?.userId?.fullName;
        if (fullNameOrUsername) {
          const contributor = {
            value: _id?.userId?._id as string,
            label: fullNameOrUsername,
          };
          // Check if the contributor is already in the accumulator
          if (!acc.some((item) => item.value === contributor.value)) {
            acc.push(contributor);
          }
        }
        return acc;
      }, []) || [];

    return getUniqueContributors;
  }, [widget]);

  const debouncedFindUser = useDebounce({ value: watch("search") || "", milliSeconds: 2000 });

  const handleSelectedVideo = ({ media }: { media: MediaDataInterface | undefined }) => {
    setSelectedVideo(media);
  };

  const handleVideoViewScreen = ({ value }: { value: boolean }) => {
    setIsVideoScreen(value);
  };

  const handleVideoView = ({ id }: { id: string }) => {
    setVideoViewId(id);
  };

  const handleActiveView = ({ active }: { active: string }) => {
    setActiveView(active);
  };

  const handlePageLoading = ({ active }: { active: boolean }) => {
    setIsPageLoading(active);
  };

  const handleSearchParams = ({ searchParams }: { searchParams: string }) => {
    const isSearch = searchParams !== "" ? true : false;
    setSearchParams(isSearch);
    handleVideoViewScreen({ value: isSearch });
    setVideoId(searchParams);
  };

  const calculateDateRange = useCallback(({ range }: { range: string }) => {
    const now = new Date();
    let fromDate, toDate;

    switch (range) {
      case "Today":
        fromDate = new Date(now.setHours(0, 0, 0, 0));
        toDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "Last 7 days":
        toDate = new Date(now.setHours(23, 59, 59, 999));
        fromDate = new Date(now.setDate(now.getDate() - 7));
        fromDate.setHours(0, 0, 0, 0);
        break;
      case "Last 30 days":
        toDate = new Date(now.setHours(23, 59, 59, 999));
        fromDate = new Date(now.setDate(now.getDate() - 30));
        fromDate.setHours(0, 0, 0, 0);
        break;
      case "This year":
        fromDate = new Date(now.getFullYear(), 0, 1);
        toDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case "Last year":
        fromDate = new Date(now.getFullYear() - 1, 0, 1);
        toDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      default:
        fromDate = "";
        toDate = "";
    }
    const formatDateString = (date: string | Date) => {
      return date instanceof Date ? date.toISOString() : date;
    };

    const formattedDates = {
      fromDate: fromDate ? formatDateString(fromDate) : "",
      toDate: toDate ? formatDateString(toDate) : "",
    };
    return formattedDates;
  }, []);

  const handleStaticApplyFilter = ({ range }: { range: string }) => {
    const { fromDate, toDate } = calculateDateRange({ range });
    setApplyFilter({ fromDate, toDate });
  };

  const handleApplyFilter = ({
    fromDate,
    toDate,
  }: {
    fromDate: Date | null;
    toDate: Date | null;
  }) => {
    setApplyFilter({ fromDate, toDate });
  };

  const handleFromDate = ({ fromDate }: { fromDate: Date | null }) => {
    setStartDate(fromDate);
  };

  const handleToDate = ({ toDate }: { toDate: Date | null }) => {
    setToDate(toDate);
  };

  const widgetMediaData = useMemo(() => {
    return widget?.media
      ?.filter(({ _id }) =>
        _id?.name?.toLowerCase()?.includes(debouncedFindUser?.toLowerCase() as string),
      )
      ?.map(({ _id }: any, index: number) => {
        const username = !_id?.userId?.username?.includes("@")
          ? _id?.userId?.username
          : _id?.userId?.fullName || "superAdmin";
        return {
          ..._id,
          username,
          index: index,
        };
      });
  }, [widget, debouncedFindUser, watch("contributor")]);

  const filteredData = useMemo(() => {
    const filterData = ({
      data,
      fromDate,
      toDate,
    }: {
      data: any;
      fromDate: Date | null;
      toDate: Date | null;
    }) => {
      if (!fromDate && !toDate) {
        return data;
      }

      const fromDateTime = fromDate ? new Date(fromDate).getTime() : 0;
      const toDateTime = toDate ? new Date(toDate).getTime() : Infinity;

      return data?.filter((item: any) => {
        const updatedAtTime = new Date(item.updatedAt).getTime();
        return updatedAtTime >= fromDateTime && updatedAtTime < toDateTime + 86400000; // Adding one day (in milliseconds) to include the same date
      });
    };

    return filterData({
      data: widgetMediaData,
      fromDate: applyFilter?.fromDate as any,
      toDate: applyFilter?.toDate as any,
    });
  }, [widgetMediaData, applyFilter?.fromDate, applyFilter?.toDate]);

  const filterContributor = filteredData?.filter((_id: any) => {
    if (
      watch("contributor")?.value === "all" ||
      watch("contributor") === null ||
      watch("contributor") === undefined
    ) {
      return _id;
    } else {
      return _id?.userId?._id === watch("contributor")?.value;
    }
  });

  const { nextPage, prevPage, goToPage, paginatedData, currentPage, totalPages } = useMockPaginate(
    filterContributor,
    limit,
  );

  const handleGetMedia = useCallback(
    ({ videoAssetsId }: { videoAssetsId: string }) => {
      const getMediaByAssetsId = widgetMediaData?.find((media) => {
        return media?.assetId === videoAssetsId;
      });

      setSelectedVideo?.(getMediaByAssetsId);
    },
    [widgetMediaData],
  );

  // api function
  const getWidgetByID = async ({ videoViewId }: { videoViewId: string }) => {
    try {
      setIsPageLoading(true);
      const res = await getWidgetViewById({ _id: videoViewId });

      if (res?.status === 200) {
        setWidget(res?.data);
        setIsPageLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsPageLoading(false);
  };

  useEffect(() => {
    if (videoViewId) {
      getWidgetByID({ videoViewId });
    }
  }, [videoViewId]);

  useEffect(() => {
    widgetMediaData && handleGetMedia({ videoAssetsId: videoId });
  }, [videoId, widgetMediaData]);

  const contextData = {
    toDate,
    limit,
    widget,
    control,
    videoId,
    register,
    setValue,
    goToPage,
    nextPage,
    prevPage,
    startDate,
    setToDate,
    activeView,
    totalPages,
    videoViewId,
    currentPage,
    handleToDate,
    searchParams,
    setStartDate,
    contributors,
    paginatedData,
    isVideoScreen,
    isPageLoading,
    selectedVideo,
    handleFromDate,
    widgetMediaData,
    handleVideoView,
    handleActiveView,
    filterContributor,
    totalWidgetMedia,
    debouncedFindUser,
    handleApplyFilter,
    handlePageLoading,
    handleSearchParams,
    handleSelectedVideo,
    handleVideoViewScreen,
    handleStaticApplyFilter,
  };

  return <VideoViewContext.Provider value={contextData}>{children}</VideoViewContext.Provider>;
};

export const useVideoView = (): VideoViewContextInterface | undefined => {
  const context = useContext(VideoViewContext);
  if (!context) {
    console.error("useClients must be used within a ClientContextProvider");
  }
  return context;
};
