import useAuthUser from "../../hooks/auth/useAuthUser";
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
} from "lucide-react";
import Yinka from "../../assets/images/students-image/student-image-1.jpg";
import Chima from "../../assets/images/students-image/student-image-2.jpg";
import Eze from "../../assets/images/students-image/student-image-3.jpg";
import { useState } from "react";

const TutorDashboardPage = () => {
  const { authUser } = useAuthUser();
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  //Modal for active state
  const handleView = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const tutor = {
    status: "active", // "pending" | "rejected" | "approved" | "active"
    progress: 82,
    bookings: [],
    upcomingSessions: [
      {
        name: "Yinka Doe",
        subject: "Mathematics",
        exam: "SS3/UTME",
        date: "Sept. 10, 2025",
        time: "2hrs, 30min",
        timehrs: "2:30pm",
        image: Yinka,
      },
      {
        name: "Chima Eke",
        subject: "English",
        exam: "SS3/UTME",
        date: "Sept. 15, 2025",
        time: "2hrs",
        timehrs: "1:00pm",
        image: Chima,
      },
      {
        name: "Eze Victor",
        subject: "Government",
        exam: "SS3/UTME",
        time: "1hr, 30min",
        timehrs: "1:30pm",
        date: "Sept. 16, 2025",
        image: Eze,
      },
    ],
  };

  const profileStatus = {
    pending: {
      icon: <Clock className="w-5 h-5 text-red-500" />,
      title: "Pending Approval",
      subtitle: "Awaiting Verification",
      btnMessage: "Check Status",
      bgColor: "bg-red-100",
      color: "text-red-500",
      sessionMessage: (
        <p className="text-sm text-gray-600">
          Sorry, there are no upcoming sessions yet until your verification is
          approved
        </p>
      ),
      sessionIcon: <CalendarOffIcon className="w-12 h-12 text-gray-400" />,
      progress: tutor.progress,
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
      progress: tutor.progress,
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
          {tutor.upcomingSessions.map((session, i) => (
            <SessionCard key={i} {...session} />
          ))}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
            Manage Schedule
          </button>
        </div>
      ),
      progress: 100,
    },
  };

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
  } = profileStatus[tutor.status] || profileStatus.pending;

  return (
    <>
      <div className="p-2 space-y-4 w-full max-w-[420px] sm:max-w-xl md:max-w-6xl mx-auto">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-2 md:space-y-6">
            <h1 className="text-2xl md:mb-4 font-semibold">
              Welcome back, {authUser?.firstName || "Tutor"}
            </h1>

            {/* Status-specific Layout */}
            {tutor.status === "pending" && <PendingLayout />}
            {tutor.status === "rejected" && <RejectedLayout />}
            {tutor.status === "approved" && <ApprovedLayout />}
            {tutor.status === "active" && (
              <ActiveLayout tutor={tutor} handleView={handleView} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 flex flex-col">
            {/* Profile Status */}
            <div className="bg-white rounded-lg border shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Profile Status</h2>
              <div
                className={`flex items-center gap-3 rounded-lg p-3 ${bgColor}`}
              >
                {icon}
                <div>
                  <p className={`font-semibold ${color}`}>{title}</p>
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
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
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
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>Background Check</span>
                  </div>
                </div>

                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
                  {btnMessage}
                </button>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg border shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              {tutor.status === "active" &&
              tutor.upcomingSessions.length > 0 ? (
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users2 className="w-5 h-5 text-blue-600" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar1Icon className="w-5 h-5 text-blue-600" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Weekly Sessions</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <StarsIcon className="w-5 h-5 text-blue-600" />
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
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <Calendar1Icon className="w-8 h-8 text-blue-600" />
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
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">You do not have any recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveLayout({ tutor, handleView }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users2 className="w-5 h-5 text-blue-600" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar1Icon className="w-5 h-5 text-blue-600" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Weekly Sessions</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <StarsIcon className="w-5 h-5 text-blue-600" />
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
              {tutor.upcomingSessions.map((session, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 px-2">
                    <BookingCard {...session} />
                  </td>
                  <td className="py-3 px-2 text-sm hidden sm:table-cell">
                    {session.subject}
                  </td>
                  <td className="py-3 px-2 text-sm hidden md:table-cell">
                    {session.date}
                  </td>
                  <td className="py-3 px-2 text-sm hidden md:table-cell">
                    {session.timehrs}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleView(session)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar1 className="w-5 h-5 text-blue-600" />
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

function SessionCard({ name, subject, time, image }) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3 w-full">
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={`${name} profile`}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-gray-500">{subject}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors">
        Confirmed
      </button>
    </div>
  );
}

function BookingCard({ name, image, exam }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={image}
        alt={`${name} profile`}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{exam}</p>
      </div>
    </div>
  );
}

function ViewModal({ isOpen, onClose, session }) {
  const [status, setStatus] = useState(null);

  const handleClose = () => {
    setStatus(null);
    onClose();
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
                    You've accepted a booking request from {session.name}. A
                    notification has been sent.
                  </p>
                </div>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
                  onClick={handleClose}
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
                    You've declined the booking request from {session.name}.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleClose}
                  >
                    Undo
                  </button>
                  <button className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Report a Problem
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <BookingCard {...session} />
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Date & Time</h4>
              <p className="text-sm font-semibold">Date: {session.date}</p>
              <p className="text-sm text-gray-600">{session.timehrs}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStatus("accepted")}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Accept Request
              </button>
              <button
                onClick={() => setStatus("rejected")}
                className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
