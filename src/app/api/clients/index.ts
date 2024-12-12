import createNotification from "@/src/components/create-notification";
import { axiosApiRequest } from "@/src/helper/api";

export const clientApi = {
  performAction: async (action: string, data?: any) => {
    if (action === "get-user-byId") {
      try {
        const response: any = await axiosApiRequest({
          method: "GET",
          url: `users/${data}`,
        });

        if (response?.status === 200) {
          return { responseData: response?.data, status: 200 };
        }
      } catch (error) {
        console.error("Error:", error);
        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
      }
    } else if (action === "get-all-client") {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        const response: any = await axiosApiRequest({
          method: "GET",
          url: `client`,
        });

        if (response.status === 200) {
          return { responseData: response?.data, status: 200 };
        } else {
          return {
            msg: "error",
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
    } else if (action === "get-client-by-id") {
      try {
        const token = localStorage.getItem("token");
        const clientId = localStorage.getItem("clientId");

        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}client/${clientId} `, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-access-Token": token,
          },
        });

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
    } else if (action === "get-client-name") {
      try {
        const response: any = await axiosApiRequest({
          method: "GET",
          url: `client/get-all-client`,
        });

        if (response?.status === 200) {
          return { responseData: response?.data?.allClients, status: 200 };
        } else {
          return {
            msg: "Error!",
            status: 400,
          };
        }
      } catch (error) {
        console.error("Error:", error);

        return { error: "Internal Server Error" };
      }
    }
  },
};

export const getClientById = async ({ clientId }: { clientId: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/client/${clientId}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateClient = async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      data: data,
      url: `/client/${id}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
