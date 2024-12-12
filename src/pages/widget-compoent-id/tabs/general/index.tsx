import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import Switch from "@/src/components/switch";
import WidgetInitialFieldsEdit from "./initial-fields-edit";

import { FormSchemaWidget } from "@/src/interface/widget-interface";

import styles from "./index.module.scss";

interface GeneralInterface {
  control: any;
  register: UseFormRegister<FormSchemaWidget>;
  errors: FieldErrors<FormSchemaWidget>;
  activeWatch: any;
}

const General: React.FC<GeneralInterface> = ({ activeWatch, register, errors, control }) => {
  return (
    <div className="gap-5">
      <WidgetInitialFieldsEdit control={control} errors={errors} register={register} />
      <div className={styles.switchContainer}>
        <div>
          Widget Status <span style={{ fontWeight: "500" }}> (Active)</span>
        </div>
        <Switch
          id="active"
          name="active"
          control={control}
          mainClass={styles.switchMainClass}
          defaultValue={activeWatch ? true : false}
        />
      </div>
    </div>
  );
};

export default General;
