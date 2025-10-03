import React from "react";
import AdminLayout from "../../layouts/Layout";

const tutors = [
  {
    id: 1,
    name: "John Doe",
    subject: "Math",
    since: "2024-01-10",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    subject: "Physics",
    since: "2024-02-12",
    status: "Pending",
  },
  {
    id: 3,
    name: "Sam Green",
    subject: "Chemistry",
    since: "2023-11-21",
    status: "Active",
  },
];

export default function AdminTutorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tutors</h1>
        <div className="flex gap-3">
          <input
            className="px-3 py-2 border rounded-md"
            placeholder="Search tutors..."
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Since</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((t, idx) => (
              <tr
                key={t.id}
                className={`${idx < tutors.length - 1 ? "border-b" : ""}`}
              >
                <td className="p-4">{t.id}</td>
                <td className="p-4">{t.name}</td>
                <td className="p-4">{t.subject}</td>
                <td className="p-4">{t.since}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      t.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="px-4 py-2 bg-white border rounded-full text-blue-600">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
