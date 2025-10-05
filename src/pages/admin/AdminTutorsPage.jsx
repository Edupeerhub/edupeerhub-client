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
import {
  ApproveTutorModal,
  RejectTutorModal,
} from "../../components/admin/ApprovalModals";

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
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
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

  // const handleApprove = (tutorId) => {
  //   if (!tutorId) return;
  //   const confirmed = window.confirm("Approve this tutor?");
  //   if (!confirmed) return;
  //   approveTutorMutation.mutate(tutorId);
  // };

  // const handleReject = (tutorId) => {
  //   if (!tutorId) return;
  //   const confirmed = window.confirm("Reject this tutor?");
  //   if (!confirmed) return;
  //   const reason = window.prompt("Please provide a rejection reason:");
  //   if (!reason || !reason.trim()) {
  //     window.alert("Rejection reason is required.");
  //     return;
  //   }
  //   rejectTutorMutation.mutate({
  //     tutorId,
  //     rejectionReason: reason.trim(),
  //   });
  // };

  const handleApproveClick = (tutor) => {
    setSelectedTutor(tutor);
    setShowApproveModal(true);
  };

  const handleRejectClick = (tutor) => {
    setSelectedTutor(tutor);
    setShowRejectModal(true);
  };

  const handleApprove = () => {
    if (selectedTutor?.id) {
      approveTutorMutation.mutate(selectedTutor.id);
      setShowApproveModal(false);
      setSelectedTutor(null);
    }
  };

  const handleReject = (reason) => {
    if (selectedTutor?.id) {
      rejectTutorMutation.mutate({
        tutorId: selectedTutor.id,
        reason,
      });
      setShowRejectModal(false);
      setSelectedTutor(null);
    }
  };

  const approvedTutors = filteredTutors.filter(
    (t) => t?.tutor?.approvalStatus === "approved"
  );
  const rejectedTutors = filteredTutors.filter(
    (t) => t?.tutor?.approvalStatus === "rejected"
  );

  return (
    <div className="space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Tutors</h1>
        <div className="flex gap-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border rounded-md"
            placeholder="Search tutors..."
            type="search"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      {/* Pending Tutor Applications */}
      <section className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold">Pending Tutor Applications</h2>
          {isPendingError ? <ErrorAlert error={pendingError} /> : null}
        </div>

        {isLoadingPending ? (
          <Spinner />
        ) : !pendingTutors || pendingTutors.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pending tutor applications.
          </p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {pendingTutors.map((tutor, index) => (
                <div
                  key={tutor?.id ?? index}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {getUserName(tutor)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {tutor?.email ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied:{" "}
                      {formatDate(tutor?.createdAt || tutor?.appliedAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      className="block w-full text-center px-3 py-2 bg-white border rounded-full text-blue-600 text-sm"
                      to={`/admin/tutors/${tutor?.id}`}
                    >
                      View
                    </Link>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-full disabled:opacity-60 text-sm"
                        disabled={approveTutorMutation.isPending}
                        onClick={() => handleApproveClick(tutor)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-full disabled:opacity-60 text-sm"
                        disabled={rejectTutorMutation.isPending}
                        onClick={() => handleRejectClick(tutor)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Applied</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTutors.map((tutor, index) => (
                    <tr
                      key={tutor?.id ?? index}
                      className={
                        index < pendingTutors.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4">{getUserName(tutor)}</td>
                      <td className="p-4">{tutor?.email ?? "—"}</td>
                      <td className="p-4">
                        {formatDate(tutor?.createdAt || tutor?.appliedAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            className="px-3 py-2 bg-white border rounded-full text-blue-600 text-sm"
                            to={`/admin/tutors/${tutor?.id}`}
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="px-3 py-2 bg-blue-600 text-white rounded-full disabled:opacity-60 text-sm"
                            disabled={approveTutorMutation.isPending}
                            onClick={() => handleApproveClick(tutor)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-full disabled:opacity-60 text-sm"
                            disabled={rejectTutorMutation.isPending}
                            onClick={() => handleRejectClick(tutor)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Active Tutors */}
      <section className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold">Active Tutors</h2>
          {isTutorsError ? <ErrorAlert error={tutorsError} /> : null}
        </div>

        {isLoadingTutors ? (
          <Spinner />
        ) : approvedTutors.length === 0 ? (
          <p className="text-sm text-gray-500">No active tutors found.</p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {approvedTutors.map((tutor, index) => {
                const status = tutor?.tutor?.approvalStatus || "—";
                return (
                  <div
                    key={tutor?.id ?? index}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {getUserName(tutor)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {tutor?.email ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Since: {formatDate(tutor?.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
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
                      <Link
                        className="px-4 py-2 bg-white border rounded-full text-blue-600 text-sm"
                        to={`/admin/tutors/${tutor?.id}`}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Since</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTutors.map((tutor, index) => {
                    const status = tutor?.tutor?.approvalStatus || "—";
                    return (
                      <tr
                        key={tutor?.id ?? index}
                        className={
                          index < approvedTutors.length - 1 ? "border-b" : ""
                        }
                      >
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
                            className="px-4 py-2 bg-white border rounded-full text-blue-600 text-sm"
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
            </div>
          </>
        )}
      </section>

      {/* Modals */}
      <ApproveTutorModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedTutor(null);
        }}
        tutorName={getUserName(selectedTutor)}
        onConfirm={handleApprove}
        isLoading={approveTutorMutation.isPending}
      />

      <RejectTutorModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedTutor(null);
        }}
        tutorName={getUserName(selectedTutor)}
        onConfirm={handleReject}
        isLoading={rejectTutorMutation.isPending}
      />
    </div>
  );
}
