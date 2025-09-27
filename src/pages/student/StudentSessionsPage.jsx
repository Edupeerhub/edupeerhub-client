import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelStudentBooking,
  getAllStudentBookings,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatTimeRange } from "../../utils/time";
import BookingDetailsModal from "../../components/common/BookingDetailsModal";
import RescheduleBookingModal from "../../components/common/RescheduleBookingModal";
import {
  handleToastSuccess,
  handleToastError,
} from "../../utils/toastDisplayHandler";

const StudentSessionsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const queryClient = useQueryClient();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: upcomingBookings,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
    error: errorUpcoming,
  } = useQuery({
    queryKey: ["studentUpcomingBookings"],
    queryFn: () => getAllStudentBookings({ status: "confirmed" }),
  });

  const {
    data: pastBookings,
    isLoading: isLoadingPast,
    isError: isErrorPast,
    error: errorPast,
  } = useQuery({
    queryKey: ["studentPastBookings"],
    queryFn: () => getAllStudentBookings({ status: "completed" }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelStudentBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(["studentUpcomingBookings"]);
      queryClient.invalidateQueries(["studentPastBookings"]);
      handleToastSuccess("Booking cancelled successfully!");
      setIsDetailsModalOpen(false);
    },
    onError: (err) => {
      handleToastError(err, "Failed to cancel booking.");
    },
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleOpenRescheduleModal = () => {
    setIsDetailsModalOpen(false);
    setIsRescheduleModalOpen(true);
  };

  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = (cancellationReason) => {
    if (selectedBooking) {
      cancelMutation.mutate({
        bookingId: selectedBooking.id,
        cancellationReason,
      });
    }
  };

  const handleRescheduleBooking = (rescheduleData) => {
    console.log("Reschedule booking:", rescheduleData);
    setIsRescheduleModalOpen(false);
  };

  if (isLoadingUpcoming || isLoadingPast) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isErrorUpcoming || isErrorPast) {
    return <ErrorAlert error={errorUpcoming?.message || errorPast?.message} />;
  }

  const bookingsToDisplay =
    activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6 sm:gap-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming sessions
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "past"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Past sessions
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <table className="min-w-full leading-normal hidden md:table">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {bookingsToDisplay && bookingsToDisplay.length > 0 ? (
                bookingsToDisplay.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {booking.tutor.user.firstName}{" "}
                        {booking.tutor.user.lastName}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {booking.subject.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {formatDate(booking.scheduledStart)}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {formatTimeRange(
                          booking.scheduledStart,
                          booking.scheduledEnd
                        )}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          booking.status === "confirmed"
                            ? "text-green-900"
                            : "text-yellow-900"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${
                            booking.status === "confirmed"
                              ? "bg-green-200"
                              : "bg-yellow-200"
                          } opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    You have no bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile Cards */}
          <div className="md:hidden">
            {bookingsToDisplay && bookingsToDisplay.length > 0 ? (
              bookingsToDisplay.map((booking) => (
                <div key={booking.id} className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      {booking.subject.name}
                    </p>
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        booking.status === "confirmed"
                          ? "text-green-900"
                          : "text-yellow-900"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 ${
                          booking.status === "confirmed"
                            ? "bg-green-200"
                            : "bg-yellow-200"
                        } opacity-50 rounded-full`}
                      ></span>
                      <span className="relative">{booking.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {booking.tutor.user.firstName} {booking.tutor.user.lastName}
                  </p>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p>{formatDate(booking.scheduledStart)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p>
                        {formatTimeRange(
                          booking.scheduledStart,
                          booking.scheduledEnd
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10">You have no bookings.</p>
            )}
          </div>
        </div>
      </div>
      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        booking={selectedBooking}
        userType="student"
        onCancel={handleCancelBooking}
        onReschedule={handleOpenRescheduleModal}
        isPast={activeTab === "past"}
      />
      <RescheduleBookingModal
        isOpen={isRescheduleModalOpen}
        onClose={handleCloseRescheduleModal}
        booking={selectedBooking}
        userType="student"
        onReschedule={handleRescheduleBooking}
      />
    </>
  );
};

export default StudentSessionsPage;
