import React, { useMemo } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import Input from "@/src/components/input";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";

import { FormSchemaWidget } from "@/src/interface/widget-interface";

import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";

interface WidgetInitialFieldsEdit {
  control: any;
  register: UseFormRegister<FormSchemaWidget>;
  errors: FieldErrors<FormSchemaWidget>;
}

const WidgetInitialFieldsEdit: React.FC<WidgetInitialFieldsEdit> = ({
  register,
  errors,
  control,
}) => {
  const clinetContext = useClients();
  const allUser = clinetContext ? clinetContext?.allUser : [];

  const selectedClient = clinetContext && clinetContext?.selectedClient;
  const selectedClientIds = clinetContext && clinetContext?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const producerOptions = useMemo(() => {
    return allUser
      ?.filter(({ clientId }: { clientId: any }) =>
        clientId.find(
          (role: any) => role?.role === "executive-producer" && role?.clientId === selectedClientId,
        ),
      )
      ?.map(({ _id, username }) => ({
        label: `${username || ""}`,
        value: _id,
      }));
  }, [allUser]);

  return (
    <>
      <Input
        label="Name"
        name="name"
        required={true}
        container="mb-[20px]"
        register={register}
        labelClass={"!font-semibold"}
        inputField={styles.widgetNameField}
        errorMessage={errors && errors.name?.message}
      />
      <Textarea
        rows={4}
        name="description"
        label="Description"
        register={register}
        container="mb-[17px] !bg-transparent"
        placeholder={"Enter Description"}
        customLabelClass={styles.TextAreaField}
        textAreaCustomClass={styles.textAreaCustomClass}
      />
      <Selection
        isMulti
        name="producers"
        control={control}
        isClearable={true}
        stylesProps={{
          width: "24px",
          height: "24px",
        }}
        labelClassName="!font-semibold"
        isSearchable={false}
        customHeight={"44px"}
        boderCustomeStyle={true}
        costumPaddingLeft={"10px"}
        options={producerOptions || []}
        label="Permission to assign videos"
        customBorder={"1px solid #B8B8B8"}
        iconClass={styles.customWidgetClass}
        imageClass={styles.imageCustomClassCustom}
        customIcon={"/assets/down-black.svg"}
        placeholderWidth="200px !important"
        customBackgroundColor={"transparent !important"}
      />
    </>
  );
};

export default WidgetInitialFieldsEdit;
