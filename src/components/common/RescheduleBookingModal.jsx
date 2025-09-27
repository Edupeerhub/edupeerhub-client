import React, { useState } from "react";
import { X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMutation } from "@tanstack/react-query";
import { rescheduleBooking } from "../../lib/api/common/bookingApi";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";

const RescheduleBookingModal = ({ booking, isOpen, onClose, onReschedule }) => {
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const rescheduleBookingMutation = useMutation({
    mutationFn: (data) => rescheduleBooking(booking.id, data),
    onSuccess: () => {
      handleToastSuccess("Booking rescheduled successfully!");
      onClose();
      onReschedule();
    },
    onError: (err) => {
      handleToastError(err, "Failed to reschedule booking.");
    },
  });

  if (!isOpen || !booking) {
    return null;
  }

  const handleReschedule = () => {
    if (!date || !startTime || !endTime) {
      handleToastError(null, "Please select a date, start time, and end time.");
      return;
    }
    const newScheduledStart = new Date(
      `${date.toISOString().split("T")[0]}T${startTime}:00`
    );
    const newScheduledEnd = new Date(
      `${date.toISOString().split("T")[0]}T${endTime}:00`
    );

    rescheduleBookingMutation.mutate({
      scheduledStart: newScheduledStart,
      scheduledEnd: newScheduledEnd,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Reschedule Booking</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <DayPicker mode="single" selected={date} onSelect={setDate} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            className="btn btn-primary btn-primary-focus text-white"
            disabled={!date || !startTime || !endTime}
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBookingModal;
