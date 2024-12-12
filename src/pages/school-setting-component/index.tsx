"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { memo, useEffect, useMemo, useState } from "react";

import Layout from "../layout/page";
import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import Selection from "@/src/components/selection";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { useClients } from "@/src/(context)/context-collection";

import { getClientById, updateClient } from "@/src/app/api/clients";

import { s3TransloaditUploadMap } from "@/src/helper/helper";
import { S3TransloaditUploadMapResultInterface } from "@/src/app/interface/client-interface/client-interface";

import styles from "./index.module.scss";

const SchoolSettingComponent = () => {
  const context = useClients();
  const selectedClientIds = context && context?.selectedClientIds;
  const handleUpdateClient = context && context?.handleUpdateClient;

  const {
    setValue,
    register,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<{
    name: string;
    website: string;
    district?: string;
    state: { value: string; label: string } | null;
  }>({
    defaultValues: {
      name: "",
      website: "",
      district: "",
      state: null,
    },
  });

  const [schoolData, setSchoolData] = useState<any>();
  const [schoolImage, setSchoolImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shotModal, setShotModal] = useState({
    isModalOpen: false,
    fileName: "uploadMedia",
  });
  const [logoData, setLogoData] = useState<{
    S3Key: string | undefined;
    url: string | undefined;
    thumbnailUrl?: string | undefined;
  }>({
    S3Key: "",
    url: "",
    thumbnailUrl: "",
  });

  const handlePageLoading = ({ value }: { value: boolean }) => {
    setIsLoading(value);
  };

  const isValidUrl = (string: any) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    const isURLValid = isValidUrl(data?.website);
    if (!isURLValid) {
      setError("website", {
        type: "manual",
        message: "Enter a valid URL e.g.(https://example.example)",
      });
    } else {
      clearErrors("website");
      try {
        const updatedData = {
          ...schoolData,
          ...data,
          ...logoData,
          name: data?.name,
          website: data?.website,
          district: data?.district,
          state: data?.state?.value ? data?.state?.value : "",
        };

        const res: any = await updateClient({ id: selectedClientIds as string, data: updatedData });

        if (res.status === 200) {
          const setStateValue = usaStateName?.find((state) => {
            const stateValueLower = state?.value?.toLowerCase();
            const resStateLower = res?.data?.newClient?.state?.toLowerCase();
            return stateValueLower === resStateLower;
          });

          setLogoData(res?.data?.newClient);
          setSchoolImage(res?.data?.newClient?.url);
          setSchoolData(res?.data?.newClient);
          setValue("name", res?.data?.newClient?.name);
          setValue("website", res?.data?.newClient?.website);
          setValue("state", setStateValue as any);
          setValue("district", res?.data?.newClient?.district);
          createNotification({
            type: "success",
            message: "Success!",
            description: "Changes saved successfully!",
          });
          handleUpdateClient?.();
        } else {
          createNotification({
            type: "error",
            message: "Error!",
            description: res?.response?.data?.msg || "Failed to update user.",
          });
        }
      } catch (error) {
        createNotification({
          type: "error",
          message: "Error!",
          description: "Failed to update user.",
        });
      }
    }
  };

  const handleResetValue = () => {
    const setStateValue = usaStateName?.find((state) => {
      const stateValueLower = state?.value?.toLowerCase();
      const resStateLower = schoolData?.state?.toLowerCase();
      return stateValueLower === resStateLower;
    });

    clearErrors();
    setValue("name", schoolData?.name);
    setValue("state", setStateValue as any);
    setValue("website", schoolData?.website);
    setValue("district", schoolData?.district);
    setLogoData((prev) => ({ ...prev, url: schoolImage }));
  };

  const handleGetUserById = async ({ selectedClient }: { selectedClient: string }) => {
    try {
      const res: any = await getClientById({ clientId: selectedClient });

      if (res.status === 200) {
        const setStateValue = usaStateName?.find((state) => {
          const stateValueLower = state?.value?.toLowerCase();
          const resStateLower = res?.data?.state?.toLowerCase();
          return stateValueLower === resStateLower;
        });

        setLogoData(res.data);
        setSchoolImage(res.data?.url);
        setSchoolData(res?.data);
        setValue("name", res?.data?.name);
        setValue("website", res?.data?.website);
        setValue("state", setStateValue as any);
        setValue("district", res?.data?.district);
      }
    } catch (error) {
      handlePageLoading({ value: false });
      throw new Error(error as any);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedClientIds) {
      setIsLoading(true);
      handleGetUserById({ selectedClient: selectedClientIds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientIds]);

  const handleChangeLogo = () => {
    setShotModal((prev) => ({ ...prev, isModalOpen: true }));
  };
  const handleCloseModal = () => setShotModal((prev) => ({ ...prev, isModalOpen: false }));

  const imageUrl = useMemo(() => {
    return logoData?.url || "/assets/noImage.png";
  }, [logoData]);

  const nameField = Math?.random();

  return (
    <div>
      {isLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <Layout>
            <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
              <div className={`w-full max-w-[700px] m-auto  ${styles.customeHeightSchool}`}>
                <div className="md:mt-24 mt-24 mx-2 m-auto ml-autop-3">
                  <div className="font-medium text-2xl text-[#000]">School Settings</div>
                  <div className="w-full ">
                    <div className="my-4 ">
                      <div className={styles.avatarLogo}>
                        <Image
                          className="md:w-52 w-36"
                          style={{
                            borderRadius: "10px",
                          }}
                          src={imageUrl || "/assets/noImage.png"}
                          alt={"logo"}
                          height="100"
                          width="100"
                        />
                      </div>
                      <div className="flex justify-start items-center gap-3 mt-4 md:ml-[20px] ml-[0px]">
                        <Button
                          type="button"
                          text="Change Logo"
                          className={`!text-[#0F0F0F] font-normal`}
                          btnClass={`!rounded-md ${styles.grayBorder}  !bg-transparent `}
                          handleClick={handleChangeLogo}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="my-4">
                      <Input
                        type="text"
                        required={true}
                        name={"name"}
                        label="School Name"
                        register={register}
                        labelClass={"pl-[5px]"}
                        placeholder="Enter school name "
                        inputField={styles.inputPlaceHolder}
                        errorMessage={errors?.name && errors.name.message}
                      />
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="my-4">
                      <Input
                        labelClass={"pl-[5px]"}
                        type="text"
                        required={true}
                        name={"website"}
                        register={register}
                        label="School Website"
                        placeholder="Enter school website "
                        inputField={styles.inputPlaceHolder}
                        errorMessage={errors?.website && errors.website.message}
                      />
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="my-4">
                      <Input
                        type="text"
                        label="District"
                        name={"district"}
                        register={register}
                        labelClass={"pl-[5px]"}
                        placeholder="Enter district"
                        inputField={styles.inputPlaceHolder}
                      />
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="my-4">
                      <Selection
                        name="state"
                        stylesProps={{
                          width: "24px",
                          height: "24px",
                        }}
                        labelClassName={"pl-[5px]"}
                        customBackgroundColor={"#ffffff !important"}
                        label="State"
                        isClearable={true}
                        isSearchable={false}
                        options={usaStateName}
                        control={control}
                        costumPaddingLeft={"10px"}
                        customIcon={"/assets/downarrow.svg"}
                        customHeight={"44px"}
                        placeholder="Selecte state"
                        iconClass={styles.customSchoolClass}
                        boderCustomeStyle={true}
                        customBorder={"1px solid #B8B8B8"}
                        placeholderWidth="200px !important"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-3">
                    <Button
                      type="button"
                      text="Cancel"
                      className={`!text-[#ED1C24] !font-semibold`}
                      btnClass={`!rounded-md ${styles.redBorder}  !bg-transparent `}
                      handleClick={handleResetValue}
                    />
                    <Button
                      type="submit"
                      text="Update"
                      isLoading={isSubmitting}
                      className={`!text-[#fff] !font-semibold`}
                      btnClass={` !rounded-md !bg-[#ED1C24]  `}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Layout>

          <div className={`${shotModal?.isModalOpen ? styles.transloaditBackground : ""}`}>
            <TransloaditUploadModal
              fieldName={shotModal?.isModalOpen}
              handleCloseModal={handleCloseModal}
              setFieldName={(val) => {
                setShotModal((prev) => ({ ...prev, upload: val }));
              }}
              minNumberOfFiles={1}
              maxNumberOfFiles={1}
              template_id={process.env.NEXT_PUBLIC_TEMPLATE_SAMPLE_VIDEO_TEMPLATE_ID}
              allowedFileTypes={["image/*"]}
              mapUploads={s3TransloaditUploadMap}
              setUploads={async ({
                uploads,
              }: {
                uploads: S3TransloaditUploadMapResultInterface[];
              }) => {
                const templateTheme = {
                  url: uploads[0]?.url,
                  S3Key: uploads[0]?.s3Key,
                  thumbnailUrl: uploads[0]?.thumbnailUrl,
                };
                setLogoData(templateTheme);
              }}
              fields={{
                prefix: `/clientLogo/`,
                fileName: `clientLogo/style-${nameField}`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default memo(SchoolSettingComponent);

const usaStateName = [
  {
    value: "Alabama",
    label: "Alabama",
  },
  {
    value: "Alaska",
    label: "Alaska",
  },
  {
    value: "Arizona",
    label: "Arizona",
  },
  {
    value: "Arkansas",
    label: "Arkansas",
  },
  {
    value: "California",
    label: "California",
  },
  {
    value: "Colorado",
    label: "Colorado",
  },
  {
    value: "Connecticut",
    label: "Connecticut",
  },
  {
    value: "Delaware",
    label: "Delaware",
  },
  {
    value: "Florida",
    label: "Florida",
  },
  {
    value: "Georgia",
    label: "Georgia",
  },
  {
    value: "Hawaii",
    label: "Hawaii",
  },
  {
    value: "Idaho",
    label: "Idaho",
  },
  {
    value: "Illinois",
    label: "Illinois",
  },
  {
    value: "Indiana",
    label: "Indiana",
  },
  {
    value: "Iowa",
    label: "Iowa",
  },
  {
    value: "Kansas",
    label: "Kansas",
  },
  {
    value: "Kentucky",
    label: "Kentucky",
  },
  {
    value: "Louisiana",
    label: "Louisiana",
  },
  {
    value: "Maine",
    label: "Maine",
  },
  {
    value: "Maryland",
    label: "Maryland",
  },
  {
    value: "Massachusetts",
    label: "Massachusetts",
  },
  {
    value: "Michigan",
    label: "Michigan",
  },
  {
    value: "Minnesota",
    label: "Minnesota",
  },
  {
    value: "Mississippi",
    label: "Mississippi",
  },
  {
    value: "Missouri",
    label: "Missouri",
  },
  {
    value: "Montana",
    label: "Montana",
  },
  {
    value: "Nebraska",
    label: "Nebraska",
  },
  {
    value: "Nevada",
    label: "Nevada",
  },
  {
    value: "New Hampshire",
    label: "New Hampshire",
  },
  {
    value: "New Jersey",
    label: "New Jersey",
  },
  {
    value: "New Mexico",
    label: "New Mexico",
  },
  {
    value: "New York",
    label: "New York",
  },
  {
    value: "North Carolina",
    label: "North Carolina",
  },
  {
    value: "North Dakota",
    label: "North Dakota",
  },
  {
    value: "Ohio",
    label: "Ohio",
  },
  {
    value: "Oklahoma",
    label: "Oklahoma",
  },
  {
    value: "Oregon",
    label: "Oregon",
  },
  {
    value: "Pennsylvania",
    label: "Pennsylvania",
  },
  {
    value: "Rhode Island",
    label: "Rhode Island",
  },
  {
    value: "South Carolina",
    label: "South Carolina",
  },
  {
    value: "South Dakota",
    label: "South Dakota",
  },
  {
    value: "Tennessee",
    label: "Tennessee",
  },
  {
    value: "Texas",
    label: "Texas",
  },
  {
    value: "Utah",
    label: "Utah",
  },
  {
    value: "Vermont",
    label: "Vermont",
  },
  {
    value: "Virginia",
    label: "Virginia",
  },
  {
    value: "Washington",
    label: "Washington",
  },
  {
    value: "West Virginia",
    label: "West Virginia",
  },
  {
    value: "Wisconsin",
    label: "Wisconsin",
  },
  {
    value: "Wyoming",
    label: "Wyoming",
  },
];
