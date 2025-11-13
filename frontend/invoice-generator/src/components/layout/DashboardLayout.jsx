import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <>
      <div className="">
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          } ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-gray-200`}
        >
          {/*Logo*/}
          <div className="">
            <Link to={"/dashboard"} className="">
              <div className="">
                <Briefcase className="" />
              </div>
              {!sidebarCollapsed && <span className="">AI Invoice App</span>}
            </Link>
          </div>
          {/*Navigation*/}
          <nav className=""></nav>
          {/*Logout*/}
          <div className="">
            <button className="" onClick={logout}>
              <LogOut className="" />
              {sidebarCollapsed && <span className="">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
