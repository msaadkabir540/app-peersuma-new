import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";

import TableView from "../table-view";
import Input from "@/src/components/input";
import Loading from "@/src/components/loading";
import VideoProjectGrid from "../video-project-grid";

import {
  ShotInterface,
  ViewComponentInterface,
} from "@/src/app/interface/video-project-interface/video-project-interface";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";

import styles from "./index.module.scss";

const ViewContainer = ({
  register,
  setValue,
  shotsOption,
  mediaType,
  handleSort,
  activeView,
  sortColumn,
  isProcessing,
  allMediaShot,
  selectedShot,
  isContributor,
  isEditingProcess,
  handleRenameFile,
  handleDeleteShots,
  handleMoveMediaShot,
}: ViewComponentInterface) => {
  const tableRef = useRef<HTMLDivElement>();
  const [isRename, setIsRename] = useState<boolean>(false);
  const [isClipOpen, setIsClipOpen] = useState<{
    url?: string | undefined;
    imageUrl: string;
    fileType: string | undefined;
    isOpen?: boolean;
  }>({ isOpen: false, imageUrl: "", fileType: "", url: "" });
  const [isShot, setIsShot] = useState<ShotInterface>({
    shotIds: "",
    shortName: "",
    shortName2: "",
    isShotOpen: false,
    isRenameOpen: false,
    isMove: false,
  });

  const FilteredMedia = useMemo(
    () =>
      allMediaShot?.[0]?.media?.filter(({ fileType }) =>
        mediaType === "all" ? true : !mediaType || fileType === mediaType,
      ),

    [mediaType, allMediaShot],
  );

  const handleDeleteShotMedia = ({ shotId }: { shotId: string }) => {
    if (shotId) {
      setIsShot((prev) => ({ ...prev, shotIds: shotId, isShotOpen: true }));
    }
  };

  const handleRenameShotModal = ({
    shotId,
    name,
    s3key,
  }: {
    shotId: string;
    name: string;
    s3key: string;
  }) => {
    if (shotId) {
      setValue?.("renameFile", name);
      setIsShot((prev) => ({ ...prev, shotIds: shotId, s3key: s3key, isRenameOpen: true }));
    }
  };

  const handleDelete = async (
    handleDeleteShots: ({ shotId }: { shotId: string }) => Promise<boolean>,
    isShot: { shotIds?: string | undefined; isShotOpen: boolean | undefined },
    setIsShot: React.Dispatch<
      React.SetStateAction<{ shotIds?: string | undefined; isShotOpen: boolean }>
    >,
  ) => {
    setIsRename(true);
    const result = await handleDeleteShots({ shotId: isShot?.shotIds as string });
    if (result) {
      setIsShot((prev) => ({ ...prev, shotIds: "", isShotOpen: false }));
      setIsRename(false);
    }
  };

  const handleRenameFiles = async () => {
    const result = await handleRenameFile({
      shotId: isShot?.shotIds as string,
      s3Key: isShot?.s3key as string,
    });
    result && setIsShot((prev) => ({ ...prev, shotIds: "", isRenameOpen: false }));
  };

  const handleMoves = async ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: string;
    moveShot: string;
    media: any;
  }) => {
    setIsRename(true);
    const result: any = await handleMoveMediaShot({
      selectedShot,
      moveShot,
      media,
    });
    if (result) {
      setIsShot((prev) => ({
        ...prev,
        shotIds: "",
        media: {},
        shortName: {},
        shortName2: {},
        isMove: false,
      }));
      setIsRename(false);
    }
  };

  const handleMoveData = ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: any;
    moveShot: any;
    media: any;
  }) => {
    setIsShot((prev) => ({
      ...prev,
      media: media,
      shortName: selectedShot,
      shortName2: moveShot,
      isMove: true,
    }));
  };

  const handleOpenVideoModal = ({
    imageUrl,
    fileType,
  }: {
    imageUrl: string | undefined;
    fileType: string | undefined;
  }) => {
    setIsClipOpen((prev: any) => ({ ...prev, isOpen: true, fileType, imageUrl }));
  };

  return (
    <>
      {FilteredMedia?.length === 0 ? (
        <div className="h-full  min-h-[calc(100vh-545px)] flex justify-center items-center mt-10">
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
        <div>
          {activeView === "table" ? (
            <TableView
              tableRef={tableRef}
              handleSort={handleSort}
              sortColumn={sortColumn}
              shotsOption={shotsOption}
              selectedShot={selectedShot}
              allMediaShot={FilteredMedia}
              isContributor={isContributor}
              isEditingProcess={isEditingProcess}
              handleMoveMediaShot={handleMoveData}
              handleOpenVideoModal={handleOpenVideoModal}
              handleDeleteShotMedia={handleDeleteShotMedia}
              handleRenameShotModal={handleRenameShotModal}
            />
          ) : (
            <VideoProjectGrid
              shotsOption={shotsOption}
              selectedShot={selectedShot}
              allMediaShot={FilteredMedia}
              isContributor={isContributor}
              isEditingProcess={isEditingProcess}
              handleMoveMediaShot={handleMoveData}
              handleOpenVideoModal={handleOpenVideoModal}
              handleDeleteShotMedia={handleDeleteShotMedia}
              handleRenameShotModal={handleRenameShotModal}
            />
          )}
        </div>
      )}

      {isShot?.isRenameOpen && (
        <Modal
          {...{
            open: isShot?.isRenameOpen,
            handleClose: () => setIsShot((prev) => ({ ...prev, isRenameOpen: true })),
          }}
          className={styles.modalWrapperRename}
        >
          <div className="">
            <div className="">
              <div className="md:text-2xl text-lg font-medium md:mb-4 mb-2">Rename File</div>
              <Input
                type="text"
                required={false}
                name={"renameFile"}
                register={register}
                inputField={styles.input}
                labelClass={styles.labelClass}
                placeholder="Enter File Name"
              />
            </div>

            <div className="w-full min-w-72 mt-3">
              <div className=" flex md:gap-4 gap-2 justify-end items-center ">
                <Button
                  text="Cancel"
                  btnClass={styles.renameCancelBtn}
                  className={`${styles.btnCreateClassText} `}
                  handleClick={() =>
                    setIsShot((prev) => ({ ...prev, shotIds: "", isRenameOpen: false }))
                  }
                />
                <Button
                  handleClick={async () => {
                    await handleRenameFiles();
                  }}
                  text="Save"
                  isLoading={isProcessing}
                  btnClass={styles.renameBtn}
                  className={`${styles.btnClassTextS} `}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isShot?.isShotOpen && (
        <Modal
          {...{
            open: isShot?.isShotOpen,
            handleClose: () => setIsShot((prev) => ({ ...prev, isShotOpen: true })),
          }}
          className={styles.modalWrapper}
        >
          <div className="flex justify-center items-center flex-col md:gap-7 gap-4">
            <div className="flex justify-center items-center flex-col md:gap-3 gap-2">
              <div className={styles.deleteClass}>
                <Image
                  data-testid="close-icon"
                  style={{
                    borderRadius: "10px",
                  }}
                  src={"/assets/delete-icon.png"}
                  alt="play button"
                  height="100"
                  width="100"
                />
              </div>
              <div className={styles.deleteHeading}>Are you sure?</div>
            </div>

            <div className="w-full min-w-72">
              <div className=" flex md:gap-4 gap-2 justify-end items-center flex-col">
                <Button
                  handleClick={async () => {
                    await handleDelete(handleDeleteShots, isShot as any, setIsShot as any);
                  }}
                  text={
                    isRename ? <Loading loaderClass={`${styles.loaderSaveClass}`} /> : "Yes, Delete"
                  }
                  btnClass={styles.deleteBtnS}
                  className={`${styles.btnClassTextS} `}
                  isLoading={isProcessing}
                />
                <Button
                  text="Cancel Delete"
                  btnClass={styles.deleteBtnC}
                  className={`${styles.btnCreateClassText} `}
                  handleClick={() =>
                    setIsShot((prev) => ({ ...prev, shotIds: "", isShotOpen: false }))
                  }
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isShot?.isMove && (
        <Modal
          {...{
            open: isShot?.isMove,
            handleClose: () => setIsShot((prev) => ({ ...prev, isMove: true })),
          }}
          className={styles.modalWrapper1}
        >
          <div className="flex justify-center items-center flex-col md:gap-7 gap-4">
            <div className="flex justify-center items-center flex-col md:gap-3 gap-2">
              <div className={styles.deleteClass}>
                <Image
                  data-testid="close-icon"
                  style={{
                    borderRadius: "10px",
                  }}
                  src={"/assets/move.png"}
                  alt="play button"
                  height="50"
                  width="100"
                />
              </div>
              <div className={styles.deleteHeading2}>
                {`Are you sure you want to move ${isShot?.media?.name} from ${isShot?.shortName?.label} to ${isShot?.shortName2?.label}?`}
              </div>
            </div>

            <div className="w-full min-w-72">
              <div className=" flex md:gap-4 gap-2 justify-end items-center flex-col">
                <Button
                  handleClick={async () => {
                    await handleMoves({
                      selectedShot: isShot?.shortName?.value,
                      moveShot: isShot?.shortName2?.value,
                      media: isShot?.media,
                    });
                  }}
                  text={
                    isRename ? (
                      <Loading loaderClass={`${styles.loaderSaveClass}`} />
                    ) : (
                      "Yes, Move this file"
                    )
                  }
                  // text="Yes, Move this file"
                  btnClass={styles.deleteBtnS}
                  className={`${styles.btnClassTextS} `}
                  isLoading={isProcessing}
                />
                <Button
                  text="No, Keep it there"
                  btnClass={styles.deleteBtnC}
                  className={`${styles.btnCreateClassText} `}
                  handleClick={() => setIsShot((prev) => ({ ...prev, shotIds: "", isMove: false }))}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        {...{
          open: isClipOpen?.isOpen,
          handleClose: () =>
            setIsClipOpen((prev: any) => ({ ...prev, isOpen: false, fileType: "", imageUrl: "" })),
        }}
        className={styles.classModal}
      >
        {isClipOpen && isClipOpen?.fileType === "video" ? (
          <video className={styles.videoPlayer} controls>
            <source src={isClipOpen?.imageUrl} type="video/mp4" />
            <track kind="captions" src={isClipOpen?.imageUrl} />
          </video>
        ) : isClipOpen && isClipOpen?.fileType === "image" ? (
          <Image
            data-testid="close-icon"
            style={{
              borderRadius: "10px",
            }}
            className={styles.videoPlayer}
            src={isClipOpen?.imageUrl as string}
            alt="play button"
            height="50"
            width="100"
          />
        ) : // <img src={isClipOpen?.url} className={styles.videoPlayer} alt="openMedia" />
        isClipOpen && isClipOpen?.fileType === "audio" ? (
          <video className={styles.videoPlayer} controls>
            <source src={isClipOpen?.imageUrl} type="audio/mpeg" />
            <track kind="captions" src={isClipOpen?.imageUrl} />
          </video>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default ViewContainer;
