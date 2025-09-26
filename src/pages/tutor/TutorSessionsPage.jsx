import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getConfirmedUpcomingSessions,
  fetchTutorAvailability,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatTimeRange } from "../../utils/time";

const TutorSessionsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

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
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">My Sessions</h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter by
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {totalSessions}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Total Sessions
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {upcomingSessions.length}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Upcoming Sessions
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {completedSessions.length}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Complete Sessions
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {cancelledSessions.length}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Cancelled Sessions
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
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

      {/* Sessions Table */}
      <div className="bg-white rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
          <div>Student</div>
          <div>Subject</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {sessionsToDisplay.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {noSessionsMessage}
            </div>
          ) : (
            sessionsToDisplay.map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSessionsPage;
