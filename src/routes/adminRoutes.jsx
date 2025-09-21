import {
  AdminDashboardPage,
  AdminReportsPage,
  AdminSettingsPage,
  AdminStudentsPage,
  AdminTutorsPage,
} from "../pages/admin";

export const adminRoutes = [
  { path: "dashboard", element: <AdminDashboardPage /> },
  { path: "tutors", element: <AdminTutorsPage /> },
  { path: "students", element: <AdminStudentsPage /> },
  { path: "report", element: <AdminReportsPage /> },
  { path: "settings", element: <AdminSettingsPage /> },
];
