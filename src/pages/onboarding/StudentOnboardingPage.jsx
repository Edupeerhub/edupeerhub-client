import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";

const StudentOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goals: [],
    subjects: [],
    exams: [],
  });

  const totalSteps = 3;

  const learningGoals = [
    "Prepare for an upcoming exam",
    "Get better at subjects I struggle with",
    "Get personalized help from tutors",
    "Build a consistent study routine",
  ];

  const subjects = ["Maths", "English", "Science", "History"];


  const exams = ["WAEC", "NECO", "JAMB", "GCE"];

  // ✅ Selection handlers
  const toggleGoal = (goal) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const toggleSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjectss.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const toggleExam = (exam) => {
    setFormData((prev) => ({
      ...prev,
      exams: prev.exams.includes(exam)
        ? prev.exams.filter((e) => e !== exam)
        : [...prev.exams, exam],
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Onboarding completed!");
  };

  return (
    <AuthLayout>
      <div className="w-[543px] h-[897px] justify-between flex flex-col gap-12 pt-[36px] pr-[16px] pl-[16px] pb-[36px]  bg-[#FCFCFC]">
        {/* Progress Indicators */}
        <div className="mb-8">
          <div className="flex gap-6 w-[242px] r- h-[4px]">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500  font-semibold whitespace-nowrap text-right -mt-3 ">
            Step {currentStep}/{totalSteps}
          </p>
        </div>

        {/* Step Content */}
        <div className=" w-[471px] h-[484px] gap-12 ">
          {/* ✅ Step 1: Learning Goals */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3 text-center">
                What are your learning goals?
              </h2>
              <p className="text-gray-600 mb-6 text-center tracking-widest">
                Let us help you personalize your experience
              </p>

              <div className="flex flex-col gap-4">
                {learningGoals.map((goal) => (
                  <label
                    key={goal}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                      formData.goals.includes(goal)
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-white border-gray-300  hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => toggleGoal(goal)}
                      className="mr-3 size-5"
                    />
                    <span className="text-gray-900">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
                    
          {/* ✅ Step 2: Subject Selection */}
          {currentStep === 2 && (
           <div className="  text-center">
              <h2 className="mb-2 font-poppins font-bold text-[32px] leading-[40px] tracking-normal text-center">

                What subjects are you interested in?
              </h2>
              <p className="text-gray-600 mb-8">Let us help you personalize your experience</p>

              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {subjects.map((subject) => (
                  <button
                    type="button"
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 border ${
                      formData.subjects.includes(subject)
                        ? "bg-blue-500 shadow-md border-blue-500 transform scale-105 "
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Step 3: Exams */}
          {currentStep === 3 && (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                What exams are you targeting?
              </h2>
              <p className="text-gray-600 mb-8 tracking-wide">
                Select the exams you plan to take
              </p>

              <div className="flex flex-col gap-6 w-full items-center">
                {exams.map((exam) => (
                  <div
                   key={exam}
                   onClick={() => toggleExam(exam)}
                     className={`cursor-pointer flex items-center justify-center py-4 px-6 rounded-lg border text-lg font-medium transition-all duration-200  w-full ${
                       formData.exams.includes(exam)
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                   >
                    {exam}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (currentStep < totalSteps) {
                setCurrentStep((s) => s + 1);
              } else {
                handleSubmit();
              }
            }}
          >
            {currentStep === totalSteps ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default StudentOnboardingPage;