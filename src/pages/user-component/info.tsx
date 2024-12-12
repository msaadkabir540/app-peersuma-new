import React, { Fragment } from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";

import { useClients } from "@/src/(context)/context-collection";

import { InfoInterface } from "@/src/app/interface/user-interface/user-interface";

import styles from "./index.module.scss";

const Info: React.FC<InfoInterface> = ({
  role,
  errors,
  register,
  isEditInfo,
  handleClose,
  errorMessage,
  isSubmitting,
  handleSelectedRole,
}) => {
  const context = useClients();
  const currentUserRole = context && context?.currentUserRole;

  const filteredRoles =
    currentUserRole === "producer" ? roles?.filter((role) => role.value === "producer") : roles;
  return (
    <div className={styles.activeTab}>
      <div className={styles.infoText}>
        <Input
          container="mb-4"
          name="fullName"
          label={"Full Name"}
          register={register}
          placeholder="Enter Full Name"
          errorMessage={errors?.fullName?.message ? "Name is required" : ""}
        />
        <Input
          label={"User Name"}
          name="username"
          register={register}
          required={true}
          container="mb-4"
          placeholder="Enter User Name"
          errorMessage={errors?.username?.message ? "User Name is required" : ""}
        />
        <Input
          name="email"
          label="Email"
          type={"email"}
          required={true}
          register={register}
          container={` mb-4 `}
          placeholder="Enter email Address"
          errorMessage={errors?.email?.message ? "Email is required" : ""}
        />
        <Input
          type={"text"}
          register={register}
          name="contactNumber"
          label="Phone Number"
          container="mb-4"
          placeholder="Enter phone number"
          errorMessage={errors?.contactNumber?.message}
        />
        <div className=" mb-5 ">
          <div className="text-base font-medium mb-2">Role</div>
          <div className="flex justify-start  gap-3">
            {filteredRoles?.map((data) => {
              return (
                <Fragment key={data?.value}>
                  <RoleList
                    handleSelectedRole={handleSelectedRole}
                    role={role as string}
                    data={data}
                  />
                </Fragment>
              );
            })}
          </div>
          <span className={`${styles.errorMessageRole} `}>{errorMessage}</span>
        </div>

        <div className="flex justify-end items-center gap-3">
          <Button
            type="button"
            text="Cancel"
            className={`!text-[#ED1C24] !font-semibold`}
            btnClass={`!rounded-md ${styles.redBorder}  !bg-transparent `}
            handleClick={handleClose}
          />
          <Button
            type="submit"
            isLoading={isSubmitting}
            text={isEditInfo ? "Add User" : "Update User"}
            className={`!text-[#fff] !font-semibold`}
            btnClass={` !rounded-md !bg-[#ED1C24]  `}
          />
        </div>
      </div>
    </div>
  );
};

export default Info;

const roles = [
  { value: "executive-producer", label: "Executive Producer" },
  { value: "producer", label: "Producer" },
];

const RoleList = ({
  handleSelectedRole,
  role,
  data,
}: {
  handleSelectedRole: ({ role }: { role: string }) => void;
  role: string;
  data: any;
}) => {
  const handleSelectedRoleEvent = () => {
    handleSelectedRole({ role: data?.value });
  };
  return (
    <div
      onClick={handleSelectedRoleEvent}
      className={`${styles.cell} ${role === data?.value ? styles.selectedDiv : ""}`}
      key={data?.value}
    >
      {data?.label}
    </div>
  );
};
