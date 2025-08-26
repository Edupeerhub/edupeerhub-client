import { useState } from "react";
import StudentAvatar from "../../assets/images/onboarding/woman.png";
import TeacherAvatar from "../../assets/images/onboarding/man.png";
import RoleSelectionCard from "../../components/onboarding/RoleSelectionCard";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "Teacher") {
      navigate("/tutor/onboarding");
    } else if (role === "Student") {
      navigate("/student/onboarding");
    }
  };

  const roles = [
    {
      id: "tutor",
      role: "Tutor",
      description: "You want to share your knowledge and help students succeed",
      image: TeacherAvatar,
    },
    {
      id: "student",
      role: "Student",
      description:
        "You are focused on building knowledge and creating a bright future",
      image: StudentAvatar,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
            What would you use <span className="text-primary">Edupeerhub</span>{" "}
            for?
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Sign up as a student or teacher to begin your journey
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 max-w-4xl mx-auto">
          {roles.map((roleData) => (
            <RoleSelectionCard
              key={roleData.id}
              role={roleData.role}
              description={roleData.description}
              image={roleData.image}
              onClick={() => handleRoleSelection(roleData.role)}
              isHovered={hoveredCard === roleData.id}
              onHover={() => setHoveredCard(roleData.id)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
