import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Guards
import PublicOnlyRoute from "./components/routes/PublicRoute";
import EmailVerificationRoute from "./components/routes/EmailVerificationRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import StudentRoute from "./components/routes/StudentRoute";
import TutorRoute from "./components/routes/TutorRoute";
import AdminRoute from "./components/routes/AdminRoute";

// Sidebar configs
import {
  studentSidebarLinks,
  tutorSidebarLinks,
  adminSidebarLinks,
} from "./utils/sideBarLinks";

// Pages
import { HomePage, AboutPage, FeaturePage, ContactPage } from "./pages/landing";

import {
  RoleSelectionPage,
  StudentOnboardingPage,
  TutorOnboardingPage,
} from "./pages/onboarding";

import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EmailVerificationPage,
} from "./pages/auth";

import { NotFoundPage } from "./pages/general";

import Layout from "./layouts/Layout";
import { studentRoutes } from "./routes/studentRoutes";
import { tutorRoutes } from "./routes/tutorRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public landing pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturePage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public-only routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Email verification */}
        <Route
          path="/verify-email"
          element={
            <EmailVerificationRoute>
              <EmailVerificationPage />
            </EmailVerificationRoute>
          }
        />

        {/* Onboarding */}
        <Route element={<OnboardingRoute />}>
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route
            path="/student/onboarding"
            element={<StudentOnboardingPage />}
          />
          <Route path="/tutor/onboarding" element={<TutorOnboardingPage />} />
        </Route>

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <Layout fullHeight sidebarLinks={studentSidebarLinks} />
            </StudentRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {studentRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Tutor routes */}
        <Route
          path="/tutor"
          element={
            <TutorRoute>
              <Layout fullHeight sidebarLinks={tutorSidebarLinks} />
            </TutorRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {tutorRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout fullHeight sidebarLinks={adminSidebarLinks} />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}
