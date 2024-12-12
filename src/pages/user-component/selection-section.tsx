import React, { useMemo } from "react";

import Input from "@/src/components/input";
import Button from "@/src/components/button";
import DropDownMenu from "@/src/components/drop-down-menu";

import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";

const SelectionSection = ({
  searchParams,
  setSearchParams,
  handleCreateUpdate,
  handleSelectedValue,
}: {
  searchParams: string;
  handleCreateUpdate: () => void;
  handleSelectedValue: ({ value }: { value: string }) => void;
  setSearchParams: any;
}) => {
  const context = useClients();
  const currentUserRoles = context && context?.currentUserRole;

  const filteredRoles = useMemo(() => {
    return currentUserRoles === "producer"
      ? roles?.filter((role) => role.value === "producer")
      : roles;
  }, [roles, currentUserRoles]);

  const handleSetEvent = (e: any) => setSearchParams(e.target.value);
  const handleClearFiled = () => setSearchParams("");

  return (
    <div className="flex justify-between  md:flex-row flex-col gap-3 items-center md:my-5 mt-1 mb-3">
      <Input
        type="text"
        crossIcons={true}
        name={"searchTerm"}
        value={searchParams}
        showSearchIcon={true}
        searchIcon={styles.searchIconCustomClass}
        container={styles.inputSearchContainer}
        placeholder="Type and search"
        inputField={styles.inputSearch}
        onChange={handleSetEvent}
        handleClickCross={handleClearFiled}
      />
      <div className={`flex justify-between items-center gap-3 ${styles.customWidth}`}>
        <div>
          <DropDownMenu
            placeholder={"Role"}
            option={filteredRoles}
            handleSelectedValue={handleSelectedValue}
            menuCustomClass={styles.menuCustomClass}
          />
        </div>
        <Button
          type="button"
          text="Add New User"
          handleClick={handleCreateUpdate}
          btnClass={` !rounded-md !bg-[#ED1C24]  `}
          className={`!text-[#fff] !font-semibold`}
        />
      </div>
    </div>
  );
};

export default SelectionSection;

const roles = [
  { value: "executive-producer", label: "Executive Producer" },
  { value: "producer", label: "Producer" },
];
