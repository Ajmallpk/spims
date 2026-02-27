import { useState } from "react";
import useScrollReveal from "@/components/common/useScrollReveal";
import FileUploadField from "@/components/common/FileUploadField";
import StatusBanner from "@/components/common/StatusBanner";
import { CheckCircle2, Clock } from "lucide-react";

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

export default function PanchayathVerification() {

  // Later this should come from API
  const [verificationStatus, setVerificationStatus] = useState("NOT_SUBMITTED");

  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [error, setError] = useState("");

  const heroRef = useScrollReveal(0);
  const bodyRef = useScrollReveal(120);

  const handleSubmit = () => {
    if (!appointmentLetter || !idProof || !selfie) {
      setError("Please upload all required documents.");
      return;
    }

    setError("");

    // Later: call API here
    setVerificationStatus("PENDING");
  };

  const allUploaded = appointmentLetter && idProof && selfie;

  return (
    <div className="bg-[#f8faff] font-body min-h-screen">
      <div className="max-w-[1140px] mx-auto py-24 px-16 space-y-12">

        {/* ── Hero Section ───────────────────────── */}
        <div ref={heroRef} style={revealStyle}>
          <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
            Identity & Authorization
          </p>

          <h1
            className="font-black text-[#0f172a] mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
            }}
          >
            Panchayath Authority Verification
          </h1>

          <p className="text-[0.9rem] text-[#475569] max-w-xl">
            Submit your official Panchayath documents for review.
            Your verification request will be examined by the Block Authority.
          </p>
        </div>

        {/* ── Body ───────────────────────── */}
        <div ref={bodyRef} style={revealStyle} className="space-y-8">

          {/* APPROVED */}
          {verificationStatus === "APPROVED" && (
            <StatusBanner
              icon={CheckCircle2}
              bg="#ecfdf5"
              borderColor="#6ee7b7"
              color="#059669"
              eyebrow="Verification Complete"
              heading="Your Account Is Verified"
              body="Your Panchayath identity has been verified by the Block Authority."
            />
          )}

          {/* PENDING */}
          {verificationStatus === "PENDING" && (
            <StatusBanner
              icon={Clock}
              bg="#fffbeb"
              borderColor="#fcd34d"
              color="#d97706"
              eyebrow="Under Review"
              heading="Verification In Progress"
              body="Your documents are under review."
            />
          )}

          {/* NOT_SUBMITTED */}
          {verificationStatus === "NOT_SUBMITTED" && (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">

              <h3
                className="font-black mb-6 text-[#0f172a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Upload Required Documents
              </h3>

              <div className="space-y-5">

                <FileUploadField
                  label="Appointment Letter"
                  hint="Official Panchayath appointment document"
                  file={appointmentLetter}
                  onChange={(e) => setAppointmentLetter(e.target.files[0])}
                />

                <FileUploadField
                  label="Government ID Proof"
                  hint="Valid government-issued ID"
                  file={idProof}
                  onChange={(e) => setIdProof(e.target.files[0])}
                />

                <FileUploadField
                  label="Live Selfie"
                  hint="Recent clear front-facing photo"
                  file={selfie}
                  onChange={(e) => setSelfie(e.target.files[0])}
                />

              </div>

              {error && (
                <p className="text-red-600 mt-5 text-sm font-medium">
                  {error}
                </p>
              )}

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!allUploaded}
                  className="text-white font-bold rounded-xl px-8 py-3 disabled:opacity-50"
                  style={{
                    background: "#1a56db",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Submit Verification
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}