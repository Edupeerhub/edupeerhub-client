import React from "react";
import AdminLayout from "../../layouts/Layout";

/**
 * AdminReportsPage.jsx
 * Replace mock data with API calls as needed.
 */

const stats = [
  { title: "Revenue", value: "₦100,000", note: "+5%" },
  { title: "Engagement Overview", value: "+15%", note: "Last 30 days +10%" },
  {
    title: "Pending Tutor Application",
    value: "15",
    note: "-20%",
    noteClass: "text-red-500",
  },
];

const subscriptions = [
  {
    id: 1,
    name: "Chidinma Okeke",
    date: "2025-09-15",
    completed: 10,
    status: "Active",
  },
  {
    id: 2,
    name: "Fatima Abubakar",
    date: "2025-09-15",
    completed: 20,
    status: "Active",
  },
  {
    id: 3,
    name: "Tunde Oladipo",
    date: "2025-09-15",
    completed: 30,
    status: "Inactive",
  },
];

function SmallArea({ d }) {
  // d = path d value for variety; simple decorative area chart
  return (
    <svg viewBox="0 0 100 60" className="w-full h-28">
      <defs>
        <linearGradient id={`g${d}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#dbeefe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dbeefe" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <path
        d={d}
        fill={`url(#g${d})`}
        stroke="#2b73ee"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminReportsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* top search area (if needed) */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            className="w-full px-4 py-3 border rounded-lg bg-white text-sm placeholder-gray-400"
            placeholder="Search"
          />
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-xl p-5 shadow-sm border"
          >
            <div className="text-sm text-gray-500">{s.title}</div>
            <div className="mt-3 text-2xl font-semibold text-gray-900">
              {s.value}
            </div>
            <div className={`mt-2 text-sm ${s.noteClass || "text-green-600"}`}>
              {s.note}
            </div>
          </div>
        ))}
      </div>

      {/* Engagement overview large card */}
      <section className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Quick Engagement Overview</h3>
            <div className="mt-1 text-3xl font-bold text-gray-900">+15%</div>
            <div className="text-sm text-green-600 mt-1">Last 30 Days +15%</div>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-50">
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
          </button>
        </div>

        {/* small charts area — 4 weeks */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-4">
            <SmallArea d="M0,50 C20,10 40,10 60,40 C80,60 100,50 100,50 L100,60 L0,60 Z" />
            <div className="text-center text-sm text-gray-500 mt-2">Week 1</div>
          </div>

          <div className="p-4">
            <SmallArea d="M0,60 C20,30 40,40 60,12 C80,4 100,60 100,60 L100,60 L0,60 Z" />
            <div className="text-center text-sm text-gray-500 mt-2">Week 2</div>
          </div>

          <div className="p-4">
            <SmallArea d="M0,50 C18,38 36,20 54,30 C72,40 90,35 100,50 L100,60 L0,60 Z" />
            <div className="text-center text-sm text-gray-500 mt-2">Week 3</div>
          </div>

          <div className="p-4">
            <SmallArea d="M0,60 C15,35 35,5 55,10 C75,20 95,55 100,45 L100,60 L0,60 Z" />
            <div className="text-center text-sm text-gray-500 mt-2">Week 4</div>
          </div>
        </div>
      </section>

      {/* Subscriptions table */}
      <section className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Subscriptions</h3>
          <a className="text-sm text-blue-600" href="#view-all">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-4">Name</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Completed sections</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${
                    idx < subscriptions.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="p-4 text-gray-700">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.date}</td>
                  <td className="p-4 text-gray-600">{s.completed}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-4 py-2 bg-white border rounded-full shadow-sm text-blue-600">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
