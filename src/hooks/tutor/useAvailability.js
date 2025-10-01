import { useQuery } from "@tanstack/react-query";
import { fetchStudentTutorAvailability } from "../../lib/api/common/bookingApi";

const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA"); // Returns YYYY-MM-DD in local timezone
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
