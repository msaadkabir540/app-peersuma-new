"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";

import GridCard from "../grid-card";
import { ShotMediaInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";
import { useOutsideClickHook } from "@/src/helper/helper";

const VideoProjectGrid = ({
  shotsOption,
  selectedShot,
  allMediaShot,
  isContributor,
  isEditingProcess,
  handleMoveMediaShot,
  handleOpenVideoModal,
  handleDeleteShotMedia,
  handleRenameShotModal,
}: {
  isEditingProcess: boolean;
  isContributor: boolean | undefined;
  handleOpenVideoModal: ({
    imageUrl,
    fileType,
  }: {
    imageUrl: string | undefined;
    fileType: string | undefined;
  }) => void;
  selectedShot: any;
  handleMoveMediaShot: ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: any;
    moveShot: any;
    media: any;
  }) => void;
  shotsOption: any;
  allMediaShot: ShotMediaInterface[];
  handleDeleteShotMedia: ({ shotId }: { shotId: string }) => void;
  handleRenameShotModal: ({
    shotId,
    name,
    s3key,
  }: {
    shotId: string;
    name: string;
    s3key: string;
  }) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [openListIndex, setOpenListIndex] = useState<number | null>(null);

  const toggleList = (index: number) => {
    setOpenListIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleMoveMedia = ({
    shotId,
    media,
    selectedShot,
  }: {
    shotId: string;
    media: any;
    selectedShot: string;
  }) => {
    handleMoveMediaShot({
      selectedShot: selectedShot,
      moveShot: shotId,
      media: media,
    });
  };

  useOutsideClickHook(cardRef, () => {
    setOpenListIndex(null);
  });

  return (
    <>
      {allMediaShot?.length === 0 ? (
        <div className="h-full min-h-[calc(100vh-545px)] flex justify-center items-center mt-10">
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
              width: "200px",
            }}
            src={"/assets/nodata.png"}
            alt="Close Nav Bar"
            height="100"
            width="100"
          />
        </div>
      ) : (
        <div
          ref={cardRef}
          className={`${styles.customGrid} grid xl:grid-cols-3 md:gap-5 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 m-1`}
        >
          {allMediaShot?.map((shotMedia: ShotMediaInterface, index: number) => {
            return (
              <div key={index} className={`relative ${styles.gridCards} `}>
                <GridCard
                  subtitle={true}
                  isDelete={true}
                  name={shotMedia?.name}
                  shotId={shotMedia?._id}
                  s3key={shotMedia?.s3Key}
                  date={shotMedia?.updatedAt}
                  isContributor={isContributor}
                  duration={shotMedia?.duration}
                  fileType={shotMedia?.fileType}
                  shotLength={shotsOption?.length}
                  isEditingProcess={isEditingProcess}
                  toggleList={() => toggleList(index)}
                  handleOpenVideoModal={handleOpenVideoModal}
                  handleRenameShotModal={handleRenameShotModal}
                  handleDeleteShotMedia={handleDeleteShotMedia}
                  url={(shotMedia?.url && shotMedia?.url) || ""}
                  updatedBy={shotMedia?.username || shotMedia?.fullName}
                  imageUrl={shotMedia?.thumbnailUrl || shotMedia?.url}
                />
                {/* Render the list if the current index matches the openListIndex */}
                {openListIndex === index && (
                  <div className={`absolute ${styles.list}`}>
                    <ul>
                      {shotsOption?.length != 1 && (
                        <li className="border-b border-solid border-gray-400 font-semibold hover:!bg-white">
                          Move to
                        </li>
                      )}
                      {shotsOption?.length === 1 && (
                        <li className=" !cursor-default text-gray-500   hover:!bg-white">
                          No shot
                        </li>
                      )}

                      {shotsOption
                        ?.filter((data: any) => data?.value != selectedShot?.value)
                        ?.map((data: any) => {
                          return (
                            <li
                              key={data?.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleMoveMedia({
                                  shotId: data,
                                  media: shotMedia,
                                  selectedShot: selectedShot,
                                });
                                setOpenListIndex(null);
                              }}
                            >
                              {data?.label}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default VideoProjectGrid;
