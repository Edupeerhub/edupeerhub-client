// src/pages/admin/AdminSettingsPage.jsx
import React, { useState } from "react";
import AdminLayout from "../../layouts/Layout";
import SettingsBackBar from "../../components/SettingsBackBar";

// panels
import AdminProfileSettingsPanel from "./settings/AdminProfileSettingsPanel";
import AdminPlatformPreferencesPanel from "./settings/AdminPlatformPreferencesPanel";
import AdminSecuritySettingsPanel from "./settings/AdminSecuritySettingsPanel";
import AdminNotificationsPanel from "./settings/AdminNotificationsPanel";

/**
 * AdminSettingsPage:
 * - Renders the main list (default)
 * - When user clicks a list row, setActivePanel to show that panel
 * - Panels receive onBack={() => setActivePanel(null)} to return to list
 */

const SECTIONS = [
  {
    key: "profile",
    title: "Profile Setting",
    desc: "Manage your personal information, contact details, and account settings.",
  },
  {
    key: "platform",
    title: "Platform Preferences",
    desc: "Customize the platform's preferences.",
  },
  {
    key: "security",
    title: "Security Settings",
    desc: "Enhance your account security and privacy settings.",
  },
  {
    key: "notifications",
    title: "Notifications",
    desc: "Configure your notification settings for emails, in-app alerts, and more.",
  },
];

function SectionRow({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-6 rounded-xl bg-white border shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <div className="max-w-[75%]">
        <div className="text-lg font-semibold text-gray-900">{title}</div>
        <div className="mt-1 text-sm text-gray-500">{desc}</div>
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-white">
        <svg
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

export default function AdminSettingsPage() {
  const [activePanel, setActivePanel] = useState(null); // null | 'profile' | 'platform' | 'security' | 'notifications'

  // show main list
  if (!activePanel) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage your account, system preferences, and platform controls.
          </h1>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <SectionRow
              key={s.key}
              title={s.title}
              desc={s.desc}
              onClick={() => setActivePanel(s.key)}
            />
          ))}
        </div>
      </div>
    );
  }

  // render chosen panel inline
  return (
    <div className="max-w-5xl">
      {activePanel === "profile" && (
        <AdminProfileSettingsPanel onBack={() => setActivePanel(null)} />
      )}
      {activePanel === "platform" && (
        <AdminPlatformPreferencesPanel onBack={() => setActivePanel(null)} />
      )}
      {activePanel === "security" && (
        <AdminSecuritySettingsPanel onBack={() => setActivePanel(null)} />
      )}
      {activePanel === "notifications" && (
        <AdminNotificationsPanel onBack={() => setActivePanel(null)} />
      )}
    </div>
  );
}
