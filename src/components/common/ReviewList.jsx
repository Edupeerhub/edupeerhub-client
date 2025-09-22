import React from "react";
import { Star } from "lucide-react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="">
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="pb-4 md:p-5 border rounded-lg shadow-sm mb-4 last:mb-0"
        >
          <div className="flex gap-3 items-start">
            <div className="avatar shrink-0">
              <div className="w-12 rounded-full">
                <img src={review.avatar} alt={review.name} />
              </div>
            </div>
            <div>
              <h1 className="font-bold">{review.name}</h1>
              <p className="text-sm text-gray-500">{review.date}</p>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.stars ? "currentColor" : "none"}
                    className={`text-primary ${
                      i >= review.stars ? "opacity-30" : ""
                    }`}
                  />
                ))}
              </div>
              {review.text && (
                <p className="text-sm mt-2 text-gray-700">{review.text}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
