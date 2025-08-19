import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import StepHeader from "../../components/onboarding/StepHeader";
import SelectableCardList from "../../components/onboarding/SelectableCardList";
import ProgressBar from "../../components/onboarding/ProgressBar";
import StepNavigation from "../../components/onboarding/StepNavigation";
import TextAreaInput from "../../components/onboarding/TextAreaInput";
import FileUpload from "../../components/onboarding/FileUpload";
import Button from "../../components/ui/Button";

const TutorOnboardingPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    subjects: [],
    background: "",
    credentials: null,
    
  });

  const toggleSubject = (subject) =>
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //file type
      const allowedFormat = ["image/jpeg", "image/png", "application/pdf"];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!allowedFormat.includes(file.type)) {
        alert("Invalid file type. Please upload a JPG, PNG, or PDF.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }

      if (file.size > maxFileSize) {
        alert("File size exceeds the 5MB limit.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  }; // Delete later after merge into dev

  const handleSubmit = () => {
    console.log("Final JSON Data:", formData);
    alert("Data sent! Check console.");
  };

  const steps = [
    <div key="step1">
      <StepHeader
        title="What are your subject expertise?"
        subtitle="Choose all that apply"
      />
      <SelectableCardList
        options={["Math", "English", "Science", "History"]}
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
        value={formData.background}
        onChange={(val) =>
          setFormData((prev) => ({ ...prev, background: val }))
        }
        placeholder="Not more than 100 words"
      />
    </div>,

    <div key="step3">
      <StepHeader
        title="Upload your academic credentials or NYSC details"
        subtitle="Supported formats: PDF, JPG, PNG"
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

export default TutorOnboardingPage;
