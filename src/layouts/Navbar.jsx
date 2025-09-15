import { BellIcon } from "lucide-react";
import Logo from "../assets/images/edupeerhub-logo1.svg?react";
import useAuthUser from "../hooks/auth/useAuthUser";
const Navbar = ({ onToggleSidebar }) => {
  const { authUser } = useAuthUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md border-b border-gray-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo */}
          <div className="flex items-center pl-3">
            {/* App Logo */}
            <Logo className="lg:hidden size-9 " />
          </div>

          {/* Right side: Hamburger menu, User menu, notifications, etc. */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
            <div className="avatar cursor-pointer">
              <div className="w-8 sm:w-9 rounded-full border-2 border-gray-300 transition-all hover:ring-2 hover:ring-gray-400/50">
                <img src={authUser?.profileImageUrl} alt="User Avatar" />
              </div>
            </div>

            {/* Hamburger Menu Button - Only visible on mobile/tablet */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {/* Hamburger Icon (3 lines) */}
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
