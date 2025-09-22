import React, { useState } from "react";
import AdminLayout from "../../layouts/Layout";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: "Edupeer",
    allowSignup: true,
    supportEmail: "support@edupeer.com",
  });

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onSave(e) {
    e.preventDefault();
    alert("Mock save - integrate API here");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <form
        className="bg-white p-6 rounded-xl border shadow-sm"
        onSubmit={onSave}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            name="siteName"
            value={form.siteName}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="allowSignup"
            checked={form.allowSignup}
            onChange={onChange}
            className="w-4 h-4"
          />
          <label className="text-sm">Allow user signup</label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Support Email
          </label>
          <input
            name="supportEmail"
            value={form.supportEmail}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                siteName: "Edupeer",
                allowSignup: true,
                supportEmail: "support@edupeer.com",
              })
            }
            className="px-4 py-2 border rounded-md"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
