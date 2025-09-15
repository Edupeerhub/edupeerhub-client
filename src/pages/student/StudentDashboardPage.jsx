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

const StudentDashboardPage = () => {
  const { authUser } = useAuthUser();

  const tutors = [
    { name: "Mr. Ola Williams", subjects: ["Maths", "Chemistry", "Physics"], image: tutorImageA },
    { name: "Ms. Nkechi Onu", subjects: ["English", "Eng Literature"], image: tutorImageB },
    { name: "Mr. Wale Ola", subjects: ["Biology"], image: tutorImageC },
  ];

  return (
    <div className="p-4 space-y-4 max-w-8xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl mb-4">
            Welcome back, {authUser?.firstName || "Student"}
          </h1>

          {/* Overview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F9FAFB] rounded-lg shadow p-4 h-28 flex flex-col justify-center">
                <img src={streakIcon} alt="Streak" className="w-10 h-10 mb-1" />
                <p className="text-gray-500 text-sm">Daily Streak</p>
                <p className="text-lg font-bold">3 days</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg shadow p-4 h-28 flex flex-col justify-center">
                <img src={quizIcon} alt="Quiz" className="w-10 h-10 mb-1" />
                <p className="text-gray-500 text-sm">Quizzes Completed</p>
                <p className="text-lg font-bold">4</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg shadow p-4 h-28 flex flex-col justify-center">
                <img src={scoreIcon} alt="Score" className="w-10 h-10 mb-1" />
                <p className="text-gray-500 text-sm">Average Score</p>
                <p className="text-lg font-bold">85%</p>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow p-1">
            <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3>

            <div className="flex items-center justify-between rounded-lg p-4 h-44">
    
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

        <div className="bg-[#F9FAFB] rounded-lg shadow p-4 space-y-4 flex flex-col self-start ">
         {/* Calendar */}
          <div className="flex-none">
            <Calendar compact={true} bookingDates={["2025-09-10", "2025-09-14"]} />
          </div>

          <hr className="border-t border-gray-100" />

          <div className="flex-none">
            <h3 className="font-semibold text-lg mb-4">Currently Enrolled</h3>
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500 text-sm font-semibold">No subject</p>
              <img src={greaterThanIcon} alt=">" className="w-3 h-3 opacity-70" />
            </div>

            <p className="text-sm text-gray-500 mt-1">Progress 0%</p>
            <div className="w-80 max-w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-600 h-2 rounded-full w-0"></div>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-blue-600 text-white px-4 py-1 border rounded-xl font-medium hover:underline w-full">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Recommended Tutors ===== */}
      <div className="bg-[#F9FAFB] rounded-lg shadow p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recommended Tutors</h3>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {tutors.map((tutor, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm p-3 flex h-34 w-84"
            >
              {/* images */}
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />

              {/* details */}
              <div className="flex flex-col justify-between flex-1 items-start">
                <div className="w-full">
                  <h4 className="font-bold text-sm">{tutor.name}</h4>
                  <p className="text-xs text-blue-600 mb-1">
                    {tutor.subjects.join(" • ")}
                  </p>
                  <p className="text-gray-600 text-xs">
                    An experienced and Passionate tutor dedicated to helping students achieve their academic goals.
                  </p>
                </div>
                <div className="w-full flex justify-end">
                  <button className="px-2 py-1 border border-gray-300 rounded-full text-xs leading-[13.51px] font-normal hover:bg-gray-100 -ml-1">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;