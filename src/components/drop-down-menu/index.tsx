import React, { useRef, useState } from "react";

import { useOutsideClickHook } from "@/src/helper/helper";

import style from "./drop-down.module.scss";

interface DropDownMenuInterface {
  placeholder: string;
  mainCustomClass?: string;
  menuCustomClass?: string;
  option: { value: string; label: string }[];
  handleSelectedValue: ({ value }: { value: string }) => void;
}

const DropDownMenu: React.FC<DropDownMenuInterface> = ({
  option,
  placeholder,
  mainCustomClass,
  handleSelectedValue,
  menuCustomClass,
}) => {
  const clickRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [value, setValue] = useState<{ label: string; value: string }>({ value: "", label: "" });

  const handleClickOpen = () => setMenuOpen(!menuOpen);
  const handleClickClose = () => setMenuOpen(false);

  useOutsideClickHook(clickRef, () => {
    setMenuOpen(false);
  });

  const handleEmpty = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelectedValue({ value: "" });
    setValue({ value: "", label: "" });
  };

  const formattedString = `${placeholder} ${value?.label ? `: ${value?.label}` : ""}`;

  return (
    <>
      <div
        className={`${style.main} relative cursor-pointer ${mainCustomClass} ${value?.label ? style.sleetedClass : ""}`}
        ref={clickRef}
        onClick={handleClickOpen}
      >
        {formattedString}

        {value?.label && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            onClick={handleEmpty}
          >
            <path
              d="M8.00001 8.00002L13 13M3 13L8.00001 8.00002L3 13ZM13 3L8.00001 8.00002L13 3ZM8.00001 8.00002L3 3L8.00001 8.00002Z"
              stroke="#ED1C24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {menuOpen && (
        <div ref={clickRef} className={`absolute cursor-pointer ${style.menu} ${menuCustomClass}`}>
          {option?.map((data) => (
            <React.Fragment key={data?.value}>
              <DropDownMenuList
                label={data?.label}
                value={data?.value}
                setValue={setValue}
                handleSelectedValue={handleSelectedValue}
                handleClickClose={handleClickClose}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export default DropDownMenu;

const DropDownMenuList = ({
  value,
  label,
  setValue,
  handleClickClose,
  handleSelectedValue,
}: {
  value: string;
  label: string;
  setValue: (argu: any) => void;
  handleClickClose: () => void;
  handleSelectedValue: ({ value }: { value: string }) => void;
}) => {
  const clickEventHandler = () => {
    setValue((prev: { label: string; value: string }) => ({ ...prev, label, value }));
    handleSelectedValue({ value });
    handleClickClose();
  };

  return <div onClick={clickEventHandler}>{label}</div>;
};
