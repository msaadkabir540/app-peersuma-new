import createNotification from "@/src/components/create-notification";
import { axiosApiRequest } from "@/src/helper/api";

export const videoProjectApi = {
  performAction: async (action: string, data?: any) => {
    if (action === "create-video-project") {
      if (data && data?.token) {
        try {
          const response: any = await axiosApiRequest({
            method: "post",
            url: `video-project`,
            data: data,
          });

          if (response?.status === 200) {
            return {
              responseData: response,
            };
          }
        } catch (error) {
          console.error("Error:", error);
          return { error: "Internal Server Error" };
        }
      } else {
        return Response.json({ msg: "Client ID missing", status: 404 }, { status: 404 });
      }
    } else if (action === "get-video-project-byId") {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return { msg: "please login", status: 200 };
        }

        const response: any = await axiosApiRequest({
          method: "GET",
          url: `video-project/get-video-project/${data?.id}`,
          params: data,
        });

        if (response?.status === 200) {
          return { getVideoProject: response?.data };
        }
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    } else if (action === "update-video-project") {
      try {
        const response: any = await axiosApiRequest({
          method: "PUT",
          url: `video-project/update-video-project/${data?.videoPageID}`,
          data: data?.updateData,
        });

        if (response?.status === 200) {
          return { getVideoProject: response?.data?.updateData };
        }
      } catch (error) {
        console.error("Error:", error);

        return { error: "Internal Server Error" };
      }
    } else if (action === "update-video-project-status") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}video-project/update-video-project-status/${data?.videoPageID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Access-Token": data?.token,
            },
            body: JSON.stringify(data?.updateData),
          },
        );

        const responseData = await response.json();

        if (responseData?.status === 200) {
          return { updatedStatus: responseData?.updateData };
        } else if (responseData?.msg) {
          createNotification({
            type: "error",
            message: responseData?.msg,
          });
          return {
            msg: responseData?.msg,
            status: 400,
          };
        }
      } catch (error) {
        console.error("Error:", error);

        return { error: "Internal Server Error" };
      }
    } else if (action === "user-invitation") {
      try {
        const response = await axiosApiRequest({
          method: "post",
          url: `/video-project/user-invitation`,
          data: data,
        });

        return response;
      } catch (error) {
        console.error("Error:", error);
        return error;
      }
    }
  },
};

export const createVideoProject = async ({ data }: { data: any }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "post",
      url: `video-project/`,
      data: data,
    });

    if (res?.status === 200) {
      return res;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getAllVideoProject = async ({ data }: { data: any }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `video-project/get-video-project-clientId/${data?.clientId}`,
      params: { ...data },
    });

    if (res?.status === 200) {
      return res;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const temporaryDeleteById = async ({ data }: { data: any }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "delete",
      url: `video-project/temporary-delete/${data?.videoProjectId}`,
      data: { ...data },
    });

    if (res?.status === 200) {
      return res;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteShotById = async ({ id }: { id: string }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "delete",
      url: `albumshot/${id}`,
    });

    if (res?.status === 200) {
      return res;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};
