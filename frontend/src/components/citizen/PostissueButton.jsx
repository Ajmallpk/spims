// citizen/components/PostIssueButton.jsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VerificationRequiredModal from "@/components/citizen/VerificationRequiredModal";
import VerificationPendingModal from "@/components/citizen/VerificationPendingModal";

export default function PostIssueButton() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch("/api/citizen/profile/verification-status/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setVerificationStatus(data.verification_status);
      } catch {
        setVerificationStatus("not_verified");
      }
    };
    fetchStatus();
  }, []);

  const handleClick = () => {
    if (verificationStatus === "verified") {
      navigate("/citizen/post-issue");
    } else if (verificationStatus === "pending") {
      setModal("pending");
    } else {
      setModal("required");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 flex items-center gap-2.5 px-5 py-3.5 bg-indigo-600 text-white font-semibold text-sm rounded-2xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 active:scale-95 z-30"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5" />
        </div>
        Report Issue
      </button>

      {modal === "required" && (
        <VerificationRequiredModal onClose={() => setModal(null)} />
      )}
      {modal === "pending" && (
        <VerificationPendingModal onClose={() => setModal(null)} />
      )}
    </>
  );
}