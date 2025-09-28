import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "../../lib/api/tutor/tutorApi";
import { fetchStudentTutorAvailability } from "../../lib/api/common/bookingApi";

export function useStudentBooking(tutorId, date) {
  const {
    data: tutorProfile,
    isLoading: tutorLoading,
    error: tutorError,
  } = useQuery({
    queryKey: ["tutorProfile", tutorId],
    queryFn: () => getTutorProfile(tutorId),
    enabled: !!tutorId,
  });

  const start = date
    ? new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      )
    : null;
  const end = date
    ? new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59
        )
      )
    : null;

  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ["availability", tutorId, start, end],
    queryFn: () => fetchStudentTutorAvailability({ tutorId, start, end }),
    enabled: !!tutorId && !!start && !!end,
  });

  const availableTimes =
    availabilityData?.map((slot) => ({
      id: slot.id,
      start: slot.scheduledStart,
      end: slot.scheduledEnd,
      label: `${new Date(slot.scheduledStart).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })} - ${new Date(slot.scheduledEnd).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`,
    })) || [];

  return {
    tutorProfile,
    tutorLoading,
    tutorError,
    availabilityData,
    availabilityLoading,
    availableTimes,
  };
}
