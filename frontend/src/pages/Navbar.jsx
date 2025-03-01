import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navbar Content */}
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <svg
                className="relative w-8 h-8 text-blue-400 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Vaulture</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/story"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About Us
            </Link>
            {/* <Link
              to="/features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link> */}
            <Link
              to="/FileInput"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Upload
            </Link>
            <Link
              to="/download"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Download
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </Link>

            {/* Conditional rendering based on authentication */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-gray-900 z-40">
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/"
                className="block px-4 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/story"
                className="block px-4 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              {/* <Link
                to="/features"
                className="block px-4 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md"
                onClick={toggleMenu}
              >
                Features
              </Link> */}
              <Link
                to="/FileInput"
                className="block px-4 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md"
                onClick={toggleMenu}
              >
                Upload
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md"
                onClick={toggleMenu}
              >
                Contact
              </Link>

              {/* Conditional rendering for mobile menu */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <div className="pt-6 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
