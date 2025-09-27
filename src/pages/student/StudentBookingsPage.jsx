
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUpcomingSession,
  cancelBookingAvailability,
} from '../../lib/api/common/bookingApi';
import Spinner from '../../components/common/Spinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatDate, formatTimeRange } from '../../utils/time';
import BookingDetailsModal from '../../components/common/BookingDetailsModal';
import { handleToastSuccess, handleToastError } from '../../utils/toastDisplayHandler';

const StudentBookingsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['studentBookings'],
    queryFn: getUpcomingSession, // This will likely need to be changed to a new function to get all bookings
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBookingAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(['studentBookings']);
      handleToastSuccess('Booking cancelled successfully!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      handleToastError(err, 'Failed to cancel booking.');
    },
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.id);
    }
  };

  const handleRescheduleBooking = () => {
    console.log('Reschedule booking:', selectedBooking);
    setIsModalOpen(false);
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
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
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
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {booking.tutor.user.firstName} {booking.tutor.user.lastName}
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
                        {formatTimeRange(booking.scheduledStart, booking.scheduledEnd)}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          booking.status === 'confirmed'
                            ? 'text-green-900'
                            : 'text-yellow-900'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${
                            booking.status === 'confirmed'
                              ? 'bg-green-200'
                              : 'bg-yellow-200'
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
        </div>
      </div>
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        userType="student"
        onCancel={handleCancelBooking}
        onReschedule={handleRescheduleBooking}
      />
    </>
  );
};

export default StudentBookingsPage;
