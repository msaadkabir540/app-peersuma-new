import { axiosApiRequest } from "@/src/helper/api";

export const getAllInventoryData = async ({
  search,
  category,
  clientId,
  sortOrder,
}: {
  clientId: string;
  category?: any;
  search?: string;
  sortOrder: { sortBy: string; sortOrder: string };
}) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/inventory?clientId=${clientId}`,
      params: {
        search,
        category,
        ...sortOrder,
      },
    });
    if (res?.status === 200) {
      return res;
    } else {
      return res;
    }
  } catch (e) {
    console.error(e);
  }
};

export const getInventoryById = async ({ id }: { id: string }) => {
  try {
    const res: any = await axiosApiRequest({
      method: "get",
      url: `/inventory/${id}`,
    });
    if (res.status === 200) {
      return res?.data;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};
