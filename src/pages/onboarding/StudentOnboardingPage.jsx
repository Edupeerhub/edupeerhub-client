import { useEffect, useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import StepHeader from "../../components/onboarding/StepHeader";
import SelectableCardWithCheckbox from "../../components/onboarding/SelectableCardWithCheckBox";
import SelectableCardList from "../../components/onboarding/SelectableCardList";
import ProgressBar from "../../components/onboarding/ProgressBar";
import StepNavigation from "../../components/onboarding/StepNavigation";
import { getSubjects } from "../../lib/api/subject/subjectsApi";
import useCreateStudent from "../../hooks/student/useCreateStudent";
import ErrorAlert from "../../components/common/ErrorAlert";

const StudentOnboardingPage = () => {
  const [subjectInfo, setSubjectInfo] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    goals: [],
    subjects: [],
    exams: [],
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

  useEffect(() => {
    async function fetchSubjects() {
      const subjects = await getSubjects();
      setSubjectInfo(subjects);
    }
    fetchSubjects();
  }, []);

  const {
    isPending,
    createStudentMutation,
    fieldErrors,
    generalError,
    clearErrors,
  } = useCreateStudent();

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    // createStudentMutation(formData);
    console.log("Final JSON Data:", formData);
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
        options={subjectInfo}
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
        options={[
          { id: 1, name: "WAEC" },
          { id: 2, name: "NECO" },
          { id: 3, name: "JAMB" },
          { id: 4, name: "GCE" },
        ]}
        selectedItems={formData.exams}
        onToggle={toggleExam}
        roundedFull={true}
        className="w-full"
      />
    </div>,
  ];

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between md:h-[90vh] space-y-1">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <ErrorAlert message={generalError} />

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
