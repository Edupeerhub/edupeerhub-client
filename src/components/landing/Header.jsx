import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/edupeerhub-logo1.svg?react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow z-50 font-poppins">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-500">
              About
            </Link>
          </li>
          <li>
            <Link to="/features" className="hover:text-blue-500">
              Features
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-500">
              Contact Us
            </Link>
          </li>
          <Link
            to="/signup"
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            SIGN UP
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            LOGIN
          </Link>
        </ul>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden flex flex-col bg-gray-100 px-6 py-4 space-y-4">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/features" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact Us
          </Link>
          <Link
            to="/signup"
            className="bg-blue-400 text-white px-4 py-2 rounded"
          >
            SIGN UP
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            LOGIN
          </Link>
        </ul>
      )}
    </header>
  );
};

export default Header;
