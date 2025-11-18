import { useAuth } from "../../context/AuthContext";
import { Loader2, User, Mail, Building, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );
      updateUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden mt-6">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-200 bg-linear-to-r from-orange-50 to-orange-50">
        <h3 className="text-xl font-semibold text-slate-900">My Profile</h3>
        <p className="text-sm text-slate-600 mt-1">
          Manage your personal and business details
        </p>
      </div>

      <form onSubmit={handleUpdateProfile}>
        <div className="p-8 space-y-8">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                disabled
                className="w-full h-11 pl-11 pr-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Full Name */}
          <InputField
            label="Full Name"
            name="name"
            icon={User}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />

          {/* Business Info */}
          <div className="pt-2">
            <h4 className="text-lg font-semibold text-slate-800">
              Business Information
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Used to pre-fill the “Bill From” section of your invoices.
            </p>

            <div className="space-y-6">
              <InputField
                label="Business Name"
                name="businessName"
                icon={Building}
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your company name"
              />

              <TextareaField
                label="Address"
                name="address"
                icon={MapPin}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, Toronto, Canada"
              />

              <InputField
                label="Phone"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="437-991-6784"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 text-white bg-orange-500 hover:bg-orange-600 cursor-pointer rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
