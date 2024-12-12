import { axiosApiRequest } from "@/src/helper/api";

export const isAuthentication = async ({ accessToken }: { accessToken: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/is-user-authentication`,
      data: { accessToken },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const loginByOTP = async ({ otp }: { otp: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/login-user-by-otp`,
      data: { otp },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
