import { axiosInstance } from "../axios";

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/user");
  return response.data.data;
};
