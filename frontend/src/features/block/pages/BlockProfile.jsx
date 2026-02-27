import { useState, useRef, useEffect } from "react";
import axios from "@/api/axiosInstance"

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  NOT_SUBMITTED: {
    label: "Not Submitted",
    bg: "#eff6ff",
    color: "#1a56db",
  },
  PENDING: {
    label: "Under Review",
    bg: "#fffbeb",
    color: "#d97706",
  },
  APPROVED: {
    label: "Approved",
    bg: "#ecfdf5",
    color: "#059669",
  },
  REJECTED: {
    label: "Rejected",
    bg: "#fef2f2",
    color: "#dc2626",
  },
};

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-[0.68rem] font-bold tracking-[.14em] uppercase mb-2"
        style={{ color: focused ? "#1a56db" : "#040a13" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-[0.9rem] text-[#0f172a] bg-[#f8faff] outline-none transition-all duration-200"
        style={{
          border: focused ? "1.5px solid #1a56db" : "1.5px solid #e2e8f0",
          boxShadow: focused ? "0 0 0 4px rgba(218, 218, 218, 0.08)" : "none",
          fontFamily: "'Outfit', sans-serif",
        }}
      />
    </div>
  );
}

// ─── BlockProfile ─────────────────────────────────────────────────────────────
export default function BlockProfile() {
  const [verificationStatus,setVerificationStatus] = useState("NOT_SUBMITTED")
  const [isVerified,setIsVerified] = useState(false)

  const [fullName, setFullName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");

  const heroRef = useScrollReveal(0);
  const formRef = useScrollReveal(100);
  const statusRef = useScrollReveal(200);


  const status = STATUS_CONFIG[verificationStatus] || STATUS_CONFIG.NOT_SUBMITTED;

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.get("/block/me/");

      setFullName(response.data.username);
      setOfficialEmail(response.data.email);
      setVerificationStatus(
        response.data.is_verified ? "APPROVED" : "NOT_SUBMITTED"
      );
      setIsVerified(response.data.is_verified);

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div className="font-body bg-[#f8faff] text-[#475569] min-h-screen">
        <div className="max-w-[1140px] mx-auto py-24 px-16 max-md:py-16 max-md:px-8 space-y-12">

          {/* ── Hero Heading ─────────────────────────────────────────────── */}
          <div ref={heroRef} style={revealStyle}>
            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
              Account Management
            </p>
            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              <span className="text-[#1a56db]">
                {"BLOCK"}
              </span> Authority 
              <span className="text-[#059669]">
                {"PROFILE"}
              </span>
            </h1>
            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-xl">
              Manage your official profile information and track your account
              verification status with the SPIMS portal.
            </p>
          </div>

          {/* ── Profile Information Card ─────────────────────────────────── */}
          <div
            ref={formRef}
            style={{ ...revealStyle, position: "relative" }}
            className="group bg-white border border-[#e2e8f0] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Activity top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />

            {/* Card header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44, height: 44,
                  background: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                }}
              >
                <svg width="20" height="20" fill="none" stroke="#1a56db" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-0.5">
                  Official Record
                </p>
                <h3
                  className="font-black text-[#0f172a] leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}
                >
                  Profile Information
                </h3>
              </div>
            </div>

            {/* Form fields */}
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
                placeholder="Enter your official email"
              />
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <button
                className="text-white font-bold rounded-xl px-8 py-3 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#1a56db",
                  boxShadow: "0 4px 16px rgba(26,86,219,.35)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a56db")}
              >
                Save Change
              </button>
            </div>
          </div>

          {/* ── Verification Status Card ─────────────────────────────────── */}
          <div
            ref={statusRef}
            style={{ ...revealStyle, position: "relative" }}
            className="group bg-white border border-[#e2e8f0] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Activity top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />

            {/* Card header */}
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 44, height: 44,
                    background: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="#1a56db" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-0.5">
                    Account Standing
                  </p>
                  <h3
                    className="font-black text-[#0f172a] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}
                  >
                    Verification Status
                  </h3>
                </div>
              </div>

              {/* Status pill */}
              <span
                className="text-[0.63rem] uppercase font-bold tracking-[.05em] px-3 py-1 rounded-full self-center"
                style={{ background: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>

            {/* Status message */}
            <div
              className="rounded-xl px-5 py-4 mb-6"
              style={{ background: status.bg, border: `1px solid ${status.color}22` }}
            >
              {verificationStatus === "NOT_SUBMITTED" && (
                <p className="text-[0.9rem] leading-[1.75]" style={{ color: status.color }}>
                  Your account has not yet been submitted for verification.
                  Submit your official documents to gain full access to the dashboard.
                </p>
              )}
              {verificationStatus === "PENDING" && (
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#d97706", flexShrink: 0,
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <p className="text-[0.9rem] leading-[1.75]" style={{ color: status.color }}>
                    Your verification is currently under review by the Administrator.
                    You will be notified once a decision is made.
                  </p>
                </div>
              )}
              {verificationStatus === "APPROVED" && (
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <p className="text-[0.9rem] leading-[1.75]" style={{ color: status.color }}>
                    Your account is fully verified. You have complete access to
                    all Block Authority dashboard features.
                  </p>
                </div>
              )}
            </div>

            {/* CTA — only when not submitted */}
            {!isVerified && verificationStatus === "NOT_SUBMITTED" && (
              <button
                className="text-white font-bold rounded-xl px-8 py-3 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#1a56db",
                  boxShadow: "0 4px 16px rgba(26,86,219,.35)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a56db")}
              >
                Submit for Verification
              </button>
            )}
          </div>

          {/* ── Gradient Impact Card (contextual) ───────────────────────── */}
          {verificationStatus === "APPROVED" && (
            <div
              className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8 relative overflow-hidden"
              style={{ opacity: 1, transform: "none" }}
            >
              {/* Orbs */}
              <div style={{
                position: "absolute", width: 200, height: 200,
                background: "rgba(255,255,255,.05)", borderRadius: "50%",
                filter: "blur(40px)", top: -50, right: -50,
              }} />
              <div style={{
                position: "absolute", width: 200, height: 200,
                background: "rgba(255,255,255,.05)", borderRadius: "50%",
                filter: "blur(40px)", bottom: -60, left: -40,
              }} />

              <div className="relative z-10">
                <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-white/60 mb-3">
                  Account Active
                </p>
                <h2
                  className="font-black text-white mb-3 leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  }}
                >
                  Verification Complete
                </h2>
                <p className="text-[0.9rem] leading-[1.75] text-white/80 max-w-lg">
                  Your account has been approved and is fully operational.
                  You now have unrestricted access to all Block Authority
                  governance features.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}