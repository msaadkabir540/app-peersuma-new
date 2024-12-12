"use clinet";

import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import ImageComponent from "@/src/components/image-component";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { videoProjectMediaShotApi } from "@/src/app/api/video-project-media-shot";

import { s3TransloaditUploadMap } from "@/src/helper/helper";

import { AlbumShotInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";
import { divide } from "lodash";

const UploadMedias = ({ shotUrl, userId }: { shotUrl: string; userId?: string }) => {
  const router = useRouter();
  const shotMedias = shotUrl as string;

  const [shotModal, setShotModal] = useState({
    isModalOpen: true,
    isPageLoading: true,
  });
  const splitUrl = shotMedias?.split("uploaded");

  const shotLink = splitUrl?.[0];

  const [shot, setShot] = useState<AlbumShotInterface>({} as AlbumShotInterface);

  const handleUploadMedia = async ({ uploads }: { uploads: any }) => {
    const uploadsData = uploads?.map((upload: any) => ({
      ...upload,
      userId: userId != "undefined" ? userId : null,
    }));

    // Construct uploadMediaData object
    const uploadMediaData = {
      id: shot?._id,
      media: uploadsData,
    };
    try {
      const resp: any = await videoProjectMediaShotApi?.performAction({
        action: "upload-media",
        data: uploadMediaData,
      });

      if (resp?.status === 200) {
        createNotification({
          type: "success",
          message: "Success!",
          description: "Media uploaded.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetData = async ({ shotLink }: { shotLink: string }) => {
    const resp: any = await videoProjectMediaShotApi?.performAction({
      action: "get-shot-by-name",
      data: { shotLink },
    });
    if (resp?.status === 200) {
      setShot(resp?.data?.data);

      localStorage.setItem("createdId", resp?.data?.data?.album?.clientId);
      setShotModal((prev) => ({ ...prev, isPageLoading: false }));
    } else {
      createNotification({
        type: "error",
        message: "Error!",
        description: resp?.response?.data?.error ?? "An Error Occurred!",
      });
      setShotModal((prev) => ({ ...prev, isPageLoading: false }));
    }
  };

  const handleRedirect = () => {
    setShotModal((prev) => ({ ...prev, isPageLoading: true }));
    router.push("/login");
  };

  useEffect(() => {
    if (shotLink) {
      setShotModal((prev) => ({ ...prev, isPageLoading: true }));
      const shotUrl = decodeURI(shotLink);

      handleGetData({ shotLink: shotUrl });
    }
  }, [shotLink]);

  const isShot = useMemo(() => (Object.keys(shot).length != 0 ? true : false), [shot]);

  return (
    <>
      {shotModal?.isPageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <div className={styles.modalContainer}>
          <div className={styles.navbar}>
            <div className={styles.imgDiv}>
              <ImageComponent
                className={styles.logo}
                src={"/assets/peersuma-logo.png"}
                alt="logo"
                priority={true}
              />
            </div>
            <div className={styles.details}>
              <div className="md:text-base text-xs">
                Project: {(shot?.album?.name as string) || ""}
              </div>
              <div className="md:text-base text-xs">{shot?.name}</div>
            </div>
          </div>
          {!userId && (
            <div className="flex justify-end items-center md:m-8 m-3">
              <Button
                text="Signup"
                imgClass={styles.iconClass}
                btnClass={styles.btnCreateClass}
                handleClick={handleRedirect}
                className={`${styles.btnCreateClassText} !text-xs md:!text-lg `}
              />
            </div>
          )}
          {shot?.album?.isEditingProcess ? (
            <div className="flex justify-center p-[10x] md:mx-36 items-center h-[70vh] md:text-[16px] text-center text-[13px] border border-[#ed1c24] rounded-md shadow-md">
              Editing is in progress of the shared project. Media cannot be uploaded currently.
            </div>
          ) : isShot ? (
            <div className={styles.modalMedia}>
              <TransloaditUploadModal
                fieldName={shotModal?.isModalOpen}
                setFieldName={(val) => {
                  setShotModal((prev) => ({ ...prev, upload: val }));
                }}
                allowedFileTypes={[`video/*`, "image/*", `audio/*`]}
                mapUploads={s3TransloaditUploadMap}
                setUploads={async ({ uploads }) => {
                  await handleUploadMedia({ uploads });
                }}
                fields={{
                  prefix: `/albums/${shot?.album?._id}/${shot?._id}/`,
                  timeStamp: moment().format("YYYYMMDD_HHmmss"),
                }}
              />
            </div>
          ) : (
            <div className="flex justify-center p-[10x] md:mx-36 items-center h-[70vh] md:text-[16px] text-center text-[13px] border border-[#ed1c24] rounded-md shadow-md">
              Scene not found!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UploadMedias;
