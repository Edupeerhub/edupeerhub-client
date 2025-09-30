import { useQuery } from "@tanstack/react-query";
import {
  getAllStudentBookings,
  getUpcomingSession,
} from "../../lib/api/common/bookingApi";
import { useMemo } from "react";

// hooks/useStudentNotifications.js
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

    // Transform upcomingSession
    if (upcomingSession.data) {
      result.push({
        id: `session-${upcomingSession.data.id}`,
        type: "session",
        sender: "System",
        message: `Upcoming session with ${upcomingSession.data.tutor?.user?.firstName}`,
        timestamp: upcomingSession.data.scheduledStart,
        priority: "high",
      });
    }

    // Transform bookings
    if (bookings.data) {
      bookings.data.forEach((booking) => {
        result.push({
          id: `booking-${booking.id}`,
          type: booking.status === "confirmed" ? "success" : "warning",
          sender: booking.tutor?.user?.firstName || "Tutor",
          message:
            booking.status === "confirmed"
              ? "confirmed your booking"
              : "cancelled your booking",
          timestamp: booking.updatedAt,
          priority: "medium",
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
