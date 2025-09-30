import { useStudentNotifications } from "./useStudentNotifications";
import { useTutorNotifications } from "./useTutorNotifications";
// import { useAdminNotifications } from "./useAdminNotifications";
import { useState, useEffect } from "react";

export function useNotifications(userRole) {
  // Get role-specific notifications
  const studentNotifs = useStudentNotifications();
  const tutorNotifs = useTutorNotifications();
  // const adminNotifs = useAdminNotifications();

  const roleNotifications = {
    student: studentNotifs,
    tutor: tutorNotifs,
    // admin: adminNotifs,
  };

  const { notifications = [], isLoading = false } =
    roleNotifications[userRole] || {};

  // Read state management
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem(`readNotifications_${userRole}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!userRole) return;
    localStorage.setItem(
      `readNotifications_${userRole}`,
      JSON.stringify(readIds)
    );
  }, [readIds, userRole]);

  // Cleanup old read IDs (30 days)
  useEffect(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const validIds = readIds.filter((id) => {
      const notification = notifications.find((n) => n.id === id);
      return notification && new Date(notification.timestamp) > thirtyDaysAgo;
    });

    if (validIds.length !== readIds.length) {
      setReadIds(validIds);
    }
  }, [notifications, readIds]);

  const unreadNotifications = notifications.filter(
    (n) => !readIds.includes(n.id)
  );

  const markAsRead = (id) => {
    setReadIds((prev) => [...prev, id]);
  };

  const markAllAsRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  return {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,
    markAsRead,
    markAllAsRead,
    isLoading,
  };
}
