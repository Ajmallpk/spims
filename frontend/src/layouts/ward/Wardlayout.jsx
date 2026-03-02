import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WardSidebar from "./WardSidebar";
import WardHeader from "./WardHeader";
import VerificationRequiredModal from "../components/VerificationRequiredModal";
import VerificationPendingModal from "../components/VerificationPendingModal";

const PROTECTED_PATHS = [
  "/ward/dashboard",
  "/ward/citizen-verifications",
  "/ward/citizens",
  "/ward/complaints",
];

export default function WardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const role = localStorage.getItem("role");
  const isVerified = localStorage.getItem("is_verified") === "true";
  const verificationSubmitted = localStorage.getItem("verification_submitted") === "true";

  useEffect(() => {
    if (role !== "WARD") {
      navigate("/login", { replace: true });
      return;
    }

    const isProtectedRoute = PROTECTED_PATHS.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isVerified && isProtectedRoute) {
      if (verificationSubmitted) {
        setShowPendingModal(true);
      } else {
        setShowRequiredModal(true);
      }
      navigate("/ward/profile", { replace: true });
    }
  }, [location.pathname, role, isVerified, verificationSubmitted, navigate]);

  if (role !== "WARD") return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <WardSidebar
        isVerified={isVerified}
        verificationSubmitted={verificationSubmitted}
        onShowRequired={() => setShowRequiredModal(true)}
        onShowPending={() => setShowPendingModal(true)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <WardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {showRequiredModal && (
        <VerificationRequiredModal
          onClose={() => setShowRequiredModal(false)}
          onGoToProfile={() => {
            setShowRequiredModal(false);
            navigate("/ward/profile");
          }}
        />
      )}

      {showPendingModal && (
        <VerificationPendingModal onClose={() => setShowPendingModal(false)} />
      )}
    </div>
  );
}