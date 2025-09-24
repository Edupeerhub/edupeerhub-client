import { useQuery } from "@tanstack/react-query";
import { fetchAvailability } from "../../lib/api/common/bookingApi";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

export function useAvailability({
  start = getTodayDate(),
  end = getTodayDate(),
  status = "open",
} = {}) {
  return useQuery({
    queryKey: ["availability", { start, end, status }],
    queryFn: () => fetchAvailability({ start, end, status }),
    enabled: !!start && !!end,
  });
}
