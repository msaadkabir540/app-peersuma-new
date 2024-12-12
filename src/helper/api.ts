import { AxiosRequestConfig } from "axios";
import axiosApi from "./axios";

export const axiosApiRequest = async (configs: AxiosRequestConfig) => {
  try {
    const res = await axiosApi({
      ...configs,
    });
    return res;
  } catch (error) {
    console?.error(error);
    return error;
  }
};
