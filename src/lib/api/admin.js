import { axiosInstance } from "./axios";

// =====================
// User Routes
// =====================
export const getAllUsers = async () => {
  const { data } = await axiosInstance.get("/admin/users");
  return data.data;
};

export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/users/${id}`);
  return data.data;
};

export const restoreUser = async (id) => {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/restore`);
  return data.data;
};

// =====================
// Pending Tutor Routes
// =====================
export const getPendingTutors = async () => {
  const { data } = await axiosInstance.get("/admin/tutors/pending");
  return data.data;
};
export const getPendingTutorById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/tutors/${id}/pending`);
  return data.data;
};

export const approveTutor = async (id) => {
  const { data } = await axiosInstance.patch(`/admin/tutors/${id}/approve`);
  return data.data;
};

export const rejectTutor = async (id) => {
  const { data } = await axiosInstance.patch(`/admin/tutors/${id}/reject`);
  return data.data;
};

// =====================
// Super Admin Routes
// =====================

export const createAdmin = async (adminData) => {
  const { data } = await axiosInstance.post("/admin", adminData);
  return data.data;
};

export const getAllAdmins = async () => {
  const { data } = await axiosInstance.get("/admin");
  return data.data;
};

// export const suspendUser = async (id) => {
//   const { data } = await axiosInstance.put(`/admin/users/${id}/suspend`);
//   return data.data;
// };

// export const unsuspendUser = async (id) => {
//   const { data } = await axiosInstance.put(`/admin/users/${id}/unsuspend`);
//   return data.data;
// };

// export const deleteUser = async (id) => {
//   const { data } = await axiosInstance.delete(`/admin/users/${id}`);
//   return data.data;
// };
