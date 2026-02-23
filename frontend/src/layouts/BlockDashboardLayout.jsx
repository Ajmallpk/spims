import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
//   { label: "Dashboard",              path: "/block/dashboard"     },
  { label: "Panchayath Approvals",   path: "/block/approvals"     },
  { label: "Escalated Complaints",   path: "/block/escalations"   },
  { label: "Panchayath Monitoring",  path: "/block/monitoring"    },
  { label: "Communication",          path: "/block/communication" },
  { label: "Profile",                path: "/block/profile"       },
];

// ─── Free paths (no verification needed) ─────────────────────────────────────
const FREE_PATHS = ["/block/profile", "/block/verification"];

// ─── BlockDashboardLayout ─────────────────────────────────────────────────────
export default function BlockDashboardLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const { isVerified, isActive } = useSelector((state) => state.block);
  const [showModal, setShowModal] = useState(false);

  // Auto-open modal on first load if not verified
  useEffect(() => {
    if (!isVerified) setShowModal(true);
  }, [isVerified]);

  // Restricted navigation
  const handleNavigation = (path) => {
    if (!isVerified && !FREE_PATHS.includes(path)) {
      setShowModal(true);
      return;
    }
    navigate(path);
  };

  // ── Account Deactivated ─────────────────────────────────────────────────────
  if (isActive === false) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', serif !important; }
          .font-body    { font-family: 'Outfit', sans-serif !important; }
        `}</style>
        <div className="font-body min-h-screen flex items-center justify-center bg-[#f8faff]">
          <div className="bg-[#fef2f2] border border-[#dc2626] text-[#dc2626] rounded-2xl p-10 text-center max-w-md shadow-[0_8px_32px_rgba(220,38,38,.10)]">
            {/* Icon */}
            <div
              className="mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{
                width: 56, height: 56,
                background: "rgba(220,38,38,.10)",
                border: "2px solid rgba(220,38,38,.25)",
              }}
            >
              <svg width="24" height="24" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2
              className="font-black text-[#0f172a] mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
            >
              Account Deactivated
            </h2>
            <p className="text-[0.9rem] leading-[1.75] text-[#475569]">
              Your account has been deactivated by the Administrator.
              Please contact support to restore access.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Main Layout ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      <div className="font-body flex min-h-screen bg-[#f8faff] text-[#475569]">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] flex flex-col"
          style={{ boxShadow: "4px 0 24px rgba(26,86,219,.04)" }}
        >
          {/* Brand */}
          <div className="px-6 pt-8 pb-6 border-b border-[#e2e8f0]">
            {/* Eyebrow */}
            <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-1">
              SPIMS Portal
            </p>
            <h2
              className="font-black text-[#0f172a] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}
            >
              Block Authority
            </h2>
          </div>

          {/* Verification badge (if not verified) */}
          {!isVerified && (
            <div
              className="mx-4 mt-4 px-4 py-3 rounded-xl bg-[#fffbeb] border border-[#d97706] flex items-center gap-2 cursor-pointer hover:bg-[#fef3c7] transition"
              onClick={() => navigate("/block/verification")}
            >
              <div
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#d97706", flexShrink: 0,
                  animation: "pulse 2s infinite",
                }}
              />
              <p className="text-[0.7rem] font-bold text-[#d97706] leading-tight">
                Verification Pending<br />
                <span className="font-normal text-[#92400e]">Tap to complete</span>
              </p>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 px-3 mt-4 flex-1">
            {NAV_ITEMS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => handleNavigation(path)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    flex items-center gap-2
                    ${isActive
                      ? "bg-[#1a56db] text-white font-semibold shadow-[0_4px_16px_rgba(26,86,219,.25)]"
                      : "text-[#475569] hover:bg-[#eff6ff] hover:text-[#1a56db]"
                    }
                  `}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "rgba(255,255,255,.7)", flexShrink: 0,
                      }}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Bottom footer */}
          <div className="px-6 py-5 border-t border-[#e2e8f0]">
            <p className="text-[0.65rem] text-[#94a3b8] leading-relaxed tracking-wide">
              SPIMS · Block Level<br />
              Government of Kerala
            </p>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main
          className={`ml-64 flex-1 overflow-y-auto transition-all duration-300 ${
            !isVerified ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          <div className="max-w-[1140px] mx-auto py-16 px-10">
            <Outlet />
          </div>
        </main>

        {/* ── Verification Modal ────────────────────────────────────────────── */}
        {showModal && !isVerified && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(15,23,42,.45)" }}
              onClick={() => setShowModal(false)}
            />

            {/* Panel */}
            <div
              className="relative z-10 bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(26,86,219,.18)" }}
            >
              {/* Accent bar */}
              <div
                style={{
                  height: 4,
                  background: "linear-gradient(90deg, #1a56db 0%, #3b82f6 100%)",
                }}
              />

              <div className="p-8">
                {/* Icon */}
                <div
                  className="mb-5 flex items-center justify-center"
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "#eff6ff",
                    border: "2px solid #bfdbfe",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <svg width="24" height="24" fill="none" stroke="#1a56db" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>

                {/* Eyebrow */}
                <p className="text-center text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-3">
                  Action Required
                </p>

                {/* Heading */}
                <h3
                  className="text-center font-black text-[#0f172a] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", lineHeight: 1.15 }}
                >
                  Verification Required
                </h3>

                {/* Body */}
                <p className="text-center text-[0.9rem] leading-[1.75] text-[#475569] mb-8">
                  You must complete your verification process before accessing
                  other sections of the dashboard. Please submit your official
                  documents for approval.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate("/block/verification");
                    }}
                    className="flex-1 text-white font-bold rounded-xl px-6 py-3 transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: "#1a56db",
                      boxShadow: "0 4px 16px rgba(26,86,219,.35)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1a56db")}
                  >
                    Complete Verification
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white border border-[#e2e8f0] text-[#475569] font-medium rounded-xl px-6 py-3 hover:border-[#1a56db] hover:text-[#1a56db] hover:-translate-y-1 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </>
  );
}