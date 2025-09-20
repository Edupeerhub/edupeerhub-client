import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "../../lib/api/tutor/tutorApi";
import RatingSummary from "../../components/common/RatingSummary";
import ReviewList from "../../components/common/ReviewList";
import BackButton from "../../components/common/BackButton";

const TutorProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Hardcoded placeholders
  const schedule = "Today: 4pm-6pm · Usual: Mon-Fri, 4-7pm";
  const rating = {
    average: 4.8,
    totalReviews: 125,
    breakdown: [
      { stars: 5, percent: 70 },
      { stars: 4, percent: 20 },
      { stars: 3, percent: 5 },
      { stars: 2, percent: 3 },
      { stars: 1, percent: 2 },
    ],
  };
  const reviews = [
    {
      name: "Eze Johnson",
      date: "July 10, 2024",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      stars: 4,
      text: "Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!",
    },
    {
      name: "Chioma Ade",
      date: "August 5, 2024",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      stars: 5,
      text: "Very patient and knowledgeable tutor. Always explains clearly!",
    },
  ];

  const handleBookSession = () => {
    navigate(`/student/booking/${id}`);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutorProfile", id],
    queryFn: () => getTutorProfile(id),
  });

  if (isLoading) return <p>Loading tutor profile...</p>;
  if (error)
    return <p className="text-red-500">Failed to load tutor profile.</p>;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Back Button */}
      <div className="px-4 sm:px-8 py-4">
        <BackButton to="/student/tutors" />
      </div>

      <div className="px-2 sm:px-8 md:pb-8">
        {/* Tutor Header */}
        <div className="flex flex-col md:flex-row gap-1 sm:gap-6 items-center">
          {/* Avatar - centered on mobile */}
          <div className="avatar avatar-online shrink-0 self-center">
            <div className="w-20 sm:w-24 rounded-full">
              <img
                src={data?.user.profileImageUrl}
                alt={`${data?.user.firstName} ${data?.user.lastName}`}
                className="w-auto sm:w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info section */}
          <div className="flex-1 min-w-0 sm:w-full w-auto text-center sm:text-left">
            <h1 className="font-bold text-xl sm:text-2xl break-words">
              {data?.user.firstName} {data?.user.lastName}
            </h1>

            {/* Subjects - allow text wrapping */}
            <div className="mt-2">
              <p className="text-sm text-primary font-semibold break-words">
                {data?.subjects?.map((s) => s.name).join(" · ")}
              </p>
            </div>

            {/* Schedule - allow text wrapping */}
            <div className="mt-2">
              <p className="text-sm text-gray-500 break-words leading-relaxed">
                {schedule}
              </p>
            </div>

            {/* Book Session Button - full width on mobile */}
            <button
              onClick={handleBookSession}
              className="btn btn-primary mt-2 md:mt-4 mb-2 rounded-full bg-primary text-white border-none shadow-md hover:bg-white hover:text-primary transition-colors duration-200 w-full sm:w-auto px-6"
            >
              Book Session
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">About Me</h2>
          <p className="text-sm mt-2 text-gray-500 leading-relaxed break-words">
            {data?.bio}
          </p>
        </div>

        {/* Rating */}
        <div className="mt-3 md:mt-6">
          <RatingSummary rating={rating} />
        </div>

        {/* Reviews */}
        <div className="mt-6 ">
          <h2 className="font-bold text-lg mb-4">Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;
