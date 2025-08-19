import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";

const TutorOnboardingPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    subjects: [],
    
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
  };

  const handleSubmit = () => {
    console.log("Final JSON Data:", formData);
    alert("Data sent! Check console.");
  };

  return (
    <AuthLayout>
      <div
        style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}
      >
        {/* Segmented Progress Bar */}
        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-md ${
                  index < currentStep ? "bg-primary" : "bg-accent"
                }`}
              />
            ))}
          </div>
          <div>
            <p className=" text-sm font-sans text-right m-0">
              Step {currentStep}/{totalSteps}
            </p>
          </div>
        </div>

        {/* Step 1: Select Subjects */}
        {currentStep === 1 && (
          <div className="mt-10">
            <div className="flex flex-col text-center">
              <h3 className="text-accent text-2xl font-bold font-sans">
                What are your subject expertise
              </h3>
              <p className="text-accent ">
                let us help you personalize your experience
              </p>
            </div>
            <div className="flex flex-wrap mt-8 mb-10 gap-2">
              {[
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
              ].map((subject) => (
                <div
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`py-3 px-4 border border-gray-300 rounded-full cursor-pointer text-sm min-w-[80px] text-center ${
                    formData.subjects.includes(subject)
                      ? "bg-primary text-white"
                      : "bg-background text-black"
                  }`}
                >
                  {subject}
                </div>
              ))}
            </div>
            <br />
          </div>
        )}

        {/* Step 2: Academic background */}
        {currentStep === 2 && (
          <div>
            <div className="flex flex-col text-center">
              <h3 className="text-accent text-2xl font-bold font-sans">
                Tell us your academic background
              </h3>
              <p className="text-accent text-sm ">
                briefly share your academic history
              </p>
            </div>
            <div>
              <textarea
                cols="50"
                rows="8"
                placeholder="Not more than 100 words"
                className="font-sans text-sm bg-gray-300 text-text mt-8 mb-8 p-4"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 3: Upload credentials */}
        {currentStep === 3 && (
          <div>
            <div className="flex flex-col text-center mb-8">
              <h3 className="text-accent text-2xl font-bold font-sans">
                Upload your academic credentials or NYSC details
              </h3>
              <p className="text-accent text-sm">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>

            <div>
              <label
                htmlFor="file-upload"
                className="
                  flex flex-col items-center justify-center p-4
                  w-full
                  bg-gray-50
                  border-2 border-dashed border-gray-300
                  rounded-xl
                  cursor-pointer
                  hover:border-blue-500 hover:bg-gray-100
                  transition-colors duration-200
                  space-y-4 mb-20
                "
              >
                <input
                  id="file-upload"
                  onChange={handleFileChange}
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="hidden"
                />
                <svg
                  width="64px"
                  height="64px"
                  viewBox="-3.12 -3.12 30.24 30.24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M3 10V18C3 19.1046 3.89543 20 5 20H12M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V13"
                      stroke="#000000"
                      stroke-width="1.056"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5"
                      stroke="#000000"
                      stroke-width="1.056"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <circle cx="6" cy="7" r="1" fill="#000000"></circle>{" "}
                    <circle cx="9" cy="7" r="1" fill="#000000"></circle>{" "}
                  </g>
                </svg>
                <div className="text-center">
                  <p className="text-gray-600 font-medium">
                    <span className="text-primary hover:underline font-bold">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-text text-sm mt-1">
                    JPG, PNG, PDF (up to 5MB)
                  </p>
                </div>
              </label>

              {selectedFile && (
                <div className="mt-6">
                  <p className="font-sans text-accent mt-[-10px]">
                    File selected:
                  </p>
                  <p className="text-text break-words mt-1">{selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-2">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className=" bg-accent text-white hover:bg-primary"
            >
              Back
            </Button>
          )}
          {currentStep < totalSteps && (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="bg-primary text-white hover:bg-blue-600"
            >
              Continue
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-primary text-white hover:bg-blue-600"
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
