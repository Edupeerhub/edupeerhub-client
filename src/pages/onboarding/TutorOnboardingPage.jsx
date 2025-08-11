import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
const TutorOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    subjects: [],
    availableTime: "",
    days: [],
  });

  const totalSteps = 3;

  const toggleSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = () => {
    console.log("Final JSON Data:", formData);
    alert("Data sent! Check console.");
  };

  const handleChange = () => {
    console.log("Final JSON Data:", formData);
    alert("Data sent! Check console.");
  };

  return (
    <AuthLayout>
      <div
        style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}
      >
        {/* Segmented Progress Bar */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: "8px",
                  background: index < currentStep ? "#4cafef" : "#ddd",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: "14px", textAlign: "right", margin: 0 }}>
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Step 1: Select Subjects */}
        {currentStep === 1 && (
          <div>
            <h3
              style={{
                padding: "12px 16px",
                backgroundColor: "#4cafef",
                color: "white",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              Select your interested subjects:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Math", "English", "Science", "History"].map((subject) => (
                <div
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: formData.subjects.includes(subject)
                      ? "#4cafef"
                      : "#f0f0f0",
                    color: formData.subjects.includes(subject)
                      ? "white"
                      : "black",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Available Time */}
        {currentStep === 2 && (
          <div>
            <h3
              style={{
                padding: "12px 16px",
                backgroundColor: "#4cafef",
                color: "white",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              Set your available time:
            </h3>
            <input
              type="time"
              value={formData.availableTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableTime: e.target.value,
                }))
              }
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Step 3: Pick Days */}
        {currentStep === 3 && (
          <div>
            <h3
              style={{
                padding: "12px 16px",
                backgroundColor: "#4cafef",
                color: "white",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              Pick your available days:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: formData.days.includes(day)
                      ? "#4cafef"
                      : "#f0f0f0",
                    color: formData.days.includes(day) ? "white" : "black",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="bg-grey-500 text-white hover:bg-blue-600"
            >
              Back
            </Button>
          )}
          {currentStep < totalSteps && (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Continue
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default TutorOnboardingPage;
