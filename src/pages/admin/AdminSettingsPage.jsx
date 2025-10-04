import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useAdmins, useCreateAdmin } from "../../hooks/admin";

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
      type="button"
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
  const navigate = useNavigate();
  const {
    data: admins,
    isLoading,
    isError,
    error,
  } = useAdmins();

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const createAdminMutation = useCreateAdmin({
    onSuccess: () => {
      setFormState({ firstName: "", lastName: "", email: "", password: "" });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (createAdminMutation.fieldErrors[name]) {
      createAdminMutation.clearFieldError(name);
    }
    if (createAdminMutation.generalError) {
      createAdminMutation.clearGeneralError();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createAdminMutation.clearErrors();
    createAdminMutation.mutate(formState);
  };

  return (
    <div className="max-w-5xl space-y-10">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Manage your account, system preferences, and platform controls.
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review current administrators, add new team members, and access platform settings.
        </p>
      </div>

      <section className="bg-white border rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Admin Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of administrators with access to the platform.
          </p>
        </div>
        <div className="p-6">
          {isError ? <ErrorAlert error={error} /> : null}
          {isLoading ? (
            <Spinner />
          ) : !admins || admins.length === 0 ? (
            <p className="text-sm text-gray-500">No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => {
                    const name = admin.fullName
                      ? admin.fullName
                      : [admin.firstName, admin.lastName].filter(Boolean).join(" ") || admin.name || "—";
                    return (
                      <tr
                        key={admin.id ?? index}
                        className={index < admins.length - 1 ? "border-b" : ""}
                      >
                        <td className="p-4 text-gray-700">{name}</td>
                        <td className="p-4 text-gray-600">{admin.email ?? "—"}</td>
                        <td className="p-4 text-gray-600">
                          {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Add New Admin</h2>
          <p className="text-sm text-gray-500 mt-1">
            Invite a new administrator to manage the platform.
          </p>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {createAdminMutation.generalError ? (
            <ErrorAlert error={createAdminMutation.generalError} />
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                value={formState.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  createAdminMutation.fieldErrors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ada"
              />
              {createAdminMutation.fieldErrors.firstName ? (
                <p className="text-xs text-red-500 mt-1">
                  {createAdminMutation.fieldErrors.firstName}
                </p>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                value={formState.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  createAdminMutation.fieldErrors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Okeke"
              />
              {createAdminMutation.fieldErrors.lastName ? (
                <p className="text-xs text-red-500 mt-1">
                  {createAdminMutation.fieldErrors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  createAdminMutation.fieldErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="admin@example.com"
                required
              />
              {createAdminMutation.fieldErrors.email ? (
                <p className="text-xs text-red-500 mt-1">
                  {createAdminMutation.fieldErrors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Temporary Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  createAdminMutation.fieldErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter a secure password"
                required
              />
              {createAdminMutation.fieldErrors.password ? (
                <p className="text-xs text-red-500 mt-1">
                  {createAdminMutation.fieldErrors.password}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:brightness-95 disabled:opacity-60"
              disabled={createAdminMutation.isPending}
            >
              {createAdminMutation.isPending ? "Creating..." : "Create admin"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6">
        {settingsSections.map((section) => (
          <SectionRow
            key={section.key}
            title={section.title}
            desc={section.desc}
            onClick={() => navigate(section.path)}
          />
        ))}
      </section>
    </div>
  );
}
