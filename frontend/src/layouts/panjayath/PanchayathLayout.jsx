// layout/PanchayathLayout.jsx
// SPIMS – Smart Panchayath Issue Management System
// Root layout for all /panchayath/* routes.
//
// Responsibilities:
//   1. Reads role + is_verified + verification_submitted from localStorage.
//   2. Redirects non-PANCHAYATH roles to /login immediately.
//   3. If not verified → auto-show VerificationRequiredModal on mount.
//   4. Passes modal callbacks down to PanchayathSidebar.
//   5. Renders Header + Sidebar + <Outlet />.

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PanchayathHeader from "@/components/panjayath/PanchayathHeader";
import PanchayathSidebar from "@/components/panjayath/PanchayathSidebar";
import VerificationRequiredModal from "@/components/panjayath/VerificationRequiredModal";
import VerificationPendingModal from "@/components/panjayath/VerificationPendingModal";
import panchayathapi from "@/service/panchayathurls";


export default function PanchayathLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Read auth state from localStorage ────────────────────────────────────
  const role = localStorage.getItem("role");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // ── Mobile sidebar state ─────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Role guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!role || role !== "PANCHAYATH") {
      navigate("/login", { replace: true });
    }
  }, [role, navigate]);

  useEffect(() => {
    const syncVerification = async () => {
      try {
        const res = await panchayathapi.verificationStatus();
        const status = (res.data?.status || "").toUpperCase();
        console.log("Verification API response:", res.data);
        const verified = status === "APPROVED";
        const submitted = status === "PENDING";

        // Update state
        setIsVerified(verified);
        setVerificationSubmitted(submitted);

        // Update localStorage
        localStorage.setItem("is_verified", String(verified));
        localStorage.setItem("verification_submitted", String(submitted));

      } catch (err) {
        console.error("Verification sync failed:", err);
      }
    };

    if (role === "PANCHAYATH") {
      syncVerification();
    }
  }, [role]);

  // ── Auto-show modal on mount if not verified ──────────────────────────────
  useEffect(() => {
    if (role === "PANCHAYATH" && !isVerified) {
      if (verificationSubmitted) {
        setShowPendingModal(true);
      } else {
        setShowRequiredModal(true);
      }
    } else {
      setShowPendingModal(false);
      setShowRequiredModal(false);
    }
  }, [isVerified, verificationSubmitted, role]);

  useEffect(() => {
  if (
    role === "PANCHAYATH" &&
    isVerified &&
    location.pathname === "/panchayath"
  ) {
    navigate("/panchayath/dashboard", { replace: true });
  }
}, [isVerified, role, location.pathname, navigate]);
  // Do not render layout until role is confirmed (avoids flash)
  if (!role || role !== "PANCHAYATH") return null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── Sidebar ── */}
      <PanchayathSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isVerified={isVerified}
        verificationSubmitted={verificationSubmitted}
        onShowRequiredModal={() => setShowRequiredModal(true)}
        onShowPendingModal={() => setShowPendingModal(true)}
      />

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <PanchayathHeader onMenuToggle={() => setSidebarOpen((o) => !o)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {showRequiredModal && (
        <VerificationRequiredModal onClose={() => setShowRequiredModal(false)} />
      )}
      {showPendingModal && (
        <VerificationPendingModal onClose={() => setShowPendingModal(false)} />
      )}
    </div>
  );
}