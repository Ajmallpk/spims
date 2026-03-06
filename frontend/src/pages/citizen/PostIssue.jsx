// citizen/pages/PostIssue.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import IssueForm from "@/components/citizen/IssueForm";
import VerificationRequiredModal from "@/components/panjayath/VerificationRequiredModal";
import VerificationPendingModal from "@/components/panjayath/VerificationPendingModal";

export default function PostIssue() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'verified' | 'pending' | 'not_verified'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch("/api/citizen/profile/verification-status/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not verify status");
        const data = await res.json();
        setVerificationStatus(data.verification_status || "not_verified");
      } catch {
        setVerificationStatus("not_verified");
      } finally {
        setLoading(false);
      }
    };
    checkVerification();
  }, []);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-400">Checking your verification status...</p>
      </div>
    );
  }

  // --- Verification gate ---
  if (verificationStatus === "not_verified") {
    return (
      <VerificationRequiredModal onClose={() => navigate("/citizen/home")} />
    );
  }

  if (verificationStatus === "pending") {
    return (
      <VerificationPendingModal onClose={() => navigate("/citizen/home")} />
    );
  }

  // --- Verified: show the form ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Feed
      </button>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Report Civic Issue
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Help improve your community by reporting problems
            </p>
          </div>
        </div>

        {/* Verified badge */}
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span className="text-xs font-medium text-emerald-700">
            Verified Citizen — you can post issues
          </span>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <IssueForm />
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-gray-400 mt-4 px-4">
        Submitted issues are reviewed by ward authorities within 48 hours.
        False reports may lead to account suspension.
      </p>
    </div>
  );
}