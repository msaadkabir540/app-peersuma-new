"use client";
import React from "react";
import { useForm } from "react-hook-form";

import Button from "@/src/components/button";
import WidgetInitialFields from "../initial-fields";

import { createWidget } from "@/src/app/api/widget";

import { palettes } from "@/src/helper/widget-color-templates";

import { useClients } from "@/src/(context)/context-collection";
import { FormSchemaWidget } from "@/src/interface/widget-interface";

import styles from "./index.module.scss";

const CreateWidget = ({
  handleClose,
  handleUpdate,
}: {
  handleClose: () => void;
  handleUpdate: () => void;
}) => {
  const clientContext = useClients();
  const selectedClient = clientContext?.selectedClientIds;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
  } = useForm<FormSchemaWidget>({
    defaultValues: {
      name: "",
      description: "",
      producers: [],
    },
  });

  const onSubmit = async (data: FormSchemaWidget) => {
    try {
      const { name, id, ...rest } = palettes?.[1];
      const producersData = data?.producers?.map((data: any) => data?.value);
      data = {
        ...data,
        ...rest,
        colorPalette: id as any,
        producers: [...producersData],
      };
      await createWidget({ data: { ...data, clientId: selectedClient as string } });
      handleUpdate();
      handleClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className="md:text-xl text-lg font-semibold mb-5">Add New Widget</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <WidgetInitialFields register={register} errors={errors} control={control} />
        <div className={styles.buttonContainer}>
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
            text={"Add Widget"}
            className={`!text-[#fff] !font-semibold`}
            btnClass={` !rounded-md !bg-[#ED1C24]  `}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateWidget;
