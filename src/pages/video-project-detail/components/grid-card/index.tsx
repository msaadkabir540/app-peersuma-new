import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";

import Button from "@/src/components/button";
import createNotification from "@/src/components/create-notification";
import { handleDownload } from "@/src/helper/helper";

import styles from "./index.module.scss";

const GridCard = ({
  name,
  date,
  s3key,
  shotId,
  subtitle,
  isDelete,
  imageUrl,
  duration,
  fileType,
  updatedBy,
  toggleList,
  shotLength,
  isContributor,
  isEditingProcess,
  handleOpenVideoModal,
  handleDeleteShotMedia,
  handleRenameShotModal,
  url,
}: {
  handleOpenVideoModal: ({
    imageUrl,
    fileType,
  }: {
    imageUrl: string;
    fileType: string | undefined;
  }) => void;
  toggleList: any;
  name: string;
  s3key: string;
  url?: string;
  date: string;
  shotId: string;
  imageUrl: string;
  fileType?: string;
  updatedBy?: string;
  subtitle: boolean;
  isEditingProcess: boolean;
  isDelete: boolean;
  duration: number | undefined;
  shotLength: number | undefined;
  isContributor: boolean | undefined;
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
  const [isDownload, setIsDownload] = useState(false);

  const formateDate = moment(date).format("YYYY-MM-DD | hh:mm A");

  const handleEventRenameShotModal = () => {
    handleRenameShotModal?.({ shotId: shotId, name: name, s3key });
  };

  const handleEventDeleteShotMedia = () => {
    handleDeleteShotMedia?.({ shotId: shotId });
  };

  const handleDownloadEvent = async () => {
    try {
      setIsDownload(true);
      await handleDownload({ name, url: url as string });
    } catch (error) {
      console.error(error);
      createNotification({
        type: "error",
        message: "Error!",
        description: "Error downloading video",
      });
    }
    setIsDownload(false);
  };

  const handleOpenVideoModalEvent = () =>
    handleOpenVideoModal({ imageUrl: url || imageUrl, fileType });

  return (
    <>
      <div className={` flex gap-2.5  flex-col items-start  ${styles.cardsBody}`}>
        <div
          className={`${styles.headingText}  gap-2.5 pl-2 md:text-base text-sm font-medium truncate text-ellipsis w-72`}
        >
          {name}
        </div>
        <div
          style={{ borderRadius: "20px" }}
          onClick={handleOpenVideoModalEvent}
          className={` w-full relative  ${styles.cardImage}`}
        >
          {fileType === "audio" ? (
            <Image
              data-testid="close-icon"
              style={{
                cursor: "pointer",
                borderRadius: "10px",
              }}
              src={"/assets/headphone.png"}
              alt={name}
              height="100"
              width="100"
            />
          ) : (
            <Image
              data-testid="close-icon"
              style={{
                cursor: "pointer",
                borderRadius: "10px",
              }}
              src={imageUrl || "/assets/backgroundimage.jpg"}
              alt={name}
              height="500"
              width="500"
            />
          )}
          {(duration as number) > 0 && fileType === "video" && (
            <div
              className={`${styles.duration} flex justify-center items-center absolute bg-white `}
            >
              <div className={`${styles.playButtonClass} bg-white rounded-full`}>
                <Image
                  data-testid="close-icon"
                  style={{
                    borderRadius: "10px",
                  }}
                  src={"/assets/playbutton.png"}
                  alt="play button"
                  height="5"
                  width="5"
                />
              </div>
              <div className="text-xs">{duration}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 w-full pl-2 relative">
          {subtitle && (
            <div>
              <div
                className={`lg:text-md md:text=sm  font-medium leading-4.5 ${styles.updatedText}`}
              >
                {`Uploaded by: ${updatedBy}`}
              </div>
              <div
                className={` text-gray-600  text-xs font-normal leading-3.375 ${styles.date}`}
                style={{ color: "#A1A1A1 " }}
              >
                {formateDate}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pr-3">
            <Button
              type="button"
              isLoading={isDownload}
              toolTip={"Download media"}
              imgClass={styles.iconClass}
              loaderClass={styles.loaderClass}
              btnClass={`!bg-transparent !p-0`}
              handleClick={handleDownloadEvent}
              iconStart={"/assets/download.png"}
            />
            <Button
              iconStart={"/assets/pen.png"}
              btnClass={`!bg-transparent !p-0`}
              imgClass={styles.iconClass}
              toolTip={"Edit media"}
              disabled={isEditingProcess}
              type="button"
              handleClick={handleEventRenameShotModal}
            />
            {(!isContributor || (isContributor && (shotLength as number) > 1)) && (
              <Button
                iconStart={"/assets/editing.png"}
                btnClass={`!bg-transparent !p-0`}
                imgClass={styles.iconClass}
                type="button"
                disabled={isEditingProcess}
                toolTip={"Move Media "}
                handleClick={toggleList}
              />
            )}
            {isDelete && (
              <Button
                type="button"
                toolTip={"Delete media"}
                disabled={isEditingProcess}
                imgClass={styles.iconClass}
                iconStart={"/assets/delete.png"}
                btnClass={`!bg-transparent !p-0`}
                handleClick={handleEventDeleteShotMedia}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GridCard;
