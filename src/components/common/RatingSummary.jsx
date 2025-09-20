import React from "react";
import { Star } from "lucide-react";

const RatingSummary = ({ rating }) => {
  return (
    <div className="bg-background p-5 rounded-lg shadow-sm  w-fit">
      <div className="flex gap-8">
        {/* Average Rating */}
        <div>
          <h1 className="font-bold text-4xl">{rating.average}</h1>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < Math.floor(rating.average) ? "currentColor" : "none"}
                className={`text-primary ${
                  i >= Math.floor(rating.average) ? "opacity-30" : ""
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{rating.totalReviews} reviews</p>
        </div>

        {/* Breakdown */}
        <div className="min-w-[400px]">
          {rating.breakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 mt-1">
              <p className="w-4">{item.stars}</p>
              <progress
                className="progress text-primary flex-1"
                value={item.percent}
                max={100}
              ></progress>
              <p className="w-10 text-right">{item.percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
