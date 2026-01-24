import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Menu, X, User, LogOut, Upload, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-600 rounded-lg p-2 group-hover:scale-105 transition-transform duration-200">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ResumeAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Nav Links with underline animation */}
            <Link
              to="/"
              className="relative px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Home
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/upload"
                  className="relative px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
                >
                  <span className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Upload
                  </span>
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </Link>
                <Link
                  to="/dashboard"
                  className="relative px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
                >
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </span>
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </Link>

                {/* User Menu */}
                <div className="relative group ml-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors duration-200">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <svg className="h-4 w-4 transition-transform group-hover:rotate-180 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {user.full_name || user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <button className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-1">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Upload className="h-4 w-4" /> Upload
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" /> Dashboard
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user.full_name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
