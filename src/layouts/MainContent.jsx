import { Outlet } from "react-router-dom";

const MainContent = ({ children, fullHeight = false }) => {
  return (
    <main
      className={`
      transition-all duration-300 ease-in-out pt-16 lg:pl-64 ${
        fullHeight ? "min-h-screen" : "min-h-full"
      }
    `}
    >
      {/* Content container with proper spacing */}
      <div
        className={`
        p-6 
        ${fullHeight ? "h-full" : ""}
      `}
      >
        {children || <Outlet />}
      </div>
    </main>
  );
};

export default MainContent;
