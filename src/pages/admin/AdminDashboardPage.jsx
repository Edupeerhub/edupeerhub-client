import React from "react";
import AdminLayout from "../../layouts/Layout";

const stats = [
  {
    id: 1,
    title: "Total Tutors",
    value: "1,250",
    delta: "+5%",
    deltaClass: "text-green-600",
  },
  {
    id: 2,
    title: "Total Students",
    value: "50",
    delta: "+10%",
    deltaClass: "text-green-600",
  },
  {
    id: 3,
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
    avatarId: 12,
  },
  {
    id: 2,
    name: "Ms. Nkechi Onu",
    university: "University of Nigeria, Nsukka",
    date: "2025-09-15",
    avatarId: 6,
  },
  {
    id: 3,
    name: "Ms. Esther Ali",
    university: "Ahmadu Bello University",
    date: "2025-09-15",
    avatarId: 8,
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

function StatCard({ title, value, delta, deltaClass }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`mt-2 text-sm ${deltaClass}`}>{delta}</div>
    </div>
  );
}

function TableHeader({ cols }) {
  return (
    <thead>
      <tr className="bg-blue-50">
        {cols.map((c) => (
          <th key={c} className="px-6 py-4 text-left text-sm text-gray-700">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border bg-white text-blue-600 shadow-sm hover:bg-gray-50"
    >
      View
    </button>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl">
      {/* top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            delta={s.delta}
            deltaClass={s.deltaClass}
          />
        ))}
      </div>

      {/* Pending Tutors Approval */}
      <section className="mb-10 bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pending Tutors Approval</h3>
          <a className="text-sm text-blue-600" href="#view-all">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader
              cols={["Name", "University", "Date Applied", "Action"]}
            />
            <tbody>
              {pendingTutors.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`${
                    idx < pendingTutors.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={`https://i.pravatar.cc/40?img=${t.avatarId}`}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-sm text-gray-700">{t.name}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.university}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end">
                      <div className="rounded-l-full bg-white shadow-sm p-2" />
                      <div className="ml-3">
                        <ViewButton
                          onClick={() =>
                            alert(`Open tutor ${t.id} - replace with routing`)
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Registered students */}
      <section className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Registered students</h3>
          <a className="text-sm text-blue-600" href="#view-all">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader
              cols={[
                "Name",
                "Date Applied",
                "Completed sections",
                "Status",
                "Action",
              ]}
            />
            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${idx < students.length - 1 ? "border-b" : ""}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {s.completed}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-right">
                    <ViewButton
                      onClick={() =>
                        alert(`Open student ${s.id} - replace with routing`)
                      }
                    />
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
