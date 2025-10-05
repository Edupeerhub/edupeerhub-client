import { X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  useApproveTutor,
  useRejectTutor,
  usePendingTutor,
} from "../../hooks/admin";

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
      type="button"
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
        </div>

        <div>
          <div className="text-sm font-medium text-gray-800">{doc.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {doc.subtitle}
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(doc)}
        className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
        type="button"
      >
        View
      </button>
    </div>
  );
}

function extractFileName(url) {
  try {
    const parts = decodeURIComponent(url).split("/");
    return parts[parts.length - 1] || "Document";
  } catch {
    return "Document";
  }
}

/* ---------- MODALS ---------- */

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 pr-6">{title}</h2>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

export default function AdminTutorsProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tutor, isLoading, isError, error } = usePendingTutor(id);

  const approveTutor = useApproveTutor({ onSuccess: () => navigate(-1) });
  const rejectTutor = useRejectTutor({ onSuccess: () => navigate(-1) });

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const documents = useMemo(() => {
    if (!tutor?.documentUrl) return [];
    const subtitle = extractFileName(tutor.documentUrl);
    return [
      {
        id: "primary-document",
        title: "Verification Document",
        subtitle,
        url: tutor.documentUrl,
      },
    ];
  }, [tutor]);

  const handleViewDocument = (doc) => {
    if (!doc?.url) return alert("Document URL unavailable.");
    window.open(doc.url, "_blank", "noopener");
  };

  const confirmApprove = () => {
    if (!id) return;
    approveTutor.mutate(id);
    setShowApproveModal(false);
  };

  const confirmReject = () => {
    if (!id) return;
    if (!rejectionReason.trim()) return alert("Rejection reason is required.");
    rejectTutor.mutate({
      tutorId: id,
      rejectionReason: rejectionReason.trim(),
    });
    setShowRejectModal(false);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorAlert error={error} />;
  if (!tutor) return <p className="text-sm text-gray-500">Tutor not found.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Tutor profile review</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review tutor information, documents, and approve or reject this
            application.
          </p>
        </div>
      </div>

      {/* Tutor info */}
      <section className="flex flex-wrap md:flex-nowrap items-start gap-8 mb-8">
        <img
          src={tutor.user.profileImageUrl}
          alt={`${tutor.user.firstName} ${tutor.user.lastName}`}
          className="w-28 h-28 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="text-2xl font-semibold text-gray-900">
            {tutor.user.firstName} {tutor.user.lastName}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Email: {tutor.user.email}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Bio: {tutor.bio || "No bio provided."}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Status: {tutor.approvalStatus}
          </div>
          {tutor.rejectionReason && (
            <div className="text-sm font-bold text-red-600 mt-1">
              Rejection Reason: {tutor.rejectionReason || "N/A"}
            </div>
          )}
        </div>
      </section>

      {/* Academic + Subjects */}
      <section className="mb-8">
        <div className="bg-white rounded-xl border p-5 shadow-sm mb-6">
          <div className="text-sm font-medium mb-1">Academic History</div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line break-words">
            {tutor.education || "No education details provided."}
          </p>

          {tutor.subjects?.length ? (
            <>
              <div className="text-sm font-medium mt-4">Subjects Selected</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tutor.subjects.map((subject) => (
                  <Tag key={subject.id}>{subject.name}</Tag>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No subjects found.</p>
          )}
        </div>

        {/* Documents */}
        <div>
          <div className="text-base font-medium mb-4">Documents</div>
          {documents.length === 0 ? (
            <p className="text-sm text-gray-500">No documents available.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  onView={handleViewDocument}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      {tutor.approvalStatus === "pending" ||
        (tutor.approvalStatus === "rejected" && (
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-6 py-3 rounded-full bg-blue-600 text-white shadow hover:brightness-95 disabled:opacity-60"
              disabled={approveTutor.isPending}
            >
              {approveTutor.isPending ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 rounded-full border text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              disabled={rejectTutor.isPending}
            >
              {rejectTutor.isPending ? "Rejecting..." : "Reject"}
            </button>
          </div>
        ))}
      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        title="Approve Tutor"
        onClose={() => setShowApproveModal(false)}
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to approve <b>{tutor.user.firstName}</b> as a
          tutor?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowApproveModal(false)}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={confirmApprove}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        title="Reject Tutor"
        onClose={() => setShowRejectModal(false)}
      >
        <p className="text-gray-600 mb-3">Please provide a rejection reason:</p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Enter reason..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowRejectModal(false)}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={confirmReject}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}
