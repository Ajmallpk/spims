import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
// import { submitVerification } from "@/blockSlice";
import FileUploadField from '@/components/panjayath/FileUploadField'
import StatusBanner from '@/components/panjayath/StatusBanner'





export default function PanchayathVerification() {
  const dispatch = useDispatch();
  const { verificationStatus } = useSelector((state) => state.panchayath);

  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [idProof,           setIdProof          ] = useState(null);
  const [selfie,            setSelfie            ] = useState(null);
  const [error,             setError             ] = useState("");

  const heroRef = useScrollReveal(0);
  const bodyRef = useScrollReveal(120);

  const handleSubmit = () => {
    if (!appointmentLetter || !idProof || !selfie) {
      setError("Please upload all three required documents before submitting.");
      return;
    }
    setError("");
    dispatch(submitVerification());
  };

  const allUploaded = appointmentLetter && idProof && selfie;

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

          {/* ── Hero ───────────────────────────────────────────────────────── */}
          <div ref={heroRef} style={revealStyle}>
            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
              Identity & Authorization
            </p>
            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              Panchayath Authority Verification
            </h1>
            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-xl">
              Submit your official appointment documents for administrative
              approval. All uploads are securely processed by the SPIMS portal.
            </p>
          </div>

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div ref={bodyRef} style={revealStyle} className="space-y-8">

            {/* APPROVED */}
            {verificationStatus === "APPROVED" && (
              <>
                <StatusBanner
                  bg="#ecfdf5"
                  borderColor="#6ee7b7"
                  color="#059669"
                  eyebrow="Verification Complete"
                  heading="Your Account Is Verified"
                  body="Your identity has been confirmed and your account is fully active. You have unrestricted access to all Panchayath Authority governance features."
                  icon={
                    <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  }
                />

                {/* Gradient impact card */}
                <div
                  className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8 relative overflow-hidden"
                >
                  <div style={{ position:"absolute", width:200, height:200, background:"rgba(255,255,255,.05)", borderRadius:"50%", filter:"blur(40px)", top:-50, right:-50 }} />
                  <div style={{ position:"absolute", width:200, height:200, background:"rgba(255,255,255,.05)", borderRadius:"50%", filter:"blur(40px)", bottom:-60, left:-40 }} />
                  <div className="relative z-10">
                    <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-white/60 mb-3">Access Granted</p>
                    <h2
                      className="font-black text-white mb-3 leading-tight"
                      style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(2rem,3vw,2.8rem)" }}
                    >
                      Welcome to the Dashboard
                    </h2>
                    <p className="text-[0.9rem] leading-[1.75] text-white/80 max-w-lg">
                      Your verification is on record. All Panchayath Authority
                      governance tools are now available to you.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* PENDING */}
            {verificationStatus === "PENDING" && (
              <StatusBanner
                bg="#fffbeb"
                borderColor="#fcd34d"
                color="#d97706"
                eyebrow="Under Review"
                heading="Verification In Progress"
                body="Your documents have been received and are currently being reviewed by the Administrator. You will be notified once a decision has been made. This process typically takes 1–3 business days."
                icon={
                  <div className="relative flex items-center justify-center w-full h-full">
                    <span style={{ width:10, height:10, borderRadius:"50%", background:"#d97706", animation:"pulse 2s infinite", display:"panchayath" }} />
                  </div>
                }
              />
            )}

            {/* NOT_SUBMITTED — Upload Form */}
            {verificationStatus === "NOT_SUBMITTED" && (
              <div
                style={{ position: "relative" }}
                className="group bg-white border border-[#e2e8f0] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] overflow-hidden"
              >
                {/* Activity top border */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                {/* Card header */}
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width:44, height:44, background:"#eff6ff", border:"1.5px solid #bfdbfe" }}
                  >
                    <svg width="20" height="20" fill="none" stroke="#1a56db" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-0.5">
                      Required Documents
                    </p>
                    <h3
                      className="font-black text-[#0f172a] leading-tight"
                      style={{ fontFamily:"'Playfair Display', serif", fontSize:"1.25rem" }}
                    >
                      Upload Official Documents
                    </h3>
                  </div>
                </div>

                {/* Info strip */}
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 mb-8"
                  style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}
                >
                  <svg width="16" height="16" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-[0.78rem] text-[#1a56db] leading-relaxed">
                    All three documents are mandatory. Accepted formats: PDF, JPG, PNG (max 5MB each).
                  </p>
                </div>

                {/* Upload fields */}
                <div className="space-y-5">
                  <FileUploadField
                    label="Appointment Letter"
                    hint="Official government appointment order — PDF or image"
                    file={appointmentLetter}
                    onChange={(e) => setAppointmentLetter(e.target.files[0])}
                    icon={
                      <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    }
                  />
                  <FileUploadField
                    label="Government ID Proof"
                    hint="Aadhaar, Passport, or any valid government photo ID"
                    file={idProof}
                    onChange={(e) => setIdProof(e.target.files[0])}
                    icon={
                      <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                      </svg>
                    }
                  />
                  <FileUploadField
                    label="Live Selfie"
                    hint="Clear front-facing photo taken today — JPG or PNG"
                    file={selfie}
                    onChange={(e) => setSelfie(e.target.files[0])}
                    icon={
                      <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    }
                  />
                </div>

                {/* Progress indicators */}
                <div className="flex items-center gap-2 mt-6">
                  {[appointmentLetter, idProof, selfie].map((f, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: f ? "#1a56db" : "#e2e8f0" }}
                    />
                  ))}
                  <p className="text-[0.7rem] text-[#94a3b8] ml-2 whitespace-nowrap">
                    {[appointmentLetter, idProof, selfie].filter(Boolean).length} / 3 uploaded
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    className="mt-5 flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ background:"#fef2f2", border:"1px solid #fca5a5" }}
                  >
                    <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-[0.8rem] text-[#dc2626] font-medium">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    className="text-white font-bold rounded-xl px-8 py-3 transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    disabled={!allUploaded}
                    style={{
                      background: allUploaded ? "#1a56db" : "#94a3b8",
                      boxShadow: allUploaded ? "0 4px 16px rgba(26,86,219,.35)" : "none",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                    onMouseEnter={(e) => allUploaded && (e.currentTarget.style.background = "#2563eb")}
                    onMouseLeave={(e) => allUploaded && (e.currentTarget.style.background = "#1a56db")}
                  >
                    Submit Verification
                  </button>

                  {!allUploaded && (
                    <p className="text-[0.78rem] text-[#94a3b8]">
                      Upload all documents to enable submission.
                    </p>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}