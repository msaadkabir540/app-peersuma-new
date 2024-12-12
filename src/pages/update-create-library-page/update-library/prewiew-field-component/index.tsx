import React from "react";

import Input from "@/src/components/input";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";

import { OptionType } from "@/src/components/selection/selection-interface";

import styles from "../index.module.scss";

const PreviewFieldCompoenets = ({
  control,
  register,
  errorName,
  nameValue,
  producerOptions,
  handleSetNameValue,
  handleDescriptionChange,
}: {
  control: any;
  register: any;
  errorName: string;
  nameValue: string;
  producerOptions: { label: string; value: string }[] | undefined;
  handleSetNameValue: (e: any) => void;
  handleDescriptionChange: (e: any) => void;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Input
        name="name"
        label="Name"
        value={nameValue}
        type={"text"}
        inputField="!bg-transparent"
        required={true}
        labelClass="!text-[#0F0F0F] !text-base !font-medium "
        errorMessage={errorName}
        container="relative"
        placeholder="Enter the name"
        onChange={handleSetNameValue}
      />

      <Textarea
        rows={8}
        label="Description"
        name="description"
        register={register}
        isFontWieght={true}
        textAreaCustomClass="!bg-transparent"
        customLabelClass={styles.labelClass}
        placeholder={"Enter description here"}
        container=" relative !bg-transparent"
        handleChange={handleDescriptionChange}
      />
      <Selection
        label="Producers"
        name={"producers"}
        placeholder="Select"
        isClearable={true}
        boderCustomeStyle={true}
        labelClassName={styles.labelClass}
        customColor={"#A1A1A1 !important"}
        className={styles.labelCustom}
        customIcon="/assets/down-gray.svg"
        iconClass={styles.iconCustomClass}
        imageClass={styles.imageCustomClass}
        control={control as any}
        customeStyles={{
          height: "42px",
        }}
        options={producerOptions as OptionType[]}
      />
      <div>
        <div className="text-[#0F0F0F] text-[16px] font-medium leading-normal">Resources</div>

        <Input
          type={"text"}
          name="reference"
          register={register}
          inputField="!bg-transparent"
          placeholder="Paste resource url here"
          label="*Attach resource url here to display in embedded page"
          labelClass="!text-[#0F0F0F] !text-sm !font-medium !italic !ml-3"
        />
      </div>
    </div>
  );
};

export default PreviewFieldCompoenets;
