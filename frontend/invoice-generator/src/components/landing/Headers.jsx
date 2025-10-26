"use client";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "../layout/ProfileDropdown";
import Button from "../ui/Button";
const Headers = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = true;
  const user = { name: "Utsav", email: "utsav@gmail.com" };
  const logout = () => {};

  const navigate = useNavigate();

  const [profileDropDownOpen, setProfileDropDownOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-600">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray-100 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                invoiceiq.com
              </span>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all hover:after:w-full"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all hover:after:w-full"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all hover:after:w-full"
              >
                FAQs
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <ProfileDropdown
                  isOpen={profileDropDownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropDownOpen(!profileDropDownOpen);
                  }}
                  avatar={user?.avatar || ""}
                  companyName={user?.name || ""}
                  email={user?.email || ""}
                  onLogout={logout}
                />
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="text-black hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/signup"}
                    className="bg-linear-to-r from-orange-500 to-orange-600 hover:bg-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="lg:hidden ">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                FAQs
              </a>
              <div className="border-t border-gray-200 my-2"></div>
              {isAuthenticated ? (
                <div className="p-4">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="block px-4 py-3 text-gray-600 hover:text-gray-50 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/signup"}
                    className="block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-3 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Headers;
