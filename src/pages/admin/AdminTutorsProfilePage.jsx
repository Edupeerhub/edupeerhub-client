import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  useApproveTutor,
  useRejectTutor,
  useTutor,
  useTutorDocument,
} from "../../hooks/admin";

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
      aria-label="Back"
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
      <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" /> {children}
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
          <div className="text-xs text-gray-500">{doc.subtitle}</div>
        </div>
      </div>

      <div>
        <button
          onClick={() => onView(doc)}
          className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
          aria-label={`View ${doc.title}`}
          type="button"
        >
          View
        </button>
      </div>
    </div>
  );
}

function getTutorName(tutor) {
  if (!tutor) return "—";
  if (tutor.fullName) return tutor.fullName;
  const nameParts = [tutor.firstName, tutor.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return tutor.name || "—";
}

function getTutorEmail(tutor) {
  return tutor?.email ?? tutor?.user?.email ?? tutor?.raw?.user?.email ?? "—";
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

export default function AdminTutorsProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pendingTutorQuery = useTutor({ id, isPending: true, enabled: Boolean(id) });
  const shouldFetchActiveTutor =
    Boolean(id) &&
    (pendingTutorQuery.isError ||
      (!pendingTutorQuery.isFetching && !pendingTutorQuery.data));

  const activeTutorQuery = useTutor({
    id,
    enabled: shouldFetchActiveTutor,
  });

  const tutor = pendingTutorQuery.data ?? activeTutorQuery.data;
  const isPendingTutor = Boolean(pendingTutorQuery.data);

  const {
    data: documentUrl,
    isLoading: isLoadingDocument,
    isError: isDocumentError,
    error: documentError,
  } = useTutorDocument({ id, enabled: Boolean(id) });

  const approveTutorMutation = useApproveTutor({
    onSuccess: () => navigate(-1),
  });
  const rejectTutorMutation = useRejectTutor({
    onSuccess: () => navigate(-1),
  });

  const isLoading = pendingTutorQuery.isLoading || activeTutorQuery.isLoading;
  const error = pendingTutorQuery.error || activeTutorQuery.error;

  const subjects = useMemo(() => {
    const subjectList =
      (Array.isArray(tutor?.tutor?.subjects) && tutor.tutor.subjects) ||
      (Array.isArray(tutor?.subjects) && tutor.subjects) ||
      [];

    return subjectList.map((subject) =>
      typeof subject === "string" ? subject : subject?.name ?? subject?.title ?? "Subject",
    );
  }, [tutor]);

  const bio =
    tutor?.tutor?.bio ||
    tutor?.bio ||
    tutor?.tutorProfile?.bio ||
    "Tutor did not provide a biography.";

  const documents = useMemo(() => {
    const tutorDocuments =
      (Array.isArray(tutor?.tutor?.documents) && tutor.tutor.documents) ||
      (Array.isArray(tutor?.documents) && tutor.documents) ||
      [];

    if (tutorDocuments.length > 0) {
      return tutorDocuments.map((document) => ({
        id: document.id ?? document.url ?? document.name,
        title: document.title ?? document.name ?? "Document",
        subtitle: document.subtitle ?? document.fileName ?? document.url ?? "",
        url: document.url ?? document.link ?? documentUrl,
      }));
    }

    if (documentUrl) {
      const parts = documentUrl.split("/");
      const subtitle = parts[parts.length - 1] || documentUrl;
      return [
        {
          id: "primary-document",
          title: "Verification Document",
          subtitle,
          url: documentUrl,
        },
      ];
    }

    return [];
  }, [documentUrl, tutor]);

  const handleViewDocument = (doc) => {
    if (!doc?.url) {
      window.alert("Document URL unavailable.");
      return;
    }
    window.open(doc.url, "_blank", "noopener");
  };

  const handleApprove = () => {
    if (!id) return;
    const confirmed = window.confirm("Approve this tutor?");
    if (!confirmed) return;
    approveTutorMutation.mutate(id);
  };

  const handleReject = () => {
    if (!id) return;
    const confirmed = window.confirm("Reject this tutor?");
    if (!confirmed) return;
    rejectTutorMutation.mutate(id);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-6 mb-8">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Tutor profile review</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review tutor information, documents, and take action on pending applications.
          </p>
        </div>
      </div>

      {error ? <ErrorAlert error={error} /> : null}

      {isLoading ? (
        <Spinner />
      ) : !tutor ? (
        <p className="text-sm text-gray-500">Tutor not found.</p>
      ) : (
        <>
          <section className="flex flex-wrap md:flex-nowrap items-start gap-8 mb-8">
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700">
              {getTutorName(tutor)
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2) || "T"}
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="text-sm text-gray-500 mb-2">
                Application Date: {formatDate(tutor?.createdAt || tutor?.appliedAt)}
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {getTutorName(tutor)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {tutor?.tutorProfile?.university ||
                  tutor?.university ||
                  tutor?.tutor?.education ||
                  tutor?.education ||
                  "University information unavailable"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Email: {getTutorEmail(tutor)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Status: {
                  tutor?.tutor?.approvalStatus ||
                  tutor?.status ||
                  tutor?.accountStatus ||
                  (isPendingTutor ? "pending" : "—")
                }
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Details</h2>

            <div className="bg-white rounded-xl border p-5 shadow-sm mb-6">
              <div className="text-sm font-medium mb-2">Bio</div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>

              {subjects.length ? (
                <div className="mt-4 flex flex-wrap">
                  {subjects.map((subject, index) => (
                    <Tag key={`${subject}-${index}`}>{subject}</Tag>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500">Availability</div>
              <div className="text-sm text-gray-800 mt-1">
                  {tutor?.tutorProfile?.availability?.label ||
                    tutor?.tutor?.availability?.label ||
                    "Not specified"}
              </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Day</div>
              <div className="text-sm text-gray-800 mt-1">
                  {tutor?.tutorProfile?.availability?.day ||
                    tutor?.tutor?.availability?.day ||
                    "Not specified"}
              </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Time</div>
              <div className="text-sm text-gray-800 mt-1">
                  {tutor?.tutorProfile?.availability?.time ||
                    tutor?.tutor?.availability?.time ||
                    "Not specified"}
              </div>
              </div>
            </div>

            <div>
              <div className="text-base font-medium mb-4">Documents</div>
              {isDocumentError ? <ErrorAlert error={documentError} /> : null}
              {isLoadingDocument ? <Spinner /> : null}
              {!isLoadingDocument && documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents available.</p>
              ) : (
                <div>
                  {documents.map((document) => (
                    <DocumentRow
                      key={document.id}
                      doc={document}
                      onView={handleViewDocument}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {isPendingTutor ? (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleApprove}
                className="px-6 py-3 rounded-full bg-blue-600 text-white shadow hover:brightness-95 disabled:opacity-60"
                aria-label="Approve tutor"
                disabled={approveTutorMutation.isPending}
                type="button"
              >
                {approveTutorMutation.isPending ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={handleReject}
                className="px-6 py-3 rounded-full border text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                aria-label="Reject tutor"
                disabled={rejectTutorMutation.isPending}
                type="button"
              >
                {rejectTutorMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
