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
import { Toaster } from "react-hot-toast";
import PublicOnlyRoute from "./components/routes/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import EmailVerificationRoute from "./components/routes/EmailVerificationRoute";
import AdminRoute from "./components/routes/AdminRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import PrivateRoute from "./components/routes/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />

        {/* ----------------------- */}
        {/* Public-only routes: accessible only if NOT logged in */}
        {/* Includes signup, login, forgot/reset password */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* ----------------------- */}
        {/* Email verification route: accessible only if logged in and NOT verified */}
        <Route
          path="/verify-email"
          element={
            <EmailVerificationRoute>
              <EmailVerificationPage />
            </EmailVerificationRoute>
          }
        />

        {/* ----------------------- */}
        {/* Onboarding routes: accessible only if logged in, verified, but NOT onboarded */}
        <Route element={<OnboardingRoute />}>
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route
            path="/student/onboarding"
            element={<StudentOnboardingPage />}
          />
          <Route path="/tutor/onboarding" element={<TutorOnboardingPage />} />
        </Route>

        {/* ----------------------- */}
        {/* Student protected routes: require login, verified, onboarded, role = student */}
        <Route
          path="/student"
          // element={
          //   <StudentRoute>
          //     <StudentLayout />
          //   </StudentRoute>
          // }
        >
          <Route path="dashboard" element={<StudentDashboardPage />} />
          {/* <Route path="profile" element={<StudentProfilePage />} /> */}
          {/* <Route path="settings" element={<StudentSettingsPage />} /> */}
        </Route>

        {/* ----------------------- */}
        {/* Tutor protected routes: require login, verified, onboarded, role = tutor */}
        <Route
          path="/tutor"
          // element={
          //   <TutorRoute >
          //     <TutorLayout />
          //   </TutorRoute>
          // }
        >
          <Route path="dashboard" element={<TutorDashboardPage />} />
          {/* <Route path="profile" element={<TutorProfilePage />} /> */}
          {/* <Route path="settings" element={<TutorSettingsPage />} /> */}
        </Route>

        {/* ----------------------- */}
        {/* Chat & Video/Calling routes: accessible to both students and tutors */}
        {/* Requires: logged-in, verified, onboarded */}
        {/* <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/call" element={<CallPage />} />
        </Route> */}

        {/* ----------------------- */}
        {/* Admin protected routes: require login, verified, onboarded, role = admin */}
        {/* Currently commented out until ready */}
        {/* <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route> */}
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}
