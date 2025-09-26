import React from "react";
import AdminLayout from "../../layouts/Layout";
import { useNavigate } from "react-router-dom";

/**
 * AdminTutorsProfilePage.jsx
 * Replace mockData with API data as needed.
 */

const mockTutor = {
  id: 1,
  name: "Mr. Ola Williams",
  avatar: "https://i.pravatar.cc/150?img=3",
  university: "University of Lagos",
  appliedAt: "2025-09-15",
  bio: "I'm a dedicated tutor with 5+ years of experience, specializing in Mathematics and Further Math. My goal is to make learning engaging and effective, helping students build confidence and achieve their academic goals.",
  tags: ["Maths", "Chem"],
  availability: {
    label: "Available",
    day: "Monday",
    time: "10:00 AM - 12:00 PM",
  },
  documents: [
    {
      id: "d1",
      title: "Resume",
      subtitle: "Resume.pdf",
      type: "pdf",
      url: "#",
    },
    {
      id: "d2",
      title: "Transcript",
      subtitle: "Transcript.pdf",
      type: "pdf",
      url: "#",
    },
    {
      id: "d3",
      title: "Introduction",
      subtitle: "Video.mp4",
      type: "video",
      url: "#",
    },
  ],
};

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
      aria-label="Back"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 mr-2">
      <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" />{" "}
      {children}
    </span>
  );
}

function DocumentRow({ doc, onView }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center">
          {doc.type === "video" ? (
            <svg
              className="w-6 h-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"
              />
              <rect
                x="3"
                y="6"
                width="10"
                height="12"
                rx="2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
              />
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2v6h6"
              />
            </svg>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-800">{doc.title}</div>
          <div className="text-xs text-gray-500">{doc.subtitle}</div>
        </div>
      </div>

      <div>
        <button
          onClick={() => onView(doc)}
          className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
          aria-label={`View ${doc.title}`}
        >
          View
        </button>
      </div>
    </div>
  );
}

export default function AdminTutorsProfilePage() {
  const tutor = mockTutor;
  const nav = useNavigate();

  function handleViewDocument(doc) {
    // Replace with real URL + viewer logic. Using window.open for demo.
    if (doc.url && doc.url !== "#") {
      window.open(doc.url, "_blank", "noopener");
    } else {
      // Demo placeholder
      alert(`Open ${doc.title} (${doc.subtitle}) — replace with actual viewer`);
    }
  }

  function handleApprove() {
    // Wire this to API: approve tutor
    const ok = window.confirm("Approve this tutor?");
    if (!ok) return;
    // TODO: call API and show toast / update UI
    alert("Tutor approved (mock).");
  }

  function handleReject() {
    const ok = window.confirm("Reject this tutor?");
    if (!ok) return;
    // TODO: call API for rejection + reason flow
    alert("Tutor rejected (mock).");
  }

  return (
    <div className="max-w-5xl">
      {/* Header row */}
      <div className="flex items-center gap-6 mb-8">
        <BackButton onClick={() => nav(-1)} />

        <div className="flex-1">
          <h1 className="text-xl font-semibold">Tutor profile review</h1>
        </div>
      </div>

      {/* Profile top */}
      <section className="flex items-start gap-8 mb-8">
        <img
          src={tutor.avatar}
          alt={`${tutor.name} avatar`}
          className="w-28 h-28 rounded-full object-cover shadow-sm"
        />

        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2">
            Application Date: {tutor.appliedAt}
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {tutor.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">{tutor.university}</div>
        </div>
      </section>

      {/* Details */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Details</h2>

        {/* Bio */}
        <div className="bg-white rounded-xl border p-5 shadow-sm mb-6">
          <div className="text-sm font-medium mb-2">Bio</div>
          <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>

          <div className="mt-4">
            {tutor.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Availability</div>
            <div className="text-sm text-gray-800 mt-1">
              {tutor.availability.label}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Day</div>
            <div className="text-sm text-gray-800 mt-1">
              {tutor.availability.day}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Time</div>
            <div className="text-sm text-gray-800 mt-1">
              {tutor.availability.time}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="text-base font-medium mb-4">Documents</div>

          <div>
            {tutor.documents.map((d) => (
              <DocumentRow key={d.id} doc={d} onView={handleViewDocument} />
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleApprove}
          className="px-6 py-3 rounded-full bg-blue-600 text-white shadow hover:brightness-95"
          aria-label="Approve tutor"
        >
          Approve
        </button>

        <button
          onClick={handleReject}
          className="px-6 py-3 rounded-full border text-gray-700 hover:bg-gray-50"
          aria-label="Reject tutor"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
