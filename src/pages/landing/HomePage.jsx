import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  function handleGetStarted() {
    // This function can be used to handle any additional logic before redirecting
    // For now, it just redirects to the signup page
    window.location.href = "/signup";
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-3xl font-heading text-primary">
          Welcome to Edupeerhub
        </h1>

        <p className="text-base font-body text-text max-w-md mx-auto">
          Learn with 1-on-1 peer support, affordably.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-secondary text-white font-ui px-4 py-2 rounded hover:bg-primary transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
