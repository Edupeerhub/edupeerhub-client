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
  const [formData, setFormData] = useState({
    scheduledStart: "",
    scheduledEnd: "",
    tutorNotes: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    const dataToSend = {
      ...formData,
      scheduledStart: new Date(formData.scheduledStart).toISOString(),
      scheduledEnd: new Date(formData.scheduledEnd).toISOString(),
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
    setFormData({
      scheduledStart: new Date(availability.scheduledStart)
        .toISOString()
        .slice(0, 16),
      scheduledEnd: new Date(availability.scheduledEnd)
        .toISOString()
        .slice(0, 16),
      tutorNotes: availability.tutorNotes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingAvailability(null);
    setFormData({
      scheduledStart: "",
      scheduledEnd: "",
      tutorNotes: "",
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
    <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto sm:p-6 bg-white shadow-md rounded-lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="scheduledStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Scheduled Start
              </label>
              <input
                type="datetime-local"
                id="scheduledStart"
                name="scheduledStart"
                value={formData.scheduledStart}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="scheduledEnd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Scheduled End
              </label>
              <input
                type="datetime-local"
                id="scheduledEnd"
                name="scheduledEnd"
                value={formData.scheduledEnd}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

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
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-500  hover:bg-gray-400 border border-gray-300 rounded-md shadow-sm"
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
