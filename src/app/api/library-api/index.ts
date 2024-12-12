import { axiosApiRequest } from "@/src/helper/api";
import createNotification from "@/src/components/create-notification";

export const getAllLibrary = async ({
  params,
}: {
  params: { selectedWidgetId?: string; search?: string; clientId: string; active: string };
}) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: "/library",
    params,
  });
  if (res) {
    return res;
  }
};
export const addWidgetMedia = async ({
  id,
  data,
}: {
  id: string;
  data: any;
  //   data: CreateUpdateDataInterface;
}) => {
  try {
    const res: any = await axiosApiRequest({
      method: "put",
      url: `/library-widget/${id}`,
      data,
    });

    if (res?.status === 200) {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeWidgetMedia = async ({
  params,
}: {
  params: { id: string; mediaId: string };
}) => {
  const res: any = await axiosApiRequest({
    method: "delete",
    url: `/library-widget/remove-media`,
    params,
  });
  if (res?.status === 200) {
    return res;
  }
};

export const removeLibraryMedia = async ({
  mediaId,
  clientId,
}: {
  mediaId: string;
  clientId: string;
}) => {
  const data = {
    clientId,
  };
  const res: any = await axiosApiRequest({
    method: "delete",
    url: `/library/${mediaId}`,
    data,
  });
  if (res?.status === 200) {
    return res;
  }
};

export const updateMediaReOrdering = async ({
  id,
  media,
}: {
  id: string;
  //   media: SelectedWidgetInterface;
  media: any;
}) => {
  const res: any = await axiosApiRequest({
    method: "put",
    url: `library-widget/reorderingMedia/${id}`,
    data: media,
  });
  if (res?.status === 200) return res;
  else return res?.status;
};

export const updateLibraryMedia = async ({
  id,
  data,
}: {
  id: string;
  //   data: CreateUpdateDataInterface;
  data: any;
}) => {
  const res: any = await axiosApiRequest({
    method: "put",
    url: `/library/${id}`,
    data,
  });
  if (res?.status === 200) {
    createNotification({ type: "success", message: "Success!", description: res?.data.msg });
    return res;
  }
};

export const addLibraryMedia = async ({ data }: { data: any }) => {
  const res: any = await axiosApiRequest({
    method: "post",
    url: "/library",
    data,
  });
  if (res.status === 200) {
    createNotification({ type: "success", message: "Success!", description: res?.data?.msg });
    return res;
  } else {
    createNotification({ type: "error", message: "Error!", description: res?.response?.data?.msg });
  }
};

export const getLibraryWidgetById = async ({
  params,
}: {
  params: { id: string | undefined; shortLink?: string | undefined };
}) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: `/library/single_library`,
    params,
  });
  if (res.status === 200) {
    return res;
  }
};

export const addMultipleLibraryMedia = async ({
  data,
}: {
  //   data: AddMultipleLibraryMediaInterface;
  data: any;
}) => {
  const res: any = await axiosApiRequest({
    method: "post",
    url: `/library/multi`,
    data,
  });
  if (res?.status === 200) {
    return res;
  }
};

export const updateShortLink = async ({
  id,
  data,
}: {
  id: string;
  data: { shortLink: string };
}) => {
  const res: any = await axiosApiRequest({
    method: "put",
    url: `/library/short_link/${id}`,
    data,
  });
  if (res.status === 200) {
    createNotification({ type: "success", message: "Success!", description: res?.data?.msg });
    return res;
  } else {
    return res;
  }
};

export const updateThumbnailFromFrame = async ({
  data,
}: {
  data: {
    id: string | undefined;
    time: number | null;
    assetId: string;
  };
}) => {
  const res: any = await axiosApiRequest({
    method: "patch",
    url: `/library/update_thumbnail`,
    data: { ...data },
  });
  if (res.status === 200) {
    createNotification({ type: "success", message: "Success!", description: res?.data?.msg });
    return res;
  } else {
    createNotification({ type: "error", message: "Error!", description: res?.data?.msg });
  }
};

export const updateThumbnailOnReplaceVideoFromVimeo = async ({
  data,
}: {
  data: {
    id: string | undefined;
    time: number | null;
    assetId: string;
  };
}) => {
  const res: any = await axiosApiRequest({
    method: "patch",
    url: `/library/update_thumbnail_vimeo`,
    data: { ...data },
  });
  if (res.status === 200) {
    createNotification({ type: "success", message: "Success!", description: res?.data?.msg });
    return res;
  } else {
    createNotification({ type: "error", message: "Error!", description: res?.data?.msg });
  }
};

export const getViemoPrivateVideo = async ({ videoId }: { videoId: string }) => {
  const res: any = await axiosApiRequest({
    method: "get",
    url: `/library/get-viemo-video`,
    params: { assetId: videoId },
  });

  if (res.status === 200) {
    return res;
  }
};

export const updateReplaceVideoLibrary = async ({
  videoId,
  id,
}: {
  videoId: string;
  id: string;
}) => {
  const res: any = await axiosApiRequest({
    method: "patch",
    url: `/library/update-replace-video`,
    params: { assetId: videoId, libraryId: id },
  });

  if (res.status === 200) {
    return res;
  }
};

export const updateColorVideoLibrary = async ({
  textColor,
  backgroundColor,
  id,
}: {
  textColor: string;
  backgroundColor: string;
  id: string;
}) => {
  const res: any = await axiosApiRequest({
    method: "patch",
    url: `/library/update-color`,
    params: { backgroundColor, textColor, libraryId: id },
  });

  if (res.status === 200) {
    return res;
  } else {
    return res;
  }
};
