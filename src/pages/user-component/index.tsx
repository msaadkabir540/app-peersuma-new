"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Info from "./info";
import Layout from "../layout/page";
import Modal from "@/src/components/modal";
import Table from "@/src/components/table";
import Button from "@/src/components/button";
import SelectionSection from "./selection-section";
import CustomPagination from "@/src/components/custom-pagination";
import createNotification from "@/src/components/create-notification";

import Columns, { Action } from "@/src/app/variable/user/column";
import { RowsInterface } from "@/src/components/table/table-interface";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deletePermanentUserById,
} from "@/src/app/api/users";
import { useClients } from "@/src/(context)/context-collection";

import {
  ActionInterface,
  CreateUserFormMainSchemaInterface,
  CreateUserFormSchemaInterface,
  UsersInterface,
} from "@/src/app/interface/user-interface/user-interface";
import { SortColumnInterface } from "@/src/app/interface/video-project-interface/video-project-interface";

import style from "./index.module.scss";
import Loader from "@/src/components/loader";

const UserComponent = () => {
  const route = useRouter();
  const {
    watch,
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormMainSchemaInterface>({
    defaultValues: {
      pageSize: { value: 30, label: 30 },
      totalCount: 0,
      page: 1,
      roles: [""],
      email: "",
      username: "",
      fullName: "",
      confirmPassword: "",
    },
  });

  const watchPage = watch("page");
  const watchPageSize = watch("pageSize");

  const [role, setRole] = useState<string>("");
  const [openModal, setOpenModal] = useState<{
    rowId: string;
    isModal: boolean;
    isUpdate: boolean;
    isCreate: boolean;
  }>({
    rowId: "",
    isModal: false,
    isUpdate: false,
    isCreate: false,
  });
  const [searchParams, setSearchParams] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [allUser, setAllUser] = useState<UsersInterface[] | undefined>();
  const [deleteAction, setDeleteAction] = useState<ActionInterface>({
    isOpen: false,
    action: false,
    id: "",
    name: "",
  });
  const [sortColumn, setSortColumn] = useState<SortColumnInterface>({
    sortBy: "",
    sortOrder: "asc",
  });
  const context = useClients();
  const loggedInUser = context && context.loggedInUser;
  const selectedClientIds = context ? context.selectedClientIds : [];
  const currentUserRole = context ? context.currentUserRole : "";
  const selectedClient = context ? context.selectedClient : [];
  const selectedClientId = selectedClientIds || selectedClient;

  const handleSelectedValue = ({ value }: { value: string }) => setSelectedValue(value);
  const handleCreateUpdate = () =>
    setOpenModal((prev) => ({ ...prev, isModal: true, isCreate: true }));
  const handleSelectedRole = ({ role }: { role: string }) => setRole(role as string);

  const handleUpdateUser = ({ rowId }: { rowId: string }) => {
    setOpenModal((prev) => ({ ...prev, isModal: true, isUpdate: true, isCreate: false, rowId }));
  };

  const handleDeleteEvent = ({ rowId }: { rowId: string }) => {
    setDeleteAction((prev) => ({ ...prev, isOpen: true, id: rowId }));
  };

  const handleCancelEvent = () => {
    setDeleteAction((prev) => ({ ...prev, isOpen: false, id: "" }));
  };

  const handleDeleteEvents = async () => {
    setDeleteAction((prev) => ({ ...prev, isOpen: false }));
    await handleDelete(deleteAction.id);
  };

  const userTableRows = useMemo(() => {
    return allUser?.map((user: UsersInterface) => {
      const role = user?.clientId?.find((client: any) => client?.clientId === selectedClientId);
      return {
        _id: user?._id,
        id: user?._id,
        email: user?.email,
        status: user?.status,
        fullName: user?.fullName,
        username: user?.username,
        role: role?.role || [],
        updatedAt: user?.updatedAt,
        contactNumber: user?.contactNumber,
      };
    });
  }, [allUser]);

  const handleStatusChange = async ({ id }: { id: string }) => {
    await updateUserStatus(id);
  };

  const handleDelete = async (userId: string) => {
    setDeleteAction((prev) => ({ ...prev, action: true, id: userId }));

    const res: any = await deletePermanentUserById({
      userId,
      params: {
        clientId: selectedClientId as string,
      },
    });
    if (res?.status === 200) {
      const newData = allUser?.filter((f) => f._id !== userId);
      setAllUser(newData);
      setDeleteAction((prev) => ({ ...prev, action: false, isOpen: false, id: "" }));
    } else {
      setDeleteAction((prev) => ({ ...prev, action: false, isOpen: false, id: "" }));
      createNotification({
        type: "error",
        message: "Error!",
        description: res?.data?.error || "Failed",
      });
    }
  };

  const onSubmit = async (data: CreateUserFormSchemaInterface) => {
    const newData = {
      password: "1234",
      confirmPassword: "1234",
      fullName: data?.fullName,
      email: data?.email,
      ...(!openModal?.rowId && { clientId: selectedClientId, role: role }),
      roles: [role],
      selectedClientId,
      createdByUser: loggedInUser?._id,
      clientId: selectedClientId,
      ...(data?.contactNumber &&
        data?.contactNumber !== "" && {
          contactNumber: data?.contactNumber?.replace(/[^0-9]/g, "").slice(-10),
        }),
      role,
      username: data?.username,
    };

    if (role === "") {
      setErrorMessage("Required");
    } else if (
      data?.contactNumber &&
      data?.contactNumber?.replace(/[^0-9]/g, "")?.slice(-10).length < 10
    ) {
      setErrorMessage("");
      setError("contactNumber", {
        type: "manual",
        message: "Contact number must be 10 digits",
      });
    } else {
      setErrorMessage("");
      const res: { status: number } | any = openModal?.rowId
        ? await updateUser({ id: openModal?.rowId, data: newData })
        : await createUser({ data: newData });
      if (res?.status === 200) {
        setOpenModal((prev) => ({
          ...prev,
          isCreate: false,
          isModal: false,
          isUpdate: false,
          rowId: "",
        }));
        setValue("email", "");
        setValue("fullName", "");
        setValue("confirmPassword", "");
        setValue("contactNumber", "");
        setValue("username", "");
        setRole("");
        handleGetAllClient();
      } else {
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.msg || "Failed",
        });
      }
    }
  };

  const handleCloseModal = () => {
    setValue("email", "");
    setValue("fullName", "");
    setValue("confirmPassword", "");
    setValue("contactNumber", "");
    setValue("username", "");
    setOpenModal((prev) => ({
      ...prev,
      isModal: false,
      isCreate: false,
      isUpdate: false,
      rowId: "",
    }));
    setRole("");
  };

  const handleGetUserById = useCallback(
    async ({ userId }: { userId: string }) => {
      try {
        setLoadingUser(true);
        const res = await getUserById({ userId });
        if (res?.status === 200) {
          const selectedClient = res.data.clientId.find(
            (client: any) => client.clientId._id === selectedClientId,
          );
          setValue("fullName", res?.data?.fullName);
          setValue("username", res?.data?.username);
          setValue("email", res?.data?.email);
          setValue("contactNumber", res?.data?.contactNumber);
          setRole(selectedClient.role);
        }
      } catch (error) {
        createNotification({
          type: "error",
          message: "Error!",
          description: "Failed",
        });
        throw error;
      }
      setLoadingUser(false);
    },
    [setValue, setRole],
  );

  useEffect(() => {
    openModal?.rowId && handleGetUserById({ userId: openModal?.rowId });
  }, [openModal?.rowId, handleGetUserById]);

  const handleGetAllClient = useCallback(async () => {
    setIsUserLoading(true);
    const res = await getAllUsers({
      params: {
        ...sortColumn,
        page: watchPage,
        role: selectedValue,
        search: searchParams,
        pageSize: watchPageSize?.value as number,
        clientId: selectedClientId as string,
      },
    });

    if (res?.status === 200) {
      setAllUser(res?.data?.users);
      setValue("totalCount", res?.data?.count || 0);
    } else if (res?.response?.status === 403) {
      setPageLoading(true);
      setAllUser([]);
      localStorage.setItem("redirect_url", "/" as string);
      route.push("/");
      createNotification({
        type: "error",
        message: "Error!",
        description: res?.response?.data?.msg,
      });
    }
    setIsUserLoading(false);
    setPageLoading(false);
  }, [
    setValue,
    watchPage,
    sortColumn,
    selectedValue,
    searchParams,
    watchPageSize,
    selectedClientId,
  ]);

  useEffect(() => {
    handleGetAllClient();
  }, [
    watchPage,
    sortColumn,
    searchParams,
    selectedValue,
    watchPageSize,
    selectedClientIds,
    handleGetAllClient,
  ]);

  useEffect(() => {
    if (currentUserRole === "producer") {
      localStorage.setItem("redirect_url", "/" as string);
      route.push("/");
    }
  }, [currentUserRole]);

  return (
    <>
      {pageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <Layout>
            <div className="md:p-5 p-4">
              <div className="md:text-2xl text-xl font-medium ">
                Manage Users ({allUser?.length || 0})
              </div>
              <SelectionSection
                searchParams={searchParams}
                handleCreateUpdate={handleCreateUpdate}
                setSearchParams={setSearchParams}
                handleSelectedValue={handleSelectedValue}
              />
              <div>
                <Table
                  columns={Columns({ control, handleStatusChange })}
                  isLoading={isUserLoading as boolean}
                  customTableClass={style.customTableClassUser}
                  headingClassName={style.headingClassNameUser}
                  sortColumn={sortColumn}
                  rows={userTableRows as RowsInterface[]}
                  trClassName={"hover:bg-[#B8B8B8]"}
                  mainTableClass={style.mainTableClass}
                  handleSort={(sort) => setSortColumn(sort)}
                  actions={({ row }) => {
                    return (
                      <React.Fragment key={row?._id}>
                        <Action
                          rowId={row?._id}
                          deletedId={deleteAction?.id}
                          isDeleting={deleteAction?.action}
                          handleUpdateUser={handleUpdateUser}
                          handleDeleteEvent={handleDeleteEvent}
                        />
                      </React.Fragment>
                    );
                  }}
                />
              </div>
              <CustomPagination
                control={control}
                setValue={setValue}
                page={watchPage as number}
                perPageText="Users per page"
                pageSize={watchPageSize?.value as number}
                totalCount={watch("totalCount") as number}
              />
            </div>

            <Modal
              open={openModal?.isModal}
              handleClose={handleCloseModal}
              className={`${style.tryNowModal} `}
              iconClassName={style.iconClassName}
              bodyClass={` ${loadingUser ? " flex justify-center items-center h-[400px]" : ""}`}
            >
              <>
                {loadingUser ? (
                  <Loader pageLoader={false} />
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className={style.createContainer}>
                    <div className="md:text-xl text-lg font-semibold mb-5">
                      {openModal?.isUpdate ? "Update User" : " Add New User"}
                    </div>
                    <Info
                      role={role}
                      errors={errors}
                      register={register}
                      isSubmitting={isSubmitting}
                      errorMessage={errorMessage}
                      handleClose={handleCloseModal}
                      isEditInfo={openModal?.isCreate}
                      handleSelectedRole={handleSelectedRole}
                    />
                  </form>
                )}
              </>
            </Modal>

            {/* delete modal */}
            <Modal
              open={deleteAction?.isOpen}
              handleClose={handleCancelEvent}
              className={style.bodyModal}
              modalWrapper={style.opacityModal}
            >
              <div className={style.deleteModal}>
                <Image
                  data-testid="close-icon"
                  style={{
                    borderRadius: "10px",
                    textAlign: "center",
                    margin: "auto",
                  }}
                  className="!w-[60px] !h-[60px]"
                  src={"/assets/delete-red.svg"}
                  alt="sortUp"
                  height="100"
                  width="100"
                />
                <div className={style.deleteHeading}>
                  Are you sure you want to delete this user?
                </div>
                <div className={style.text}>You will not be able to recover that user.</div>

                <div className="flex justify-end items-center gap-3 mt-5">
                  <Button
                    type="button"
                    text="Cancel"
                    className={`!text-[#ED1C24] !font-semibold`}
                    btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
                    handleClick={handleCancelEvent}
                  />
                  <Button
                    type="button"
                    text="Confirm"
                    isLoading={false}
                    className={`!text-[#fff] !font-semibold`}
                    btnClass={` !rounded-md !bg-[#ED1C24]  ${style.maxWidth}   `}
                    handleClick={handleDeleteEvents}
                  />
                </div>
              </div>
            </Modal>
          </Layout>
        </>
      )}
    </>
  );
};

export default UserComponent;
