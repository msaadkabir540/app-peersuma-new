import React, { useEffect, useMemo } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import Input from "@/src/components/input";
import Selection from "@/src/components/selection";

import { palettes } from "@/src/helper/widget-color-templates";

import { FormSchemaWidget } from "@/src/interface/widget-interface";
import { WidgetInterface } from "@/src/interface/update-widget-interface";

import styles from "./index.module.scss";

interface ColorThemeInterface {
  widget: WidgetInterface;
  control: any;
  register: UseFormRegister<FormSchemaWidget>;
  setValue: UseFormSetValue<FormSchemaWidget>;
  handleColorPalette?: ({ colorPalette }: { colorPalette: any }) => void;
  colorPaletteWatch: any;
}

const ColorTheme: React.FC<ColorThemeInterface> = ({
  widget,
  control,
  setValue,
  register,
  colorPaletteWatch,
  handleColorPalette,
}) => {
  const valueColor = colorPaletteWatch?.value;

  const palette = palettes[valueColor as any];

  useEffect(() => {
    if (palette) {
      handleColorPalette?.({ colorPalette: palette });
      const { id, name, ...tempPalette } = palette;
      customizations?.map((customization) => {
        const { name } = customization;
        if ((tempPalette as any)[name]) {
          setValue(name as any, (tempPalette as any)[name]);
          setValue("shareColor" as any, (tempPalette as any)["shareColor"]);
          setValue("tryNowButtonColor" as any, (tempPalette as any)["tryNowButtonColor"]);
          setValue("tryNowButtonTextColor" as any, (tempPalette as any)["tryNowButtonTextColor"]);
        }
      });
    }
  }, [palette]);

  const handleSetColorPalette = ({ value }: { value: string }) => {
    const findColorPalette = palettes?.find((palette) => palette?.id === value);
    const setColorPalettes = {
      value: findColorPalette?.id as string,
      label: findColorPalette?.name as string,
    };

    setValue("colorPalette", setColorPalettes as any);
  };

  useEffect(() => {
    const handleSetValue = () => {
      customizations?.map((customization) => {
        const { name } = customization;
        if ((widget?.data as any)[name]) {
          setValue(name as any, (widget?.data as any)[name]);
        }
      });
    };

    handleSetColorPalette({ value: widget?.data?.colorPalette });
    handleSetValue();
  }, [setValue, widget?.data]);

  const colorPalettes = useMemo(() => {
    return (
      palettes?.map(
        ({ id, name, backgroundColor }: { id: string; name: string; backgroundColor: string }) => ({
          value: id,
          label: `${name}`,
          color: backgroundColor,
        }),
      ) || []
    );
  }, [palettes]);

  return (
    <>
      <div className={styles.colorPaletteContainer}>
        <div className={styles.colorPalettes}>Color Palette</div>
        <Selection
          control={control}
          isClearable={true}
          name="colorPalette"
          isSearchable={false}
          boderCustomeStyle={true}
          options={colorPalettes}
          iconClass={"!top-[9px]"}
          placeholder="Select Color Palette"
          customIcon={"/assets/down-black.svg"}
        />
      </div>
      <hr className={styles.borderLine} />
      <div className="flex flex-col gap-5 mb-[20px]">
        {customizations?.map(({ name, title }, index) => (
          <div key={index} className={styles.colorFields}>
            <label className="md:!text-[18px] !text-[14px]" htmlFor={name}>
              {title}
            </label>
            <Input
              id={name}
              name={name}
              type={"color"}
              register={register}
              container={styles.containerCustom}
              inputField={styles.inputContainerCustom}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ColorTheme;

export const customizations = [
  { title: "Background Color", name: "backgroundColor" },
  { title: "Title Color", name: "titleColor" },
  { title: "Text Color", name: "textColor" },
  { title: "Button Color", name: "buttonColor" },
  { title: "Thumbnail Title Color", name: "thumbnailTitleColor" },
  { title: "Hyper Text Color", name: "hyperTextColor" },
];
