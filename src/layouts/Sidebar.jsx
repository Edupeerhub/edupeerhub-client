// ===== STEP 3: BUILDING THE SIDEBAR COMPONENT =====
const Sidebar = ({ isOpen, onClose }) => {
  // Navigation links data - easy to modify
  const navigationLinks = [
    { name: "Home", href: "#", icon: "🏠" },
    { name: "Dashboard", href: "#", icon: "📊" },
    { name: "Settings", href: "#", icon: "⚙️" },
    { name: "Logout", href: "#", icon: "🚪" },
  ];

  const handleLinkClick = (linkName) => {
    alert(`Clicked: ${linkName}`);
    // On mobile, close sidebar when link is clicked
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
        w-64 h-full 
        bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        
        
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } /* On mobile: slide in/out based on isOpen state */
        
        lg:translate-x-0         /* On desktop (lg:): always visible, no transform */

      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Navigation</h2>

          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
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
        <nav className="flex-1 p-4 space-y-2">
          {navigationLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.name)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                       text-gray-300 hover:text-white hover:bg-gray-700 
                       transition-colors duration-200"
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
