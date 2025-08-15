import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/landing/HomePage";
import StudentOnboardingPage from "./pages/onboarding/StudentOnboardingPage";
import TutorOnboardingPage from "./pages/onboarding/TutorOnboardingPage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import RoleSelectionPage from "./pages/onboarding/RoleSelectionPage";
import StudentDashboardPage from "./pages/dashboard/StudentDashboardPage";
import TutorDashboardPage from "./pages/dashboard/TutorDashboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/" element={<ResetPasswordPage />} />

      <Route path="/verify-email" element={<EmailVerificationPage />} />

      <Route path="/student-dashboard" element={<StudentDashboardPage />} />
      <Route path="/tutor-dashboard" element={<TutorDashboardPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/student-onboarding" element={<StudentOnboardingPage />} />
      <Route path="/tutor-onboarding" element={<TutorOnboardingPage />} />
    </Routes>
  );
}
