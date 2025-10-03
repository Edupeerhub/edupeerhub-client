import React from "react";
import AdminLayout from "../../layouts/Layout";

const statCards = [
  {
    title: "Total Tutors",
    value: "1,250",
    delta: "+5%",
    deltaClass: "text-green-600",
  },
  {
    title: "Total Students",
    value: "50",
    delta: "+10%",
    deltaClass: "text-green-600",
  },
  {
    title: "Pending Tutor Application",
    value: "15",
    delta: "-20%",
    deltaClass: "text-red-500",
  },
];

const pendingTutors = [
  {
    id: 1,
    name: "Mr. Ola Williams",
    university: "University of Lagos",
    date: "2025-09-15",
  },
  {
    id: 2,
    name: "Ms. Nkechi Onu",
    university: "University of Nigeria, Nsukka",
    date: "2025-09-15",
  },
  {
    id: 3,
    name: "Ms. Esther Ali",
    university: "Ahmadu Bello University",
    date: "2025-09-15",
  },
];

const students = [
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

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-xl p-5 shadow-sm border"
          >
            <div className="text-sm text-gray-500">{s.title}</div>
            <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            <div className={`mt-2 text-sm ${s.deltaClass}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Pending tutors */}
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pending Tutors Approval</h3>
          <a className="text-sm text-blue-600" href="#view-all">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-4">Name</th>
                <th className="p-4">University</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingTutors.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`${
                    idx < pendingTutors.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      alt={t.name}
                      src={`https://i.pravatar.cc/40?img=${t.id}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm text-gray-700">{t.name}</div>
                  </td>
                  <td className="p-4 text-gray-600">{t.university}</td>
                  <td className="p-4 text-gray-600">{t.date}</td>
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

      {/* Registered students */}
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Registered students</h3>
          <a className="text-sm text-blue-600" href="#view-all">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-4">Name</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4">Completed sections</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${idx < students.length - 1 ? "border-b" : ""}`}
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
