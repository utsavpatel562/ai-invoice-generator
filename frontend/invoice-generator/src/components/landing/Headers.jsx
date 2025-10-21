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
        <div className="">
          <div className="">
            <div className="">
              <div className="">
                <FileText className="" />
              </div>
              <span className="">invoiceiq.com</span>
            </div>
            <div className="">
              <a href="#features" className="">
                Features
              </a>
              <a href="#testimonials" className="">
                Testimonials
              </a>
              <a href="#faq" className="">
                FAQs
              </a>
            </div>
            <div className="">
              <Link to={"/login"} className="">
                Login
              </Link>
              <Link to={"/signup"} className="">
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
