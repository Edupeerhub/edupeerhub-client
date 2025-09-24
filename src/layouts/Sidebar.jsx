import { NavLink } from "react-router-dom";
import LogoutIcon from "../assets/images/layout-icons/logout.svg?react";
import Logo from "../assets/images/edupeerhub-logo1.svg?react";
import useLogout from "../hooks/auth/useLogout";

const Sidebar = ({ isOpen, onClose, links = [] }) => {
  const { logoutMutation } = useLogout();

  const baseClasses =
    "btn btn-ghost justify-start w-full gap-3 px-3 normal-case transition-colors duration-200";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay - Dark background when sidebar is open */}
      {/* Only shows on mobile (lg:hidden) when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed top-0 left-0 z-40 
    w-[75%] md:w-64 h-full 
        bg-white text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0    
        border-r-2 border-[#D5D8DA]   
        flex flex-col
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center gap-3 p-5 ">
          <Logo className="hidden md:block size-10  " />{" "}
          <h1 className="hidden md:block text-2xl font-bold text-gray-900">
            Edupeerhub
          </h1>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="md:hidden ml-auto p-2 rounded-md text-gray-400 hover:text-white bg-gray-700 transition-colors "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-7 mt-4">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => handleLinkClick()}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive
                    ? " text-[#0568FF] bg-[#CDE1FF]"
                    : "text-[#2C3A47] hover:text-[#0568FF] hover:bg-[#CDE1FF]"
                }`
              }
            >
              {Icon && (
                <Icon
                  className="size-5 opacity-70"
                  style={{
                    fill: "cuurrentColor",
                    stroke: "currentColor",
                  }}
                />
              )}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4">
          <button
            className="flex w-full justify-center items-center gap-3 text-[#0568FF]  border border-[#0568FF] rounded-full p-3"
            onClick={logoutMutation}
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
