"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Layout from "../layout/page";
import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import MainContainer from "./main-container";
import Textarea from "@/src/components/textarea";
import createNotification from "@/src/components/create-notification";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import {
  createVideoProject,
  getAllVideoProject,
  temporaryDeleteById,
  videoProjectApi,
} from "@/src/app/api/video-projects";

import { useClients } from "@/src/(context)/context-collection";

import { VideoProjectDataInterface } from "@/src/interface/video-request-interface";

import styles from "./index.module.scss";

const ProjectList = () => {
  const router = useRouter();
  const { control, register, handleSubmit, setValue, watch } = useForm<{
    name?: string;
    sortOrder?: {
      label: string;
      value: string;
    } | null;
    description?: string;
    status?: string;
    projectStatus?: {
      label: string;
      value: string;
    } | null;
  }>({
    defaultValues: {
      name: "",
      description: "",
      status: "",
      projectStatus: {
        label: "All Projects",
        value: "all-Projects",
      },
    },
  });

  const projectStatusWatch = watch("projectStatus") || null;

  const [isOpen, setIsOpen] = useState<{
    isOpenModal: boolean;
    isUpdate: boolean;
    videoProjectId?: string;
    oldStatus?: string;
    isDeleted?: boolean;
    isCreated?: boolean;
  }>({
    isOpenModal: false,
    isUpdate: false,
    videoProjectId: "",
    oldStatus: "",
    isDeleted: false,
    isCreated: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [videoProjectData, setVideoProjectData] = useState<VideoProjectDataInterface[]>([]);

  const clientContext = useClients();
  const selectedClient = clientContext && clientContext?.selectedClient;
  const currentUserRole = clientContext && clientContext?.currentUserRole;
  const logInUsers = clientContext && clientContext?.loggedInUser;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const searchParamsValue = useDebounce({ value: searchParams, milliSeconds: 1000 });

  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchParams(e.target.value);

  const handleSetEventCross = () => setSearchParams("");

  // video project api call here
  const sortOrder = useMemo(() => {
    const selectedSortOrder = watch("sortOrder");

    switch (selectedSortOrder?.value) {
      case "Last Modified":
        return { sortBy: "updatedAt", sortOrder: "desc" };
      case "Oldest":
        return { sortBy: "createdAt", sortOrder: "asc" };
      case "Alphabetical ascending":
        return { sortBy: "name", sortOrder: "asc" };
      case "Alphabetical descending":
        return { sortBy: "name", sortOrder: "desc" };
      default:
        return { sortBy: "updatedAt", sortOrder: "desc" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("sortOrder")]);

  const handleGetAllTemplates = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const clientId = selectedClientId;
    const userId = localStorage.getItem("userId");
    try {
      if (clientId) {
        const urlData = {
          clientId,
          userId,
          search: searchParamsValue,
          isFilter: projectStatusWatch?.value,
          roles: currentUserRole,
          ...sortOrder,
        };

        const response = await getAllVideoProject({ data: urlData });

        if (response.status === 200) {
          const getAllVideoProject = response?.data?.allVideoProject;
          setVideoProjectData(getAllVideoProject);
        }
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClientId, sortOrder, searchParamsValue, projectStatusWatch]);

  useEffect(() => {
    handleGetAllTemplates();
  }, [handleGetAllTemplates]);

  const handleStatusChange = async ({
    status,
    name,
    oldStatus,
    videoRequestId,
  }: {
    status: string;
    name: string;
    oldStatus?: string;
    videoRequestId?: string;
  }) => {
    const token = localStorage?.getItem("token");
    try {
      const updateData = {
        name: name,
        status: status,
        email: logInUsers?.email,
        userName: logInUsers?.username,
        statusChangeFrom: "projectsPeersuma",
        contactNumber: logInUsers?.contactNumber,
        oldStatus: oldStatus || isOpen?.oldStatus,
      };
      const urlData = {
        videoPageID: videoRequestId || isOpen.videoProjectId,
        token,
        updateData,
      };
      const res: any = await videoProjectApi.performAction("update-video-project-status", urlData);

      if (res) {
        const statusUpdate = videoProjectData?.reduce((acc, videoProject) => {
          if (videoProject?._id === videoRequestId) {
            acc.push({ ...videoProject, status: status, updatedAt: res?.updatedStatus?.updatedAt });
          } else {
            acc.push(videoProject);
          }
          return acc;
        }, [] as VideoProjectDataInterface[]);

        setVideoProjectData(statusUpdate);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: any) => {
    setIsOpen((prev) => ({ ...prev, isOpenModal: false, isUpdate: false }));
    const updateData = {
      name: data?.name,
      description: data?.description,
      status: data?.status,
      email: logInUsers?.email,
      userName: logInUsers?.username,
    };
    const urlData = {
      videoPageID: isOpen?.videoProjectId,
      updateData,
    };
    if (data?.status != isOpen?.oldStatus) {
      await handleStatusChange({ status: data?.status, name: data?.name });
    }
    const res: any = await videoProjectApi.performAction("update-video-project", urlData);

    if (res) {
      handleGetAllTemplates();
      setIsOpen((prev) => ({ ...prev, isOpenModal: false, isUpdate: false }));
    }
  };

  const handleCloseModal = () =>
    setIsOpen((prev) => ({ ...prev, isOpenModal: false, isUpdate: false, videoProjectId: "" }));

  const handleOpenModal = ({ videoProjectId }: { videoProjectId: string }) => {
    const findUpdateData = videoProjectData?.find(({ _id }) => _id === videoProjectId);

    setValue("name", findUpdateData?.name);
    setValue("description", findUpdateData?.description);
    setValue("status", findUpdateData?.status);

    setIsOpen((prev) => ({
      ...prev,
      isUpdate: false,
      videoProjectId,
      isOpenModal: true,
      oldStatus: findUpdateData?.status,
    }));
  };

  const handleTemporaryDelete = async ({ videoProjectId }: { videoProjectId: string }) => {
    setIsOpen((prev) => ({
      ...prev,
      isDeleted: true,
      videoProjectId,
    }));
    try {
      const res: any = await temporaryDeleteById({ data: { videoProjectId, isDeleted: true } });
      if (res) {
        const filterData = videoProjectData?.filter(({ _id }) => _id != videoProjectId);

        setVideoProjectData(filterData);
        setIsOpen((prev) => ({
          ...prev,
          isDeleted: false,
          videoProjectId: "",
        }));
        createNotification({
          type: "success",
          message: "Success",
          description: "Successfully deleted.",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsOpen((prev) => ({
      ...prev,
      isDeleted: false,
      videoProjectId: "",
    }));
  };

  const handleCreateVideoProject = async () => {
    setIsOpen((prev) => ({
      ...prev,
      isCreated: true,
    }));
    const token = localStorage?.getItem("token");
    const clientId = selectedClientId;
    const userName = localStorage?.getItem("userName");
    const userId = localStorage?.getItem("userId");
    const isClient = localStorage?.getItem("clientId");
    if (isClient || clientId != undefined || clientId != "undefined") {
      try {
        const createVideoProjectData = {
          userName,
          userId,
          clientId,
          token,
        };

        const res = await createVideoProject({ data: createVideoProjectData });

        if (res.status === 200) {
          router.push(`/produce/${res?.data?.newVideoProject?._id}`);
          setIsLoading(true);
          setIsOpen((prev) => ({
            ...prev,
            isCreated: false,
          }));
          createNotification({
            type: "success",
            message: "Success!",
            description: "Video project created.",
          });
        }
      } catch (error) {
        console.error(error);
        setIsOpen((prev) => ({
          ...prev,
          isCreated: false,
        }));
      }
    } else {
      createNotification({
        type: "error",
        message: "Error!",
        description: "ClientId is missing",
      });
      setIsOpen((prev) => ({
        ...prev,
        isCreated: false,
      }));
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-85px)] p-4">
        <div className={`flex-1 md:pl-4 transition-all duration-300 w-full `}>
          <div
            className={`flex flex-col items-center gap-2.5 md:px-5 flex-1 self-stretch rounded-lg md:border md:border-gray-400 md:bg-white md:h-[calc(100vh-120px)]  w-full  `}
          >
            <MainContainer
              control={control}
              searchParams={searchParams}
              loadingVideoRequest={isLoading}
              handleOpenModal={handleOpenModal}
              videoProjectData={videoProjectData}
              handleSearchEvent={handleSearchEvent}
              isDeleted={isOpen?.isDeleted as boolean}
              handleStatusChange={handleStatusChange}
              isCreated={isOpen?.isCreated as boolean}
              handleSetEventCross={handleSetEventCross}
              handleTemporaryDelete={handleTemporaryDelete}
              videoProjectId={isOpen?.videoProjectId as string}
              handleCreateVideoProject={handleCreateVideoProject}
            />
          </div>
        </div>
      </div>

      <Modal
        className={styles.modalContentWrapper}
        open={isOpen?.isOpenModal}
        handleClose={handleCloseModal}
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
                name={"name"}
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
            <div className="my-4 flex gap-4 justify-end">
              <Button
                text="Cancel"
                btnClass={styles.btnClass}
                className={styles.btnCreateClassText}
                handleClick={handleCloseModal}
              />
              <Button
                text="Save"
                type="submit"
                btnClass="sm:!max-w-fit !max-w-none "
                isLoading={isOpen?.isUpdate}
                className={"!w-12"}
              />
            </div>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ProjectList;
