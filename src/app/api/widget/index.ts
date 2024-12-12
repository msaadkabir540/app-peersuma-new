import { axiosApiRequest } from "@/src/helper/api";

import createNotification from "@/src/components/create-notification";

export const getAllWidgets = async ({ params }: { params: { clientId: string } }) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: "/widget",
    params,
  });
  if (res.status === 200) {
    return res?.data;
  } else return res;
};

export const getWidgetById = async ({ _id }: { _id: string }) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: `/widget/${_id}`,
  });
  if (res.status === 200) {
    return res;
  }
};

export const getWidgetViewById = async ({ _id }: { _id: string }) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: `/widget/view/${_id}`,
  });
  if (res.status === 200) {
    return res;
  }
};

export const createWidget = async ({
  data,
}: {
  data: {
    name?: string | undefined;
    description: string;
    producers: string[];
    clientId: string;
  };
}) => {
  const res: any = await axiosApiRequest({
    method: "post",
    url: "/widget",
    data,
  });
  if (res.status === 200) {
    createNotification({
      type: "success",
      message: "Success!",
      description: "Widget Created Successfully!",
    });
  } else {
    createNotification({
      type: "error",
      message: "Error!",
      description: res?.data?.msg || "Widget Creation Failed!",
    });
  }
};

export const updateWidget = async ({
  _id,
  data,
}: {
  _id: string;
  data: { active: boolean; clientId?: string };
}) => {
  const res: any = await axiosApiRequest({
    method: "put",
    url: `/widget/${_id}`,
    data,
  });
  if (res.status === 200) {
    createNotification({
      type: "success",
      message: "Success!",
      description: res.data.msg || "Widget Updated successfully!",
    });
    return res;
  }
};

export const deleteWidget = async ({ _id }: { _id: string }) => {
  const res: any = await axiosApiRequest({
    method: "delete",
    url: `/widget/${_id}`,
  });
  if (res.status === 200) {
    return true;
  }
};

export const widgetEmailSend = async ({ data }: { data: any }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: `/widget/widgetEmailSendToClient`,
    data,
  });

  if (res) {
    return res;
  }
};
