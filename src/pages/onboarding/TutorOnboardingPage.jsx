import { useEffect, useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import StepHeader from "../../components/onboarding/StepHeader";
import SelectableCardList from "../../components/onboarding/SelectableCardList";
import ProgressBar from "../../components/onboarding/ProgressBar";
import StepNavigation from "../../components/onboarding/StepNavigation";
import TextAreaInput from "../../components/onboarding/TextAreaInput";
import FileUpload from "../../components/onboarding/FileUpload";
import useCreateTutor from "../../hooks/tutor/useCreateTutor";
import ErrorAlert from "../../components/common/ErrorAlert";
import { getSubjects } from "../../lib/api/common/subjectsApi";

const TutorOnboardingPage = () => {
  const [subjectInfo, setSubjectInfo] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    subjects: [],
    education: "",
    credentials: null,
  });

  const toggleSubject = (subject) =>
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
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
    createTutorMutation,
    fieldErrors,
    generalError,
    clearErrors,
  } = useCreateTutor();

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    createTutorMutation(formData);
  };

  const steps = [
    <div key="step1">
      <StepHeader
        title="What are your subject expertise?"
        subtitle="Choose all that apply"
      />
      <SelectableCardList
        options={subjectInfo}
        selectedItems={formData.subjects}
        onToggle={toggleSubject}
        roundedFull={true}
      />
    </div>,

    <div key="step2">
      <StepHeader
        title="Tell us your academic background"
        subtitle="Briefly share your academic history"
      />
      <TextAreaInput
        value={formData.education}
        onChange={(val) => setFormData((prev) => ({ ...prev, education: val }))}
        placeholder="Not more than 100 words"
      />
    </div>,

    <div key="step3">
      <StepHeader
        title="Upload your academic credentials or NYSC details"
        subtitle="Supported formats:  JPG, JPEG, PNG, PDF"
      />
      <FileUpload
        onChange={(file) =>
          setFormData((prev) => ({ ...prev, credentials: file }))
        }
      />
      {formData.credentials && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {formData.credentials.name}
        </p>
      )}
    </div>,
  ];

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between md:h-[90vh] space-y-2">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <ErrorAlert error={generalError} />
        <div className="flex-1">{steps[currentStep - 1]}</div>

        {currentStep === 1 && formData.subjects.length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Please select at least one subject.
          </p>
        )}

        {currentStep === 2 && formData.education.trim() === "" && (
          <p className="text-sm text-red-500 mt-2">
            Academic history is required.
          </p>
        )}

        {/* {currentStep === 3 && !formData.credentials && (
          <p className="text-sm text-red-500 mt-2">
            Please upload your credentials.
          </p>
        )} */}

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={() => setCurrentStep((s) => s - 1)}
          onNext={() => setCurrentStep((s) => s + 1)}
          onSubmit={handleSubmit}
          disableNext={
            (currentStep === 1 && formData.subjects.length === 0) ||
            (currentStep === 2 && formData.education.trim() === "")
            // || (currentStep === 3 && !formData.credentials)
          }
        />
      </div>
    </AuthLayout>
  );
};

export default TutorOnboardingPage;
