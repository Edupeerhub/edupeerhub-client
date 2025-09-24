import { Star } from "lucide-react";

const RatingSummary = ({ rating }) => {
  return (
    <div className="bg-background md:p-4 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Average Rating */}
        <div className="text-center md:text-left md:w-auto">
          <h1 className="font-bold text-2xl md:text-4xl">
            {rating.averageRating}
          </h1>
          <div className="flex justify-center md:justify-start mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`text-primary ${
                  i < Math.floor(rating.averageRating)
                    ? "fill-current"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{rating.totalReviews} reviews</p>
        </div>

        {/* Breakdown */}
        <div className="mt-4 md:mt-0 md:min-w-[400px]">
          {rating.breakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 mt-1">
              <p className="w-4">{item.stars}</p>
              <progress
                className="progress text-primary flex-1"
                value={item.percent}
                max={100}
              />
              <p className="w-10 text-right">{item.percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
