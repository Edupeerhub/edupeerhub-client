import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatDate, formatTimeRange, formatDuration } from '../../utils/time';
import { Link } from 'react-router-dom';

const BookingDetailsModal = ({
  booking,
  userType,
  isOpen,
  onClose,
  onCancel,
  onReschedule,
  isPast,
}) => {
  const [cancellationReason, setCancellationReason] = useState('');

  if (!isOpen || !booking) {
    return null;
  }

  const isStudent = userType === 'student';
  const otherParty = isStudent ? booking.tutor : booking.student;
  const otherPartyName = `${otherParty.user.firstName} ${otherParty.user.lastName}`;

  const handleCancel = () => {
    onCancel(cancellationReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Booking Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{isStudent ? 'Tutor' : 'Student'}</p>
              <p className="font-semibold">{otherPartyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="font-semibold">{booking.subject.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{formatDate(booking.scheduledStart)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold">
                {formatTimeRange(booking.scheduledStart, booking.scheduledEnd)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">
                {formatDuration(booking.scheduledStart, booking.scheduledEnd)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                  booking.status === 'confirmed' ? 'text-green-900' : 'text-red-900'
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 ${
                    booking.status === 'confirmed' ? 'bg-green-200' : 'bg-red-200'
                  } opacity-50 rounded-full`}
                ></span>
                <span className="relative">{booking.status}</span>
              </span>
            </div>
            {!isPast && (
              <div>
                <p className="text-sm text-gray-500">Meeting Link</p>
                <Link
                  to={`/${userType}/call/${booking.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Join Call
                </Link>
              </div>
            )}
            {!isPast && (
              <div>
                <p className="text-sm text-gray-500">Cancellation Reason</p>
                <input
                  type="text"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                />
              </div>
            )}
          </div>
        </div>

        {!isPast && (
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="btn btn-outline flex-1"
              disabled={!cancellationReason}
            >
              Cancel Booking
            </button>
            <button
              onClick={onReschedule}
              className="btn btn-primary flex-1"
            >
              Reschedule Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsModal;
