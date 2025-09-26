import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/landing/HomePage";
import StudentOnboardingPage from "./pages/onboarding/StudentOnboardingPage";
import TutorOnboardingPage from "./pages/onboarding/TutorOnboardingPage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import RoleSelectionPage from "./pages/onboarding/RoleSelectionPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import TutorDashboardPage from "./pages/tutor/TutorDashboardPage";
import { Toaster } from "react-hot-toast";
import PublicOnlyRoute from "./components/routes/PublicRoute";
import EmailVerificationRoute from "./components/routes/EmailVerificationRoute";
import AdminRoute from "./components/routes/AdminRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import NotFoundPage from "./pages/general/NotFoundPage";
import Layout from "./layouts/Layout";
import {
  adminSidebarLinks,
  studentSidebarLinks,
  tutorSidebarLinks,
} from "./utils/sideBarLinks";
import StudentRoute from "./components/routes/StudentRoute";
import TutorRoute from "./components/routes/TutorRoute";
import StudentLibraryPage from "./pages/student/StudentLibraryPage";
import StudentTutorsPage from "./pages/student/StudentTutorsPage";
import StudentFaqPage from "./pages/general/FAQPage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";
import FAQPage from "./pages/general/FAQPage";
import TutorSettingsPage from "./pages/tutor/TutorSettingsPage";
import TutorProfilePage from "./pages/tutor/TutorProfilePage";
import AboutPage from "./pages/landing/AboutPage";
import FeaturePage from "./pages/landing/FeaturePage";
import ContactPage from "./pages/landing/ContactPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import StudentBookingPage from "./pages/student/StudentBookingPage";
import AdminTutorsPage from "./pages/admin/AdminTutorsPage";
import TutorSessionsPage from "./pages/tutor/TutorSessionsPage";
import TutorAvailabilityPage from "./pages/tutor/TutorAvailabilityPage";
import TutorMessagesPage from "./pages/tutor/TutorMessagesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import ChatPage from "./pages/messaging/ChatPage";
import CallPage from "./pages/messaging/CallPage";
import RecentChatsPage from "./pages/messaging/RecentChatsPage";
import TutorPrivateProfilePage from "./pages/tutor/TutorPrivateProfilePage";
import BookingRequestsPage from "./pages/tutor/BookingRequestsPage";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturePage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public-only routes: accessible only if NOT logged in */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Email verification route: accessible only if logged in and NOT verified */}
        <Route
          path="/verify-email"
          element={
            <EmailVerificationRoute>
              <EmailVerificationPage />
            </EmailVerificationRoute>
          }
        />

        {/* Onboarding routes: accessible only if logged in, verified, but NOT onboarded */}
        <Route element={<OnboardingRoute />}>
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route
            path="/student/onboarding"
            element={<StudentOnboardingPage />}
          />
          <Route path="/tutor/onboarding" element={<TutorOnboardingPage />} />
        </Route>

        {/* Student protected routes: require login, verified, onboarded, role = student */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <Layout fullHeight={true} sidebarLinks={studentSidebarLinks} />
            </StudentRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="library" element={<StudentLibraryPage />} />
          <Route path="tutors" element={<StudentTutorsPage />} />
          <Route path="tutor-profile/:id" element={<TutorProfilePage />} />
          <Route
            path="chats"
            element={<RecentChatsPage key={location.pathname} />}
          />
          <Route
            path="chat/:id"
            element={<ChatPage key={location.pathname} />}
          />
          <Route
            path="call/:id"
            element={<CallPage key={location.pathname} />}
          />
          <Route path="booking/:id" element={<StudentBookingPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        {/* Tutor protected routes: require login, verified, onboarded, role = tutor */}
        <Route
          path="/tutor"
          element={
            <TutorRoute>
              <Layout fullHeight={true} sidebarLinks={tutorSidebarLinks} />
            </TutorRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TutorDashboardPage />} />
          <Route path="sessions" element={<TutorSessionsPage />} />
          <Route path="availability" element={<TutorAvailabilityPage />} />
          <Route
            path="chats"
            element={<RecentChatsPage key={location.pathname} />}
          />
          <Route
            path="chat/:id"
            element={<ChatPage key={location.pathname} />}
          />
          <Route
            path="call/:id"
            element={<CallPage key={location.pathname} />}
          />
          <Route path="settings" element={<TutorSettingsPage />} />
          <Route path="profile" element={<TutorPrivateProfilePage />} />
          <Route path="booking-requests" element={<BookingRequestsPage />} />
        </Route>

        {/* Chat & Video/Calling routes: accessible to both students and tutors */}
        {/* Requires: logged-in, verified, onboarded */}
        {/* <Route
          element={
            <PrivateRoute>
              <Layout fullHeight={true} />
            </PrivateRoute>
          }
        >
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/call/:id" element={<CallPage />} />
        </Route> */}

        {/* Admin protected routes: require login, verified, onboarded, role = admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout fullHeight={true} sidebarLinks={adminSidebarLinks} />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="tutors" element={<AdminTutorsPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="report" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
