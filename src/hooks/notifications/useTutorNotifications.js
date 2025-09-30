import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchTutorBookings,
  getUpcomingSession,
} from "../../lib/api/common/bookingApi";

// hooks/useTutorNotifications.js
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

    // Pending bookings
    if (bookings.data) {
      bookings.data
        .filter((b) => b.status === "pending")
        .forEach((booking) => {
          result.push({
            id: `booking-${booking.id}`,
            type: "request",
            sender: booking.student?.user?.firstName || "Student",
            message: "sent you a booking request",
            timestamp: booking.createdAt,
            priority: "high",
            action: { label: "Review", link: `/tutor/booking-requests` },
          });
        });
    }

    // Upcoming sessions (within 2 hours)
    if (sessions.data) {
      const session = sessions.data;

      result.push({
        id: `session-${session.id}`,
        type: "session",
        sender: "System",
        message: `Session with ${session.student?.user?.firstName} starting soon`,
        timestamp: session.scheduledStart,
        priority: "high",
      });
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [bookings.data, sessions.data]);

  return {
    notifications,
    isLoading: bookings.isLoading || sessions.isLoading,
  };
}
