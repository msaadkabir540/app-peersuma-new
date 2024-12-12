import React, { useMemo } from "react";

import Input from "@/src/components/input";
import Textarea from "@/src/components/textarea";
import Selection from "@/src/components/selection";

import { useClients } from "@/src/(context)/context-collection";

import { WidgetInitialFieldsInterface } from "@/src/interface/widget-interface";

import styles from "./index.module.scss";

const WidgetInitialFields: React.FC<WidgetInitialFieldsInterface> = ({
  register,
  errors,
  control,
}) => {
  const clinetContext = useClients();
  const allUser = clinetContext ? clinetContext?.allUser : [];

  const producerOptions = useMemo(() => {
    return allUser
      ?.filter(({ roles }: { roles: string[] }) =>
        roles.find((role: string) => ["executive-producer", "producer"]?.includes(role)),
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
        name={"name"}
        required={true}
        container="mb-4"
        register={register}
        errorMessage={errors && errors.name?.message}
      />
      <Textarea
        name="description"
        label="Description"
        register={register}
        rows={4}
        container="mb-1"
        customLabelClass={styles.TextAreaField}
        placeholder={"Enter Description"}
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
        iconClass={styles.customWidgetClass}
        isSearchable={false}
        costumPaddingLeft={"10px"}
        customIcon={"/assets/downarrow.svg"}
        customHeight={"44px"}
        label="Permission to assign videos"
        options={producerOptions || []}
        customBorderRadius={"5px"}
        customBorder={"1px solid #B8B8B8"}
        placeholderWidth="200px !important"
      />
    </>
  );
};

export default WidgetInitialFields;
