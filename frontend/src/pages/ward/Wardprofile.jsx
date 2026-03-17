import { useState, useEffect, useCallback } from "react";
import WardInfoCard from "@/components/ward/Wardinfocard";
import VerificationStatusCard from "@/components/ward/Verificationstatuscard";
import VerificationProgress from "@/components/ward/Verificationprogress";
import WardVerificationForm from "@/components/ward/Wardverificationform";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";
import WardSecuritySettings from "@/components/ward/WardSecuritySettings";
import { useLocation, useNavigate } from "react-router-dom";

// ── Right panel states ────────────────────────────────────────────────────────

function PendingPanel() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-amber-400 to-yellow-400" />
      <div className="p-8 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-amber-50 border-2 border-amber-100 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Documents Under Review</h3>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Your verification documents have been submitted and are currently being reviewed by the administrative team. This process typically takes <span className="font-semibold text-gray-700">1–3 business days</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0" />
          <p className="text-xs font-semibold text-amber-700">Awaiting administrative review</p>
        </div>
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs mt-1">
          {[
            { label: "Documents submitted", done: true },
            { label: "Admin review in progress", done: false },
            { label: "Access granted on approval", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                ${item.done ? "bg-green-500" : "bg-gray-200"}`}>
                {item.done && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={item.done ? "text-green-700 font-medium" : "text-gray-400"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 max-w-xs">
          You'll receive an update once the review is complete.
        </p>
      </div>
    </div>
  );
}

function ApprovedPanel() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-green-400 to-teal-500" />
      <div className="p-8 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Verification Approved</h3>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Your identity and officer credentials have been verified. You now have full access to all ward management features.
          </p>
        </div>

        {/* Features unlocked */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-1">
          {[
            { icon: "👥", label: "Citizen\nManagement" },
            { icon: "✅", label: "Verification\nRequests" },
            { icon: "📋", label: "Complaint\nManagement" },
          ].map((f) => (
            <div key={f.label}
              className="flex flex-col items-center gap-1.5 p-3.5 bg-green-50 border border-green-100 rounded-xl hover:shadow-sm transition-shadow">
              <span className="text-xl">{f.icon}</span>
              <span className="text-xs font-semibold text-green-700 text-center leading-tight whitespace-pre-line">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl">
          <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          <p className="text-xs font-semibold text-green-700">Full access active</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function WardProfile() {
  const token = localStorage.getItem("access");

  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [changedEmail, setChangedEmail] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ── Fetchers ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (location.state?.emailChanged) {
      setChangedEmail(location.state.newEmail);
      setShowEmailModal(true);

      // clear router state properly
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (location.state?.emailCancelled) {
      setShowCancelModal(true);

      // clear router state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);



  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);

      const res = await wardapi.profile();

      setProfile(res.data);
    } catch (err) {
      // interceptor will show toast
      
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setIsLoadingVerification(true);

      const res = await wardapi.verificationStatus();

      setVerificationStatus(res.data);

    } catch (err) {
      // interceptor will show toast
    } finally {
      setIsLoadingVerification(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchVerificationStatus();
  }, [fetchProfile, fetchVerificationStatus]);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // ── Event handlers ────────────────────────────────────────────────────────────

  const handleVerificationSuccess = () => {
    setSuccessMessage(
      "Verification documents submitted successfully! Your request is now under review."
    );

    // Immediately update UI
    setVerificationStatus({ status: "PENDING" });

    // Then refresh from backend
    fetchVerificationStatus();
  };

  const handleRefresh = () => {
    fetchProfile();
    fetchVerificationStatus();
  };

  // ── Derived state ─────────────────────────────────────────────────────────────

  const isLoading = isLoadingProfile || isLoadingVerification;
  const status = (verificationStatus?.status ?? "not_submitted").toLowerCase();
  const showForm = status === "not_submitted" || status === "rejected";
  const showPending = status === "pending";
  const showApproved = status === "approved";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (

    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your ward officer profile and verification status
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium
            text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50
            transition-colors disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd" />
          </svg>
          <p className="text-sm text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Approved access banner */}
      {!isLoading && showApproved && (
        <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white shadow-md">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-bold">Full Ward Access Granted</p>
            <p className="text-xs text-green-100 mt-0.5">
              Your verification is complete. All ward management features are now available.
            </p>
          </div>
        </div>
      )}

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left column (1/3) ── */}
        <div className="lg:col-span-1 space-y-5">
          <WardInfoCard profile={profile} isLoading={isLoadingProfile} />

          {isLoadingVerification ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-4/5" />
              <div className="h-3 bg-gray-100 rounded w-3/5" />
            </div>
          ) : (
            <VerificationStatusCard
              status={status}
              rejectionReason={
                verificationStatus?.rejection_reason ??
                verificationStatus?.reason ??
                null
              }
            />
          )}

          {/* Show progress only after submission */}
          {!isLoadingVerification && status !== "not_submitted" && (
            <VerificationProgress status={status} />
          )}
          {profile && (
            <WardSecuritySettings profile={profile} />
          )}
        </div>

        {/* ── Right column (2/3) ── */}
        <div className="lg:col-span-2">
          {isLoadingVerification ? (
            /* Form skeleton */
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-1.5 bg-gray-200" />
              <div className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                      <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-28 bg-gray-100 rounded-xl" />
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ) : showForm ? (
            <WardVerificationForm
              onSuccess={handleVerificationSuccess}
              prefillData={profile}
            />
          ) : showPending ? (
            <PendingPanel />
          ) : showApproved ? (
            <ApprovedPanel />
          ) : null}
        </div>

      </div>





      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl text-center">

            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                ✓
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Email Updated Successfully
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              Your email has been successfully changed.
            </p>

            <p className="text-sm font-medium text-gray-800 mb-6">
              New Email: <span className="text-teal-600">{changedEmail}</span>
            </p>

            <button
              onClick={() => setShowEmailModal(false)}
              className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600"
            >
              Continue
            </button>

          </div>

        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl text-center">

            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-bold">
                !
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Email Change Cancelled
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              You cancelled the email change request.
              Your email address remains unchanged.
            </p>

            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
            >
              Continue
            </button>

          </div>

        </div>
      )}
    </div>
  );
}