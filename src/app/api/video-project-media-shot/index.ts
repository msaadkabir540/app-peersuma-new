import createNotification from "@/src/components/create-notification";
import { axiosApiRequest } from "@/src/helper/api";

type ShotAction =
  | "add-shot"
  | "upload-media"
  | "delete-media"
  | "update-shot"
  | "move-media-shot"
  | "upload-shot-by-name"
  | "update-shot-name-by-Id"
  | "get-shot-by-name"
  | "update-media-file-name";

export const videoProjectMediaShotApi = {
  performAction: async ({ action, data }: { action: ShotAction; data?: any }) => {
    if (action === "upload-media") {
      try {
        const response: any = await axiosApiRequest({
          method: "put",
          url: `albumshot/upload/${data?.id}`,
          data: { media: data?.media },
        });

        if (response?.status === 200) {
          return { getVideoProject: response?.data?.data, status: 200 };
        }
      } catch (error) {
        console.error("Error:", error);

        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
        return { error: "Internal Server Error" };
      }
    } else if (action === "delete-media") {
      try {
        const response = await axiosApiRequest({
          method: "delete",
          url: `/albumshot/delete-media`,
          params: data,
        });
        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "update-media-file-name") {
      try {
        const response = await axiosApiRequest({
          method: "put",
          url: `/albumshot/update-media-name/${data?.albumshotId}`,
          params: data,
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "add-shot") {
      try {
        const response = await axiosApiRequest({
          method: "post",
          url: "/albumshot",
          data,
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "update-shot") {
      try {
        const shotData = {
          name: data?.name,
          dueDate: data?.dueDate,
          description: data?.description,
        };
        const response = await axiosApiRequest({
          method: "put",
          url: `/albumshot/${data?.shotId}`,
          data: shotData,
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "move-media-shot") {
      try {
        const response = await axiosApiRequest({
          method: "post",
          url: `albumshot/move-album-shot`,
          data: data,
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "get-shot-by-name") {
      try {
        const response = await axiosApiRequest({
          method: "get",
          url: `albumshot/single_shot`,
          params: { shotUrl: data?.shotLink },
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "update-shot-name-by-Id") {
      try {
        const response = await axiosApiRequest({
          method: "put",
          url: `albumshot/shotUrl/${data?.shotId}`,
          data: { shotUrl: data?.shotUrl },
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    }
  },
};
