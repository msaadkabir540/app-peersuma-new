import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "../layout/page";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import Loader from "@/src/components/loader";
import createNotification from "@/src/components/create-notification";
import TransloaditUploadModal from "@/src/components/transloadit-upload-modal";

import { vimeoTransloaditUploadMap } from "@/src/helper/helper";

import { addMultipleLibraryMedia } from "@/src/app/api/library-api";

import { useClients } from "@/src/(context)/context-collection";

import style from "./index.module.scss";

const CreateLibraryPage = () => {
  const route = useRouter();

  const inputFile = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [droppedFiles, setDroppedFiles] = useState<any>(null);

  const clientContext = useClients();
  const allClients = clientContext && clientContext?.allClients;
  const loggedInUser = clientContext && clientContext?.loggedInUser;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const handleShowLibraryProcessCard = clientContext && clientContext?.handleShowLibraryProcessCard;

  const handleClickEventClose = () => {
    setIsOpen(false);
    setDroppedFiles(null);
  };

  const handleVideoUrl = (e: any) => setVideoUrl(e?.target.value);

  const handleUpdateMedia = () => {
    route.push(`/update-library/?videoUrl=${videoUrl}`);
  };

  const handleCloseCreate = () => {
    route.push(`/library`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files as any;
    if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
      setDroppedFiles(files);
      setIsOpen(true); // Open the Transloadit modal after file drop
    } else {
      createNotification({
        type: "warn",
        message: "Warning!",
        description: "Please select a video only",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadMediaLibrary = async (uploads: any) => {
    setIsLoading(true);
    try {
      const res = await addMultipleLibraryMedia({
        data: {
          uploads: uploads?.uploads as any,
          clientId: selectedClientIds as string,
          userId: loggedInUser?._id,
          folderId: allClients?.find((x: any) => x._id === selectedClientIds)?.vimeoFolderId || "",
        },
      });
      if (res.status === 200) {
        localStorage.setItem("libraryId", res?.data?.newLibraryMedia?.[0]?._id);
        localStorage.setItem("videoId", res?.data?.newLibraryMedia?.[0]?.assetId);

        route.push(`/library`);
        handleShowLibraryProcessCard?.();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  const handleFileUpload = (e: any) => {
    const { files } = e.target;
    if (files && files.length) {
      if (files.length && files?.[0]?.type.split("/")?.[0] === "video") {
        setDroppedFiles(files);
        setIsOpen(true); // Open the Transloadit modal after file drop
      } else {
        createNotification({
          type: "warn",
          message: "Warning!",
          description: "Please select a video only",
        });
      }
    }
  };

  return (
    <>
      <Layout>
        {isLoading ? (
          <Loader diffHeight={34} pageLoader={true} />
        ) : (
          <>
            <div className="rounded-[15px] m-auto md:border md:mt-[120px] md:border-[#B8B8B8] md:bg-[#F8F8F8] max-w-[800px] p-[20px]  items-start gap-[20px] self-stretch">
              <div className="flex items-center gap-4">
                <Image
                  data-testid="close-icon"
                  src={"/assets/arrow-top.svg"}
                  style={{ cursor: "pointer", transform: "rotate(90deg)" }}
                  alt="sortUp"
                  className="!w-[24px] !h-[24px]"
                  height="100"
                  width="100"
                  onClick={handleCloseCreate}
                />
                <div className="text-[#0F0F0F] text-[20px] font-semibold leading-normal">
                  Add Video to library
                </div>
              </div>
              <div className="my-5 md:h-full h-[calc(100vh-236px)]">
                <div>
                  <div
                    className={`text-base font-font-medium text-[#0F0F0F] mb-1 ${style.labelModal}`}
                  >
                    Upload Video
                  </div>

                  <input
                    style={{ display: "none" }}
                    // accept=".zip,.rar"
                    ref={inputFile}
                    onChange={handleFileUpload}
                    type="file"
                  />
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={style.dropVideoContainer}
                  >
                    Drop files here or{" "}
                    <span
                      className="text-red-600  cursor-pointer underline"
                      onClick={onButtonClick}
                    >
                      browser file
                    </span>
                  </div>
                </div>

                <div className="text-center my-4">OR</div>
                <div>
                  <div
                    className={`text-base font-font-medium text-[#0F0F0F] mb-1 ${style.labelModal}`}
                  >
                    Video URL
                  </div>
                  <div className="relative bg-[#fff]">
                    <div className="absolute z-10 left-[11px] md:mt-[9px] mt-[11px] text-[#A1A1A1] md:text-base text-sm">
                      https://vimeo.com/
                    </div>
                    <Input
                      type={"text"}
                      name="videoURL"
                      required={true}
                      value={videoUrl}
                      placeholder="Enter Id"
                      container="mb-4 relative"
                      onChange={handleVideoUrl}
                      inputField={`md:!pl-[167px] !pl-[147px] ${style.inputCustom}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 mt-5">
                <Button
                  type="button"
                  text="Cancel"
                  handleClick={handleCloseCreate}
                  className={`!text-[#ED1C24] !font-semibold`}
                  btnClass={`!rounded-md ${style.redBorder} !bg-transparent md:!max-w-max !max-w-none`}
                />
                <Button
                  text="Next"
                  type="button"
                  isLoading={false}
                  handleClick={handleUpdateMedia}
                  disabled={videoUrl ? false : true}
                  className={`!text-[#fff] !font-semibold`}
                  btnClass={` !rounded-md ${videoUrl ? "!bg-[#ED1C24]" : "!bg-[#c3c2c2]"}  !min-w-[100px] md:!max-w-max !max-w-none`}
                />
              </div>
            </div>

            <div className={`${isOpen ? style.transloaditBackground : ""}`}>
              <TransloaditUploadModal
                droppedFiles={droppedFiles}
                fieldName={isOpen}
                setFieldName={handleClickEventClose}
                allowedFileTypes={[`video/*`]}
                mapUploads={vimeoTransloaditUploadMap as any}
                setUploads={async ({ uploads }: { uploads: any[] }) => {
                  await uploadMediaLibrary({ uploads } as any);
                }}
                template_id={process.env.NEXT_PUBLIC_TRANSLOADIT_VIMEO_TEMPLATE_ID}
              />
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default CreateLibraryPage;
