import createNotification from "@/src/components/create-notification";

import { DataTypes, DraftAction } from "../../interface/draft-interface/draft-interface";

import { axiosApiRequest } from "@/src/helper/api";

export const DraftApi = {
  performAction: async ({ action, data }: { action: DraftAction; data?: DataTypes }) => {
    if (action === "get-all-video-drafts") {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found in localStorage");
        }
        const draftData = {
          clientId: data?.selectedClientId,
          videoProjectId: data?.videoProjectId,
        };

        const response: any = await axiosApiRequest({
          method: "GET",
          url: `/video-draft/get-video-draft-clientId`,
          params: draftData,
        });

        if (response?.status === 200) {
          return { getDraftVideo: response?.data?.getDraftVideo, status: 200 };
        }
      } catch (error) {
        console.error("Error:", error);
        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
        return { error: "Internal Server Error" };
      }
    } else if (action === "add-comment") {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return { msg: "please login", status: 200 };
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/video-draft/add-comments/${data?.videoDraftId}?comments=${data?.comment}&videoProjectId=${data?.videoProjectId}&clientId=${data?.clientId}&userId=${data?.userId}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const responseData = await response.json();

        if (responseData) {
          return { responseData, status: 200 };
        } else if (responseData?.message || responseData?.error || responseData?.msg) {
          return {
            msg: responseData?.message || responseData?.error,
            status: 400,
          };
        }
      } catch (error) {
        console.error("Error:", error);
        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
        return { error: "Internal Server Error" };
      }
    } else if (action === "update-draft-name") {
      try {
        const updatedData = data?.bodyData;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/video-draft/update-draft-name/${data?.videoDraftId}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...updatedData }),
          },
        );

        const responseData = await response.json();

        if (responseData) {
          return { responseData, status: 200 };
        } else if (responseData?.message || responseData?.error || responseData?.msg) {
          return {
            msg: responseData?.message || responseData?.error,
            status: 400,
          };
        }
      } catch (error) {
        console.error("Error:", error);
        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
        return { error: "Internal Server Error" };
      }
    }
  },
};
