import {
  UserPlus,
  Monitor,
  Video,
  BookOpen,
  MessageCircle,
  Trophy,
} from "lucide-react";
import Section from "../common/Section";
import { HOW_IT_WORKS_STEPS } from "../../config/assets";

const iconMap = {
  UserPlus,
  Monitor,
  Video,
  BookOpen,
  MessageCircle,
  Trophy,
};

const StepCard = ({ step, index, isLast, isThird }) => {
  const Icon = iconMap[step.icon];

  return (
    <div className="relative">
      <div className="bg-blue-600 text-white rounded-full p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-white/20 rounded-full p-4">
            <Icon className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h3 className="text-lg md:text-xl font-bold">{step.title}</h3>
          <p className="text-sm md:text-base text-blue-50">
            {step.description}
          </p>
        </div>
      </div>

      {!isLast ||
        (!isThird && (
          <div className="hidden lg:block absolute top-1/2 -right-8 xl:-right-12 transform -translate-y-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <Section id="features" background="gray">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          How <span className="text-blue-600">EduPeerHub</span> Works
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Your learning journey made simple, supportive, and powerful.
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isLast={index === HOW_IT_WORKS_STEPS.length - 1}
            isThird={HOW_IT_WORKS_STEPS.length === 2}
          />
        ))}
      </div>
    </Section>
  );
};

export default HowItWorksSection;
