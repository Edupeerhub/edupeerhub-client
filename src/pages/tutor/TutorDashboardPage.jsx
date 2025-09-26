import {
  Clock,
  Check,
  CalendarOffIcon,
  Hourglass,
  AlertCircle,
  CheckCircle2,
  Calendar1Icon,
  Users2,
  ChevronRight,
  StarsIcon,
  Calendar1,
  X,
  CalendarSyncIcon,
} from "lucide-react";
import StudentIcon from "../../assets/tutor-dashboard-icons/students.svg?react";
import RatingsIcon from "../../assets/tutor-dashboard-icons/ratings.svg?react";
import CalendarIcon from "../../assets/tutor-dashboard-icons/calendar.svg?react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../../lib/api/user/userApi";
import {
  getConfirmedUpcomingSessions,
  getPendingBookingRequests,
  updateBookingAvailabilityStatus,
} from "../../lib/api/common/bookingApi";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { formatDate, formatDuration, formatTimeRange } from "../../utils/time";
import { Link } from "react-router-dom";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";

const TutorDashboardPage = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const {
    data: upcomingSessionsData,
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
    error: errorSessions,
  } = useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: getConfirmedUpcomingSessions,
    enabled: !!user,
  });

  const {
    data: pendingBookingRequestsData,
    isLoading: isLoadingPendingRequests,
    isError: isErrorPendingRequests,
    error: errorPendingRequests,
  } = useQuery({
    queryKey: ["pendingBookingRequests"],
    queryFn: getPendingBookingRequests,
    enabled: !!user,
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ availabilityId, status }) =>
      updateBookingAvailabilityStatus(availabilityId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookingRequests"]);
      handleToastSuccess("Booking request updated successfully!");
    },
    onError: (err) => {
      handleToastError(err, "Failed to update booking request.");
    },
  });

  const upcomingSessions = upcomingSessionsData
    ? Array.isArray(upcomingSessionsData)
      ? upcomingSessionsData
      : [upcomingSessionsData]
    : [];

  const tutor = user?.tutor;

  //Modal for active state
  const handleView = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const getTutorStatus = () => {
    if (!tutor) return "pending";
    if (
      tutor.approvalStatus === "approved" &&
      user.accountStatus === "active"
    ) {
      return "active";
    }
    return tutor.approvalStatus;
  };

  const tutorStatus = getTutorStatus();

  const profileStatus = {
    pending: {
      icon: <Clock className="w-5 h-5" style={{ color: "#BB6927" }} />,
      title: "Pending Approval",
      subtitle: "Awaiting Verification",
      btnMessage: "Check Status",
      bgColor: "#F9E5D5",
      color: "#BB6927",
      sessionMessage: (
        <p className="text-sm text-gray-600">
          Sorry, there are no upcoming sessions yet until your verification is
          approved
        </p>
      ),
      sessionIcon: <CalendarOffIcon className="w-12 h-12 text-gray-400" />,
      progress: 0,
    },
    rejected: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      title: "Verification Rejected",
      subtitle: "Please check details",
      btnMessage: "Resubmit",
      bgColor: "bg-red-100",
      color: "text-red-500",
      sessionMessage: (
        <p className="text-sm text-gray-600">
          Sorry, there are no upcoming sessions yet until your verification is
          approved
        </p>
      ),
      sessionIcon: <CalendarOffIcon className="w-12 h-12 text-gray-400" />,
      progress: 0,
    },
    approved: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-900" />,
      title: "Verified Tutor",
      subtitle: "Your Profile is approved",
      btnMessage: "View Profile",
      bgColor: "bg-green-100",
      color: "text-green-900",
      sessionMessage: (
        <p className="text-sm text-gray-600">
          Your upcoming session would appear here
        </p>
      ),
      sessionIcon: <Calendar1Icon className="w-12 h-12 text-gray-400" />,
      progress: 100,
    },
    active: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-900" />,
      title: "Verified Tutor",
      subtitle: "Your Profile is approved",
      btnMessage: "View Profile",
      bgColor: "bg-green-100",
      color: "text-green-900",
      sessionMessage: (
        <div className="w-full space-y-3">
          {upcomingSessions?.map((session, i) => (
            <SessionCard key={i} session={session} />
          ))}
          <Link
            to="/tutor/availability"
            className="btn bg-white border border-gray-700 w-full rounded-full"
            style={{ hover: { backgroundColor: "#4CA1F0" } }}
          >
            Manage Schedule
          </Link>
        </div>
      ),
      progress: 100,
    },
  };

  if (isLoadingUser || isLoadingSessions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isErrorUser) {
    return <ErrorAlert message={errorUser.message} />;
  }

  if (isErrorSessions) {
    return <ErrorAlert message={errorSessions.message} />;
  }

  const {
    icon,
    title,
    subtitle,
    btnMessage,
    bgColor,
    color,
    sessionMessage,
    sessionIcon,
    progress,
  } = profileStatus[tutorStatus] || profileStatus.pending;

  const renderProfileButton = () => {
    if (tutorStatus === "pending") {
      return (
        <button
          onClick={() => window.location.reload()}
          className="btn bg-primary hover:bg-primary/80 text-white  w-full mt-4 rounded-full"
        >
          {btnMessage}
        </button>
      );
    }

    if (tutorStatus === "rejected") {
      return (
        <button disabled className="btn btn-primary w-full mt-4 rounded-full">
          {btnMessage}
        </button>
      );
    }

    return (
      <Link
        to="/tutor/profile"
        className="btn bg-primary hover:bg-primary/80 text-white w-full mt-4 rounded-full"
      >
        {btnMessage}
      </Link>
    );
  };

  return (
    <>
      <div className="p-2 space-y-4 w-full max-w-[420px] sm:max-w-xl md:max-w-6xl mx-auto">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-2 md:space-y-6">
            <h1 className="text-2xl md:mb-4 font-semibold">
              Welcome back, {user?.firstName || "Tutor"}
            </h1>

            {/* Status-specific Layout */}
            {tutorStatus === "pending" && <PendingLayout />}
            {tutorStatus === "rejected" && <RejectedLayout />}
            {tutorStatus === "approved" && <ApprovedLayout />}
            {tutorStatus === "active" && (
              <ActiveLayout
                tutor={tutor}
                upcomingSessions={upcomingSessions}
                pendingRequests={pendingBookingRequestsData}
                handleView={handleView}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 flex flex-col">
            {/* Profile Status */}
            <div className="bg-white rounded-lg border shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Profile Status</h2>
              <div
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  tutorStatus === "approved" || tutorStatus === "active"
                    ? "bg-green-100"
                    : ""
                }`}
                style={
                  tutorStatus === "pending"
                    ? { backgroundColor: bgColor, color: color }
                    : {}
                }
              >
                {icon}
                <div>
                  <p
                    className={`font-semibold ${
                      tutorStatus === "approved" || tutorStatus === "active"
                        ? "text-green-900"
                        : ""
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-xs text-gray-600">{subtitle}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Profile Completion</p>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#4CA1F0",
                    }}
                  ></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Education Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {tutorStatus === "approved" || tutorStatus === "active" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-red-500" />
                    )}
                    <span>Background Check</span>
                  </div>
                </div>

                {renderProfileButton()}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg border shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              {tutorStatus === "active" && upcomingSessions.length > 0 ? (
                sessionMessage
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  {sessionIcon}
                  <div className="mt-4">{sessionMessage}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ViewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        session={selectedSession}
        updateBookingStatusMutation={updateBookingStatusMutation}
      />
    </>
  );
};

export default TutorDashboardPage;

function PendingLayout() {
  return (
    <div className="bg-white rounded-lg border shadow p-8 flex flex-col justify-center items-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
        <Hourglass className="w-8 h-8 text-orange-600" />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">Verification in progress</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          We are currently reviewing your verification request. This helps us
          keep the platform secure for all users. You'll receive a notification
          as soon as the process is complete.
        </p>
      </div>
    </div>
  );
}

function RejectedLayout() {
  return (
    <div className="bg-white rounded-lg border shadow p-8 flex flex-col justify-center items-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">Verification Rejected</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unfortunately, we couldn't approve your verification request at this
          time. This may be due to unclear documents or information mismatch.
          Please review the details and resubmit.
        </p>
      </div>
    </div>
  );
}

function ApprovedLayout() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <StudentIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarSyncIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Weekly Sessions</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <RatingsIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Ratings</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Booking Requests */}
      <div className="bg-white rounded-lg border shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Booking Requests</h2>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Calendar1Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              No booking requests yet
            </h3>
            <p className="text-gray-600 text-sm">
              Your requests will appear here once students start booking
              sessions with you
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm">You do not have any recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveLayout({
  tutor,
  upcomingSessions,
  pendingRequests,
  handleView,
}) {
  const pendingBookingRequests = pendingRequests
    ? Array.isArray(pendingRequests)
      ? pendingRequests
      : [pendingRequests]
    : [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <StudentIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">{tutor?.students?.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Weekly Sessions</p>
          <p className="text-2xl font-bold">{tutor?.weeklySessions || 0}</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <RatingsIcon />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Ratings</p>
          <p className="text-2xl font-bold">{tutor?.rating || 0}</p>
        </div>
      </div>

      {/* Booking Requests */}
      <div className="bg-white rounded-lg border shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Booking Requests</h2>
          <Link
            to="/tutor/booking-requests"
            className="text-primary text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium">
                  Student
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden sm:table-cell">
                  Subject
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium hidden md:table-cell">
                  Time
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingBookingRequests?.length > 0 ? (
                pendingBookingRequests.map((session, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-2">
                      <BookingCard session={session} />
                    </td>
                    <td className="py-3 px-2 text-sm hidden sm:table-cell">
                      {session.subject.name}
                    </td>
                    <td className="py-3 px-2 text-sm hidden md:table-cell">
                      {formatDate(session.scheduledStart)}
                    </td>
                    <td className="py-3 px-2 text-sm hidden md:table-cell">
                      {formatTimeRange(
                        session.scheduledStart,
                        session.scheduledEnd
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleView(session)}
                        className="text-primary hover:underline font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No pending booking requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Completed session with Chima Eke on integration and
                differentiation
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar1 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm">New booking request from Yinka Doe</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3 w-full">
      <div className="flex items-center gap-3">
        <img
          src={session.student.user.profileImageUrl}
          alt={`${session.student.user.firstName} profile`}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium text-sm">{`${session.student.user.firstName} ${session.student.user.lastName}`}</p>
          <p className="text-xs text-gray-500">{session.subject.name}</p>
          <p className="text-xs text-gray-500">
            {formatDuration(session.scheduledStart, session.scheduledEnd)}
          </p>
        </div>
      </div>
      <button
        className="btn btn-sm rounded-full"
        style={{ backgroundColor: "#E6F4EA", color: "#34A853" }}
      >
        Confirmed
      </button>
    </div>
  );
}

function BookingCard({ session }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={session.student.user.profileImageUrl}
        alt={`${session.student.user.firstName} profile`}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium">{`${session.student.user.firstName} ${session.student.user.lastName}`}</p>
      </div>
    </div>
  );
}

function ViewModal({ isOpen, onClose, session, updateBookingStatusMutation }) {
  const [status, setStatus] = useState(null);

  const handleClose = () => {
    setStatus(null);
    onClose();
  };

  const handleAccept = () => {
    updateBookingStatusMutation.mutate(
      { availabilityId: session.id, status: "confirmed" },
      {
        onSuccess: () => {
          setStatus("accepted");
        },
        onError: (err) => {
          handleToastError(err, "Failed to accept booking request.");
        },
      }
    );
  };

  const handleDecline = () => {
    updateBookingStatusMutation.mutate(
      { availabilityId: session.id, status: "open" },
      {
        onSuccess: () => {
          setStatus("rejected");
        },
        onError: (err) => {
          handleToastError(err, "Failed to decline booking request.");
        },
      }
    );
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {status ? (
          <>
            {status === "accepted" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Request Accepted
                  </h3>
                  <p className="text-sm text-gray-600">
                    You've accepted a booking request from{" "}
                    {`${session.student.user.firstName} ${session.student.user.lastName}`}
                    . A notification has been sent.
                  </p>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => {
                    handleClose();
                  }}
                  style={{ backgroundColor: "#4CA1F0", color: "white" }}
                >
                  Done
                </button>
              </div>
            )}
            {status === "rejected" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Request Declined
                  </h3>
                  <p className="text-sm text-gray-600">
                    You've declined the booking request from{" "}
                    {`${session.student.user.firstName} ${session.student.user.lastName}`}
                    .
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      handleClose();
                    }}
                    style={{ backgroundColor: "#4CA1F0", color: "white" }}
                  >
                    Done
                  </button>
                  <button className="btn btn-outline w-full">
                    Report a Problem
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <BookingCard session={session} />
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Date & Time</h4>
              <p className="text-sm font-semibold">
                Date: {formatDate(session.scheduledStart)}
              </p>
              <p className="text-sm text-gray-600">
                {formatTimeRange(session.scheduledStart, session.scheduledEnd)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="btn btn-primary flex-1"
                style={{ backgroundColor: "#4CA1F0", color: "white" }}
              >
                Accept Request
              </button>
              <button
                onClick={handleDecline}
                className="btn btn-outline flex-1"
              >
                Decline
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
