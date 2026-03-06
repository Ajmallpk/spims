// citizen/pages/CitizenVerification.jsx
import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import CitizenInfoCard from "@/components/ward/Citizeninfocard";
import VerificationStatusCard from "@/components/panjayath/Verificationstatuscard";
import VerificationProgress from "@/components/ward/Verificationprogress";
import CitizenVerificationForm from "@/components/citizen/CitizenVerificationform";

const FORM_ALLOWED_STATUSES = ["NOT_SUBMITTED", "REJECTED"];

export default function CitizenVerification() {
  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, statusRes] = await Promise.all([
        fetch("/api/citizen/profile/", { headers }),
        fetch("/api/citizen/verification-status/", { headers }),
      ]);

      if (!profileRes.ok) throw new Error("Failed to load profile.");
      if (!statusRes.ok) throw new Error("Failed to load verification status.");

      const profileData = await profileRes.json();
      const statusData = await statusRes.json();

      setProfile(profileData);
      setVerificationStatus(statusData.status || "NOT_SUBMITTED");
      setRejectionReason(statusData.rejection_reason || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerificationSuccess = () => {
    setVerificationStatus("PENDING");
  };

  const showForm = FORM_ALLOWED_STATUSES.includes(verificationStatus) || loading;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Citizen Verification
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Complete your identity verification to access all features
                </p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Failed to load data</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* LEFT COLUMN — info, status, progress */}
          <div className="lg:col-span-2 space-y-4">
            <CitizenInfoCard profile={profile} loading={loading} />
            <VerificationStatusCard
              status={verificationStatus}
              rejectionReason={rejectionReason}
              loading={loading}
            />
            <VerificationProgress status={verificationStatus} />
          </div>

          {/* RIGHT COLUMN — form or status message */}
          <div className="lg:col-span-3">
            {loading ? (
              // Form skeleton
              <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-5">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-3.5 bg-gray-100 rounded w-72" />
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-20" />
                      <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gray-100" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-36 bg-gray-100 rounded-xl" />
                  <div className="h-36 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-12 bg-gray-200 rounded-xl" />
              </div>
            ) : showForm ? (
              <CitizenVerificationForm
                profile={profile}
                onSuccess={handleVerificationSuccess}
              />
            ) : (
              // Locked state for PENDING / APPROVED
              <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center text-center gap-4">
                {verificationStatus === "APPROVED" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">You're Verified!</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Your identity has been verified. You have full access to all citizen features.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-xs font-semibold text-emerald-700">Verified Citizen</span>
                    </div>
                  </>
                ) : verificationStatus === "PENDING" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Under Review</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Your documents are being reviewed by the ward authority. Please check back in 1–2 business days.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse inline-block" />
                      <span className="text-xs font-semibold text-yellow-700">Pending Review</span>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}