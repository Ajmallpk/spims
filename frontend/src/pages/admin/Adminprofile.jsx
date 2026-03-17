import { useState, useEffect } from "react";
import axios from "axios";
import { UserCog } from "lucide-react";
import AdminInfoCard from "@/components/admin/Admininfocard";
import SecuritySettingsCard from "@/components/admin/Securitysettingscard";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await adminapi.profile()
        setProfile(data);
      } catch (err) {
        handleApiError(err, "Error fetching admin profile:");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-indigo-100 rounded-xl mt-0.5">
          <UserCog className="w-5 h-5 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Admin Profile
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account and security settings
          </p>
        </div>
      </div>

      {/* Two-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Profile Info */}
        <AdminInfoCard profile={profile} isLoading={loading} />

        {/* Right: Security Settings */}
        <SecuritySettingsCard profile={profile} />
      </div>
    </div>
  );
};

export default AdminProfile;