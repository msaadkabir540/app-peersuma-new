import createNotification from "@/src/components/create-notification";
import { axiosApiRequest } from "@/src/helper/api";
import {
  CreateUserFormSchemaInterface,
  GetAllUsersInterface,
  UsersInterface,
} from "../../interface/user-interface/user-interface";

export const checkUserByEmailContact = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/is-user-exist`,
      data: { searchTerm },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const getAllUsers = async ({
  params,
}: {
  params: {
    page?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    pageSize?: number;
    clientId?: string;
    sortOrder?: "asc" | "desc";
  };
}) => {
  try {
    const res:
      | {
          status: number;
          data: GetAllUsersInterface;
        }
      | any = await axiosApiRequest({
      method: "get",
      url: `/users/`,
      params,
    });
    return res;
  } catch (e: any) {
    console.error("[getAllUsers]-error", e);
  }
};

export const createUser = async ({ data }: { data: CreateUserFormSchemaInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/signup/`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const signUP = async ({ data }: { data: CreateUserFormSchemaInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/create-user`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateUserStatus = async (id: string) => {
  try {
    const res: any = await axiosApiRequest({
      method: "put",
      url: `/users/status/${id}`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    if (res?.status === 200) {
      createNotification({
        type: "success",
        message: "Success!",
        description: res?.data?.msg || "Successfully updated",
      });
    }
    return res;
  } catch (e: any) {
    createNotification({
      type: "error",
      message: "Error!",
      description: "error to update",
    });
    console.error(e);
  }
};

export const getUserById = async ({ userId }: { userId: string }) => {
  try {
    const res: { status: number; data: UsersInterface } | any = await axiosApiRequest({
      method: "get",
      url: `/users/${userId}/`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deletePermanentUserById = async ({
  userId,
  params,
}: {
  userId: string;
  params: {
    clientId: string;
  };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/users/permanent-delete-user/${userId}/`,
      params,
    });
    return res;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: CreateUserFormSchemaInterface;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/users/${id}/`,
      data: data,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const userByEmailOrNumber = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/is-user-exist`,
      data: { searchTerm },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
