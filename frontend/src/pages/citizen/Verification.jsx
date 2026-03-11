/**
 * Verification.jsx
 * Citizen Verification page for SPIMS.
 * Fetches profile + verification status, orchestrates layout.
 *
 * Expected env / context:
 *   - getAuthToken() → string  (replace with your auth utility)
 *   - API base: /api/citizen/
 */

import { useState, useEffect, useCallback } from "react";
import CitizenInfoCard from "@/components/citizen/Citizeninfocard";
import VerificationStatusCard from "@/components/citizen/Verificationstatuscard";
import VerificationProgress from "@/components/citizen/Verificationprogress";
import CitizenVerificationForm from "@/components/citizen/Citizenverificationform";
import citizenapi from "@/service/citizenurls";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getAuthToken = () =>
  localStorage.getItem("spims_token") || "";

const fetchWithAuth = async (url, token) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Verification = () => {
  const token = getAuthToken();

  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [profileRes, statusRes] = await Promise.all([
        citizenapi.getProfile(),
        citizenapi.getVerificationStatus(),
      ]);

      setProfile(profileRes.data);
      setVerificationStatus(statusRes.data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitSuccess = async () => {
    // Re-fetch verification status after successful submission
    try {
      const statusRes = await citizenapi.getVerificationStatus();
      setVerificationStatus(statusRes.data);
    } catch {
      // silent — the form already shows success state
    }
  };

  const status = verificationStatus?.status ?? "NOT_SUBMITTED";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-gray-100 pt-4 pb-3 border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
          {/* Back arrow */}
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-600">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* Logo mark */}
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Citizen Verification</h1>
            <p className="text-xs text-gray-400">SPIMS · Smart Panchayath</p>
          </div>
          {/* Refresh */}
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors disabled:opacity-50"
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
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Failed to load data</p>
              <p className="text-xs text-red-500">{fetchError}</p>
            </div>
            <button
              onClick={loadData}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-1 space-y-4">
            <CitizenInfoCard profile={profile} loading={loading} />
            <VerificationStatusCard
              verificationStatus={verificationStatus}
              loading={loading}
            />
            <VerificationProgress status={status} />
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2">
            <CitizenVerificationForm
              profile={profile}
              verificationStatus={verificationStatus}
              onSubmitSuccess={handleSubmitSuccess}
              token={token}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verification;