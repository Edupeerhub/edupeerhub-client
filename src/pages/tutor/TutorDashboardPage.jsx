import useAuthUser from "../../hooks/auth/useAuthUser";
// import Navbar from "../../layouts/Navbar";
import { Clock, Check, CalendarOffIcon, Hourglass, 
  AlertCircle, CheckCircle2, Calendar1Icon, Users2, ChevronRight, StarsIcon} from "lucide-react";

const TutorDashboardPage = () => {
  const { authUser } = useAuthUser();

  const tutor = {
    status: "approved", // "pending" | "rejected" | "approved" | "active"
    progress: 82,
    bookings: [],
  };

  const profileStatus = {
    pending: {
      icon: <Clock className="mt-2 text-red-500" />,
      title: "Pending Approval",
      subtitle: "Awaiting Verification",
      btnMessage: "Check Status",
      bgColor: "bg-red-100",
      color: "text-red-500",
      sessionMessage: "Sorry, there are no upcoming sessions yet until your verification is approved",
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
      sessionMessage: "Sorry, there are no upcoming sessions yet until your verification is approved",
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
      sessionMessage: "Your upcoming session would appear here",
      sessionIcon: <Calendar1Icon className="text-accent" />,
      progress: 100,
    }
  }

  const { icon, title, subtitle, btnMessage, bgColor, color, sessionMessage, sessionIcon, progress } = profileStatus[tutor.status] || profileStatus.pending;


  return (
    <>
      <div className="mr-96">
        <h1 className="font-bold">
          Welcome Back, {authUser?.firstName || "Tutor"}
        </h1>
        <p className="text-[12px]">Manage all your tutoring sessions here</p>
      </div>

      <div className="flex gap-2 h-full">
        <div className="w-4/5 flex items-center">
          {tutor.status === "pending" && <PendingLayout />}
          {tutor.status === "rejected" && <RejectedLayout />}
          {tutor.status === "approved" && <ApprovedLayout />}
        </div>

        <div className="w-1/5 mt-[-30px]">
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
              <p className="text-[11px] pt-3">{sessionMessage}</p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorDashboardPage;

import React from "react";

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
