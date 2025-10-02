import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import Button from "./LandingButton";
import { ASSETS } from "../../config/assets";
import useAuthUser from "../../hooks/auth/useAuthUser";
import Logo from "../../assets/images/edupeerhub-logo.svg?react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser } = useAuthUser();
  const isAuthenticated = !!authUser;

  const roleLink =
    authUser?.role === "tutor"
      ? "/tutor"
      : authUser?.role === "student"
      ? "/student"
      : "/admin";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "home" },
    { label: "Features", href: "features" },
    { label: "About", href: "about" },
    { label: "Contact Us", href: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#deeaf6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-col items-center">
              <img
                src={ASSETS.logo?.image}
                alt={ASSETS.logo?.alt}
                className="h-8 md:h-8"
              />
              <p className="hidden sm:block text-xl md:text-xl font-bold text-blue-600">
                edupeerhub
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button to={roleLink} variant="primary" size="md">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Log In
                </Button>
                <Button to="/signup" variant="primary" size="md">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 space-y-2 border-t border-gray-200">
              {isAuthenticated ? (
                <Button
                  to={roleLink}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    to="/login"
                    variant="ghost"
                    size="md"
                    className="w-full"
                  >
                    Log In
                  </Button>
                  <Button
                    to="/signup"
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
