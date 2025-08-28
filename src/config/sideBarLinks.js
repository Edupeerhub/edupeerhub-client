import DashboardIcon from "../assets/images/layout-icons/home.svg?react";
import LibraryIcon from "../assets/images/layout-icons/library.svg?react";
import AskIcon from "../assets/images/layout-icons/question.svg?react";
import SettingsIcon from "../assets/images/layout-icons/setting.svg?react";

export const studentSidebarLinks = [
  { path: "/student/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/student/library", label: "Profile", icon: LibraryIcon },
  { path: "/student/settings", label: "Settings", icon: SettingsIcon },
  { path: "/student/faq", label: "Settings", icon: AskIcon },
];

export const tutorSidebarLinks = [
  { path: "/tutor/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/tutor/library", label: "Profile", icon: LibraryIcon },
  { path: "/tutor/settings", label: "Settings", icon: SettingsIcon },
  { path: "/tutor/faq", label: "Settings", icon: AskIcon },
];
