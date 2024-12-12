import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import Modal from "@/src/components/modal";
import Input from "@/src/components/input";
import Radio from "@/src/components/radio";
import Button from "@/src/components/button";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";
import { statusOption, statusTemplate } from "@/src/app/option";

import { DraftApi } from "@/src/app/api/draft";

import { useClients } from "@/src/(context)/context-collection";

import { VideoProjectHeaderInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import styles from "./index.module.scss";

const PageHeader = ({
  name,
  status,
  isOpen,
  control,
  isUpdate,
  setValue,
  register,
  onSubmit,
  setIsOpen,
  activeList,
  createdDate,
  description,
  handleSubmit,
  producerName,
  isContributor,
  videoProjectId,
  isStatusUpdate,
  handleDraftsList,
  isEditingProcess,
  handleStatusChange,
}: VideoProjectHeaderInterface) => {
  const isMobile = useMediaQuery("(max-width: 780px)");

  const [videoDraft, setVideoDraft] = useState<number>(0);

  const context = useClients();
  const selectedClient = context ? context.selectedClientIds : [];

  useEffect(() => {
    setValue?.("videoProjectName", name);
    setValue?.("description", description);
    setValue?.("status", status);
  }, [name, status, description, setValue]);

  const sendMailToUserWhenStatusChangeEvent = (value: string) => {
    handleStatusChange?.({ status: value });
  };

  const isOptionDisabled = (option: any) => {
    switch (status) {
      case "closed":
      case "cancelled":
        return true;
      case "in-review":
        return option.value !== "closed" && option.value !== "cancelled";
      case "in-production":
        return (
          option.value !== "in-post-production" &&
          option.value !== "closed" &&
          option.value !== "cancelled"
        );
      case "in-post-production":
        if (!isEditingProcess) {
          return option.value !== "in-production" && option.value !== "in-review";
        } else {
          return option.value !== "in-review";
        }
      default:
        return false;
    }
  };

  const getDisabledStatus = (id: any) => {
    if (status === "in-review") {
      return id !== "closed" && id !== "cancelled";
    } else if (status === "in-production") {
      return id !== "in-post-production" && id !== "closed" && id !== "cancelled";
    } else if (status === "in-post-production") {
      if (isEditingProcess) {
        return id !== "in-review";
      } else {
        return id !== "in-production" && id !== "in-review";
      }
    }
    return false; // Default case: all options clickable
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setValue?.("status", "");
  };
  const handleModalEventOpen = () => {
    setIsOpen(true);
    setValue?.("status", status);
  };

  const handleGetVideoDrafts = async () => {
    const data = { videoProjectId: videoProjectId!, selectedClientId: selectedClient as string };
    try {
      const videoDraftResponse = await DraftApi.performAction({
        action: "get-all-video-drafts",
        data: data,
      });
      if (videoDraftResponse?.status === 200) {
        setVideoDraft(videoDraftResponse?.getDraftVideo.length || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    videoProjectId && selectedClient && handleGetVideoDrafts();
  }, [videoProjectId, selectedClient]);

  return (
    <div className="">
      <div className=" flex justify-center items-center flex-col gap-3 bg-[#0F0F0F] ">
        <div
          className={`text-white text-center pt-8 font-semibold leading-normal text-[25px] flex justify-center items-center  md:text-[42px] md:gap-5 gap-3`}
        >
          {name}
          {!isContributor && (
            <Button
              iconStart={"/assets/pen-white.png"}
              btnClass={"!bg-transparent !p-0"}
              imgClass={`md:!h-[25px] md:!w-[25px] !h-4 !w-4`}
              handleClick={handleModalEventOpen}
            />
          )}
        </div>
        <div className="mb-3">
          <Selection
            control={control}
            id="projectStatus"
            customStyles={true}
            name="projectStatus"
            isSearchable={false}
            isDisabled={isContributor}
            placeholder="Project Status"
            options={statusOption as any}
            isOptionDisabled={isOptionDisabled}
            customBorder={"none !important"}
            customMenuWidth={"200px !important"}
            costumPaddingLeft={"15px !important"}
            customPaddingRight={"30px !important"}
            iconClass={
              isContributor
                ? `!hidden`
                : !isMobile
                  ? "!top-[8px] !right-[12px]"
                  : `${styles.iconClass} `
            }
            customFuncOnChange={sendMailToUserWhenStatusChangeEvent}
            className={styles.selectClass}
          />
        </div>

        <div className="w-full">
          <div
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
            className="text-white  gap-5 md:gap-11  w-full flex justify-center items-center p-[11px]"
          >
            <div className={`md:text-sm text-[13px]`}>Created By: {producerName}</div>
            <div className={`md:text-sm text-[13px]`}>Created At: {createdDate}</div>
          </div>
          {!isContributor && activeList != "drafts" && videoDraft >= 1 && (
            <div className="text-white  gap-5 md:gap-11 bg-[#ED1C24] w-full flex justify-center items-center md:p-[4px] p-[2px]">
              <div className={`text-[13px] md:text-lg`}>
                Drafts are ready
                <span
                  className="underline cursor-pointer md:ml-[4px] ml-[2px]"
                  onClick={handleDraftsList}
                >
                  click here to view
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <Modal
          className={styles.modalContentWrapper}
          {...{
            open: isOpen,
            handleClose: () => setIsOpen(false),
          }}
        >
          <div>
            <div className="md:text-2xl text-xl font-semibold md:m-4 m-3 my-4">
              Update Video Project
            </div>
          </div>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="m-3">
              <div className="">
                <Input
                  name={"videoProjectName"}
                  register={register}
                  required={true}
                  label="Name"
                  inputField={styles.input}
                  labelClass={styles.labelClass}
                  placeholder="Enter Video Project Name"
                  type="text"
                />
              </div>

              <div className="pt-5">
                <Textarea
                  rows={3}
                  name={"description"}
                  register={register}
                  label="Description"
                  placeholder="Enter description"
                />
              </div>
              <div className="pb-5" style={{ color: "#A1A1A1" }}>
                Only invited contributor can see the description*
              </div>
              <div className="flex justify-start items-start gap-3 flex-wrap">
                {statusTemplate?.map(({ id, name }, index) => {
                  return (
                    <div key={index}>
                      <Radio
                        name="status"
                        label={name}
                        radioValue={id}
                        register={register}
                        disabled={getDisabledStatus(id)}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="my-4 flex gap-4 justify-end">
                <Button
                  text="Cancel"
                  btnClass={styles.btnClass}
                  className={styles.btnCreateClassText}
                  handleClick={handleModalClose}
                />
                <Button text="Save" type="submit" isLoading={isUpdate} className={"!w-12"} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PageHeader;
