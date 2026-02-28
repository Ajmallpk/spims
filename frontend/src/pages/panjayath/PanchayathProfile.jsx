// pages/PanchayathProfile.jsx
// SPIMS – Smart Panchayath Issue Management System
// Panchayath Profile & Verification page.
//
// API calls:
//   GET  /api/panchayath/profile/              → profile data
//   GET  /api/panchayath/verification-status/  → { status, rejection_reason, ... }
//
// Conditionally renders:
//   NOT_SUBMITTED / REJECTED → VerificationForm
//   PENDING                  → Pending message
//   APPROVED                 → Verified success banner

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProfileInfoCard from "@/components/panjayath/Profileinfocard";
import VerificationStatusCard from "@/components/panjayath/Verificationstatuscard";
import VerificationForm from "@/components/panjayath/Verificationform";
import panchayathapi from "@/service/panchayathurls"

// ─── Auth helper ─────────────────────────────────────────────────────────────

function getAuthHeader() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Success toast shown after form submission
function SubmissionSuccessToast({ onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xl">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-emerald-800">Verification Submitted</p>
          <p className="text-xs text-emerald-700 mt-0.5 font-medium">
            Your verification request has been submitted successfully. You will be notified after review.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-emerald-400 hover:text-emerald-700 transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// APPROVED success banner
function ApprovedBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl px-6 py-5 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10 pointer-events-none" />
      <div className="absolute right-16 -bottom-4 w-16 h-16 rounded-full bg-white opacity-5 pointer-events-none" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-0.5">
            Account Verified
          </p>
          <h3 className="text-lg font-black leading-tight">
            Full System Access Granted
          </h3>
          <p className="text-emerald-100 text-sm mt-1 leading-snug">
            Your Panchayath account has been verified and approved. All SPIMS features are now active.
          </p>
        </div>
      </div>
    </div>
  );
}

// PENDING banner
function PendingBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 px-6 py-5 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-black text-amber-900">Awaiting Administrative Review</h3>
          <p className="text-sm text-amber-800 mt-1 leading-relaxed">
            Your verification request has been received and is currently under review by the District Administration Office.
            No action is required at this time. You will receive a notification once the review is complete.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Review in Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page-level error state
function PageError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-rose-400">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-700">Failed to Load Profile</h3>
      <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors duration-150"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Retry
      </button>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function PanchayathProfile() {
  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError("");
    try {
      const { data } = await panchayathapi.profile()
      setProfile(data);
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("[PanchayathProfile] Unauthorized – JWT may be expired.");
      } else {
        console.error("[PanchayathProfile] Profile fetch error:", err);
      }
      setProfileError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to load profile information."
      );
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // ── Fetch verification status ─────────────────────────────────────────────
  const fetchVerificationStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setStatusError("");
    try {
      const { data } = await panchayathapi.verificationStatus();
      setVerificationStatus(data);

      // Sync localStorage verification flags so sidebar locking stays consistent
      const status = (data?.status || "").toUpperCase();
      localStorage.setItem("is_verified", String(status === "APPROVED"));
      localStorage.setItem(
        "verification_submitted",
        String(["PENDING", "APPROVED", "REJECTED"].includes(status))
      );
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("[PanchayathProfile] Unauthorized – JWT may be expired.");
      } else {
        console.error("[PanchayathProfile] Verification status fetch error:", err);
      }
      setStatusError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to load verification status."
      );
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchProfile();
    fetchVerificationStatus();
  }, [fetchProfile, fetchVerificationStatus]);

  // ── After successful form submission ──────────────────────────────────────
  const handleVerificationSuccess = () => {
    setShowSuccessToast(true);
    fetchVerificationStatus(); // Refresh status
  };

  // ── Derive current status key ─────────────────────────────────────────────
  const currentStatus = (verificationStatus?.status || "NOT_SUBMITTED").toUpperCase();
  const showForm = currentStatus === "NOT_SUBMITTED" || currentStatus === "REJECTED";
  const showPending = currentStatus === "PENDING";
  const showApproved = currentStatus === "APPROVED";

  const pageError = profileError && statusError;


  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-slate-400 font-medium">Panchayath</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-xs text-blue-600 font-semibold">Profile</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Account information and verification management
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={() => { fetchProfile(); fetchVerificationStatus(); }}
          disabled={isLoadingProfile || isLoadingStatus}
          className="flex-shrink-0 self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 ${isLoadingProfile || isLoadingStatus ? "animate-spin" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Full page error (both requests failed) ── */}
      {pageError && (
        <PageError
          message="Unable to load profile and verification data. Please check your connection."
          onRetry={() => { fetchProfile(); fetchVerificationStatus(); }}
        />
      )}

      {/* ── Main content ── */}
      {!pageError && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Left column: Profile + Status cards ── */}
          <div className="xl:col-span-1 space-y-5">
            {/* Profile Info */}
            <ProfileInfoCard
              profile={profile}
              isLoading={isLoadingProfile}
            />

            {/* Verification Status */}
            {!statusError && (
              <VerificationStatusCard
                verificationStatus={verificationStatus}
                isLoading={isLoadingStatus}
              />
            )}

            {/* Status fetch error (non-critical) */}
            {statusError && !isLoadingStatus && (
              <div className="bg-white rounded-2xl border border-rose-200 shadow-md px-5 py-4">
                <p className="text-sm text-rose-600 font-medium">{statusError}</p>
                <button
                  onClick={fetchVerificationStatus}
                  className="mt-2.5 text-xs text-blue-600 font-semibold hover:underline"
                >
                  Retry →
                </button>
              </div>
            )}
          </div>

          {/* ── Right column: Action area ── */}
          <div className="xl:col-span-2 space-y-5">
            {/* Approved banner */}
            {showApproved && !isLoadingStatus && <ApprovedBanner />}

            {/* Pending banner */}
            {showPending && !isLoadingStatus && <PendingBanner />}

            {/* Verification form: NOT_SUBMITTED or REJECTED */}
            {showForm && !isLoadingStatus && !statusError && (
              <VerificationForm
                onSuccess={handleVerificationSuccess}
                isRejected={currentStatus === "REJECTED"}
              />
            )}

            {/* Loading placeholder for right column */}
            {isLoadingStatus && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                  <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse mb-1.5" />
                  <div className="h-3 w-32 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="px-6 py-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 w-28 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                  ))}
                  <div className="h-32 w-full bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Success toast ── */}
      {showSuccessToast && (
        <SubmissionSuccessToast onDismiss={() => setShowSuccessToast(false)} />
      )}
    </div>
  );
}