import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getAllStudentBookings,
  getUpcomingSession,
} from "../../lib/api/common/bookingApi";

export function useStudentNotifications() {
  const upcomingSession = useQuery({
    queryKey: ["upcomingSession"],
    queryFn: getUpcomingSession,
    staleTime: 30000,
  });

  const bookings = useQuery({
    queryKey: ["studentBookings"],
    queryFn: () =>
      getAllStudentBookings({ status: ["confirmed", "cancelled"] }),
    staleTime: 30000,
  });

  const notifications = useMemo(() => {
    const result = [];

    // Upcoming session notification
    if (upcomingSession.data) {
      const session = upcomingSession.data;
      const tutorName = session.tutor?.user?.firstName || "your tutor";
      const startTime = new Date(session.scheduledStart).toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );

      result.push({
        id: `session-${session.id}`,
        type: "session",
        sender: "System",
        message: `You have an upcoming session with ${tutorName} on ${startTime}`,
        timestamp: session.scheduledStart,
        priority: "high",
        action: {
          label: "View Details",
          link: `/student/sessions/${session.id}`,
        },
      });
    }

    // Booking status notifications
    if (bookings.data) {
      bookings.data.forEach((booking) => {
        const tutorName = booking.tutor?.user?.firstName || "Tutor";
        const isConfirmed = booking.status === "confirmed";

        result.push({
          id: `booking-${booking.id}`,
          type: isConfirmed ? "success" : "warning",
          sender: tutorName,
          message: isConfirmed
            ? "confirmed your booking request"
            : "cancelled your booking",
          timestamp: booking.updatedAt,
          priority: "medium",
          action: {
            label: "View Booking",
            link: `/student/bookings/${booking.id}`,
          },
        });
      });
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [upcomingSession.data, bookings.data]);

  return {
    notifications,
    isLoading: upcomingSession.isLoading || bookings.isLoading,
  };
}
