"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Layout from "../layout/page";
import MainContainer from "./main-container";
import PendingRequestCard from "./component/pending-request-card";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import { getAllVideoRequestsByAssignId, updateVideoRequest } from "@/src/app/api/video-request";

import { useClients } from "@/src/(context)/context-collection";

import { VideoRequestInterface } from "@/src/interface/video-request-interface";

import styles from "./index.module.scss";

const VideoRequestComponent = () => {
  const { control, watch } = useForm<{ schoolYear: { label: string; value: string } }>();

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [loadingVideoRequest, setLoadingVideoRequest] = useState(false);
  const [videoRequestData, setVideoRequestData] = useState<VideoRequestInterface[]>([]);

  const clientContext = useClients();
  const selectedClient = clientContext && clientContext?.selectedClient;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const loggedInUser = clientContext && clientContext?.loggedInUser;
  const selectedClientId = selectedClientIds || selectedClient;

  const searchParamsValue = useDebounce({ value: searchParams, milliSeconds: 2000 });

  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchParams(e.target.value);

  const handleSetEventCross = () => setSearchParams("");

  const handleActive = () => {
    setActive(!active);
  };

  const pendingVideoRequest = useMemo(() => {
    return videoRequestData?.filter(({ status }: { status: string }) => status === "pending");
  }, [videoRequestData]);

  const handleGetAllVideoRequest = useCallback(async () => {
    setLoadingVideoRequest(true);
    try {
      const res = await getAllVideoRequestsByAssignId({
        clientId: selectedClientId as string,
        assignTo: loggedInUser?._id,
        searchParamsValue,
        schoolYear: watch("schoolYear")?.value,
      });
      if (res) {
        setVideoRequestData(res);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoadingVideoRequest(false);
    }
  }, [
    selectedClientId,
    loggedInUser,
    getAllVideoRequestsByAssignId,
    searchParamsValue,
    watch("schoolYear"),
  ]);

  const handleSetResponseData = ({ responseData }: { responseData: VideoRequestInterface }) => {
    const updatedData = videoRequestData?.filter((data) => data._id !== responseData._id);

    setVideoRequestData([...updatedData, responseData]);
  };

  const handleSetData = ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => {
    const updatedData = videoRequestData?.map((data) =>
      data._id === videoRequestId ? { ...data, status } : data,
    );
    setVideoRequestData(updatedData);
  };

  const handleUpdateStatus = async ({
    videoRequestId,
    status,
  }: {
    videoRequestId: string;
    status: string;
  }) => {
    handleSetData({
      videoRequestId,
      status,
    });
    try {
      const addVideoRequestData = {
        status,
      };
      await updateVideoRequest({ id: videoRequestId, data: addVideoRequestData });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMediaStatus = async ({
    upload,
    status,
    videoRequestId,
  }: {
    upload: any;
    status: string;
    videoRequestId: string;
  }) => {
    handleSetData({
      videoRequestId,
      status,
    });

    try {
      const addVideoRequestData = {
        status,
        url: upload?.url,
        s3Key: upload?.s3Key,
        videoName: upload?.name,
        thumbnailUrl: upload?.thumbnailUrl,
        thumbnailS3Key: upload?.thumbnailS3Key,
      };

      const res: any = await updateVideoRequest({ id: videoRequestId, data: addVideoRequestData });
      if (res.status === 200) {
        handleSetData({
          videoRequestId,
          status,
        });
        handleGetAllVideoRequest();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllVideoRequest();
  }, [handleGetAllVideoRequest]);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-85px)] p-4">
        <div
          className={`transition-all duration-300 z-10
       ${isOpen ? " p-5 rounded-lg border border-gray-400 bg-white text-white  w-full  max-w-[300px] min-w-[300px] md:block hidden" : "w-0 overflow-hidden"}`}
        >
          <div
            className={` ${isOpen ? "flex justify-between items-center border-b border-b-[#B8B8B8] pb-[10px]" : "hidden"}`}
          >
            <div className="text-[#000]">Pending Requests ({pendingVideoRequest?.length || 0})</div>
            <button className="bg-transparent  text-white " onClick={() => setIsOpen(!isOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
                  stroke="#5E5E5E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.25 10L5.5 12L7.25 14"
                  stroke="#5E5E5E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 21V3"
                  stroke="#5E5E5E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Sidebar content */}
          <div className="flex flex-col gap-3 mt-[10px] overflow-scroll h-[calc(100vh-200px)]">
            {pendingVideoRequest?.map((data) => {
              return (
                <PendingRequestCard
                  key={data?._id}
                  cardData={data}
                  handleSetResponseData={handleSetResponseData}
                />
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="ml-auto md:block hidden">
          {!isOpen && (
            <>
              <div className="absolute z-10 top-[90px] left-[50px] rounded-full text-white bg-[#ED1C24] text-[12px] flex w-[25px] h-[25px] p-[2px] px-1.5 flex-col justify-center items-center gap-2.5">
                {pendingVideoRequest?.length || 0}
              </div>
              <button
                className="rounded-md border border-gray-400 bg-white p-3 relative"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
                    stroke="#5E5E5E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 21V3"
                    stroke="#5E5E5E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 10L7.25 12L5.5 14"
                    stroke="#5E5E5E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
        <div className={`flex-1 md:pl-4 transition-all duration-300 w-full `}>
          <div className="md:hidden block text-black text-[20px] font-medium leading-normal">
            Video Requests
          </div>
          <div
            className="md:hidden block text-[#0F0F0F] text-right font-poppins text-[13px] font-normal leading-normal underline"
            onClick={handleActive}
          >
            <div className="flex justify-end items-center gap-2">
              Pending Requests ({pendingVideoRequest?.length || 0})
              <Image
                data-testid="close-icon"
                src={"/assets/arrow-top.svg"}
                style={{ cursor: "pointer", transform: "rotate(270deg)" }}
                alt="sortUp"
                className="!w-[24px] !h-[24px]"
                height="100"
                width="100"
                onClick={handleActive}
              />
            </div>
          </div>

          {active ? (
            <div className={styles.backDropDiv}>
              <div className="text-black text-[20px] font-medium leading-normal">
                Video Requests
              </div>
              <div
                className="text-[#0F0F0F] mt-[15px] text-[14px] flex gap-3 font-medium leading-normal  w-full pb-[10px]  border-b border-b-[#B8B8B8]"
                onClick={handleActive}
              >
                <Image
                  data-testid="close-icon"
                  src={"/assets/arrow-top.svg"}
                  style={{ cursor: "pointer", transform: "rotate(90deg)" }}
                  alt="sortUp"
                  className="!w-[24px] !h-[24px]"
                  height="100"
                  width="100"
                  onClick={handleActive}
                />
                Pending Requests ({pendingVideoRequest?.length || 0})
              </div>
              <div className="flex flex-col gap-3 mt-[10px] overflow-scroll h-[calc(100vh-200px)]">
                {pendingVideoRequest?.map((data) => {
                  return (
                    <PendingRequestCard
                      key={data?._id}
                      cardData={data}
                      handleSetResponseData={handleSetResponseData}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center gap-2.5 md:px-5 flex-1 self-stretch rounded-lg md:border md:border-gray-400 md:bg-white md:h-[calc(100vh-120px)] ${isOpen ? "md:w-[calc(100vw-344px)] w-full" : ""}  `}
            >
              <MainContainer
                control={control}
                searchParams={searchParams}
                videoRequestData={videoRequestData}
                handleSearchEvent={handleSearchEvent}
                handleUpdateStatus={handleUpdateStatus}
                loadingVideoRequest={loadingVideoRequest}
                handleSetEventCross={handleSetEventCross}
                handleUpdateMediaStatus={handleUpdateMediaStatus}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VideoRequestComponent;
