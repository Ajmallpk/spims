/**
 * Profile.jsx
 * Citizen Profile page — SPIMS.
 * Fetches profile + issue history, manages all child state.
 *
 * Replace getAuthToken() with your own auth utility.
 */

import { useState, useEffect, useCallback } from "react";
import ProfileHeader from "@/components/citizen/Profileheader";
import ProfileInfoCard from "@/components/citizen/Profileinfocard";
import ProfileStats from "@/components/citizen/Profilestats";
import SecuritySettings from "@/components/citizen/Securitysettings";
import IssueHistory from "@/components/citizen/Issuehistory";
import EditProfileModal from "@/components/citizen/Editprofilemodal";

// ─── Auth helper ─────────────────────────────────────────────────────────────
const getAuthToken = () => localStorage.getItem("spims_token") || "";

// ─── Fetch helper ─────────────────────────────────────────────────────────────
const fetchWithAuth = async (url, token, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Profile = () => {
  const token = getAuthToken();

  const [profile, setProfile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [profileData, issueData] = await Promise.all([
        fetchWithAuth("/api/citizen/profile/", token),
        fetchWithAuth("/api/citizen/issues/my/", token),
      ]);
      setProfile(profileData);
      setIssues(issueData?.results ?? issueData ?? []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAvatarUpload = (newUrl) => {
    setProfile((prev) => ({ ...prev, avatarUrl: newUrl }));
  };

  const handleProfileUpdate = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-gray-100 pt-4 pb-3 border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-600">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-xs text-gray-400">SPIMS · Smart Panchayath</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 text-xs text-teal-600 font-medium px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {fetchError && !loading && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Failed to load profile</p>
              <p className="text-xs text-red-500">{fetchError}</p>
            </div>
            <button onClick={loadData} className="text-xs text-red-600 font-semibold hover:underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <ProfileHeader
          profile={profile}
          loading={loading}
          onAvatarUpload={handleAvatarUpload}
          onEditClick={() => setIsEditOpen(true)}
          token={token}
        />
        <ProfileInfoCard profile={profile} loading={loading} />
        <ProfileStats issues={issues} loading={loading} />
        <SecuritySettings profile={profile} token={token} />
        <IssueHistory issues={issues} loading={loading} />
      </main>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onUpdateSuccess={handleProfileUpdate}
        token={token}
      />
    </div>
  );
};

export default Profile;