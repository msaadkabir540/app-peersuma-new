import { useForm } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import React, { useEffect, useMemo, useState } from "react";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";

import {
  addVideoRequest,
  getVideoRequestById,
  updateVideoRequest,
} from "@/src/app/api/video-request";
import { updateVideoRequestIds } from "@/src/app/api/video-request-themes";

import { useCalender } from "@/src/(context)/calender-context";
import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";
import { categoryOptions } from "@/src/helper/helper";
import { getInventoryById } from "@/src/app/api/inventory";

const AddVideoRequestModal = ({
  id,
  isOpen,
  themeId,
  isAllow,
  dragMedia,
  isDrop = false,
  isUpdate = false,
  handleResponseData,
  handleIsModalClose,
}: {
  id?: string;
  dragMedia?: any;
  isOpen: boolean;
  isAllow?: boolean;
  themeId?: string;
  isDrop?: boolean;
  isUpdate?: boolean;
  handleIsModalClose: () => void;
  handleResponseData?: ({ addVideoRequestData }: { addVideoRequestData: any }) => void;
}) => {
  const {
    control,
    setValue,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    sampleUrl: string;
    description: string;
    audioS3Key?: string;
    audioUrl?: string;
    videoRequestName: string;
    sampleThumbnailUrl: string;
    category: { value: string; label: string };
    assignTo?: { value: string; label: string };
  }>({
    defaultValues: {
      sampleUrl: "",
      description: "",
      audioUrl: "",
      audioS3Key: "",
      sampleThumbnailUrl: "",
      videoRequestName: "",
      category: { value: "", label: "" },
      assignTo: { value: "", label: "" },
    },
  });

  const contextData = useClients();
  const allUser = contextData && contextData?.allUser;
  const loggedInUser = contextData && contextData?.loggedInUser;
  const selectedClient = contextData && contextData?.selectedClient;
  const currentUserRole = contextData && contextData?.currentUserRole;
  const selectedClientIds = contextData && contextData?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const { handleAddedVideoRequest, schoolYear, handleActiveClose, isUpdateVideoRequest } =
    useCalender();

  const [errorsDate, setErrorsDate] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    setErrorsDate("");
    clearErrors();
    const addVideoRequestData = {
      clientId: selectedClientId,
      description: data?.description,
      category: data?.category?.value,
      dueDate: startDate ?? "",
      userId: loggedInUser?._id,
      audioUrl: data?.audioUrl,
      sampleUrl: data?.sampleUrl,
      audioS3Key: data?.audioS3Key,
      videoRequestName: data?.videoRequestName,
      sampleThumbnailUrl: data?.sampleThumbnailUrl,
      ...(schoolYear && { schoolYear }),
      ...((isDrop || isUpdate) && {
        assignTo: data?.assignTo?.value != "" ? data?.assignTo?.value : null,
      }),
      ...(themeId && { themeId, status: "pending" }),
    };

    try {
      const res = id
        ? await updateVideoRequest({ id, data: addVideoRequestData })
        : await addVideoRequest({ data: addVideoRequestData });

      if (themeId) {
        await updateVideoRequestIds({
          id: themeId,
          data: {
            videoRequestId: id || res?.data?.newVideoRequests?._id,
            orderNumber: isUpdateVideoRequest?.dropIndex,
          },
        });
      }
      if ((res || themeId) && !isUpdate) {
        handleAddedVideoRequest();
      }
      if (res || themeId) {
        handleResponseData?.({ addVideoRequestData: res });
      }
      if (res && !isUpdate) handleResponseData?.({ addVideoRequestData: res });
      if (res?.status === 200) {
        handleClose();
        handleActiveClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setErrorsDate("");
    clearErrors();
    setValue("description", "");
    setValue("videoRequestName", "");
    setValue("category", { value: "", label: "" });
    if (currentUserRole === "producer") {
      const assignToData = userData?.find((data) => data?.value === loggedInUser?._id);
      setValue("assignTo", assignToData as any);
    } else {
      setValue("assignTo", { value: "", label: "" });
    }
    setStartDate(null);
    handleIsModalClose();
  };

  const userData = useMemo(() => {
    return allUser?.map((data) => {
      return { label: data?.username || data?.fullName, value: data?._id };
    });
  }, [allUser]);

  const handleGetVideoRequestById = async ({ id }: { id: string }) => {
    try {
      setIsLoading(true);
      const res: any = await getVideoRequestById({ id });

      if (res) {
        const categoryData = categoryOptions?.find(
          (data) => data?.value === res?.data?.category,
        ) || {
          value: "",
          label: "",
        };

        const assignToData = userData?.find((data) => data?.value === res?.data?.assignTo) || {
          value: "",
          label: "",
        };
        setStartDate(res?.data?.dueDate);
        setValue("category", categoryData);
        setValue("sampleUrl", res?.data?.url);
        setValue("assignTo", assignToData as any);
        setValue("description", res?.data?.description);
        setValue("sampleThumbnailUrl", res?.data?.thumbnailUrl);
        setValue("videoRequestName", res?.data?.videoRequestName);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    setIsLoading(false);
  };

  const handleGetInventoryById = async ({ id }: { id: string }) => {
    try {
      setIsLoading(true);
      const res: any = await getInventoryById({ id });

      if (res) {
        const categoryData = categoryOptions?.find((data) => data?.value === res?.category) || {
          value: "",
          label: "",
        };
        setValue("sampleThumbnailUrl", res?.customeThumbnailUrl || res?.thumbnailUrl);
        setValue("audioUrl", res?.audioUrl);
        setValue("audioS3Key", res?.audioS3Key);
        setValue("sampleUrl", res?.url);
        setValue("description", res?.description);
        setValue("videoRequestName", res?.name);
        setValue("category", categoryData);
        setStartDate(res?.dueDate);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isDrop && themeId && dragMedia?.inventoryId) {
      handleGetInventoryById({ id: dragMedia?.inventoryId });
    }
  }, [isDrop, themeId, dragMedia?.inventoryId]);

  useEffect(() => {
    id && handleGetVideoRequestById({ id });
  }, [id]);

  useEffect(() => {
    if (currentUserRole === "producer") {
      const assignToData = userData?.find((data) => data?.value === loggedInUser?._id);
      setValue("assignTo", assignToData as any);
    }
  }, [currentUserRole, userData, loggedInUser]);

  return (
    <div>
      <Modal
        open={isOpen}
        handleClose={handleIsModalClose}
        className={`${styles.modalContentWrapper}`}
      >
        <div>
          <div className="md:text-2xl text-xl font-semibold">
            {id ? "Update Video Request" : "Create Video Request"}
          </div>
        </div>
        {isLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <Loader pageLoader={false} loaderClass={styles.loaderClassUnassigned} />
          </div>
        ) : (
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="">
                <Input
                  name={"videoRequestName"}
                  register={register}
                  required={true}
                  label="Name"
                  inputField={styles.inputClass}
                  labelClass={styles.labelClass}
                  placeholder="Enter Name"
                  type="text"
                  errorMessage={errors?.videoRequestName && errors?.videoRequestName?.message}
                />
              </div>

              <div className="pt-5">
                <Textarea
                  rows={3}
                  label="Description"
                  register={register}
                  name={"description"}
                  placeholder="Enter description"
                  customLabelClass={styles.labelClass}
                  errorMessage={errors?.description && errors?.description?.message}
                />
              </div>
              <div className="mt-[5px]">
                <Selection
                  label="Category"
                  name={"category"}
                  isClearable={true}
                  placeholder="Select"
                  customHeight={"44px"}
                  boderCustomeStyle={true}
                  control={control as any}
                  options={categoryOptions}
                  imageClass="!w-[24px] !h-[24px]"
                  customIcon="/assets/down-gray.svg"
                  customBorder={"1px solid #B8B8B8"}
                  placeholderWidth="200px !important"
                  iconClass={"!top-[52%] !right-[5px]"}
                  labelClassName={`!mt-[4px] ${styles.labelClass}`}
                  errorMessage={errors?.category && errors?.category?.message}
                />
              </div>
              <div className="md:my-3 mt-3 mb-4">
                <label htmlFor="" className={`!mb-[4px] ${styles.labelClass}`}>
                  Due Date {!isDrop && "(optional)"}
                </label>
                <ReactDatePicker
                  className={styles.DatePicker}
                  name={"dueDate"}
                  dateFormat={"yyyy-MM-dd"}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <span className="absolute block font-medium ml-[1px] mt-0 text-[#ff5050] text-[11px]">
                  {errorsDate && errorsDate}
                </span>
              </div>
              {(isDrop || isUpdate) && isAllow && (
                <div className="mt-[9px] mb-3">
                  <Selection
                    isClearable={true}
                    name={"assignTo"}
                    placeholder="Select"
                    isDisabled={currentUserRole != "producer" ? false : true}
                    customHeight={"44px"}
                    label="Assigned Producer"
                    boderCustomeStyle={true}
                    control={control as any}
                    options={userData as any}
                    iconClass={"!top-[52%] !right-[5px]"}
                    imageClass="!w-[24px] !h-[24px]"
                    customIcon="/assets/down-gray.svg"
                    customBorder={"1px solid #B8B8B8"}
                    placeholderWidth="200px !important"
                    labelClassName={`!mt-[4px] ${styles.labelClass}`}
                    errorMessage={errors?.assignTo && errors?.assignTo?.message}
                  />
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  text="Cancel"
                  handleClick={handleClose}
                  className={`!text-[#ED1C24] !font-semibold`}
                  btnClass={`!rounded-md !bg-transparent ${styles.borderRed}`}
                />

                <Button
                  type="submit"
                  text={id ? "Update" : "Create Video Request"}
                  isLoading={isSubmitting}
                  className={`!text-[#fff] !font-semibold`}
                  btnClass={` !rounded-md "!bg-[#ED1C24]"  !min-w-fit md:!max-w-max  !max-w-none `}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AddVideoRequestModal;
