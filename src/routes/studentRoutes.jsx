import {
  StudentDashboardPage,
  StudentLibraryPage,
  StudentTutorsPage,
  StudentSettingsPage,
  StudentBookingPage,
} from "../pages/student";
import TutorProfilePage from "../pages/tutor/TutorProfilePage";
import FAQPage from "../pages/general/FAQPage";

export const studentRoutes = [
  { path: "dashboard", element: <StudentDashboardPage /> },
  { path: "library", element: <StudentLibraryPage /> },
  { path: "tutors", element: <StudentTutorsPage /> },
  { path: "tutor-profile/:id", element: <TutorProfilePage /> },
  { path: "booking/:id", element: <StudentBookingPage /> },
  { path: "faq", element: <FAQPage /> },
  { path: "settings", element: <StudentSettingsPage /> },
];
