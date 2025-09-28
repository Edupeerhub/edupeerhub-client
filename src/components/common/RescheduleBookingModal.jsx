import React, { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { rescheduleBooking } from "../../lib/api/common/bookingApi";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import DropdownPicker from "../../components/ui/DropdownPicker";
import {
  generateDateOptions,
  generateTimeSlots,
  getAvailableEndTimes,
  calculateDuration,
} from "../../utils/time";

const RescheduleBookingModal = ({ booking, isOpen, onClose, onReschedule }) => {
  const [date, setDate] = useState("");
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

  // 🔹 Handler for time changes
  const handleTimeChange = (field, value) => {
    if (field === "startTime") {
      setStartTime(value);
      setEndTime(""); // Reset end time when start time changes
    } else {
      setEndTime(value);
    }
  };

  const handleReschedule = () => {
    if (!date || !startTime || !endTime) {
      handleToastError(null, "Please select a date, start time, and end time.");
      return;
    }

    // Create dates in user's local timezone
    const newScheduledStart = new Date(`${date}T${startTime}:00`);
    const newScheduledEnd = new Date(`${date}T${endTime}:00`);

    rescheduleBookingMutation.mutate({
      scheduledStart: newScheduledStart, // Send Date object
      scheduledEnd: newScheduledEnd, // Send Date object
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
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
          {/* Date Picker */}
          <DropdownPicker
            label="Date"
            value={date}
            onChange={setDate}
            options={generateDateOptions()}
            placeholder="Select a date"
          />

          {/* Time Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownPicker
              label="Start Time"
              value={startTime}
              onChange={(value) => handleTimeChange("startTime", value)}
              options={generateTimeSlots()}
              placeholder="Select start time"
            />

            <DropdownPicker
              label="End Time"
              value={endTime}
              onChange={(value) => handleTimeChange("endTime", value)}
              options={getAvailableEndTimes(startTime)}
              disabled={!startTime}
              placeholder={
                startTime ? "Select end time" : "Select start time first"
              }
            />
          </div>

          {/* Duration Display */}
          {startTime && endTime && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Session Duration: {calculateDuration(startTime, endTime)}{" "}
                minutes
              </p>
            </div>
          )}
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
