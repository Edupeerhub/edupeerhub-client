import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConfirmedUpcomingSessions,
  fetchTutorAvailability,
  cancelBookingAvailability,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatTimeRange } from "../../utils/time";
import BookingDetailsModal from "../../components/common/BookingDetailsModal";
import { handleToastSuccess, handleToastError } from "../../utils/toastDisplayHandler";

const TutorSessionsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: upcomingSessionsData,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
    error: errorUpcoming,
  } = useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: getConfirmedUpcomingSessions,
  });

  const {
    data: completedSessionsData,
    isLoading: isLoadingCompleted,
    isError: isErrorCompleted,
    error: errorCompleted,
  } = useQuery({
    queryKey: ["completedSessions"],
    queryFn: () => fetchTutorAvailability({ status: "completed" }),
  });

  const {
    data: cancelledSessionsData,
    isLoading: isLoadingCancelled,
    isError: isErrorCancelled,
    error: errorCancelled,
  } = useQuery({
    queryKey: ["cancelledSessions"],
    queryFn: () => fetchTutorAvailability({ status: "cancelled" }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBookingAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(["upcomingSessions"]);
      queryClient.invalidateQueries(["completedSessions"]);
      queryClient.invalidateQueries(["cancelledSessions"]);
      handleToastSuccess('Booking cancelled successfully!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      handleToastError(err, 'Failed to cancel booking.');
    },
  });

  const upcomingSessions = upcomingSessionsData
    ? Array.isArray(upcomingSessionsData)
      ? upcomingSessionsData
      : [upcomingSessionsData]
    : [];

  const completedSessions = completedSessionsData
    ? Array.isArray(completedSessionsData)
      ? completedSessionsData
      : [completedSessionsData]
    : [];

  const cancelledSessions = cancelledSessionsData
    ? Array.isArray(cancelledSessionsData)
      ? cancelledSessionsData
      : [cancelledSessionsData]
    : [];

  const totalSessions =
    upcomingSessions.length +
    completedSessions.length +
    cancelledSessions.length;

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancelBooking = (cancellationReason) => {
    if (selectedSession) {
      cancelMutation.mutate({ id: selectedSession.id, cancellationReason });
    }
  };

  const handleRescheduleBooking = () => {
    console.log('Reschedule booking:', selectedSession);
    setIsModalOpen(false);
  };

  if (isLoadingUpcoming || isLoadingCompleted || isLoadingCancelled) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isErrorUpcoming || isErrorCompleted || isErrorCancelled) {
    return (
      <ErrorAlert
        message={
          errorUpcoming?.message ||
          errorCompleted?.message ||
          errorCancelled?.message
        }
      />
    );
  }

  const sessionsToDisplay =
    activeTab === "upcoming" ? upcomingSessions : completedSessions;
  const noSessionsMessage =
    activeTab === "upcoming" ? "No upcoming sessions." : "No past sessions.";

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            My Sessions
          </h1>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filter by
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border rounded-lg p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">
              {totalSessions}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <span className="hidden sm:inline">Total Sessions</span>
              <span className="sm:hidden">Total</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">
              {upcomingSessions.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <span className="hidden sm:inline">Upcoming Sessions</span>
              <span className="sm:hidden">Upcoming</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">
              {completedSessions.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <span className="hidden sm:inline">Complete Sessions</span>
              <span className="sm:hidden">Complete</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">
              {cancelledSessions.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <span className="hidden sm:inline">Cancelled Sessions</span>
              <span className="sm:hidden">Cancelled</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Sessions Table/Cards */}
        <div className="bg-white rounded-lg border">
          {/* Desktop Table Header - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
            <div>Student</div>
            <div>Subject</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
          </div>

          {/* Sessions Content */}
          <div className="divide-y divide-gray-100">
            {sessionsToDisplay.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {noSessionsMessage}
              </div>
            ) : (
              sessionsToDisplay.map((session) => (
                <div
                  key={session.id}
                  className="transition-colors hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDetails(session)}
                >
                  {/* Desktop Table Row */}
                  <div className="hidden md:grid md:grid-cols-5 gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          session.student.user.profileImageUrl ||
                          `https://ui-avatars.com/api/?name=${session.student.user.firstName}+${session.student.user.lastName}&background=random&color=fff`
                        }
                        alt={`${session.student.user.firstName} ${session.student.user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{`${session.student.user.firstName} ${session.student.user.lastName}`}</div>
                        <div className="text-xs text-gray-500">
                          {session.subject.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      {session.subject.name}
                    </div>
                    <div className="flex items-center text-gray-700">
                      {formatDate(session.scheduledStart)}
                    </div>
                    <div className="flex items-center text-gray-700">
                      {formatTimeRange(
                        session.scheduledStart,
                        session.scheduledEnd
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {session.status}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            session.student.user.profileImageUrl ||
                            `https://ui-avatars.com/api/?name=${session.student.user.firstName}+${session.student.user.lastName}&background=random&color=fff`
                          }
                          alt={`${session.student.user.firstName} ${session.student.user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{`${session.student.user.firstName} ${session.student.user.lastName}`}</div>
                          <div className="text-sm text-gray-600">
                            {session.subject.name}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {session.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <div className="text-gray-700 font-medium">
                          {formatDate(session.scheduledStart)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <div className="text-gray-700 font-medium">
                          {formatTimeRange(
                            session.scheduledStart,
                            session.scheduledEnd
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedSession}
        userType="tutor"
        onCancel={handleCancelBooking}
        onReschedule={handleRescheduleBooking}
        isPast={activeTab === 'past'}
      />
    </>
  );
};

export default TutorSessionsPage;