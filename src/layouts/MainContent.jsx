import { Outlet } from "react-router-dom";

const MainContent = ({ children, fullHeight = false }) => {
  return (
    <main
      className={`
      transition-all duration-300 ease-in-out pt-16 lg:pl-64 
        flex-1 ${fullHeight ? "flex" : ""}
      
    `}
    >
      {/* Content container with proper spacing */}
      <div
        className={`
        p-6 
        ${fullHeight ? "flex-1" : ""}
      `}
      >
        {children || <Outlet />}
      </div>
    </main>
  );
};

export default MainContent;
