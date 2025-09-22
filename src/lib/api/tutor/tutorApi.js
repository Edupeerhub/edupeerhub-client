import { axiosInstance } from "../axios";

export const createTutor = async (data) => {
  const response = await axiosInstance.post("/tutor", data);
  return response.data.data;
};

export const getTutors = async () => {
  const response = await axiosInstance.get(`/tutor`);
  return response.data.data;
};

export const getRecommendedTutors = async () => {
  const response = await axiosInstance.get(`/tutor/recommendations`);
  return response.data.data;
};

export const getTutorProfile = async (id) => {
  const response = await axiosInstance.get(`/tutor/${id}`);
  return response.data.data;
};
