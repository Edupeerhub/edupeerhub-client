import { BellIcon, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useAuthUser from "../hooks/auth/useAuthUser";
import ProfileDropdown from "../components/navbar/ProfileDropdown";

const Navbar = ({ onToggleSidebar }) => {
  const { authUser } = useAuthUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileMenuClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleMenuItemClick = (action) => {
    setIsProfileDropdownOpen(false);
    console.log(`Clicked: ${action}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md border-b border-gray-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          {/* Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-auto"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={handleProfileMenuClick}
                className="flex items-center gap-2 sm:gap-3 bg-gray-50 hover:bg-gray-100 rounded-full pl-1 pr-2 sm:pr-4 py-1 cursor-pointer transition-colors border border-gray-200"
              >
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={authUser?.profileImageUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-800 max-w-32 truncate">
                  {authUser?.firstName} {authUser?.lastName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isProfileDropdownOpen && (
                <ProfileDropdown
                  authUser={authUser}
                  onSelect={handleMenuItemClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
