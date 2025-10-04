import React, { useState, useMemo } from "react";
import AdminLayout from "../../layouts/Layout";

const MOCK_TUTORS = [
  {
    id: 1,
    name: "Mr. Ola Williams",
    university: "University of Lagos",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=12",
  },
  {
    id: 2,
    name: "Ms. Nkechi Onu",
    university: "University of Nigeria, Nsukka",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=6",
  },
  {
    id: 3,
    name: "Ms. Esther Ali",
    university: "Ahmadu Bello University",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=8",
  },
  {
    id: 4,
    name: "Mr. Steve Aina",
    university: "University of Lagos",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=10",
  },
  {
    id: 5,
    name: "Mr. Ola Williams",
    university: "University of Nigeria, Nsukka",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=14",
  },
  {
    id: 6,
    name: "Ms. Nkechi Onu",
    university: "Ahmadu Bello University",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=15",
  },
  {
    id: 7,
    name: "Ms. Esther Ali",
    university: "University of Lagos",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=9",
  },
  {
    id: 8,
    name: "Mr. Steve Aina",
    university: "University of Lagos",
    date: "2025-09-15",
    avatar: "https://i.pravatar.cc/48?img=11",
  },
];

function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tutors"
        className="w-full md:w-1/2 px-4 py-3 border rounded-lg bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        aria-label="Search tutors"
      />
    </div>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border bg-white text-blue-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
      aria-label="View details"
    >
      View
    </button>
  );
}

export default function AdminTutorsPage() {
  const [query, setQuery] = useState("");

  // simple client side filter (replace with server filtering if needed)
  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_TUTORS;
    const q = query.toLowerCase();
    return MOCK_TUTORS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.university.toLowerCase().includes(q) ||
        t.date.includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold mb-4">Tutor Vetting</h1>

      <SearchBar value={query} onChange={setQuery} />

      <div className="bg-white rounded-xl p-0 shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px]">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  University
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  Date Applied
                </th>
                <th className="px-6 py-4 text-right text-sm text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`${idx < filtered.length - 1 ? "border-b" : ""}`}
                >
                  <td className="px-6 py-5 flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-sm text-gray-700">{t.name}</div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {t.university}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">{t.date}</td>

                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      {/* decorative left "tab" to match the Figma right-side button style */}
                      <div
                        className="rounded-l-full bg-white shadow-sm p-2"
                        aria-hidden="true"
                      />
                      <div className="ml-3">
                        <ViewButton
                          onClick={() =>
                            alert(`Open tutor ${t.id} — replace with navigate`)
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-sm text-gray-500"
                    colSpan={4}
                  >
                    No tutors match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
