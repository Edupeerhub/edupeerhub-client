import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  useApproveTutor,
  usePendingTutors,
  useRejectTutor,
  useUsers,
} from "../../hooks/admin";

function getUserName(user) {
  if (!user) return "—";
  if (user.fullName) return user.fullName;
  const nameParts = [user.firstName, user.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return user.name || "—";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleDateString();
  } catch (error) {
    return "—";
  }
}

export default function AdminTutorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: tutorsData,
    isLoading: isLoadingTutors,
    isError: isTutorsError,
    error: tutorsError,
  } = useUsers({ role: "tutor", limit: 50 });

  const tutors = tutorsData?.users ?? [];

  const {
    data: pendingTutors,
    isLoading: isLoadingPending,
    isError: isPendingError,
    error: pendingError,
  } = usePendingTutors();

  const approveTutorMutation = useApproveTutor();
  const rejectTutorMutation = useRejectTutor();

  const filteredTutors = useMemo(() => {
    if (!Array.isArray(tutors)) return [];
    if (!searchTerm) return tutors;
    const lowerCaseTerm = searchTerm.toLowerCase();
    return tutors.filter((tutor) => {
      const name = getUserName(tutor).toLowerCase();
      const email = (tutor?.email || "").toLowerCase();
      return name.includes(lowerCaseTerm) || email.includes(lowerCaseTerm);
    });
  }, [searchTerm, tutors]);

  const handleApprove = (tutorId) => {
    if (!tutorId) return;
    const confirmed = window.confirm("Approve this tutor?");
    if (!confirmed) return;
    approveTutorMutation.mutate(tutorId);
  };

  const handleReject = (tutorId) => {
    if (!tutorId) return;
    const confirmed = window.confirm("Reject this tutor?");
    if (!confirmed) return;
    rejectTutorMutation.mutate(tutorId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tutors</h1>
        <div className="flex gap-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="px-3 py-2 border rounded-md"
            placeholder="Search tutors..."
            type="search"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Search
          </button>
        </div>
      </div>

      <section className="bg-white rounded-xl p-4 border shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Tutors</h2>
          {isTutorsError ? <ErrorAlert error={tutorsError} /> : null}
        </div>
        {isLoadingTutors ? (
          <Spinner />
        ) : filteredTutors.length === 0 ? (
          <p className="text-sm text-gray-500">No tutors found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Since</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTutors.map((tutor, index) => {
                const status =
                  tutor?.tutor?.approvalStatus || tutor?.status || tutor?.accountStatus || "—";
                return (
                  <tr
                    key={tutor?.id ?? index}
                    className={index < filteredTutors.length - 1 ? "border-b" : ""}
                  >
                    <td className="p-4">{tutor?.id ?? index + 1}</td>
                    <td className="p-4">{getUserName(tutor)}</td>
                    <td className="p-4">{tutor?.email ?? "—"}</td>
                    <td className="p-4">{formatDate(tutor?.createdAt)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          status === "approved"
                            ? "bg-green-100 text-green-700"
                            : status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        className="px-4 py-2 bg-white border rounded-full text-blue-600"
                        to={`/admin/tutors/${tutor?.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white rounded-xl p-4 border shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pending Tutor Applications</h2>
          {isPendingError ? <ErrorAlert error={pendingError} /> : null}
        </div>
        {isLoadingPending ? (
          <Spinner />
        ) : !pendingTutors || pendingTutors.length === 0 ? (
          <p className="text-sm text-gray-500">No pending tutor applications.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Education</th>
                <th className="p-4 text-left">Applied</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingTutors.map((tutor, index) => (
                <tr
                  key={tutor?.id ?? index}
                  className={index < pendingTutors.length - 1 ? "border-b" : ""}
                >
                  <td className="p-4">{getUserName(tutor)}</td>
                  <td className="p-4">{tutor?.email ?? "—"}</td>
                  <td className="p-4">
                    {tutor?.education ?? tutor?.raw?.education ?? "—"}
                  </td>
                  <td className="p-4">{formatDate(tutor?.createdAt || tutor?.appliedAt)}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Link
                      className="px-3 py-2 bg-white border rounded-full text-blue-600"
                      to={`/admin/tutors/${tutor?.id}`}
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="px-3 py-2 bg-green-600 text-white rounded-full disabled:opacity-60"
                      disabled={approveTutorMutation.isPending}
                      onClick={() => handleApprove(tutor?.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 bg-red-600 text-white rounded-full disabled:opacity-60"
                      disabled={rejectTutorMutation.isPending}
                      onClick={() => handleReject(tutor?.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
