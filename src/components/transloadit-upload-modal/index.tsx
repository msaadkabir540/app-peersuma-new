import moment from "moment";
import Uppy from "@uppy/core";
import React, { useEffect } from "react";
import Transloadit from "@uppy/transloadit";
import { DashboardModal } from "@uppy/react";

import createNotification from "../create-notification";

import {
  ResultInterface,
  TransloaditModalInterface,
  UseUppyWithTransloaditInterface,
} from "./transloadit-upload-interface";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const useUppyWithTransloadit = ({
  fields,
  customName,
  template_id,
  onCloseModal,
  setMediaList,
  customExtension,
  allowedFileTypes,
  maxNumberOfFiles,
  minNumberOfFiles,
  droppedFiles, // Added droppedFiles prop to handle files
}: UseUppyWithTransloaditInterface) => {
  const uppy = React.useMemo(() => {
    const uppyInstance = new Uppy({
      autoProceed: false,
      ...(customName && {
        onBeforeFileAdded: (currentFile) => {
          const splitted = customName?.split("_");
          splitted?.pop();
          const modifiedFile = {
            ...currentFile,
            name: splitted.join("_"),
          };
          return modifiedFile;
        },
      }),
    });

    uppyInstance.use(Transloadit, {
      params: {
        auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY as string },
        template_id,
      },
      fields: customName
        ? ({
            prefix: fields?.prefix,
            timeStamp: fields?.timeStamp || moment().format("YYYYMMDD_HHmmss"),
          } as { prefix: string; timeStamp: string } | undefined | any)
        : fields,
      waitForEncoding: true,
      waitForMetadata: true,
    });

    uppyInstance.setOptions({
      restrictions: {
        allowedFileTypes,
        maxNumberOfFiles,
        minNumberOfFiles,
      },
    });

    // Automatically add dropped files to uppy
    if (droppedFiles?.length) {
      Array?.from(droppedFiles)?.forEach((file: any) => {
        uppyInstance?.addFile({
          name: file?.name,
          type: file?.type,
          data: file,
        });
      });
    }

    return uppyInstance;
  }, [
    customName,
    template_id,
    fields,
    allowedFileTypes,
    maxNumberOfFiles,
    minNumberOfFiles,
    droppedFiles, // Ensure droppedFiles are re-evaluated
  ]);

  useEffect(() => {
    {
      customExtension &&
        uppy.on("file-added", (file) => {
          if (file.extension !== customExtension) {
            createNotification({
              type: "error",
              message: "Please upload file with same extension",
            });
            uppy.removeFile(file.id);
          }
        });
    }

    uppy.on("complete", (result) => {
      if (!result?.successful?.length) return;
      setMediaList({ result });
      onCloseModal();
    });

    uppy.on("upload-error", (error) => {
      console.error("error message:", error);
      createNotification({ type: "error", message: " upload-error" });
    });

    uppy.on("restriction-failed", (error) => {
      console.error("restriction-failed:", error);
      createNotification({ type: "error", message: "restriction-failed" });
    });

    return () => {
      uppy.close();
    };
  }, [uppy, customExtension, onCloseModal, setMediaList]);

  return uppy;
};

const TransloaditUploadModal: React.FC<TransloaditModalInterface> = ({
  fieldName,
  customName,
  mapUploads,
  setUploads,
  setFieldName,
  customExtension,
  handleCloseModal,
  allowedFileTypes = null,
  maxNumberOfFiles = null,
  minNumberOfFiles = null,
  template_id = process.env.NEXT_PUBLIC_UPLOAD_TEMPLATE_ID,
  fields = { prefix: "/", timeStamp: moment().format("YYYYMMDD_HHmmss") },
  droppedFiles, // Add droppedFiles as prop
}) => {
  const setMediaList = ({ result }: { result: ResultInterface }) => {
    const resp = { data: result?.transloadit?.[0] };
    const uploads = mapUploads(resp, fields) || result?.transloadit?.[0]?.results?.[":original"];
    result?.transloadit?.[0]?.results?.["convert_to_mp4"] ||
      result?.transloadit?.[0]?.results?.["convert_heic_to_jpg"];
    setUploads({ uploads });
  };

  const onCloseModal = () => {
    handleCloseModal?.();
    setFieldName?.(false);
    const className = document?.getElementsByTagName("body")?.[0];
    className.classList.remove("uppy-Dashboard-isFixed");
  };

  const uppy = useUppyWithTransloadit({
    fields,
    customName,
    template_id,
    setMediaList,
    onCloseModal,
    customExtension,
    allowedFileTypes,
    maxNumberOfFiles,
    minNumberOfFiles,
    droppedFiles, // Pass droppedFiles to uppy instance
  } as UseUppyWithTransloaditInterface);

  return (
    <div>
      <DashboardModal
        uppy={uppy}
        open={!!fieldName}
        showProgressDetails
        closeAfterFinish={false}
        onRequestClose={() => onCloseModal()}
        proudlyDisplayPoweredByUppy={false}
        locale={
          {
            strings: { dropHereOr: "Drop here or %{browse}", browse: "browse" },
          } as any
        }
      />
    </div>
  );
};

export default TransloaditUploadModal;
