import { axiosInstance } from "../axios";

export async function trackEvent() {
  const response = await axiosInstance.get("/chat/token");
  return response.data.data;
}
