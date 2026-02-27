import { useNavigate } from "react-router-dom";

export default function VerificationRestrictionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goToVerification = () => {
    navigate("/block/verification");
    onClose();
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center font-body">

        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: "rgba(15,23,42,.45)" }}
          onClick={onClose}
        />

        {/* Panel */}
        <div
          className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 24px 64px rgba(26,86,219,.18)" }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #1a56db 0%, #3b82f6 100%)",
            }}
          />

          <div className="p-8">

            {/* Icon */}
            <div
              className="flex items-center justify-center mx-auto mb-5"
              style={{
                width: 56, height: 56,
                borderRadius: "50%",
                background: "#eff6ff",
                border: "2px solid #bfdbfe",
              }}
            >
              <svg
                width="26" height="26"
                fill="none" stroke="#1a56db"
                strokeWidth="1.8" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            {/* Eyebrow */}
            <p className="text-center text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-3">
              Action Required
            </p>

            {/* Heading */}
            <h2
              className="text-center font-black text-[#0f172a] leading-tight mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.7rem",
              }}
            >
              Verification Required
            </h2>

            {/* Body */}
            <p className="text-center text-[0.9rem] leading-[1.75] text-[#475569] mb-8">
              Your account is not yet verified. Please complete the official
              verification process to access this section.
            </p>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ height: 1, background: "#e2e8f0" }}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={goToVerification}
                className="flex-1 font-bold rounded-xl px-6 py-3 text-sm text-white transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#1a56db",
                  boxShadow: "0 4px 16px rgba(26,86,219,.35)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a56db")}
              >
                Complete Verification
              </button>

              <button
                onClick={onClose}
                className="flex-1 font-medium rounded-xl px-6 py-3 text-sm transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "white",
                  color: "#475569",
                  border: "1.5px solid #e2e8f0",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1a56db";
                  e.currentTarget.style.color = "#1a56db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}