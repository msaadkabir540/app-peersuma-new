import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.request.use(
  (req: AxiosRequestConfig) => {
    const localStorageToken = localStorage.getItem("token") || false;
    if (req.headers && req.headers["X-Access-Token"] !== "no token" && localStorageToken) {
      const headers = req.headers as Record<string, string>;
      headers["X-Access-Token"] = localStorageToken;
    } else {
      const headers = req.headers as Record<string, string | undefined>;
      headers["X-Access-Token"] = undefined;
    }
    return req as InternalAxiosRequestConfig<any>;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosApi.interceptors.response.use(
  (successRes: AxiosResponse) => {
    return successRes;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosApi;
