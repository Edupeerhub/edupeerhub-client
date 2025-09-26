import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createBookingAvailability,
  cancelBookingAvailability,
  deleteBookingAvailability,
  updateBookingAvailability,
  fetchTutorAvailability,
} from "../../lib/api/common/bookingApi";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/common/Spinner";
import { formatDate, formatTimeRange } from "../../utils/time";
import { X } from "lucide-react";
import Modal from "../../components/ui/Modal";
import ErrorAlert from "../../components/common/ErrorAlert";

const TutorAvailabilityPage = () => {
  const queryClient = useQueryClient();

  // Keep your existing form data structure with helper fields for UI
  const [formData, setFormData] = useState({
    scheduledStart: "",
    scheduledEnd: "",
    tutorNotes: "",
    // Helper fields for the custom time picker UI
    date: "",
    startTime: "",
    endTime: "",
  });

  const [editingAvailability, setEditingAvailability] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [availabilityToCancel, setAvailabilityToCancel] = useState(null);

  const {
    data: availabilities,
    isLoading: isLoadingAvailabilities,
    isError: isErrorAvailabilities,
    error: availabilitiesError,
  } = useQuery({
    queryKey: ["tutorOpenAvailabilities"],
    queryFn: () => fetchTutorAvailability({ status: "open" }),
  });

  // Custom TimePicker Component
  const TimePicker = ({
    label,
    value,
    onChange,
    options,
    disabled,
    placeholder,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-left ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {value ? (
              new Date(`2000-01-01T${value}`).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              ⏰
            </span>
          </button>

          {isOpen && !disabled && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {isOpen && !disabled && (
          <div className="fixed inset-0 z-5" onClick={() => setIsOpen(false)} />
        )}
      </div>
    );
  };

  // Time slot generator (every 15 minutes from 6 AM to 10 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = new Date(
          `2000-01-01T${timeString}`
        ).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        slots.push({ value: timeString, label: displayTime });
      }
    }
    return slots;
  };

  // Generate available end times (15 min to 1 hour after start)
  const getAvailableEndTimes = (startTime) => {
    if (!startTime) return [];

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;

    const endTimes = [];

    for (let duration = 15; duration <= 60; duration += 15) {
      const endTotalMinutes = startTotalMinutes + duration;

      if (endTotalMinutes >= 22 * 60) break; // Don't allow sessions past 10 PM

      const endHour = Math.floor(endTotalMinutes / 60);
      const endMinute = endTotalMinutes % 60;
      const timeString = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = new Date(
        `2000-01-01T${timeString}`
      ).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      endTimes.push({
        value: timeString,
        label: `${displayTime} (${duration} min session)`,
      });
    }

    return endTimes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle time changes for custom time picker
  const handleTimeChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Clear end time if start time changes
      if (field === "startTime") {
        newData.endTime = "";
      }

      return newData;
    });
  };

  const createAvailabilityMutation = useMutation({
    mutationFn: createBookingAvailability,
    onSuccess: () => {
      handleToastSuccess("Availability added successfully!");
      queryClient.invalidateQueries(["tutorOpenAvailabilities"]);
      setFormData({
        scheduledStart: "",
        scheduledEnd: "",
        tutorNotes: "",
        date: "",
        startTime: "",
        endTime: "",
      });
    },
    onError: (err) => {
      handleToastError(err, "Failed to add availability.");
    },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: ({ availabilityId, updateData }) =>
      updateBookingAvailability(availabilityId, updateData),
    onSuccess: () => {
      handleToastSuccess("Availability updated successfully!");
      queryClient.invalidateQueries(["tutorOpenAvailabilities"]);
      setEditingAvailability(null);
      setFormData({
        scheduledStart: "",
        scheduledEnd: "",
        tutorNotes: "",
        date: "",
        startTime: "",
        endTime: "",
      });
    },
    onError: (err) => {
      handleToastError(err, "Failed to update availability.");
    },
  });

  const cancelAvailabilityMutation = useMutation({
    mutationFn: ({ id, cancellationReason }) =>
      cancelBookingAvailability(id, cancellationReason),
    onSuccess: () => {
      handleToastSuccess("Availability cancelled successfully!");
      queryClient.invalidateQueries(["tutorOpenAvailabilities"]);
    },
    onError: (err) => {
      handleToastError(err, "Failed to cancel availability.");
    },
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: deleteBookingAvailability,
    onSuccess: () => {
      handleToastSuccess("Availability deleted successfully!");
      queryClient.invalidateQueries(["tutorOpenAvailabilities"]);
    },
    onError: (err) => {
      handleToastError(err, "Failed to delete availability.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use your existing API field names
    const dataToSend = {
      scheduledStart: new Date(
        `${formData.date}T${formData.startTime}`
      ).toISOString(),
      scheduledEnd: new Date(
        `${formData.date}T${formData.endTime}`
      ).toISOString(),
      tutorNotes: formData.tutorNotes,
    };

    if (editingAvailability) {
      updateAvailabilityMutation.mutate({
        availabilityId: editingAvailability.id,
        updateData: dataToSend,
      });
    } else {
      createAvailabilityMutation.mutate(dataToSend);
    }
  };

  const handleEdit = (availability) => {
    setEditingAvailability(availability);
    const startDate = new Date(availability.scheduledStart);
    const endDate = new Date(availability.scheduledEnd);

    setFormData({
      scheduledStart: availability.scheduledStart,
      scheduledEnd: availability.scheduledEnd,
      tutorNotes: availability.tutorNotes || "",
      // Helper fields for UI
      date: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
    });
  };

  const handleCancelEdit = () => {
    setEditingAvailability(null);
    setFormData({
      scheduledStart: "",
      scheduledEnd: "",
      tutorNotes: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleCancelAvailability = (id) => {
    setAvailabilityToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (availabilityToCancel && cancellationReason) {
      cancelAvailabilityMutation.mutate({
        id: availabilityToCancel,
        cancellationReason,
      });
      setIsCancelModalOpen(false);
      setCancellationReason("");
      setAvailabilityToCancel(null);
    }
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancellationReason("");
    setAvailabilityToCancel(null);
  };

  if (isLoadingAvailabilities) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isErrorAvailabilities) {
    return <ErrorAlert message={availabilitiesError.message} />;
  }

  return (
    <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-2 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Manage Your Availability</h1>
      {createAvailabilityMutation.error && (
        <ErrorAlert message={createAvailabilityMutation.error.message} />
      )}

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingAvailability
            ? "Edit Availability Slot"
            : "Create New Availability Slot"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Start Time Picker */}
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(value) => handleTimeChange("startTime", value)}
              options={generateTimeSlots()}
              placeholder="Select start time"
            />

            {/* End Time Picker */}
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(value) => handleTimeChange("endTime", value)}
              options={getAvailableEndTimes(formData.startTime)}
              disabled={!formData.startTime}
              placeholder={
                formData.startTime
                  ? "Select end time"
                  : "Select start time first"
              }
            />
          </div>

          {formData.startTime && formData.endTime && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Session Duration:{" "}
                {(() => {
                  const [startHour, startMinute] = formData.startTime
                    .split(":")
                    .map(Number);
                  const [endHour, endMinute] = formData.endTime
                    .split(":")
                    .map(Number);
                  const duration =
                    endHour * 60 + endMinute - (startHour * 60 + startMinute);
                  return `${duration} minutes`;
                })()}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="tutorNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tutor Notes (Required)
            </label>
            <textarea
              id="tutorNotes"
              name="tutorNotes"
              value={formData.tutorNotes}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Available for advanced topics in Algebra."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            {editingAvailability && (
              <Button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-500 hover:bg-gray-400 border border-gray-300 rounded-md shadow-sm"
              >
                Cancel Edit
              </Button>
            )}
            <Button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={
                createAvailabilityMutation.isLoading ||
                updateAvailabilityMutation.isLoading
              }
            >
              {editingAvailability ? (
                updateAvailabilityMutation.isLoading ? (
                  <Spinner size="small" />
                ) : (
                  "Update Availability"
                )
              ) : createAvailabilityMutation.isLoading ? (
                <Spinner size="small" />
              ) : (
                "Add Availability"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Current Availabilities
        </h2>
        {availabilities?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No availabilities set yet. Add one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availabilities?.map((availability) => (
              <div
                key={availability.id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(availability.scheduledStart)}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        availability.status === "open"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {availability.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatTimeRange(
                      availability.scheduledStart,
                      availability.scheduledEnd
                    )}
                  </p>
                  {availability.tutorNotes && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Notes: {availability.tutorNotes}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    onClick={() => handleEdit(availability)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </Button>
                  {availability.status === "open" && (
                    <Button
                      onClick={() => handleCancelAvailability(availability.id)}
                      className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      disabled={cancelAvailabilityMutation.isLoading}
                    >
                      {cancelAvailabilityMutation.isLoading ? (
                        <Spinner size="small" />
                      ) : (
                        "Cancel"
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      deleteAvailabilityMutation.mutate(availability.id)
                    }
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={deleteAvailabilityMutation.isLoading}
                  >
                    {deleteAvailabilityMutation.isLoading ? (
                      <Spinner size="small" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        title="Cancel Availability"
      >
        <div className="p-4">
          <label
            htmlFor="cancellationReason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Cancellation
          </label>
          <textarea
            id="cancellationReason"
            name="cancellationReason"
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Please provide a reason for canceling this availability."
          ></textarea>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleCloseCancelModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              disabled={
                !cancellationReason || cancelAvailabilityMutation.isLoading
              }
            >
              {cancelAvailabilityMutation.isLoading ? (
                <Spinner size="small" />
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TutorAvailabilityPage;
