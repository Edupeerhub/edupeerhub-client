import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createBookingAvailability,
  deleteBookingAvailability,
  updateBookingAvailability,
  fetchTutorBookings,
} from "../../lib/api/common/bookingApi";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import Button from "../../components/ui/Button";
import Spinner from "../../components/common/Spinner";
import {
  formatDate,
  formatTimeRange,
  fromUtcToLocalParts,
  makeAvailabilityPayload,
} from "../../utils/time";
import ErrorAlert from "../../components/common/ErrorAlert";
import DropdownPicker from "../../components/ui/DropdownPicker";
import {
  generateDateOptions,
  generateTimeSlots,
  getAvailableEndTimes,
  calculateDuration,
} from "../../utils/time";

const TutorAvailabilityPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    scheduledStart: "",
    scheduledEnd: "",
    tutorNotes: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [editingAvailability, setEditingAvailability] = useState(null);

  const {
    data: availabilities,
    isLoading: isLoadingAvailabilities,
    isError: isErrorAvailabilities,
    error: availabilitiesError,
  } = useQuery({
    queryKey: ["tutorOpenAvailabilities"],
    queryFn: () => fetchTutorBookings({ status: "open" }),
  });

  // 🔹 Handlers
  const handleTimeChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "startTime") newData.endTime = "";
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.startTime || !formData.endTime) {
      return handleToastError(null, "Please select date, start, and end time.");
    }

    const dataToSend = makeAvailabilityPayload(
      formData.date,
      formData.startTime,
      formData.endTime,
      formData.tutorNotes
    );

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
    const { date: startDate, time: startTime } = fromUtcToLocalParts(
      availability.scheduledStart
    );
    const { time: endTime } = fromUtcToLocalParts(availability.scheduledEnd);

    setFormData({
      scheduledStart: availability.scheduledStart,
      scheduledEnd: availability.scheduledEnd,
      tutorNotes: availability.tutorNotes || "",
      date: startDate,
      startTime,
      endTime,
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

  if (isLoadingAvailabilities) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isErrorAvailabilities) {
    return <ErrorAlert error={availabilitiesError} />;
  }

  return (
    <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-6xl mx-auto p-2 sm:p-3">
      {createAvailabilityMutation.error && (
        <ErrorAlert error={createAvailabilityMutation.error} />
      )}
      <h1 className="text-2xl font-semibold mb-6 pl-2">
        Manage Your Availability
      </h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingAvailability
            ? "Edit Availability Slot"
            : "Create New Availability Slot"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Custom Date Picker */}
            <DropdownPicker
              label="Date"
              value={formData.date}
              onChange={(value) => setFormData((p) => ({ ...p, date: value }))}
              options={generateDateOptions()}
              placeholder="Select a date"
            />

            {/* Start Time Picker */}
            <DropdownPicker
              label="Start Time"
              value={formData.startTime}
              onChange={(value) => handleTimeChange("startTime", value)}
              options={generateTimeSlots()}
              placeholder="Select start time"
            />

            {/* End Time Picker */}
            <DropdownPicker
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
                {calculateDuration(formData.startTime, formData.endTime)}{" "}
                minutes
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="tutorNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tutor Notes (Optional)
            </label>
            <textarea
              id="tutorNotes"
              name="tutorNotes"
              value={formData.tutorNotes}
              onChange={(e) =>
                setFormData((p) => ({ ...p, tutorNotes: e.target.value }))
              }
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

      {/* Availabilities List */}
      <div className="mt-10 border-t-2 pt-3 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2">
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
    </div>
  );
};

export default TutorAvailabilityPage;
