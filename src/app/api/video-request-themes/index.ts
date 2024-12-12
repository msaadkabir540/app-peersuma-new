import { axiosApiRequest } from "@/src/helper/api";
import { updatedDataInterface } from "../../interface/calender-interface/calender-interface";

export const addVideoRequestThemes = async ({ data }: { data: updatedDataInterface }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "post",
      url: `/video-requests-themes`,
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

export const getAllVideoRequestsThemes = async ({
  clientId,
  schoolYear,
}: {
  clientId: string;
  schoolYear: string;
}) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/video-requests-themes`,
      params: {
        clientId,
        schoolYear,
      },
    });

    if (res?.status === 200) {
      return res?.data?.allVideoRequestsThemes;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getVideoThemeById = async ({ themeId }: { themeId: string }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/video-requests-themes/${themeId}/`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateVideoThemes = async ({
  id,
  data,
}: {
  id: string;
  data: updatedDataInterface;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/video-requests-themes/${id}/`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateVideoRequestIds = async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/video-requests-themes/update-video-request-ids/${id}/`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const removeVideoRequestIds = async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/video-requests-themes/remove-video-request/${id}/`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteVideoRequestTheme = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/video-requests-themes/${id}/`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const changeVideoRequestThemeId = async ({
  changeVideoRequestThemeIds,
}: {
  changeVideoRequestThemeIds: { videoRequestId: string; themeIdRemove: string; themeIdAdd: string };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/video-requests-themes/change-video-request-theme`,
      data: { changeVideoRequestThemeIds },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
