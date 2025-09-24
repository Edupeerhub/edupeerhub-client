import { axiosInstance } from "../axios";

export const createTutor = async (data) => {
  const response = await axiosInstance.post("/tutor", data);
  return response.data.data;
};

export const getTutors = async (params = {}) => {
  const queryParams = new URLSearchParams();

  // Add search parameter
  if (params.search) {
    queryParams.append("search", params.search);
  }

  // Add filter parameters as comma-separated strings
  if (params.subjects && params.subjects.length > 0) {
    queryParams.append("subjects", params.subjects.join(","));
  }

  if (params.availability && params.availability.length > 0) {
    queryParams.append("availability", params.availability.join(","));
  }

  if (params.ratings && params.ratings.length > 0) {
    queryParams.append("rating", params.ratings.join(","));
  }

  // Add pagination parameters if provided
  if (params.page) {
    queryParams.append("page", params.page);
  }

  if (params.limit) {
    queryParams.append("limit", params.limit);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/tutor?${queryString}` : "/tutor";

  const response = await axiosInstance.get(url);
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

export const getTutorReviews = async (tutorId) => {
  const response = await axiosInstance.get(`/reviews/tutor/${tutorId}`);
  return response.data.data;
};

export const getTutorReviewSummary = async (userId) => {
  const response = await axiosInstance.get(`/reviews/aggregates/${userId}`);
  return response.data.data;
};
