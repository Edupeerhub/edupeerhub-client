import React, { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPendingBookingRequests } from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatTimeRange } from "../../utils/time";
import ViewModal from "../../components/tutor/ViewModal";

const BookingRequestsPage = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: bookingRequests,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookingRequests"],
    queryFn: getPendingBookingRequests,
  });

  const handleAcceptRequest = (id) => {
    console.log("Accept request (placeholder): ", id);
    // To implement fully, this would require an API call and query invalidation.
  };

  const handleDeclineRequest = (id) => {
    console.log("Decline request (placeholder): ", id);
    // To implement fully, this would require an API call and query invalidation.
  };

  const handleDismissRequest = (id) => {
    console.log("Dismiss request (placeholder): ", id);
    // To implement fully, this would require an API call and query invalidation.
    // Not modifying local state to adhere to "leave existing functionality as is" with React Query.
  };

  const handleView = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isError) {
    return <ErrorAlert message={error.message} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h1 className="text-xl font-semibold mb-6">Booking Requests</h1>

      <div className="space-y-4">
        {bookingRequests?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2V7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No booking requests
            </h3>
            <p className="text-gray-600">
              New booking requests will appear here when students book sessions
              with you.
            </p>
          </div>
        )}

        {bookingRequests?.map((session) => (
          <div
            key={session.id}
            className="border border-gray-200 rounded-lg p-4 relative cursor-pointer hover:bg-gray-50 transition-colors"
            // onClick={() => handleView(session)}
          >
            {/* Student info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  session.student?.user?.profileImageUrl ||
                  "https://via.placeholder.com/150"
                }
                alt={`${session.student?.user?.firstName} ${session.student?.user?.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {session.student?.user?.firstName}{" "}
                  {session.student?.user?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{session.subject?.name}</p>
              </div>
            </div>

            {/* Date and time */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">
                {formatDate(session.scheduledStart)}
              </p>
              <p className="text-sm text-gray-600">
                {formatTimeRange(session.scheduledStart, session.scheduledEnd)}
              </p>
            </div>

            {/* Action buttons - now placeholders */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptRequest(session.id);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Accept Request
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeclineRequest(session.id);
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      <ViewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        session={selectedSession}
      />
    </div>
  );
};

export default BookingRequestsPage;
