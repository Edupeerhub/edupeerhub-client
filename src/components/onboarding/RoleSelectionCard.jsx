import React from "react";

const RoleSelectionCard = ({
  role,
  description,
  image,
  onClick,
  isHovered,
  onHover,
  onLeave,
}) => {
  return (
    <div
      className={`bg-[#d8e8ff] rounded-2xl p-3 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform ${
        isHovered ? "scale-105" : "scale-100"
      }`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Profile Image */}
      <div className="flex justify-center mb-2 md:mb-6">
        <img
          src={image}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden"
        />
      </div>

      {/* Role Title */}
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-2 md:mb-4">
        {role}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
};

export default RoleSelectionCard;
