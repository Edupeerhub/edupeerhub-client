import Upcoming from "../../assets/Student-icon/upcoming.svg";
import clockIcon from "../../assets/Student-icon/clock.svg";
import { Link } from "react-router-dom";
import useCallAccess from "../../hooks/booking/useCallAccess"; // New import
import { formatSessionDate } from "../../utils/time";

const UpcomingSessionsCard = ({ upcomingSessions, onViewDetails }) => {
  const { canAccess, reason } = useCallAccess(upcomingSessions);

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
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold transition-colors hover:bg-primary-focus"
          >
            Book a Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3> */}
      <div className="flex items-center justify-between rounded-lg md:p-4 h-44">
        <div className="flex flex-col justify-between h-full p-1">
          <div>
            <p className="text-blue-600 font-semibold">
              {upcomingSessions?.subject?.name}
            </p>
            <p className="text-gray-800">
              {upcomingSessions.tutor?.user?.firstName}{" "}
              {upcomingSessions.tutor?.user?.lastName}
            </p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <img src={clockIcon} alt="Clock" className="w-4 h-4 mr-2" />
              <span>{formatSessionDate(upcomingSessions.scheduledStart)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              className="bg-primary text-white px-3 sm:px-6 py-2 rounded-full font-semibold w-full sm:w-auto"
              onClick={() => onViewDetails(upcomingSessions)}
            >
              View Details
            </button>
            {canAccess ? (
              <Link to={`/student/call/${upcomingSessions.id}`}>
                <button className="bg-green-500 text-white px-3 sm:px-6 py-2 rounded-full font-semibold w-full sm:w-auto disabled:bg-gray-400">
                  Join
                </button>
              </Link>
            ) : (
              <button
                className="bg-gray-400 text-white px-3 sm:px-6 py-2 rounded-full font-semibold w-full sm:w-auto cursor-not-allowed"
                disabled={true}
                title={reason}
              >
                Join
              </button>
            )}
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
