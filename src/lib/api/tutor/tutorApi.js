import { axiosInstance } from "../axios";

export const createTutor = async (data) => {
  const response = await axiosInstance.post("/tutor", data);
  return response.data.data;
};
