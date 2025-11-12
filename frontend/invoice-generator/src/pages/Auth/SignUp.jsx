import {
  FileText,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  User,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  // Validation functions
  const validateName = (name) => {};

  const handleInputChange = (e) => {};

  const handleBlur = (e) => {};

  const isFormValid = () => {};

  const handleSubmit = async () => {};
  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <div className="">
              <FileText className="" />
            </div>
            <h1 className="">Create Account</h1>
            <p className="">Join Invoice Generator Today!</p>
          </div>
          {/*Form*/}
          <div className="">
            <div className="">
              <label className="">Full Name</label>
              <div className="">
                <User className="" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                    fieldErrors.name && touched.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {fieldErrors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>
            <div className="">
              <label className="">Email</label>
              <div className="">
                <Mail className="" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                    fieldErrors.email && touched.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {fieldErrors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            <div className="">
              <label>Password</label>
              <div className="">
                <Lock className="" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                    fieldErrors.password && touched.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  placeholder="Create your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <div className="">
              <label className="">Confirm Password</label>
              <div className="">
                <Lock className="" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                    fieldErrors.confirmPassword && touched.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
            {/*Error/Success Messages*/}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              className="w-full bg-linear-to-r from-orange-400 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
