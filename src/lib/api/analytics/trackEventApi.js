import { axiosInstance } from "../axios";

export default async function trackEvent() {
  const response = await axiosInstance.get("/chat/token");
  return response.data.data;
}
