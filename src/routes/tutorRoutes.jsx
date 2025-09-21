import {
  TutorDashboardPage,
  TutorSessionsPage,
  TutorSettingsPage,
  TutorAvailabilityPage,
  TutorMessagesPage,
} from "../pages/tutor";

export const tutorRoutes = [
  { path: "dashboard", element: <TutorDashboardPage /> },
  { path: "sessions", element: <TutorSessionsPage /> },
  { path: "availability", element: <TutorAvailabilityPage /> },
  { path: "messages", element: <TutorMessagesPage /> },
  { path: "settings", element: <TutorSettingsPage /> },
];
