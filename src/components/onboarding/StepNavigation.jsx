import Button from "../ui/Button";

const StepNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
}) => (
  <div className=" flex gap-2">
    {currentStep > 1 && (
      <Button
        type="button"
        onClick={onBack}
        className="bg-gray-500 text-white hover:bg-blue-600"
      >
        Back
      </Button>
    )}
    {currentStep < totalSteps && (
      <Button
        type="button"
        onClick={onNext}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Continue
      </Button>
    )}
    {currentStep === totalSteps && (
      <Button
        type="button"
        onClick={onSubmit}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Submit
      </Button>
    )}
  </div>
);

export default StepNavigation;
