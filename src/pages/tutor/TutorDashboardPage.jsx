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
      icon: <Clock className="mt-2 text-red-500" />,
      title: "Pending Approval",
      subtitle: "Awaiting Verification",
      btnMessage: "Check Status",
      bgColor: "bg-red-100",
      color: "text-red-500",
      sessionMessage: (
        <p className="text-[11px] pt-3">
          Sorry, there are no upcoming sessions yet until your verification is
          approved
        </p>
      ),
      sessionIcon: <CalendarOffIcon className="text-accent" />,
      progress: tutor.progress,
    },
    rejected: {
      icon: <AlertCircle className="mt-2 text-red-500" />,
      title: "Verification Rejected",
      subtitle: "Please check details",
      btnMessage: "Resubmit",
      bgColor: "bg-red-100",
      color: "text-red-500",
      sessionMessage: (
        <p className="text-[11px] pt-3">
          Sorry, there are no upcoming sessions yet until your verification is
          approved
        </p>
      ),
      sessionIcon: <CalendarOffIcon className="text-accent" />,
      progress: tutor.progress,
    },
    approved: {
      icon: <CheckCircle2 className="mt-2 text-green-900" />,
      title: "Verified Tutor",
      subtitle: "Your Profile is approved",
      btnMessage: "View Profile",
      bgColor: "bg-blue-200",
      color: "text-green-900",
      sessionMessage: (
        <p className="text-[11px] pt-3">
          Your upcoming session would appear here
        </p>
      ),
      sessionIcon: <Calendar1Icon className="text-accent" />,
      progress: 100,
    },
    active: {
      icon: <CheckCircle2 className="mt-2 text-green-900" />,
      title: "Verified Tutor",
      subtitle: "Your Profile is approved",
      btnMessage: "View Profile",
      bgColor: "bg-blue-200",
      color: "text-green-900",
      sessionMessage: (
        <div className="w-full mt-[-20px] flex flex-col items-center gap-1 text-[12px]">
          {tutor.upcomingSessions.map((session, i) => (
            <SessionCard key={i} {...session} />
          ))}
          <button className="mt-1 shadow-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-full font-semibold w-full">
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
      <div className="mr-96 mb-4">
        <h1 className="font-bold">
          Welcome Back, {authUser?.firstName || "Tutor"}
        </h1>
        <p className="text-[12px]">Manage all your tutoring sessions here</p>
      </div>

      <div className="flex gap-4 h-full">
        {/* Left side (always 2/3 width) */}
        <div className="w-2/3">
          {tutor.status === "pending" && <PendingLayout />}
          {tutor.status === "rejected" && <RejectedLayout />}
          {tutor.status === "approved" && <ApprovedLayout />}
          {tutor.status === "active" && <ActiveLayout tutor={tutor} handleView={handleView} />}
        </div>

        {/* Right side (always 1/3 width) */}
        <div className="w-1/3 mt-[-30px]">
          <div className="border rounded-md p-3 shadow-md text-sm">
            <p className="font-bold mb-2">Profile Status</p>
            <div
              className={`flex items-center text-nowrap text-[12px] 
              gap-2 rounded-md p-2 ${bgColor}`}
            >
              {icon}
              <span>
                <p className={`font-bold ${color}`}>{title}</p>
                <p className="text-[8px]">{subtitle}</p>
              </span>
            </div>

            <p className="pt-2 text-[12px] mb-[-2px]">Profile Completion</p>
            <span className="flex gap-2">
              <progress
                value={progress}
                max={100}
                className="w-4/5 pt-2.5 mb-1.5 text-primary 
                [&::-webkit-progress-bar]:bg-gray-500
                [&::-webkit-progress-value]:bg-current
                [&::-moz-progress-bar]:bg-current"
              ></progress>
              <p className="text-[10px] mt-1">{progress}%</p>
            </span>

            <span className="list-none flex gap-2 mt-1 text-[12px]">
              <Check className="w-4 pb-1" />
              <li>Identity Verified</li>
            </span>
            <span className="list-none flex gap-2 mt-1 text-[12px]">
              <Check className="w-4 pb-1" />
              <li>Education Verified</li>
            </span>
            <span className="list-none flex gap-2 mt-1 text-[12px]">
              <Clock className="w-4 pb-1 text-red-500" />
              <li>Background Check</li>
            </span>

            <button className="mt-2 shadow-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-full font-semibold w-full">
              {btnMessage}
            </button>
          </div>

          <div className="mt-3 border shadow-md rounded-md text-sm">
            <p className="font-bold m-2">Upcoming sessions</p>
            <span className="flex flex-col mt-7 m-2 text-center items-center">
              {sessionIcon}
              {sessionMessage}
            </span>
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
    <>
      <div className="h-2/3 border rounded-md shadow-md flex flex-col justify-center items-center">
        <Hourglass className="rounded-full p-1 bg-red-300 text-accent" />
        <div className="w-1/2 text-center text-[12px] ">
          <h1 className="font-bold text-xl p-2">Verification in progress</h1>
          <p>
            We are currently reviewing your verification request. This helps us
            keep the platform secure for all users. you'll receive a
            notification as soon as the process is complete
          </p>
        </div>
      </div>
    </>
  );
}

function RejectedLayout() {
  return (
    <>
      <div className="h-2/3 border rounded-md shadow-md flex flex-col justify-center items-center">
        <Hourglass className="rounded-full p-1 bg-red-300 text-accent" />
        <div className="w-1/2 text-center text-[12px] ">
          <h1 className="font-bold text-xl p-2">Verification Rejected</h1>
          <p>
            Unfortunately, we couldn't approve your verification request at this
            time, this may be due to unclear document or information mismatch.
            please review the details and resubmit
          </p>
        </div>
      </div>
    </>
  );
}

function ApprovedLayout() {
  return (
    <>
      <div>
        <div className="w-full flex gap-3">
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <Users2 className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Total Students</p>
            <p className="pt-1">0</p>
          </div>
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <Calendar1Icon className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Weekly Sessions</p>
            <p className="pt-1">0</p>
          </div>
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <StarsIcon className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Ratings</p>
            <p className="pt-1">0</p>
          </div>
        </div>

        <div className="mt-3 p-2 border rounded-md shadow-sm">
          <p className="p-2 font-bold">Booking Requests</p>
          <div className="h-60 border rounded-md shadow-md flex flex-col justify-center items-center">
            <Calendar1Icon className="rounded-full p-1 bg-primary text-accent" />
            <div className="w-1/2 text-center text-[12px] ">
              <h1 className="font-bold text-xl p-2">No booking requests yet</h1>
              <p>
                Your request will appear here once students start booking
                sessions with you
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 border rounded-md shadow-sm">
          <p className="p-2 font-bold">Recent Activity</p>
          <div className="h-14 border rounded-md shadow-md flex gap-3 items-center pl-8">
            <AlertCircle className="rounded-full p-1 bg-primary text-accent" />
            <div className="w-1/2 text-[12px] ">
              <p>You do not have any recent activities</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveLayout({ tutor, handleView }) {
  const tableHeaders = ["Student", "Subject", "Date", "Time", "Action"];
  return (
    <>
      <div>
        <div className="w-full flex gap-3">
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <Users2 className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Total Students</p>
            <p className="pt-1">0</p>
          </div>
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <Calendar1Icon className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Weekly Sessions</p>
            <p className="pt-1">0</p>
          </div>
          <div className="w-56 p-5 text-[10px] border rounded-md shadow-md">
            <span className="flex justify-between mb-3">
              <StarsIcon className="rounded-full p-1 bg-blue-300 text-blue-800" />
              <ChevronRight className=" pb-3" />
            </span>
            <p>Ratings</p>
            <p className="pt-1">0</p>
          </div>
        </div>

        <div className="mt-3 p-2 border rounded-md shadow-sm">
          <p className="p-2 font-bold">Booking Requests</p>
          <div className="h-60 border rounded-md shadow-md flex flex-col">
            <table>
              <thead>
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} className="text-sm border-b px-4 py-3">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tutor.upcomingSessions.map((s, i) => (
                  <tr key={i} className="text-center text-sm">
                    <td>
                      <div>
                        <BookingCard key={i} {...s} />
                      </div>
                    </td>
                    <td>{s.subject}</td>
                    <td>{s.date}</td>
                    <td>{s.timehrs}</td>
                    <td>
                      <button onClick={() => handleView(s)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 p-2 border rounded-md shadow-sm">
          <p className="p-2 font-bold">Recent Activity</p>
          <div className="h-14 border rounded-md shadow-md flex gap-3 items-center pl-8">
            <Check className="rounded-full p-1 bg-blue-200 text-blue-500" />
            <div className="w-full text-[12px] ">
              <p>
                Completed session with chima eke on integration and
                differentiation
              </p>
              <p className="text-gray-500 text-[8px]">2 hours ago</p>
            </div>
          </div>

          <div className="h-14 border rounded-md shadow-md flex gap-3 items-center pl-8">
            <Calendar1 className="rounded-full p-1 bg-blue-200 text-blue-500" />
            <div className="w-full text-[12px] ">
              <p>New booking request from Yinka Doe</p>
              <p className="text-gray-500 text-[8px]">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SessionCard({ name, subject, time, image }) {
  return (
    <div className="flex items-center justify-center border p-2 rounded-md w-full">
      <div className="flex items-center gap-1">
        <img
          src={image}
          alt={`${name} profile`}
          className="w-6 h-6 rounded-full shrink-0"
        />
        <div className="text-left ml-1 text-nowrap">
          <p className="font-bold">{name}</p>
          <p className="text-gray-500 text-[8px]">{subject}</p>
          <p className="text-gray-500 text-[8px]">{time}</p>
        </div>
      </div>
      <button className="ml-4 shadow-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-1 py-1 rounded-full text-[8px] font-semibold">
        Confirmed
      </button>
    </div>
  );
}

function BookingCard({ name, image, exam }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <img
        src={image}
        alt={`${name} profile`}
        className="w-7 h-7 rounded-full"
      />
      <div className="text-left ml-1">
        <p className="text-sm">{name}</p>
        <p className="text-gray-500 text-sm">{exam}</p>
      </div>
    </div>
  );
}

function ViewModal({ isOpen, onClose, session }) {
  const [status, setStatus] = useState(null);

  const handleClose = () => {
    setStatus(null);
    onClose();
  }

  if (!isOpen || !session) return null;

  return (
    <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded-md shadow-lg w-96">
        {status ? (
          <>
            {status === "accepted" && (
              <div className="flex flex-col items-center gap-3 p-3">
                <Check className="border w-8 h-8 rounded-full bg-green-500 text-white" />
                <p className="text-lg font-bold mt-3">Request Accepted</p>
                <p className="text-sm text-center">
                  You've accepted a booking request from {session.name}. A
                  notification has been sent
                </p>
                <button
                  className="mt-4 shadow-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-full font-semibold w-full"
                  onClick={handleClose}
                >
                  Done
                </button>
              </div>
            )}
            {status === "rejected" && (
              <div className="flex flex-col items-center gap-3 p-3">
                <XIcon className="border w-8 h-8 rounded-full bg-red-500 text-white" />
                <p className="text-lg font-bold mt-3">Request Declined</p>
                <p className="text-sm text-center">
                  You've declined the booking request from {session.name}.
                </p>
                <div className="flex flex-col gap-1 w-full">
                  <button
                    className="mt-4 shadow-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-full font-semibold w-full"
                    onClick={handleClose}
                  >
                    Undo
                  </button>
                  <button
                    className="mt-4 shadow-md bg-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-full font-semibold w-full"
                  >
                    Report a Problem
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <span className="flex items-center justify-between">
              <BookingCard {...session} />
              <XIcon className="cursor-pointer" onClick={onClose} />
            </span>
            <p className="mt-2 text-sm">Date & Time</p>
            <p className="text-sm font-bold">Date: {session.date}</p>
            <p className="text-sm">{session.timehrs}</p>

            <div className="mt-4 flex justify-between ">
              <button
                onClick={() => setStatus("accepted")}
                className="px-6 py-2 text-[12px] text-white bg-blue-500 hover:shadow-lg rounded-full"
              >
                Accept Request
              </button>
              <button
                onClick={() => setStatus("rejected")}
                className="px-7 py-2 border text-[12px] mr-10 bg-white hover:bg-blue-500 hover:text-white rounded-full"
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
