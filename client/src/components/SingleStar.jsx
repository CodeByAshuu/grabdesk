import React from "react";
import { FaStar } from "react-icons/fa";

function SingleStar({ rating = 0 }) {
  const maxRating = 5;
  const fillPercent = (rating / maxRating) * 100; // convert to %

  return (
    <div className="flex items-center gap-1 text-sm">
      {/* Star Container */}
      <div className="relative w-5 h-5">
        {/* Empty Star */}
        {/* <FaStar className="text-white absolute inset-0" size={20} /> */}

        {/* Filled Star */}
        <div
          className="absolute inset-0"
          style={{ width: `${fillPercent}%` }}
        >
          <FaStar className="text-amber-400" size={20} />
        </div>
      </div>

      {/* Rating Number */}
      <span className="font-semibold">{rating.toFixed(2)}</span>
    </div>
  );
}

export default SingleStar;
