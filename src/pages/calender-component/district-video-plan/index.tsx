"use client";
import moment from "moment";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { SketchPicker } from "react-color";
import ReactDatePicker from "react-datepicker";
import React, { useEffect, useMemo, useRef, useState } from "react";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Selection from "@/src/components/selection";
import VideoContainer from "./component/video-container";
import { useOutsideClickHook } from "@/src/helper/helper";
import createNotification from "@/src/components/create-notification";

import {
  addVideoRequestThemes,
  getVideoThemeById,
  updateVideoThemes,
} from "@/src/app/api/video-request-themes";

import { sendReminderEmailVideoRequest } from "@/src/app/api/video-request";

import { useCalender } from "@/src/(context)/calender-context";
import { useClients } from "@/src/(context)/context-collection";

import style from "./index.module.scss";

const DistrictVideoPlanComponent = () => {
  const {
    control,
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    themeName: string;
    dateFilter?: { value: string; label: string };
    sortOrder?: {
      label: string;
      value: string;
    } | null;
  }>({
    defaultValues: {
      themeName: "",
    },
  });

  const clickRef = useRef<HTMLDivElement | null>(null);

  useOutsideClickHook(clickRef, () => {
    setIsShow(false);
  });

  const contextData = useClients();
  const loggedInUser = contextData && contextData?.loggedInUser;
  const currentUserRole = contextData && contextData?.currentUserRole;
  const selectedClient = contextData && contextData?.selectedClient;
  const selectedClientIds = contextData && contextData?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const {
    loading,
    setLoading,
    handleCategory,
    videoThemesData,
    handleActiveFilter,
    handleGetAllThemes,
    handleUnActiveFilter,
  } = useCalender();

  const [hex, setHex] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>();
  const [isShow, setIsShow] = useState<boolean>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [errorMessage, setErrorMessage] = useState<{
    startError?: string;
    endError?: string;
    colorError?: string;
  }>();

  const [alertEmail, setAlertEmail] = useState<{
    isAlertModal?: boolean;
    isLoading?: boolean;
    isSendEmail?: boolean;
    sendEmial?: [{ assignTo: string; videoRequestId: string }];
  }>({
    isAlertModal: false,
    isLoading: false,
    isSendEmail: false,
  });

  const handleIsModalClose = () => setIsOpen(false);
  const handleIsModalOpen = () => setIsOpen(true);
  const handleColorPicker = () => setIsShow(true);

  const handleCancel = () => {
    setIsShow(false);
    handleIsModalClose();
    setStartDate(null);
    setEndDate(null);
    setValue("themeName", "");
    setHex("");
    setLoading((prev: any) => ({ ...prev, isUpdateing: "" }));
  };

  const onSubmit = async (date: any) => {
    if (watch("dateFilter")?.value === "" || watch("dateFilter") === undefined) {
      createNotification({
        type: "warn",
        message: "Warnning!",
        description: "Please select a school year",
      });
    } else {
      if (!startDate) {
        setErrorMessage((prev) => ({ ...prev, startError: "Required" }));
      }
      if (!endDate) {
        setErrorMessage((prev) => ({ ...prev, endError: "Required" }));
      }
      if (!hex) {
        setErrorMessage((prev) => ({ ...prev, colorError: "Required" }));
      }

      const start = moment(startDate).format("YYYY-MM-DD");
      const end = moment(endDate).format("YYYY-MM-DD");

      if (start > end) {
        setErrorMessage((prev) => ({ ...prev, colorError: "" }));
        setErrorMessage((prev) => ({
          ...prev,
          endError: "The end date should be greater than the start date",
        }));
      } else if (startDate && endDate && hex) {
        setErrorMessage({});
        try {
          const themeData = {
            themeColor: hex,
            userId: loggedInUser?._id,
            clientId: selectedClientId,
            themeName: date?.themeName,
            toDate: endDate,
            fromDate: startDate,
            schoolYear: watch("dateFilter")?.value,
          };

          const res: any = loading?.isUpdateing
            ? await updateVideoThemes({ id: loading?.isUpdateing, data: themeData })
            : await addVideoRequestThemes({ data: themeData });

          if (res?.status === 200) {
            handleIsModalClose();
            setStartDate(null);
            setEndDate(null);
            setValue("themeName", "");
            setHex("");
            handleGetAllThemes();
            setLoading((prev: any) => ({ ...prev, isUpdateing: "" }));
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleUpdate = ({ themeId }: { themeId: string }) => {
    handleGetVideoThemeById({ themeId });
    handleIsModalOpen();
  };

  const handleGetVideoThemeById = async ({ themeId }: { themeId: string }) => {
    try {
      setLoading((prev: any) => ({
        ...prev,
        isLoading: false,
        UpdatedLoading: true,
        isUpdateing: themeId,
      }));
      const response = await getVideoThemeById({ themeId });

      if (response.status === 200) {
        setStartDate(response?.data?.fromDate);
        setEndDate(response?.data?.toDate);
        setValue("themeName", response?.data?.themeName);
        setHex(response?.data?.themeColor);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }
    setLoading((prev: any) => ({ ...prev, isLoading: false, UpdatedLoading: false }));
  };

  const handleUpdateVideoPlan = ({ addVideoRequestData }: { addVideoRequestData: any }) => {
    addVideoRequestData && handleGetAllThemes();
  };

  const handleSendAlertEvent = () => {
    setAlertEmail((prev) => ({ ...prev, isAlertModal: true }));
  };

  const handleSendAlertEventClose = () => {
    setAlertEmail((prev: any) => ({
      ...prev,
      isAlertModal: false,
      isLoading: false,
      sendEmial: [],
    }));
  };
  // video project api call here
  const sortOrderApply = useMemo(() => {
    const selectedSortOrder = watch("sortOrder");

    switch (selectedSortOrder?.value) {
      case "Last Modified":
        return { sortBy: "updatedAt", sortOrder: "desc" };
      case "Oldest":
        return { sortBy: "createdAt", sortOrder: "asc" };
      case "Alphabetical ascending":
        return { sortBy: "videoRequestName", sortOrder: "asc" };
      case "Alphabetical descending":
        return { sortBy: "videoRequestName", sortOrder: "desc" };
      case "Due Date(Ascending)":
        return { sortBy: "dueDate", sortOrder: "asc" };
      case "Due Date (Descending)":
        return { sortBy: "dueDate", sortOrder: "desc" };
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("sortOrder")]);

  const filterAssignToData = useMemo(() => {
    const assignTo = videoThemesData
      ?.flatMap((data) => {
        return data?.videoRequestIds?.length ? data.videoRequestIds : [];
      })
      .filter((data) => data?.dueDate != null || data?.dueDate != undefined);

    return assignTo;
  }, [videoThemesData]);

  const filteredThemes = useMemo(() => {
    if (sortOrderApply) {
      return videoThemesData?.reduce((acc: any[], theme: any) => {
        const sortedVideoRequestIds = theme.videoRequestIds?.sort((a: any, b: any) => {
          const valueA = a.videoRequestId[sortOrderApply.sortBy];
          const valueB = b.videoRequestId[sortOrderApply.sortBy];

          if (sortOrderApply.sortOrder === "asc") {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          }
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        });

        const filteredVideoRequestIds = sortedVideoRequestIds?.filter((item: any) => {
          return item.videoRequestId?.assignTo?._id === loggedInUser?._id;
        });

        acc.push({
          ...theme,
          videoRequestIds:
            currentUserRole === "producer" ? filteredVideoRequestIds : sortedVideoRequestIds,
        });

        return acc;
      }, []);
    } else {
      return videoThemesData?.map((theme) => {
        if (theme?.videoRequestIds) {
          const updatedVideoRequestIds =
            currentUserRole === "producer"
              ? theme.videoRequestIds
                  .filter((id: any) => id?.videoRequestId?.assignTo?._id === loggedInUser?._id)
                  .sort((a: any, b: any) => a.orderNumber - b.orderNumber)
              : [...theme.videoRequestIds].sort((a: any, b: any) => a.orderNumber - b.orderNumber);

          return {
            ...theme,
            videoRequestIds: updatedVideoRequestIds,
          };
        }
        return theme;
      });
    }
  }, [sortOrderApply, videoThemesData, loggedInUser]);

  useEffect(() => {
    if (filterAssignToData) {
      const allUser = filterAssignToData?.map((user) => {
        return { assignTo: user?.assignTo?._id, videoRequestId: user?._id };
      });

      setAlertEmail((prev: any) => ({
        ...prev,
        sendEmial: allUser,
      }));
    }
  }, [filterAssignToData, alertEmail?.isAlertModal]);

  const handleSelectUserAlert = ({
    userId,
    videoRequestId,
  }: {
    userId: string;
    videoRequestId: string;
  }) => {
    setAlertEmail((prev: any) => {
      const isSelected = prev?.sendEmial?.some(
        (email: any) => email.videoRequestId === videoRequestId && email.assignTo === userId,
      );

      const updatedSendEmail = isSelected
        ? prev?.sendEmial?.filter(
            (email: any) => !(email.videoRequestId === videoRequestId && email.assignTo === userId),
          )
        : [...prev?.sendEmial, { assignTo: userId, videoRequestId }];

      return {
        ...prev,
        sendEmial: updatedSendEmail,
      };
    });
  };

  const handleSendEmailAlert = async () => {
    setAlertEmail((prev: any) => ({
      ...prev,
      isSendEmail: true,
    }));

    const sendEmail = alertEmail?.sendEmial as [{ videoRequestId: string; assignTo: string }];

    try {
      const res: any = await sendReminderEmailVideoRequest({
        sendEmail,
        requestedById: loggedInUser?._id,
      });

      if (res.status === 200) {
        createNotification({ type: "success", message: "Success!", description: res?.data?.msg });
      }
      if (res) {
        setAlertEmail((prev: any) => ({
          ...prev,
          isAlertModal: false,
          isLoading: false,
          isSendEmail: false,
          sendEmial: [],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const yearList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2024;
    const endYear = currentYear + 10;
    const yearList = [];

    for (let i = startYear; i < endYear; i++) {
      const yearObject = {
        label: `${i}-${i + 1}`,
        value: `${i}-${i + 1}`,
      };
      yearList.push(yearObject);
    }

    return yearList;
  }, []);

  useEffect(() => {
    handleCategory?.({ schoolYear: watch("dateFilter")?.value as string });
  }, [watch("dateFilter")]);

  useEffect(() => {
    if (watch("sortOrder")) {
      handleUnActiveFilter?.();
    } else {
      handleActiveFilter?.();
    }
  }, [watch("sortOrder")]);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let date;
    if (currentDate.getMonth() >= 7) {
      date = yearList?.find((year) => year?.value?.startsWith(`${currentYear}`));
    }

    setValue("dateFilter", date as any);
    handleCategory?.({ schoolYear: date?.value as string });
  }, [yearList]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap md:border-b md:border-b-[#B8B8B8] md:pb-[10px]">
        <div className="text-[#0F0F0F] md:text-[18px] text-[16px] font-medium leading-normal md:pb-0 pb-[10px] ">
          District Video plan
        </div>
        <div className=" md:pb-0 pb-[10px] ">
          <Selection
            options={yearList}
            customPaddingRight="20px !important"
            name={"dateFilter"}
            placeholder="Select"
            isSearchable={false}
            control={control as any}
            boderCustomeStyle={true}
            iconClass={"!top-[8px]"}
            labelClassName="!mt-[4px]"
            imageClass="!w-[16px] !h-[16px]"
            customBorder={"1px solid #B8B8B8"}
            placeholderWidth="125px !important"
          />
        </div>
        <div className={`flex justify-end items-center  ${style.classForMobileScreen}`}>
          <div className={style.inventorySelectionBox}>
            <Selection
              control={control}
              isClearable={true}
              isSearchable={false}
              name={"sortOrder"}
              options={sortOptions}
              customPadding={true}
              boderCustomeStyle={true}
              iconClass={"!top-[8px]"}
              placeholder="Sort"
              className="min-w-[150px]"
              customBorder={"1px solid #B8B8B8"}
            />
          </div>
          {currentUserRole != "producer" && (
            <div className="flex items-center justify-between w-full md:w-auto md:justify-normal md:border-none border-t border-t-[#B8B8B8]">
              <Button
                text="Create New Theme"
                imgClass="!h-[16px] !w-[16px]"
                handleClick={handleIsModalOpen}
                iconStart={"/assets/plus-red.png"}
                disabled={watch("dateFilter") ? false : true}
                btnClass="!rounded-md !bg-transparent !gap-[5px]"
                className={`!text-[#ED1C24] text-sm !font-medium`}
              />
              <Image
                width="100"
                height="100"
                alt="sortUp"
                data-testid="close-icon"
                src={"/assets/notify.svg"}
                style={{ cursor: "pointer" }}
                className="!w-[24px] !h-[24px]"
                onClick={handleSendAlertEvent}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className={`overflow-auto  ${style.scrollbarVisibleClass} ${loading?.isLoading ? "flex justify-center items-center md:h-[500px] h-[300px]" : ""}`}
      >
        {loading?.isLoading ? (
          <Loader pageLoader={false} loaderClass={style.loaderClassAssigned} />
        ) : videoThemesData.length === 0 ? (
          <div className="flex flex-col items-center justify-center  md:h-[500px] h-[calc(100vh-485px)]">
            <Image
              width="100"
              height="100"
              alt="sortUp"
              data-testid="close-icon"
              src={"/assets/no-theme.png"}
              className="!w-[100px] !h-[100px]"
            />
            <span className="text-[#A1A1A1] md:text-[18px] text-[16px] mt-[5px] ">
              {!watch("dateFilter") ? "Select School Year" : "No Theme Created Yet"}
            </span>
          </div>
        ) : (
          <VideoContainer
            handleUpdate={handleUpdate}
            videoThemesData={filteredThemes}
            handleUpdateVideoPlan={handleUpdateVideoPlan}
          />
        )}
      </div>

      <Modal
        open={alertEmail?.isAlertModal}
        handleClose={handleSendAlertEventClose}
        className={`${style.modalAlert} ${alertEmail.isLoading ? style.heightLoadingClass : ""}`}
      >
        <div>
          <div className="md:text-2xl text-xl font-semibold">Video Request Due Reminder</div>
        </div>
        <div className="text-[#0F0F0F] text-[16px] font-normal leading-normal mt-2 mb-4">
          This Reminder email will be sent to following assignees;
        </div>
        {alertEmail.isLoading ? (
          <div className="flex justify-center items-center h-[490px]">
            <Loader pageLoader={false} loaderClass={style.loaderClassAssigned} />
          </div>
        ) : (
          <>
            {filterAssignToData?.map((assign) => {
              return (
                <div key={assign} className="flex items-center gap-4">
                  <CheckUser
                    checkValue={
                      !!alertEmail?.sendEmial?.find(
                        (videoRequest) =>
                          videoRequest.videoRequestId === assign?._id &&
                          videoRequest.assignTo === assign?.assignTo?._id,
                      )
                    }
                    handleCheck={handleSelectUserAlert}
                    userId={assign?.assignTo?._id}
                    videoRequestId={assign?._id}
                  />
                  <div className="flex items-center gap-1 ">
                    <div>
                      <Image
                        data-testid="close-icon"
                        src={"/assets/user-black.svg"}
                        alt="sortUp"
                        style={{ cursor: "pointer" }}
                        className="!w-[24px] !h-[24px]"
                        height="100"
                        width="100"
                      />
                    </div>
                    <div className="my-[10px] break-all md:w-full w-fit md:overflow-hidden text-[var(--Fonts-Font-B,#0F0F0F)] md:text-ellipsis md:whitespace-nowrap text-[16px] font-medium leading-normal">
                      {`${assign?.assignTo?.username || assign?.assignTo?.fullName} from "${assign?.videoRequestName}"`}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 justify-end mt-5">
              <Button
                type="button"
                text="Cancel"
                handleClick={handleSendAlertEventClose}
                className={`!text-[#ED1C24] !font-semibold`}
                btnClass={`!rounded-md !bg-transparent ${style.borderRed}`}
              />

              <Button
                handleClick={handleSendEmailAlert}
                text={"Confirm"}
                isLoading={alertEmail?.isSendEmail}
                className={`!text-[#fff] !font-semibold`}
                btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-max !max-w-none `}
              />
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={isOpen}
        handleClose={handleCancel}
        className={`${style.modalContentWrapper} ${loading.UpdatedLoading ? style.heightLoadingClass : ""}`}
      >
        <div>
          <div className="md:text-2xl text-xl font-semibold">
            {loading.isUpdateing ? "Update Theme" : "Create New Theme"}
          </div>
        </div>
        {loading.UpdatedLoading ? (
          <div className="flex justify-center items-center h-[490px]">
            <Loader pageLoader={false} loaderClass={style.loaderClassAssigned} />
          </div>
        ) : (
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="">
                <Input
                  name={"themeName"}
                  register={register}
                  required={true}
                  label="Name"
                  inputField={style.inputCss}
                  labelClass={style.labelClassInput}
                  placeholder="Enter Name"
                  type="text"
                  errorMessage={errors?.themeName && errors?.themeName?.message}
                />
              </div>

              <div className="my-3">
                <label htmlFor="" className={style.labelClass}>
                  Start Date
                </label>
                <ReactDatePicker
                  className={style.DatePicker}
                  name={"dueDate"}
                  dateFormat={"yyyy-MM-dd"}
                  placeholderText="YYYY-MM-DD"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <span className="absolute block font-medium ml-[1px] mt-0 text-[#ff5050] text-[11px]">
                  {errorMessage?.startError && errorMessage?.startError}
                </span>
              </div>
              <div className="my-3">
                <label htmlFor="" className={style.labelClass}>
                  End Date
                </label>
                <ReactDatePicker
                  placeholderText="YYYY-MM-DD"
                  dateFormat={"yyyy-MM-dd"}
                  className={style.DatePicker}
                  name={"dueDate"}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
                <span className="absolute block font-medium ml-[1px] mt-0 text-[#ff5050] text-[11px]">
                  {errorMessage?.endError && errorMessage?.endError}
                </span>
              </div>
              <div className="my-3">
                <label htmlFor="" className={style.labelClass}>
                  Color
                </label>
                <div className="flex flex-wrap gap-3 ">
                  {colorSelection?.map((color) => {
                    return (
                      <div
                        key={color}
                        style={{
                          background: color,
                          border: color === hex ? "2px solid black" : "",
                        }}
                        className={` rounded-full w-[30px] h-[30px] cursor-pointer `}
                        onClick={() => {
                          setHex(color);
                        }}
                      ></div>
                    );
                  })}
                  <Image
                    className="!w-[30px] !h-[30px]"
                    src="/assets/color-picker.svg"
                    alt="Edit"
                    style={{ cursor: "pointer" }}
                    height={100}
                    width={100}
                    onClick={handleColorPicker}
                  />
                  {isShow && (
                    <div className="absolute bottom-28" ref={clickRef}>
                      <SketchPicker
                        color={hex}
                        onChangeComplete={(color) => {
                          setHex(color.hex);
                        }}
                      />
                    </div>
                  )}
                  {!colorSelection?.includes(hex) && hex != "" && (
                    <div
                      style={{
                        background: hex,
                        border: "2px solid black",
                      }}
                      className={` rounded-full w-[30px] h-[30px] cursor-pointer `}
                    ></div>
                  )}
                </div>
                <span className="absolute block font-medium ml-[1px] mt-0 text-[#ff5050] text-[11px]">
                  {errorMessage?.colorError && errorMessage?.colorError}
                </span>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  text="Cancel"
                  handleClick={handleCancel}
                  className={`!text-[#ED1C24] !font-semibold`}
                  btnClass={`!rounded-md !bg-transparent ${style.borderRed}`}
                />

                <Button
                  type="submit"
                  text={loading.isUpdateing ? "Update Theme" : "Create Theme"}
                  isLoading={isSubmitting}
                  className={`!text-[#fff] !font-semibold`}
                  btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-max !max-w-none `}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default DistrictVideoPlanComponent;

const CheckUser = ({
  handleCheck,
  userId,
  checkValue,
  videoRequestId,
}: {
  handleCheck: ({ userId, videoRequestId }: { userId: string; videoRequestId: string }) => void;
  videoRequestId: string;
  checkValue: boolean;
  userId: string;
}) => {
  const handleClickEvent = () => handleCheck({ videoRequestId, userId });
  return (
    <div className="mb-[-8px]">
      <input
        onClick={handleClickEvent}
        type="checkbox"
        checked={checkValue}
        className={style.customCheckbox}
      />
    </div>
  );
};

const colorSelection = [
  "#FF4081",
  "#1BBC9C",
  "#2ECD6F",
  "#3082B7",
  "#3397DD",
  "#7C4DFF",
  "#81B1FF",
  "#9B59B6",
  "#AF7E2E",
  "#BF55EC",
  "#EA80FC",
  "#F900EA",
  "#F9D900",
  "#FF7800",
  "#FF7FAB",
];

const sortOptions = [
  { label: "Last Modified", value: "Last Modified" },
  { label: "Oldest", value: "Oldest" },
  { label: "Alphabetical (Ascending)", value: "Alphabetical ascending" },
  { label: "Alphabetical (Descending)", value: "Alphabetical descending" },
  { label: "Due Date (Ascending)", value: "Due Date(Ascending)" },
  { label: "Due Date (Descending)", value: "Due Date (Descending)" },
];
