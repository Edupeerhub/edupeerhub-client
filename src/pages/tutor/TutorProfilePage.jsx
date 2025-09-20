import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "../../lib/api/tutor/tutorApi";
import RatingSummary from "../../components/common/RatingSummary";
import ReviewList from "../../components/common/ReviewList";

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
    <>
      <Link
        to="/student/tutors"
        className="btn items-center ggap-1 px-3 py-1.5 rounded-full 
             border border-[#0568FF] shadow-sm 
             bg-white text-primary font-semibold 
             hover:bg-primary hover:text-white hover:border-transparent 
             transition"
      >
        <ChevronLeft size={18} />
        Back
      </Link>

      {/* Tutor Header */}
      <div className="flex gap-10 items-start mt-6">
        <div className="avatar avatar-online shrink-0">
          <div className="w-24 rounded-full">
            <img
              src={data?.user.profileImageUrl}
              alt={`${data?.user.firstName} ${data?.user.lastName}`}
            />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-xl">
            {data?.user.firstName} {data?.user.lastName}
          </h1>

          {/* Subjects */}
          <p className="text-sm mt-2 text-primary font-semibold">
            {data?.subjects?.map((s) => s.name).join(" · ")}
          </p>

          {/* Schedule */}
          <p className="text-sm mt-2 text-gray-500">{schedule}</p>

          <button
            onClick={handleBookSession}
            className="btn btn-primary mt-2 mb-2 rounded-full bg-primary text-white border-none shadow-md hover:bg-white hover:text-primary"
          >
            Book Session
          </button>
        </div>
      </div>

      {/* About */}
      <div className="mt-2">
        <h1 className="font-bold">About Me</h1>
        <p className="text-sm mt-2 text-gray-500">{data?.bio}</p>
      </div>

      {/* Rating */}
      <div className="mt-4">
        <RatingSummary rating={rating} />
      </div>

      {/* Reviews */}
      <div className="mt-6">
        <h1 className="font-bold mb-4">Reviews</h1>
        <ReviewList reviews={reviews} />
      </div>
    </>
  );
};

export default TutorProfilePage;
