import Upcoming from "../../assets/Student-icon/upcoming.svg";
import clockIcon from "../../assets/Student-icon/clock.svg";
import { Link } from "react-router-dom";
import useCallAccess from "../../hooks/booking/useCallAccess"; // New import

// Helper function to format the date based on its proximity
const formatSessionDate = (scheduledStart) => {
  const sessionDate = new Date(scheduledStart);
  const today = new Date();
  const oneWeekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Check if the session is within the next 7 days
  if (sessionDate >= today && sessionDate < oneWeekFromToday) {
    const weekday = sessionDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const time = sessionDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${weekday}, ${time}`;
  } else {
    // Format for beyond one week: "Month Dayth, Time"
    const month = sessionDate.toLocaleDateString("en-US", { month: "long" });
    const day = sessionDate.getDate();
    const time = sessionDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Add correct suffix for the day of the month (e.g., "st", "nd", "rd", "th")
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return `${month} ${day}${suffix}, ${time}`;
  }
};

const UpcomingSessionsCard = ({ upcomingSessions, onViewDetails }) => {
  // Conditional check to handle the empty state
  if (!upcomingSessions) {
    return (
      <div className="flex flex-row items-center justify-center p-4 bg-gray-100 rounded-2xl shadow-md h-44 w-full text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="font-semibold text-lg text-gray-800">
            No Upcoming Sessions
          </h3>
          <p className="text-gray-500 mb-4 mt-1">You're all caught up!</p>
          <Link
            to="/student/tutors"
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold transition-colors hover:bg-primary/80"
          >
            Book a Session
          </Link>
        </div>
      </div>
    );
  }

  // If there is an upcoming session, render the full card
  const sessionDate = new Date(upcomingSessions.scheduledStart);
  const { canAccess, reason } = useCallAccess(upcomingSessions); // Use the new hook

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3>
      <div className="flex items-center justify-between rounded-lg md:p-4 h-44">
        <div className="flex flex-col justify-between h-full p-1">
          <div>
            <p className="text-blue-600 font-semibold">
              {upcomingSessions?.subject?.name}
            </p>
            <p className="text-gray-800">
              {upcomingSessions.tutor.user.firstName}{" "}
              {upcomingSessions.tutor.user.lastName}
            </p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <img src={clockIcon} alt="Clock" className="w-4 h-4 mr-2" />
              <span>{formatSessionDate(upcomingSessions.scheduledStart)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              className="bg-primary text-white px-3 sm:px-6 py-2 rounded-full font-semibold w-full sm:w-auto" // Removed disabled prop
              onClick={() => onViewDetails(upcomingSessions)}
            >
              View Details
            </button>
            <Link to={`/student/call/${upcomingSessions.id}`}>
              <button
                className="bg-green-500 text-white px-3 sm:px-6 py-2 rounded-full font-semibold w-full sm:w-auto disabled:bg-gray-400"
                disabled={!canAccess} // Use canAccess from the hook
                title={!canAccess ? reason : ""} // Add title for disabled reason
              >
                Join
              </button>
            </Link>
          </div>
        </div>
        <img
          src={Upcoming}
          alt="Upcoming session"
          className="w-32 sm:w-48 h-full rounded-lg object-cover ml-6"
        />
      </div>
    </div>
  );
};

export default UpcomingSessionsCard;
