import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchTutorBookings,
  getUpcomingSession,
} from "../../lib/api/common/bookingApi";

export function useTutorNotifications() {
  const bookings = useQuery({
    queryKey: ["tutorBookings"],
    queryFn: () => fetchTutorBookings({ status: ["pending", "confirmed"] }),
    staleTime: 30000,
  });

  const sessions = useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: getUpcomingSession,
    staleTime: 30000,
  });

  const notifications = useMemo(() => {
    const result = [];

    // Pending booking requests
    if (bookings.data) {
      bookings.data
        .filter((b) => b.status === "pending")
        .forEach((booking) => {
          const studentName = booking.student?.user?.firstName || "A student";

          result.push({
            id: `booking-${booking.id}`,
            type: "request",
            sender: studentName,
            message: "sent you a new booking request",
            timestamp: booking.createdAt,
            priority: "high",
            action: {
              label: "Review Request",
              link: `/tutor/booking-requests`,
            },
          });
        });
    }

    // Upcoming session (within next 2 hours)
    if (sessions.data) {
      const session = sessions.data;
      const start = new Date(session.scheduledStart);
      const now = new Date();
      const hoursDiff = (start - now) / (1000 * 60 * 60);

      // Only show if within 2 hours
      // if (hoursDiff > 0 && hoursDiff < 2) {
      const studentName = session.student?.user?.firstName || "a student";
      const minutesUntil = Math.round(hoursDiff * 60);

      result.push({
        id: `session-${session.id}`,
        type: "session",
        sender: "System",
        message: `Your session with ${studentName} starts in ${minutesUntil} minutes`,
        timestamp: session.scheduledStart,
        priority: "high",
        action: {
          label: "Join Session",
          link: `/tutor/call/${session.id}`,
        },
      });
      // }
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [bookings.data, sessions.data]);

  return {
    notifications,
    isLoading: bookings.isLoading || sessions.isLoading,
  };
}
