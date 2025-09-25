import { useQuery } from "@tanstack/react-query";
import {
  getBookingRequests,
  getConfirmedUpcomingSessions,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { Link } from "react-router-dom";
import { formatDate, formatTimeRange } from "../../utils/time";
import { useState } from "react";
import ViewModal from "../../components/tutor/ViewModal";
import BookingCard from "../../components/tutor/BookingCard";

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
    queryFn: getConfirmedUpcomingSessions,
  });

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
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Booking Requests</h1>
      <div className="bg-white rounded-lg border shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium">
                  Student
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden sm:table-cell">
                  Subject
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden md:table-cell">
                  Time
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingRequests?.map((session, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 px-2">
                    <BookingCard session={session} />
                  </td>
                  <td className="py-3 px-2 text-sm hidden sm:table-cell">
                    {session.subject.name}
                  </td>
                  <td className="py-3 px-2 text-sm hidden md:table-cell">
                    {formatDate(session.scheduledStart)}
                  </td>
                  <td className="py-3 px-2 text-sm hidden md:table-cell">
                    {formatTimeRange(
                      session.scheduledStart,
                      session.scheduledEnd
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleView(session)}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
