import React, { useState } from "react";
import { ChevronLeft, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "../../lib/api/tutor/tutorApi";

const TutorProfilePage = () => {
  // Simulated API data
  const [tutor, setTutor] = useState({
    name: "Mr. Daniel Ocholi",
    subjects: "Maths. Further maths.",
    bio: "Experienced tutor with a passion for helping students succeed",
    schedule: "Today: 4pm-6pm .Usual: Mon-Fri, 4-7pm",
    about:
      "I'm a dedicated tutor with 5+ years of experience, specializing in Mathematics and Further Math. My goal is to make learning engaging and effective, helping students build confidence and achieve their academic goals.",
    avatar:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  });

  const [rating, setRating] = useState({
    average: 4.8,
    totalReviews: 125,
    breakdown: [
      { stars: 5, percent: 70 },
      { stars: 4, percent: 20 },
      { stars: 3, percent: 5 },
      { stars: 2, percent: 3 },
      { stars: 1, percent: 2 },
    ],
  });

  const [reviews, setReviews] = useState([
    {
      name: "Eze Johnson",
      date: "July 10, 2024",
      avatar: tutor.avatar,
      stars: 4,
      text: "Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!",
    },
    {
      name: "Eze Johnson",
      date: "July 10, 2024",
      avatar: tutor.avatar,
      stars: 4,
      text: "Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!",
    },
    {
      name: "Eze Johnson",
      date: "July 10, 2024",
      avatar: tutor.avatar,
      stars: 4,
      text: "Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!",
    },
    {
      name: "Eze Johnson",
      date: "July 10, 2024",
      avatar: tutor.avatar,
      stars: 4,
      text: "Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!",
    },
  ]);

  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutorProfile", id],
    queryFn: () => getTutorProfile(id),
  });

  return (
    <>
      <Link
        className="btn items-center ggap-1 px-3 py-1.5 rounded-full 
             border border-[#0568FF] shadow-sm 
             bg-white text-primary font-semibold 
             hover:bg-primary hover:text-white hover:border-transparent 
             transition"
      >
        <ChevronLeft size={18} />
        Back
      </Link>
      <div className="flex gap-10 items-start">
        <div className="avatar avatar-online mt-8 shrink-0 !static">
          <div className="w-24 rounded-full">
            <img src={data?.user.profileImageUrl} alt="Tutor Profile Picture" />
          </div>
        </div>
        <div className="">
          <h1 className="font-bold">
            {data?.user.firstName} {data?.user.lastName}
          </h1>
          <p className="text-sm mt-2 text-primary font-semibold">
            {data?.subjects?.map((s) => s.name).join(" · ")}
          </p>

          <p className="text-sm mt-2 text-gray-500">{tutor?.schedule}</p>

          <button className="btn btn-primary mt-2 mb-2 rounded-full bg-primary text-white border-none shadow-md hover:bg-white hover:text-primary">
            Book Session
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-bold">About Me</h1>
        <p className="text-sm mt-2 text-gray-500">{data?.bio}</p>
      </div>
      <h1 className="font-bold mt-4 mb-4">Reviews</h1>
      <div className="bg-background">
        <div className="flex p-5">
          <div className="pl-3">
            <h1 className="font-bold text-4xl">{rating.average}</h1>

            <div className="flex w-1/2 mt-[-10px]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={30}
                  fill={
                    i < Math.floor(rating.average) ? "currentColor" : "white"
                  }
                  className="text-primary"
                  stroke={i < Math.floor(rating.average) ? "none" : "lightblue"}
                />
              ))}
            </div>
            <p className="text-sm">{rating.totalReviews} reviews</p>
          </div>
          <div className="ml-[-30px] w-full">
            {rating.breakdown.map((item) => (
              <div className="flex gap-2 mt-1" key={item.stars}>
                <p>{item.stars}</p>
                <progress
                  className="progress text-primary w-1/3 mt-2"
                  value={item.percent}
                  max={100}
                ></progress>
                <p>{item.percent}%</p>
              </div>
            ))}
          </div>
        </div>
        {reviews.map((review, idx) => (
          <React.Fragment key={idx}>
            <div className="flex gap-2 items-start p-5 mt-[-18px]">
              <div className="avatar avatar-online shrink-0 !static">
                <div className="w-12 rounded-full">
                  <img src={review.avatar} />
                </div>
              </div>
              <div className="">
                <h1 className="font-bold">{review.name}</h1>
                <p className="text-sm mt-1">{review.date}</p>
              </div>
            </div>
            <div className="flex w-1/2 mt-[-30px] p-5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < review.stars ? "currentColor" : "white"}
                  className="text-primary"
                  stroke="none"
                />
              ))}
            </div>
            {review.text && (
              <div>
                <p className="text-sm p-5 mt-[-30px] text-text ">
                  {review.text}
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default TutorProfilePage;
