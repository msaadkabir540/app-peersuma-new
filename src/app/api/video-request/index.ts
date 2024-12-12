import { axiosApiRequest } from "@/src/helper/api";

export const addVideoRequest = async ({ data }: { data: any }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "post",
      url: `/video-request`,
      data,
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

export const getAllVideoRequests = async ({ clientId }: { clientId: string }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/video-request`,
      params: {
        clientId,
      },
    });

    if (res?.status === 200) {
      return res?.data?.allVideoRequests;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getAllVideoRequestsByAssignId = async ({
  clientId,
  assignTo,
  schoolYear,
  searchParamsValue,
}: {
  clientId: string;
  assignTo: string;
  schoolYear?: string;
  searchParamsValue?: string;
}) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/video-request/get-by-assignto/${clientId}`,
      params: {
        assignTo,
        schoolYear,
        searchParamsValue,
      },
    });

    if (res?.status === 200) {
      return res?.data?.allVideoRequests;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getVideoRequestById = async ({ id }: { id: string }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/video-request/${id}/`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateVideoRequest = async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/video-request/${id}/`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteVideoRequest = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/video-request/${id}/`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const addVideoRequestMultiple = async ({
  data,
}: {
  data: { clientId: string; userId: string; invontriesIds: string[] };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/video-request/add-multiple`,
      data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const sendEmailVideoRequest = async ({
  data,
}: {
  data: { assignTo: string; id: string; schoolYear?: string };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/video-request/resign-user`,
      data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const sendEmailToUser = async ({
  data,
}: {
  data: { assignTo: string; id: string; schoolYear?: string };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/video-request/send-email-user`,
      data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const sendReminderEmailVideoRequest = async ({
  sendEmail,
  requestedById,
}: {
  sendEmail: [{ videoRequestId: string; assignTo: string }];
  requestedById: string;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/video-request/reminder-email`,
      data: { sendEmail, requestedById },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
