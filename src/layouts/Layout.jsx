import { useState } from "react";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = ({ children, fullHeight = false, sidebarLinks = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`flex flex-col ${fullHeight ? "min-h-screen" : ""}`}>
      {/* Navbar - fixed at top */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar - fixed on left */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          links={sidebarLinks}
        />

        {/* Main Content Area */}
        <MainContent fullHeight={fullHeight}>
          {children || <Outlet />}
        </MainContent>
      </div>
    </div>
  );
};

export default Layout;
