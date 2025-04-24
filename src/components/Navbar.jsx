import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#1ABC9C] h-10 w-10 rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">GoalMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-[#1ABC9C]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/planner"
              className={`transition-colors ${
                isActive("/planner")
                  ? "text-[#1ABC9C]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Planner
            </Link>
            <Link
              to="/todo"
              className={`transition-colors ${
                isActive("/todo")
                  ? "text-[#1ABC9C]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Todo
            </Link>
            <Link
              to="/signin"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`transition-colors ${
                  isActive("/") ? "text-[#1ABC9C]" : "text-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                to="/planner"
                className={`transition-colors ${
                  isActive("/planner") ? "text-[#1ABC9C]" : "text-gray-300"
                }`}
              >
                Planner
              </Link>
              <Link
                to="/todo"
                className={`transition-colors ${
                  isActive("/todo") ? "text-[#1ABC9C]" : "text-gray-300"
                }`}
              >
                Todo
              </Link>
              <Link to="/signin" className="text-gray-300">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
