import React from "react";
// ===== STEP 4: MAIN CONTENT WRAPPER =====
const MainContent = ({ children, fullHeight = false }) => {
  return (
    <main
      className={`
      transition-all duration-300 ease-in-out
      
      /* Always leave space for navbar at top */
      pt-16
      
      /* On desktop: leave space for sidebar on left */
      lg:pl-64
      
      /* Height behavior based on fullHeight prop */
      ${fullHeight ? "min-h-screen" : "min-h-full"}
    `}
    >
      {/* Content container with proper spacing */}
      <div
        className={`
        p-6 
        ${fullHeight ? "h-full" : ""}
      `}
      >
        {children}
      </div>
    </main>
  );
};

export default MainContent;
