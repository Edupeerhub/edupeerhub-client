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

export const bookSession = async ({ bookingId, subjectId }) => {
  const response = await axiosInstance.post(`/booking/${bookingId}`, {
    subjectId,
  });
  return response.data.data;
};

export const getConfirmedUpcomingSessions = async () => {
  const response = await axiosInstance.get(
    "/booking/availability?status=confirmed"
  );
  return response.data.data;
};

export const getBookingRequests = async () => {
  const response = await axiosInstance.get("/booking/requests");
  return response.data.data;
};

export const getPendingBookingRequests = async () => {
  const response = await axiosInstance.get(
    "/booking/availability?status=pending"
  );
  return response.data.data;
};

export const updateBookingAvailabilityStatus = async (
  availabilityId,
  status
) => {
  const response = await axiosInstance.patch(
    `/booking/availability/${availabilityId}/status`,
    { status }
  );
  return response.data.data;
};

export const createBookingAvailability = async (availabilityData) => {
  const response = await axiosInstance.post(
    "/booking/availability",
    availabilityData
  );
  return response.data.data;
};

export const getAllTutorAvailabilities = async () => {
  const response = await axiosInstance.get("/booking/availability");
  return response.data.data;
};

export const cancelBookingAvailability = async (
  availabilityId,
  cancellationReason
) => {
  const response = await axiosInstance.patch(
    `/booking/availability/${availabilityId}/cancel`,
    { cancellationReason }
  );
  return response.data.data;
};

export const deleteBookingAvailability = async (availabilityId) => {
  const response = await axiosInstance.delete(
    `/booking/availability/${availabilityId}`
  );
  return response.data.data;
};

export const updateBookingAvailability = async (availabilityId, updateData) => {
  const response = await axiosInstance.patch(
    `/booking/availability/${availabilityId}`,
    updateData
  );
  return response.data.data;
};

export const fetchBookingById = async (bookingId) => {
  const response = await axiosInstance.get(`/booking/${bookingId}`);
  return response.data.data;
};
