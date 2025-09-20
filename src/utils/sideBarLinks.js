import DashboardIcon from "../assets/images/layout-icons/home.svg?react";
import LibraryIcon from "../assets/images/layout-icons/library.svg?react";
import AskIcon from "../assets/images/layout-icons/question.svg?react";
import TutorIcon from "../assets/images/layout-icons/tutors.svg?react";
import SettingsIcon from "../assets/images/layout-icons/setting.svg?react";

export const studentSidebarLinks = [
  { path: "/student/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/student/library", label: "Library", icon: LibraryIcon },
  { path: "/student/tutors", label: "Tutors", icon: TutorIcon },
  { path: "/student/faq", label: "Ask Questions", icon: AskIcon },
  { path: "/student/settings", label: "Settings", icon: SettingsIcon },
];

export const tutorSidebarLinks = [
  { path: "/tutor/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/tutor/faq", label: "Ask Question", icon: AskIcon },
  { path: "/tutor/settings", label: "Settings", icon: SettingsIcon },
];

export const adminSidebarLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/admin/settings", label: "Settings", icon: SettingsIcon },
];
