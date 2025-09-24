import { axiosInstance } from "../axios";

export const getUpcomingSession = async () => {
  const response = await axiosInstance.get("/booking/upcoming");
  return response.data.data;
};

export const fetchAvailability = async ({ start, end, status }) => {
  const response = await axiosInstance.get(`/booking/availability`, {
    params: { start, end, status },
  });
  return response.data.data;
};
