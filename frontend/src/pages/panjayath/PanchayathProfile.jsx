import { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import useScrollReveal from "@/components/common/useScrollReveal";
import InputField from "@/components/common/InputField";

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

const STATUS_CONFIG = {
  NOT_SUBMITTED: { label: "Not Submitted", bg: "#eff6ff", color: "#1a56db" },
  PENDING: { label: "Under Review", bg: "#fffbeb", color: "#d97706" },
  APPROVED: { label: "Approved", bg: "#ecfdf5", color: "#059669" },
  REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#dc2626" },
};

export default function PanchayathProfile() {

  const [verificationStatus, setVerificationStatus] = useState("NOT_SUBMITTED");
  const [isVerified, setIsVerified] = useState(false);

  const [fullName, setFullName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");

  const heroRef = useScrollReveal(0);
  const formRef = useScrollReveal(100);
  const statusRef = useScrollReveal(200);

  const status = STATUS_CONFIG[verificationStatus];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/panchayath/me/");

        setFullName(response.data.username);
        setOfficialEmail(response.data.email);
        setVerificationStatus(
          response.data.is_verified ? "APPROVED" : "NOT_SUBMITTED"
        );
        setIsVerified(response.data.is_verified);

      } catch (error) {
        console.error("Error fetching Panchayath profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-[#f8faff] font-body min-h-screen">
      <div className="max-w-[1140px] mx-auto py-24 px-16 space-y-12">

        {/* ── Hero ───────────────────────── */}
        <div ref={heroRef} style={revealStyle}>
          <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
            Account Management
          </p>

          <h1
            className="font-black text-[#0f172a] mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
            }}
          >
            <span className="text-[#1a56db]">PANCHAYATH</span> Authority{" "}
            <span className="text-[#059669]">PROFILE</span>
          </h1>

          <p className="text-[0.9rem] text-[#475569] max-w-xl">
            Manage your official Panchayath profile information and track
            your verification status within the SPIMS governance system.
          </p>
        </div>

        {/* ── Profile Card ───────────────────────── */}
        <div
          ref={formRef}
          style={{ ...revealStyle }}
          className="bg-white border border-[#e2e8f0] rounded-2xl p-8"
        >
          <h3
            className="font-black mb-6 text-[#0f172a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
            <InputField
              label="Official Email"
              type="email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              placeholder="Enter official email"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="text-white font-bold rounded-xl px-8 py-3"
              style={{
                background: "#1a56db",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ── Verification Status ───────────────────────── */}
        <div
          ref={statusRef}
          style={{ ...revealStyle }}
          className="bg-white border border-[#e2e8f0] rounded-2xl p-8"
        >
          <h3
            className="font-black mb-6 text-[#0f172a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Verification Status
          </h3>

          <span
            className="uppercase text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>

          <div className="mt-6">
            {verificationStatus === "NOT_SUBMITTED" && (
              <p className="text-[#1a56db]">
                Your account has not yet been submitted for verification.
                Submit required documents to activate your Panchayath authority access.
              </p>
            )}

            {verificationStatus === "APPROVED" && (
              <p className="text-[#059669]">
                Your Panchayath account is fully verified.
                You now have complete access to governance tools.
              </p>
            )}
          </div>
        </div>

        {/* ── Gradient Card if Approved ───────────────────────── */}
        {isVerified && (
          <div className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8">
            <h2
              className="font-black mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
              }}
            >
              Verification Complete
            </h2>

            <p className="text-white/80">
              Your Panchayath authority credentials are active and verified.
              Governance operations are fully enabled.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}