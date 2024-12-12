"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import Design from "./tabs/design";
import General from "./tabs/general";

import ColorTheme from "./tabs/color-theme";

import { getWidgetById, updateWidget } from "@/src/app/api/widget";

import { assets } from "@/src/helper/assets_example";
import { useClients } from "@/src/(context)/context-collection";

import Layout from "../layout/page";
import Tabs from "@/src/components/tabs";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import CarouselTemplate from "./widget-templates/carousel-widget";
import SlideShowTemplate from "./widget-templates/slide-show-widget";
import VerticalStackTemplate from "./widget-templates/vertical-stack-widget";
import ThumbnailGridTemplate from "./widget-templates/thumbnail-grid-widget";

import { SlideShowTemplateInterface } from "../../interface/slide-show-interface";
import { ThumbnailGridTemplateInterface } from "../../interface/thumbnail-grid-interface";
import {
  TabComponentInterface,
  WidgetDataType,
  WidgetInterface,
  widgetTemplateInterface,
} from "@/src/interface/update-widget-interface";
import { VerticalStackTemplateInterface } from "@/src/interface/vertical-stack-interface";

import styles from "./index.module.scss";

const UpdateWidget = ({ _id }: { _id: string }) => {
  const route = useRouter();
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<any>({
    defaultValues: {
      active: false,
      showTitle: false,
      enableShare: false,
      showDescription: false,
    },
  });

  const nameWatch = watch("name") || "";
  const activeWatch = watch("active") || false;
  const colorPaletteWatch = watch("colorPalette") || { value: "", label: "" };

  const clientContext = useClients();
  const allUser = clientContext ? clientContext?.allUser : [];
  const selectedClient = clientContext?.selectedClientIds;

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [widget, setWidget] = useState<WidgetInterface>({ active: 0, data: {} as WidgetDataType });
  const { active } = widget;

  const handleBack = () => {
    setPageLoading(true);
    route.push("/widgets");
  };
  const onSubmit = async (data: WidgetDataType) => {
    delete data?._id;
    data = {
      ...data,
      producers: data?.producers?.map((data: any) => data?.value),
      colorPalette: data?.colorPalette?.value as string,
    };
    const { media, ...rest } = data;
    try {
      const res = await updateWidget({
        _id,
        data: { ...rest, clientId: selectedClient as string },
      } as any);
      if (res.status === 200) {
        setWidget((prev) => {
          prev.data = res.data.updatedWidget;
          return {
            ...prev,
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const media = assets?.map(
    ({
      asset: {
        id,
        public_name,
        public_description,
        version: { external_id, thumbnails },
      },
    }) => ({
      _id: id,
      name: public_name,
      description: public_description,
      thumbnailUrl: thumbnails[2].url_image,
      // videoUrl: `${process.env.NEXT_PUBLIC_PEERSUMA_STUDIO}${external_id}`,
      videoUrl: `${external_id}`,
    }),
  );

  const templateProps = useMemo(() => {
    return {
      assets: media,
      isAllowGetStartedModal: false,
      widget: {
        ...watch(),
        subscribers: 107,
      },
    };
  }, [media, watch()]);

  const handleColorPalette = ({ colorPalette }: { colorPalette: any }) => {
    const { id, name, ...tempPalette } = colorPalette;
    setWidget((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        colorPalette: id,
        ...tempPalette,
      },
    }));
  };

  const tabsComponents = {
    0: <General activeWatch={activeWatch} register={register} errors={errors} control={control} />,
    1: <Design nameWatch={nameWatch} register={register} control={control} />,
    2: (
      <ColorTheme
        widget={widget}
        control={control}
        register={register}
        setValue={setValue}
        colorPaletteWatch={colorPaletteWatch}
        handleColorPalette={handleColorPalette}
      />
    ),
  };

  useEffect(() => {
    const producers = watch("producers");

    const selectedProducers = producers
      ?.map((producerId: any) => {
        const user = allUser?.find((data) => data?._id === producerId);
        return user ? { label: user?.username, value: user?._id } : null;
      })
      ?.filter(Boolean);
    setValue("producers", selectedProducers);
  }, [allUser]);

  const widgetTemplate: widgetTemplateInterface = {
    carousel: <CarouselTemplate {...(templateProps as any)} />,
    slideshow: <SlideShowTemplate {...(templateProps as SlideShowTemplateInterface)} />,
    thumbnailGrid: <ThumbnailGridTemplate {...(templateProps as ThumbnailGridTemplateInterface)} />,
    verticalStack: <VerticalStackTemplate {...(templateProps as VerticalStackTemplateInterface)} />,
  };

  const getWidgetByID = async () => {
    setPageLoading(true);
    try {
      const res = await getWidgetById({ _id } as any);
      if (res.status === 200) {
        setWidget((prev: any) => ({ ...prev, data: res.data }));
        const { createdAt, updatedAt, __v, ...temp } = res.data;
        setValue("colorPalette", +temp?.colorPalette || 1);
        setValue("textColor", temp?.textColor || "#FFD6AF");
        setValue("buttonColor", temp?.buttonColor || "#1C1C20");
        setValue("thumbnailColor", temp?.thumbnailColor || "#EE5F1D");
        setValue("widgetTemplate", temp?.widgetTemplate || "carousel");
        setValue("backgroundColor", temp?.backgroundColor || "#1C1C20");
        setValue("buttonTextColor", temp?.buttonTextColor || "#FFD6AF");
        setValue("tryNowButtonColor", temp?.tryNowButtonColor || "#1C1C20");
        setValue("tryNowButtonTextColor", temp?.tryNowButtonTextColor || "#FFD6AF");
        reset({
          ...temp,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    getWidgetByID();
  }, []);

  const handlePageRedirect = () => setPageLoading(true);

  const handleTabClick = ({ index }: { index: number }) =>
    setWidget((prev) => ({ ...prev, active: index }));

  return (
    <>
      {pageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <Layout handlePageRedirect={handlePageRedirect}>
            <div className={styles.container}>
              <div className={styles.formContainer}>
                <Tabs tabs={tabs({ handleTabClick })} active={active} />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.tabContainer}>
                    {tabsComponents[active as keyof TabComponentInterface]}
                  </div>

                  <div className="flex justify-end items-center gap-3">
                    <Button
                      type="button"
                      text="Cancel"
                      className={`!text-[#ED1C24] !font-semibold`}
                      btnClass={`!rounded-md ${styles.redBorder}  !bg-transparent `}
                      handleClick={handleBack}
                    />
                    <Button
                      type="submit"
                      text="Save"
                      isLoading={isSubmitting}
                      className={`!text-[#fff] !font-semibold`}
                      btnClass={` !rounded-md !bg-[#ED1C24] !max-w-[80px]`}
                    />
                  </div>
                </form>
              </div>
              <div className={styles.widgetContainer}>
                {
                  widgetTemplate[
                    (watch("widgetTemplate") as keyof widgetTemplateInterface) || "showcase"
                  ]
                }
              </div>
            </div>
          </Layout>
        </>
      )}
    </>
  );
};

export default UpdateWidget;

const tabs = ({ handleTabClick }: any) => {
  return [
    { title: "General", handleClick: handleTabClick },
    { title: "Design", handleClick: handleTabClick },
    { title: "Color Theme", handleClick: handleTabClick },
  ];
};
