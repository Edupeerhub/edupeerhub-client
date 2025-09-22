import useAuthUser from "../../hooks/auth/useAuthUser";
import Calendar from "../../components/Calendar";
import streakIcon from "../../assets/Student-icon/streak.svg";
import quizIcon from "../../assets/Student-icon/score.svg";
import scoreIcon from "../../assets/Student-icon/score.svg";
import greaterThanIcon from "../../assets/Student-icon/greater-than.svg";
import Upcoming from "../../assets/Student-icon/upcoming.svg";
import tutorImageA from "../../assets/Student-icon/tutor-image-A.svg";
import tutorImageB from "../../assets/Student-icon/tutor-image-B.svg";
import tutorImageC from "../../assets/Student-icon/tutor-image-C.svg";
import clockIcon from "../../assets/Student-icon/clock.svg";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedTutors } from "../../lib/api/tutor/tutorApi";
import { Link } from "react-router-dom";
import OverviewPanel from "../../components/student/OverviewPanel";

const StudentDashboardPage = () => {
  const { authUser } = useAuthUser();

  const tutors = [
    {
      name: "Mr. Ola Williams",
      subjects: ["Maths", "Chemistry", "Physics"],
      image: tutorImageA,
    },
    {
      name: "Ms. Nkechi Onu",
      subjects: ["English", "Eng Literature"],
      image: tutorImageB,
    },
    { name: "Mr. Wale Ola", subjects: ["Biology"], image: tutorImageC },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendedTutors"],
    queryFn: () => getRecommendedTutors(),
  });
  return (
    <div className="md:p-4 space-y-4 md:max-w-8xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-2 md:space-y-6">
          <h1 className="text-2xl md:mb-4 p-2 sm:p-0 font-semibold">
            Welcome back, {authUser?.firstName || "Student"}
          </h1>

          {/* Overview */}
          <div className="bg-white rounded-lg border shadow p-2 sm:p-4">
            <h2 className="text-lg font-semibold mb-4 ">Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <OverviewPanel icon={streakIcon} text="Daily Streak" />
              <OverviewPanel icon={quizIcon} text="Quizzes Completed" />
              <OverviewPanel icon={scoreIcon} text="Average Score" />
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg border shadow p-4">
            <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3>

            <div className="flex items-center justify-between rounded-lg md:p-4 h-44">
              <div className="flex flex-col justify-between h-full p-1">
                <div>
                  <p className="text-blue-600 font-semibold">Mathematics</p>
                  <p className="text-gray-600">With Mr. Adebayo</p>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <img src={clockIcon} alt="Clock" className="w-4 h-4 mr-2" />
                    Today, 4:00 PM
                  </div>
                </div>

                {/* Join Button */}
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold w-full sm:w-60">
                  JOIN
                </button>
              </div>

              {/*Image */}
              <img
                src={Upcoming}
                alt="Upcoming session"
                className="w-32 sm:w-48 h-full rounded-lg object-cover ml-6"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] border rounded-lg shadow md:p-4 space-y-4 flex flex-col self-start ">
          {/* Calendar */}
          <div className="flex-none">
            <Calendar
              compact={true}
              bookingDates={["2025-09-10", "2025-09-14"]}
            />
          </div>

          <hr className="border-t border-gray-300" />

          {/* Currently Enrolled */}
          <div className="flex-none px-2 sm:px-0">
            <h3 className="font-semibold text-lg mb-4">Currently Enrolled</h3>
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500 text-sm font-semibold">No subject</p>
              <img
                src={greaterThanIcon}
                alt=">"
                className="w-3 h-3 opacity-70"
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">Progress 0%</p>
            <div className="w-80 max-w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-600 h-2 rounded-full w-0"></div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                disabled
                className="bg-blue-600 text-white px-4 py-1 border rounded-xl font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed italic"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Recommended Tutors ===== */}
      <div className="bg-[#F9FAFB] rounded-lg md:p-4 w-full border shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg px-2">Recommended Tutors</h3>
          <Link
            to="/student/tutors"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {!data || data.rows?.length === 0 ? (
          <p className="flex justify-center items-center font-bold">
            No tutors found.
          </p>
        ) : (
          <div className="">
            <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
              {data.rows.map((tutor) => (
                <div
                  key={tutor.userId}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition w-80 flex-shrink-0"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={tutor.user.profileImageUrl}
                        alt={`${tutor?.user.firstName} ${tutor?.user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {tutor?.user.firstName} {tutor?.user.lastName}
                      </h3>
                      <p className="text-sm text-primary mt-1">
                        {tutor?.subjects?.map((s) => s.name).join(" • ")}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {tutor.bio}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/student/tutor-profile/${tutor.userId}`}
                    className="mt-auto self-end px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/80 text-center no-underline"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
