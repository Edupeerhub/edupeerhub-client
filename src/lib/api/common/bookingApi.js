import { axiosInstance } from "../axios";

export const getUpcomingSession = async () => {
  const response = await axiosInstance.get("/booking/upcoming");
  return response.data.data;
};

export const fetchTutorAvailability = async ({ start, end, status }) => {
  const response = await axiosInstance.get(`/booking/availability`, {
    params: { start, end, status },
  });
  return response.data.data;
};

export const fetchStudentTutorAvailability = async ({
  start,
  end,
  tutorId,
}) => {
  const response = await axiosInstance.get(`/booking/tutors/${tutorId}`, {
    params: { start, end },
  });
  return response.data.data;
};

export const bookSession = async (bookingId) => {
  const response = await axiosInstance.post(`/booking${bookingId}`);
  return response.data.data;
};
