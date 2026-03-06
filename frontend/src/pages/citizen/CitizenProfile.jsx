// citizen/pages/CitizenProfile.jsx
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import ProfileHeader from "@/components/citizen/ProfileHeader";
import ProfileInfoCard from "@/components/panjayath/Profileinfocard";
import VerificationNotice from "@/components/citizen/VerificationNotice";
import AccountSecurityCard from "@/components/citizen/AccountSecuritycard";

export default function CitizenProfile() {
  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, statusRes] = await Promise.all([
        fetch("/api/citizen/profile/", { headers }),
        fetch("/api/citizen/verification-status/", { headers }),
      ]);

      if (!profileRes.ok) throw new Error("Failed to load profile data.");
      const profileData = await profileRes.json();
      setProfile(profileData);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setVerificationStatus(statusData.status || "NOT_SUBMITTED");
      } else {
        setVerificationStatus("NOT_SUBMITTED");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImageUpdate = useCallback((newImageUrl) => {
    setProfile((prev) => prev ? { ...prev, profile_image: newImageUrl } : prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Page title bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your account and security settings
            </p>
          </div>
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error banner */}
        {error && !loading && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Failed to load profile</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={fetchProfile}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Verification notice — shown for all non-verified states */}
        {!loading && verificationStatus !== "APPROVED" && (
          <VerificationNotice status={verificationStatus || "NOT_SUBMITTED"} />
        )}

        {/* Profile header card */}
        <div className="mb-5">
          <ProfileHeader
            profile={profile}
            verificationStatus={verificationStatus}
            loading={loading}
          />
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
          {/* Left — profile info */}
          <div className="lg:col-span-3">
            <ProfileInfoCard
              profile={profile}
              loading={loading}
              onImageUpdate={handleImageUpdate}
            />
          </div>

          {/* Right — account security */}
          <div className="lg:col-span-2 space-y-4">
            <AccountSecurityCard />

            {/* Quick links card */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Quick Links
                </p>
                <div className="space-y-1">
                  {[
                    { label: "View My Issues", path: "/citizen/my-issues" },
                    { label: "Community Feed", path: "/citizen/home" },
                    { label: "Verification Page", path: "/citizen/verification" },
                    { label: "Notifications", path: "/citizen/notifications" },
                  ].map(({ label, path }) => (
                    <a
                      key={path}
                      href={path}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group"
                    >
                      <span>{label}</span>
                      <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}