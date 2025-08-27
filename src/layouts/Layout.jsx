import { useState } from "react";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

// ===== STEP 1: UNDERSTANDING THE LAYOUT STRUCTURE =====
// We need 4 main components:
// 1. Layout - The main wrapper that controls everything
// 2. Navbar - Fixed at top, contains hamburger menu + title
// 3. Sidebar - Fixed on left, hidden on mobile by default
// 4. MainContent - The area where page content goes

// ===== STEP 5: LAYOUT COMPONENT - PUTS IT ALL TOGETHER =====
const Layout = ({ children, title, fullHeight = false }) => {
  // State to control sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - fixed at top */}
      <Navbar onToggleSidebar={toggleSidebar} title={title} />

      {/* Sidebar - fixed on left */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <MainContent fullHeight={fullHeight}>{children}</MainContent>
    </div>
  );
};

export default Layout;
