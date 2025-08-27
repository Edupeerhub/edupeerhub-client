// ===== STEP 2: BUILDING THE NAVBAR COMPONENT =====
const Navbar = ({ onToggleSidebar, title = "My App" }) => {
  return (
    // Fixed positioning keeps navbar at top when scrolling
    // z-50 ensures it stays above other elements
    // bg-white with shadow for clean look
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Hamburger menu + Title */}
          <div className="flex items-center gap-4">
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

            {/* App Title */}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Right side: User menu, notifications, etc. */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
