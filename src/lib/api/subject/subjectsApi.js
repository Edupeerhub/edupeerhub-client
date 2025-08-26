import { axiosInstance } from "../axios";

export const getSubjects = async () => {
  const response = await axiosInstance.get("/subject");
  return response.data.data;
};
