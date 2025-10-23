"use client";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
const Headers = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = false;
  const user = { name: "Utsav", email: "utsav@gmail.com" };
  const logout = () => {};

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
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
              >
                Features
              </a>
              <a href="#testimonials" className="">
                Testimonials
              </a>
              <a href="#faq" className="">
                FAQs
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to={"/login"}
                className="text-black hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to={"/signup"}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:bg-orange-400 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
            <div className="">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="">
                {isMenuOpen ? <X className="" /> : <Menu className="" />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Headers;
