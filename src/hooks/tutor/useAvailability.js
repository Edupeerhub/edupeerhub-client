import { useQuery } from "@tanstack/react-query";
import { fetchStudentTutorAvailability } from "../../lib/api/common/bookingApi";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

export function useAvailability({
  start = getTodayDate(),
  end = getTodayDate(),
  tutorId,
} = {}) {
  return useQuery({
    queryKey: ["availability", { start, end }],
    queryFn: () => fetchStudentTutorAvailability({ start, end, tutorId }),
    enabled: !!start && !!end,
  });
}
