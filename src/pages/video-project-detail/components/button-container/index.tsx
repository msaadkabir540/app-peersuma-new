"use client";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useMediaQuery } from "usehooks-ts";
import React, { useCallback, useMemo, useRef, useState } from "react";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";
import SelectionViewTab from "./selection-view-tab";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { lettersValue, s3TransloaditUploadMap } from "@/src/helper/helper";

import { VideoProjectButtonInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";
import "react-datepicker/dist/react-datepicker.css";

const ButtonContainer = ({
  control,
  register,
  setValue,
  dueDate,
  startDate,
  onSubmit,
  shotMedia,
  activeView,
  shotsOption,
  description,
  invitedUser,
  selectedShot,
  projectName,
  mediaLength,
  setStartDate,
  searchParams,
  isProcessing,
  handleSubmit,
  isContributor,
  setActiveView,
  videoProjectId,
  isEditingProcess,
  searchParamsValue,
  isDeletingScenes,
  handleUploadMedia,
  watchContributor,
  contributorOption,
  handleSearchEvent,
  handleInvitesModal,
  handleDeleteShotById,
  handleSetEventCross,
  handleSendReminderMail,
  handleUpdateShotUrlModalOpen,
}: VideoProjectButtonInterface) => {
  const isMobile = useMediaQuery("(max-width: 770px)");

  const inputFile = useRef<HTMLInputElement | null>(null);

  const [droppedFiles, setDroppedFiles] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [callUpdate, setCallUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shotModal, setShotModal] = useState({
    isModalOpen: false,
    fileName: "uploadMedia",
  });

  const handleCreateUpdateShot = async (data: any) => {
    const shotData = {
      name: data?.shotName,
      description: data?.shotDescription,
      updated: false,
      shotId: "",
    };

    let response;
    if (data?.shotName.trim().length === 0) {
      setError("Required");
    } else {
      setError("");
      if (callUpdate) {
        shotData.updated = true;
        shotData.shotId = selectedShot?.value || "";
        response = await onSubmit(shotData);
        response && setIsOpen(false);
        setCallUpdate(false);
        setValue("shotName", "");
        setValue("shotDescription", "");
        setStartDate(dueDate);
        handleCloseEvent();
      } else {
        response = await onSubmit(shotData);
        if (response) {
          setIsOpen(false);
          setCallUpdate(false);
        }
      }
    }
    setValue("shotDescription", "");
  };

  const handleUpdate = () => {
    setValue && setValue("shotName", selectedShot?.label || "");
    setValue && setValue("shotDescription", description || "");
    setStartDate(dueDate);
    setCallUpdate(true);
    setIsOpen(true);
  };

  const handleCloseEvent = () => {
    setCallUpdate(false);
    setIsOpen(false);
    setError("");
    setStartDate("");
    setValue?.("shotName", "");
    setValue?.("shotDescription", "");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditingProcess) {
      const files = e?.dataTransfer?.files as any;
      if (files) {
        setDroppedFiles(files);
        setShotModal((prev) => ({ ...prev, isModalOpen: true, fileName: "uploadMedia" }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onButtonClick = () => {
    if (!isEditingProcess) {
      inputFile?.current?.click();
    }
  };

  const handleFileUpload = useCallback(
    (e: any) => {
      const { files } = e.target;

      if (files) {
        setDroppedFiles(files);
        setShotModal((prev) => ({ ...prev, isModalOpen: true, fileName: "uploadMedia" }));
      }
    },
    [setDroppedFiles, setShotModal],
  );

  const handleSelectedShot = ({ label, value }: { label: string; value: string }) => {
    const selectedValue = { label, value };
    setValue && setValue("selectedShot", selectedValue);
  };

  const handleClickContributor = ({ label, value }: { label: string; value: string }) => {
    const selectedValue = { label, value };

    if (value != watchContributor?.value) {
      setValue && setValue("contributor", selectedValue);
    } else {
      setValue && setValue("contributor", null);
    }
  };

  const filterShotMedia = useMemo(() => {
    return shotMedia?.find((media) => {
      return media?._id === selectedShot?.value;
    });
  }, [shotMedia, selectedShot]);

  const createdDate = useMemo(() => {
    return filterShotMedia?.dueDate
      ? moment(filterShotMedia?.dueDate as string).format("YYYY-MM-DD ")
      : "-";
  }, [filterShotMedia?.dueDate]);

  const handleCreateModal = () => {
    if (shotMedia!?.length < 3) {
      setIsOpen(true);
    } else {
      createNotification({ type: "error", message: "Not create more then 3 scenes" });
    }
  };

  const handleClickToOpenShotURL = () => {
    if (!isEditingProcess) {
      handleUpdateShotUrlModalOpen();
    }
  };

  const handleClickCloseUploadModal = () => {
    setShotModal((prev) => ({ ...prev, isModalOpen: false }));
    setDroppedFiles(null);
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center  md:mt-5 md:h-12 md:mb-2 my-2 flex-row  md:border-b md:border-[#B8B8B8]">
        <div className="md:flex hidden justify-start">
          {shotsOption?.map((shot) => {
            return (
              <SceneList
                shotName={shot?.label}
                shotValue={shot?.value}
                selectedScene={selectedShot?.value!}
                handleSelectedShot={handleSelectedShot}
              />
            );
          })}
          <div
            className={`flex items-center gap-[10px] ${shotMedia!?.length < 3 ? "" : "ml-[15px]"} `}
          >
            {!isContributor && (
              <>
                {shotMedia!?.length < 3 && (
                  <Tooltip backClass="!bottom-[53px]" text={`Create New Scene`}>
                    <div>
                      <Button
                        text="Create New Scene"
                        disabled={isEditingProcess}
                        imgClass={"md:!w-[20px] md:!h-[20px] !h-[24px] !w-[24px]"}
                        btnClass={`${styles.btnCreateClassAdd} ${isEditingProcess ? "!bg-[#c3c2c2]" : "!bg-[#0F0F0F]"}`}
                        iconStart={"/assets/plus-black.svg"}
                        handleClick={handleCreateModal}
                        className={`!text-[#0F0F0F] font-normal text-[14px] md:block hidden !text-sm`}
                      />
                    </div>
                  </Tooltip>
                )}
                <Tooltip
                  backClass={` ${styles.tooltipClass} !bottom-[35px] !right-[-780px] `}
                  text={`${!isEditingProcess && "Scene is a folder for organizing media in a project. We can create upto 3 Scenes in a  single project and invite others to upload media in each scene."}`}
                >
                  <Button
                    iconStart={"/assets/info.svg"}
                    imgClass={"md:!w-[24px] md:!h-[24px] !h-[24px] !w-[24px]"}
                    btnClass={`${styles.btnMedias2}`}
                  />
                </Tooltip>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden flex justify-start items-center gap-2">
          <Selection
            control={control}
            id="selectedShot"
            name="selectedShot"
            customPadding={true}
            isSearchable={false}
            options={shotsOption || []}
            customBorder="none !important"
            imageClass={"!w-[24px] !h-[24px]"}
            customIcon={"/assets/down-gray.svg"}
            customPaddingRight="30px !important"
            customMinOnly="156px !important"
            iconClass={"md:!top-[11px] !top-[7px]"}
            className={styles.selectedScenesClassName}
            customHeight={`${isMobile ? "34px !important" : "44px !important"}`}
          />
          <div className="flex items-center gap-1">
            {!isContributor && (
              <>
                {shotMedia!?.length < 3 && (
                  <Tooltip backClass="!bottom-[53px]" text={`Create New Scene`}>
                    <div>
                      <Button
                        disabled={isEditingProcess}
                        imgClass={"md:!w-[20px] md:!h-[20px] !h-[24px] !w-[24px]"}
                        btnClass={`${styles.btnCreateClassAdd} ${isEditingProcess ? "!bg-[#c3c2c2]" : "!bg-[#0F0F0F]"}`}
                        iconStart={"/assets/plus-red.png"}
                        handleClick={handleCreateModal}
                      />
                    </div>
                  </Tooltip>
                )}
              </>
            )}
            <Tooltip
              backClass={` ${styles.tooltipClass} !bottom-[35px] !right-[-780px] `}
              text={`${!isEditingProcess && "Scene is a folder for organizing media in a project. We can create multiple Scenes in a  single project and invite others to upload media in each scene."}`}
            >
              <Button
                iconStart={"/assets/info.svg"}
                btnClass={styles.btnMedias}
                imgClass={"md:!w-[24px] md:!h-[24px] !h-[24px] !w-[24px]"}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex justify-end items-start gap-2">
          {!isContributor && (
            <>
              <Tooltip
                backClass={``}
                text={`${!isEditingProcess ? "Edit Scene" : "project is under editing you cannot invite the user"}`}
              >
                <Button
                  iconStart={"/assets/pen-black.svg"}
                  btnClass={styles.btnMedias}
                  disabled={isEditingProcess}
                  imgClass={"md:!w-[24px] md:!h-[24px] !h-[24px] !w-[24px]"}
                  handleClick={handleUpdate}
                />
              </Tooltip>
              {shotsOption?.length > 1 && (
                <Tooltip
                  backClass={``}
                  text={`${!isEditingProcess ? "Delete" : "project is under editing you cannot invite the user"}`}
                >
                  <Button
                    loaderClass={styles.loadingClass}
                    iconStart={"/assets/delete-black.svg"}
                    btnClass={styles.btnMedias}
                    disabled={isEditingProcess}
                    isLoading={isDeletingScenes}
                    imgClass={"md:!w-[24px] md:!h-[24px] !h-[24px] !w-[24px]"}
                    handleClick={handleDeleteShotById}
                  />
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
      {shotsOption?.length >= 1 && (
        <>
          <div className="flex flex-col items-start gap-[10px] self-stretch my-[10px]">
            <div className="text-[#0F0F0F] text-[14px] font-normal leading-normal">
              More about {selectedShot?.label}:
            </div>
            <div className="text-[#0F0F0F] text-[14px] font-light leading-normal">
              {filterShotMedia?.description}
            </div>
            <div className="text-[#0F0F0F] text-[14px] font-normal leading-normal">
              Due Date:{" "}
              <span className="text-[#0F0F0F] text-[14px] font-light leading-normal">
                {createdDate}
              </span>
            </div>
          </div>

          <div
            className={`grid  gap-4 ${!isContributor ? "grid-cols-1 md:grid-cols-[7fr_3fr]" : "grid-cols-1 "}`}
          >
            <div className="">
              <div className="relative" onDrop={handleDrop} onDragOver={handleDragOver}>
                <input
                  style={{ position: "absolute", top: "-100000px" }}
                  // accept=".zip,.rar"
                  ref={inputFile}
                  onChange={handleFileUpload}
                  type="file"
                />
                <div className="flex md:h-[400px] h-[300px] p-[var(--N20,20px)] flex-col justify-center items-center gap-[var(--N10,10px)] self-stretch rounded-[var(--N10,10px)] border border-dashed border-[var(--Stroke-Stroke-D,#B8B8B8)] bg-[var(--Background-BG-2,#FFF)]">
                  <div className="text-black text-center text-[18px] font-light leading-normal">
                    To get started, simply upload media to {projectName}
                  </div>
                  <div className="text-black text-center text-[18px] font-light leading-normal">
                    <span
                      className={` md:ml-2 ml-1 font-medium ${isEditingProcess ? "text-[#c3c2c2] " : "text-[#ED1C24]"}`}
                    >
                      Drop{" "}
                    </span>{" "}
                    media files here or
                    <span
                      className={` md:ml-2 ml-1 underline font-medium ${isEditingProcess ? "text-[#c3c2c2] " : "text-[#ED1C24]  cursor-pointer"}`}
                      onClick={onButtonClick}
                    >
                      Upload Media
                    </span>
                  </div>
                  <div className="text-black text-center text-[18px] font-light leading-normal">
                    Share this{" "}
                    <span
                      className={`text-[#ED1C24] underline font-medium ${isEditingProcess ? "text-[#c3c2c2] " : "text-[#ED1C24] cursor-pointer "}`}
                      onClick={handleClickToOpenShotURL}
                    >
                      Link{" "}
                    </span>{" "}
                    with other contributors
                  </div>
                </div>
              </div>
            </div>
            {!isContributor && (
              <div className="flex p-[15px] flex-col items-start gap-[5px] rounded-[10px] border border-[0.5px] border-[#B8B8B8] bg-white">
                <div className="flex justify-between items-center w-full border-b border-[#B8B8B8] pb-[10px]">
                  <div>Scene Contributors:</div>
                  <div>
                    {" "}
                    {!isContributor && (
                      <Tooltip
                        backClass="!bottom-[53px]"
                        text={`${isEditingProcess ? "project is under editing you cannot invite the user" : "Invite the user"}`}
                      >
                        <Button
                          text={"Invite Contributor"}
                          imgClass={"md:!w-[20px] md:!h-[20px] !h-[24px] !w-[24px]"}
                          btnClass={`${styles.btnCreateClassInviteUser} ${isEditingProcess ? "!bg-[#c3c2c2]" : "!bg-[#ED1C24]"}`}
                          disabled={isEditingProcess}
                          className={`${styles.btnCreateClassText} !text-lg ${isEditingProcess ? "!text-[#c3c2c2]" : "!text-[#ED1C24]"}`}
                          iconStart={!isEditingProcess ? "/assets/add.svg" : "/assets/invites.svg"}
                          handleClick={handleInvitesModal}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
                {invitedUser && invitedUser?.length > 0 ? (
                  <div className="w-full h-[320px] overflow-scroll ">
                    {invitedUser?.map((data) => {
                      return (
                        <InvitedUserList
                          userId={data._id}
                          userName={data?.username}
                          selectedContributorsId={watchContributor?.value!}
                          handleClickContributor={handleClickContributor}
                          handleSendReminderMail={handleSendReminderMail}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[320px] flex justify-center items-center w-full">
                    No users invited yet
                  </div>
                )}
              </div>
            )}
          </div>

          <SelectionViewTab
            control={control}
            activeView={activeView}
            searchParams={searchParams}
            mediaLength={mediaLength}
            isContributor={isContributor}
            setActiveView={setActiveView}
            searchParamsValue={searchParamsValue}
            handleSearchEvent={handleSearchEvent}
            contributorOption={contributorOption}
            handleSetEventCross={handleSetEventCross}
          />
        </>
      )}

      {isOpen && (
        <>
          <Modal
            open={isOpen}
            className={styles.modalContentWrapper}
            handleClose={() => setIsOpen(true)}
          >
            <div>
              <div className="text-2xl font-medium ">
                {callUpdate ? "Update" : "Create"} New Scene
              </div>
            </div>
            <form className="mt-4" onSubmit={handleSubmit(handleCreateUpdateShot)}>
              <div className="">
                <div className="">
                  <Input
                    type="text"
                    label="Scene Name"
                    name={"shotName"}
                    errorMessage={error}
                    register={register}
                    inputField={styles.input}
                    placeholder="Enter scene name"
                    labelClass={styles.labelClass}
                  />
                </div>
                <div className="pt-5">
                  <label htmlFor="" className={styles.labelClass}>
                    Due Date (optional)
                  </label>
                  <DatePicker
                    name={"dueDate"}
                    selected={startDate}
                    dateFormat="yyyy-MM-dd"
                    className={styles.DatePicker}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>

                <div className="pt-5">
                  <Textarea
                    rows={3}
                    name={"shotDescription"}
                    register={register}
                    label="Description (optional)"
                    placeholder="Enter description"
                  />
                </div>
                <div className={`${styles.text} md:text-base text-xs`}>
                  Only invited contributor can see the description*
                </div>
                <div className="md:mt-4 mt-5 flex gap-2.5 !justify-start flex-row-reverse">
                  <Button
                    type="submit"
                    isLoading={isProcessing}
                    text={callUpdate ? "Update" : "Create"}
                  />
                  <Button
                    text="Cancel"
                    btnClass={styles.btnClass}
                    handleClick={handleCloseEvent}
                    className={styles.btnCreateClassText2}
                  />
                </div>
              </div>
            </form>
          </Modal>
        </>
      )}

      <div className={`${shotModal?.isModalOpen ? styles.transloaditBackground : ""}`}>
        <TransloaditUploadModal
          fieldName={shotModal?.isModalOpen}
          droppedFiles={droppedFiles}
          handleCloseModal={handleClickCloseUploadModal}
          setFieldName={(val) => {
            setShotModal((prev) => ({ ...prev, upload: val }));
          }}
          allowedFileTypes={[`video/*`, "image/*", `audio/*`]}
          mapUploads={s3TransloaditUploadMap}
          setUploads={async ({ uploads }) => {
            await handleUploadMedia({
              id: selectedShot?.value as string,
              uploads: uploads as any,
            });
            setShotModal((prev) => ({ ...prev, isModalOpen: false }));
            setDroppedFiles(null);
          }}
          fields={{
            prefix: `/video-project/${videoProjectId}/${selectedShot?.value}/`,
            timeStamp: moment().format("YYYYMMDD_HHmmss"),
          }}
        />
      </div>
    </>
  );
};

export default ButtonContainer;

const SceneList = ({
  shotValue,
  shotName,
  selectedScene,
  handleSelectedShot,
}: {
  shotValue: string;
  shotName: string;
  selectedScene: string;
  handleSelectedShot: ({ label, value }: { label: string; value: string }) => void;
}) => {
  const handleClickEvent = () => {
    handleSelectedShot({ label: shotName, value: shotValue });
  };

  return (
    <div className="flex items-center gap-[5px]">
      <div
        style={{ borderBottom: selectedScene === shotValue ? "2px solid #ED1C24" : "" }}
        key={shotValue}
        className={` flex p-[11px_15px] justify-center items-center  cursor-pointer ${
          selectedScene === shotValue ? "text-[#ED1C24]" : ""
        }`}
        onClick={handleClickEvent}
      >
        {shotName}
      </div>
      <div className="w-[1px] h-[22.006px] bg-[#B8B8B8]"></div>
    </div>
  );
};
const InvitedUserList = ({
  userName,
  userId,
  selectedContributorsId,
  handleSendReminderMail,
  handleClickContributor,
}: {
  userName: string;
  userId: string;
  selectedContributorsId: string;
  handleClickContributor: ({ label, value }: { label: string; value: string }) => void;
  handleSendReminderMail: ({ userName, userId }: { userName: string; userId: string }) => void;
}) => {
  const handleClickEvent = () => {
    handleSendReminderMail({ userName, userId });
  };
  const handleClickEventValue = () => {
    handleClickContributor({ label: userName, value: userId });
  };

  const inviteAvatar = useMemo(() => {
    return lettersValue({ value: userName });
  }, [userName]);
  return (
    <div className="flex justify-between items-center w-full border-b border-[#B8B8B8] py-[10px]">
      <div
        className="flex justify-start gap-[5px] items-center  cursor-pointer"
        onClick={handleClickEventValue}
      >
        <div
          className={`flex w-[24px] h-[24px] justify-center items-center rounded-[50%] ${selectedContributorsId === userId ? "border border-[#ED1C24] w-[26px] h-[26px]" : ""}`}
        >
          <div
            className={`!w-[24px] !h-[24px] text-[10px] !flex justify-center items-center rounded-full bg-slate-700 text-white `}
          >
            {inviteAvatar?.toUpperCase()}
          </div>
        </div>
        <div
          className={` text-[14px] font-normal leading-none ${
            selectedContributorsId === userId ? "text-[#ED1C24]" : "text-black"
          }`}
        >
          {userName}
        </div>
      </div>
      <div
        onClick={handleClickEvent}
        className="text-black font-poppins text-[12px] font-light leading-none cursor-pointer"
      >
        Send Reminder
      </div>
    </div>
  );
};
