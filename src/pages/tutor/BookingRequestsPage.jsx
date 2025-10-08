import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTutorBookings,
  updateBookingAvailabilityStatus,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatTimeRange } from "../../utils/time";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";

const BookingRequestsPage = () => {
  const queryClient = useQueryClient();

  const {
    data: bookingRequests,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookingRequests"],
    queryFn: () => fetchTutorBookings({ status: "pending" }),
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ availabilityId, status }) =>
      updateBookingAvailabilityStatus(availabilityId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookingRequests"]);
      handleToastSuccess("Booking request updated successfully!");
    },
    onError: (err) => {
      handleToastError(err, "Failed to update booking request.");
    },
  });

  const handleAcceptRequest = (id) => {
    updateBookingStatusMutation.mutate({
      availabilityId: id,
      status: "confirmed",
    });
  };

  const handleDeclineRequest = (id) => {
    updateBookingStatusMutation.mutate({ availabilityId: id, status: "open" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isError) {
    return <ErrorAlert error={error.message} />;
  }

  return (
    <div className="w-full max-w-7xl flex flex-col p-2 sm:p-0 bg-white">
      <h1 className="text-2xl font-semibold mb-6">Booking Requests</h1>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,auto))] justify-center">
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
                  strokeWidth={2}
                  d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
            className="border border-gray-200 rounded-lg p-3 sm:p-4 relative cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
          >
            {/* top section (student + date info) */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:justify-between sm:items-center mb-4 flex-1">
              {/* Student info */}
              <div className="flex items-center gap-3">
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
                  <p className="text-sm text-gray-600">
                    {session.subject?.name}
                  </p>
                </div>
              </div>

              {/* Date and time */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {formatDate(session.scheduledStart)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTimeRange(
                    session.scheduledStart,
                    session.scheduledEnd
                  )}
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex mt-auto justify-around items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptRequest(session.id);
                }}
                className="bg-primary text-white px-6 py-2 sm:px-8 rounded-full text-sm font-medium hover:bg-primary-focus transition-colors"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeclineRequest(session.id);
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 sm:px-8 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequestsPage;
