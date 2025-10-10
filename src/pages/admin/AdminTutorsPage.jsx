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
import ResponsiveDataSection from "../../components/admin/ResponsiveDataSection";

function getUserName(user) {
  if (!user) return "—";
  const userDetails = user.user || user;
  if (userDetails.fullName) return userDetails.fullName;
  const nameParts = [userDetails.firstName, userDetails.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return userDetails.name || "—";
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

  const approvedTutors = filteredTutors.filter(
    (t) => t?.tutor?.approvalStatus === "approved"
  );

  const pendingTutorColumns = [
    { header: "Name", cell: (tutor) => getUserName(tutor) },
    { header: "Email", cell: (tutor) => tutor?.email ?? "—" },
    {
      header: "Applied",
      cell: (tutor) => formatDate(tutor?.createdAt || tutor?.appliedAt),
    },
  ];

  const renderPendingTutorCard = (tutor) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div>
        <p className="font-medium text-gray-900">{getUserName(tutor)}</p>
        <p className="text-sm text-gray-500 mt-1">{tutor?.email ?? "—"}</p>
        <p className="text-xs text-gray-400 mt-1">
          Applied: {formatDate(tutor?.createdAt || tutor?.appliedAt)}
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
  );

  const activeTutorColumns = [
    { header: "Name", cell: (tutor) => getUserName(tutor) },
    { header: "Email", cell: (tutor) => tutor?.email ?? "—" },
    { header: "Since", cell: (tutor) => formatDate(tutor?.createdAt) },
    {
      header: "Status",
      cell: (tutor) => {
        const status = tutor?.tutor?.approvalStatus || "—";
        return (
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full ${
              status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const renderActiveTutorCard = (tutor) => {
    const status = tutor?.tutor?.approvalStatus || "—";
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div>
          <p className="font-medium text-gray-900">{getUserName(tutor)}</p>
          <p className="text-sm text-gray-500 mt-1">{tutor?.email ?? "—"}</p>
          <p className="text-xs text-gray-400 mt-1">
            Since: {formatDate(tutor?.createdAt)}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full ${
              status === "approved"
                ? "bg-green-100 text-green-700"
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
  };

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
          <button className="px-4 py-2 bg-primary text-white rounded-md whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      <ResponsiveDataSection
        title="Pending Tutor Applications"
        data={pendingTutors}
        columns={pendingTutorColumns}
        renderCard={renderPendingTutorCard}
        getLink={(tutor) => `/admin/tutors/${tutor.id}`}
        isLoading={isLoadingPending}
        error={pendingError}
        emptyMessage="No pending tutor applications."
      />

      <ResponsiveDataSection
        title="Active Tutors"
        data={approvedTutors}
        columns={activeTutorColumns}
        renderCard={renderActiveTutorCard}
        getLink={(tutor) => `/admin/tutors/${tutor.id}`}
        isLoading={isLoadingTutors}
        error={tutorsError}
        emptyMessage="No active tutors found."
      />

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
