import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import StepHeader from "../../components/onboarding/StepHeader";
import SelectableCardWithCheckbox from "../../components/onboarding/SelectableCardWithCheckBox";
import SelectableCardList from "../../components/onboarding/SelectableCardList";
import ProgressBar from "../../components/onboarding/ProgressBar";
import StepNavigation from "../../components/onboarding/StepNavigation";

const StudentOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    goals: [],
    subjects: [],
    exams: [],
    goals: [],
  });

  const toggleGoal = (goal) =>
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));

  const toggleSubject = (subject) =>

    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjectss.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));

  const toggleExam = (exam) =>
    setFormData((prev) => ({
      ...prev,
      exams: prev.exams.includes(exam)
        ? prev.exams.filter((e) => e !== exam)
        : [...prev.exams, exam],
    }));

  const handleSubmit = () => {
    console.log("Final JSON Data:", { formData });
    alert("Data sent! Check console.");
  };

  // Step Components
  const steps = [
    <div key="step1">
      <StepHeader
        title="What are your learning goals?"
        subtitle="Let us help you personalize your experience"
      />
      <SelectableCardWithCheckbox
        options={[
          "Prepare for an upcoming exam",
          "Get better at subjects I struggle with",
          "Get personalized help from tutors",
          "Build a consistent study routine",
        ]}
        selectedItems={formData.goals}
        onToggle={toggleGoal}
      />
    </div>,

    <div key="step2">
      <StepHeader
        title="What subjects are you interested in?"
        subtitle="Choose all that apply"
      />
      <SelectableCardList
        options={[
          "Chemistry",
          "Mathematics",
          "English",
          "Physics",
          "Literature",
          "Accounting",
          "Computer Science",
          "Economics",
          "Government",
          "French",
          "Music",
          "Commerce",
          "History",
          "Biology",
          "Further Math",
        ]}
        selectedItems={formData.subjects}
        onToggle={toggleSubject}
        roundedFull={true}
      />
    </div>,

    <div key="step3">
      <StepHeader
        title="What exams are you targeting?"
        subtitle="Select the exams you plan to take"
      />
      <SelectableCardList
        options={["WAEC", "NECO", "JAMB", "GCE"]}
        selectedItems={formData.exams}
        onToggle={toggleExam}
        roundedFull={true}
        className="w-full"
      />
    </div>,
  ];

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between h-[70vh] md:h-[90vh] space-y-2">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="flex-1">{steps[currentStep - 1]}</div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={() => setCurrentStep((s) => s - 1)}
          onNext={() => setCurrentStep((s) => s + 1)}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthLayout>
  );
};

export default StudentOnboardingPage;