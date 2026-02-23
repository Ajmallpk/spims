import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import VerificationRestrictionModal from "@/shared/components/Verificationrestrictionmodal";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/block",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Panchayath Approvals",
    path: "/block/approvals",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Escalated Complaints",
    path: "/block/escalations",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    label: "Panchayath Monitoring",
    path: "/block/monitoring",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: "Communication",
    path: "/block/communication",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/block/profile",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    free: true,
  },
];

// ─── BlockLayout ──────────────────────────────────────────────────────────────
export default function BlockLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [showModal, setShowModal] = useState(false);
  const storedVerified = localStorage.getItem("is_verified");

   const [isVerified] = useState(
    storedVerified === "true"
  );


  // Auto-show modal when not verified and not on profile
  useEffect(() => {
    if (isVerified === false && location.pathname !== "/block/profile") {
      navigate("/block/profile", { replace: true });
    }
  }, [isVerified, location.pathname]);

  const handleNavigation = (path, free = false) => {
    if (!isVerified && !free) {
      setShowModal(true);
      return;
    }
    navigate(path);
  };
  
 const handleLogout = () => {
  localStorage.clear();
  navigate("/login",{replace:true});
};
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div className="font-body flex min-h-screen bg-[#f8faff] text-[#475569]">

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <aside
          className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] flex flex-col z-30"
          style={{ boxShadow: "4px 0 24px rgba(26,86,219,.04)" }}
        >
          {/* Brand */}
          <div className="px-6 pt-8 pb-6 border-b border-[#e2e8f0]">
            <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-1">
              SPIMS Portal
            </p>
            <h2
              className="font-black text-[#0f172a] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}
            >
              Block Panel
            </h2>
          </div>

          {/* Verification warning */}
          {!isVerified && (
            <button
              onClick={() => navigate("/block/profile")}
              className="mx-4 mt-4 px-4 py-3 rounded-xl text-left transition-colors duration-150 hover:bg-[#fef3c7]"
              style={{ background: "#fffbeb", border: "1.5px solid #fcd34d" }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#d97706", flexShrink: 0,
                    animation: "pulse 2s infinite",
                  }}
                />
                <p className="text-[0.7rem] font-bold text-[#d97706]">Verification Pending</p>
              </div>
              <p className="text-[0.65rem] text-[#92400e] mt-0.5 pl-[18px]">
                Tap to complete your profile
              </p>
            </button>
          )}

          {/* Nav */}
          <nav className="flex flex-col gap-1 px-3 mt-4 flex-1 overflow-y-auto">
            {NAV_ITEMS.map(({ label, path, icon, free }) => {
              const isActive = location.pathname === path;
              const locked   = !isVerified && !free;

              return (
                <button
                  key={path}
                  onClick={() => handleNavigation(path, free)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                  style={{
                    background: isActive ? "#1a56db" : "transparent",
                    color:      isActive ? "white"    : locked ? "#cbd5e1" : "#475569",
                    fontFamily: "'Outfit', sans-serif",
                    boxShadow:  isActive ? "0 4px 16px rgba(26,86,219,.25)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#eff6ff";
                      e.currentTarget.style.color = "#1a56db";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = locked ? "#cbd5e1" : "#475569";
                    }
                  }}
                >
                  {/* Icon */}
                  <span style={{ opacity: locked && !isActive ? 0.4 : 1 }}>
                    {icon}
                  </span>

                  {/* Label */}
                  <span className="flex-1 truncate">{label}</span>

                  {/* Lock icon for restricted items */}
                  {locked && (
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}

                  {/* Active dot */}
                  {isActive && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.6)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
<div className="px-3 mt-auto mb-4">
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
    style={{
      background: "transparent",
      color: "#dc2626",
      fontFamily: "'Outfit', sans-serif",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#d87171";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    {/* Icon */}
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m0 0l3-3m-3 3l3 3"
      />
    </svg>

    <span>Logout</span>
  </button>
</div>

          {/* Footer stamp */}
          <div className="px-6 py-5 border-t border-[#e2e8f0]">
            <p className="text-[0.65rem] text-[#94a3b8] leading-relaxed tracking-wide">
              SPIMS · Block Level<br />
              Government of Kerala
            </p>
          </div>
        </aside>

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <main className="ml-64 flex-1 overflow-y-auto">
          <div className="max-w-[1140px] mx-auto py-16 px-10">
            <Outlet />
          </div>
        </main>

        {/* ── Verification Restriction Modal ────────────────────────────── */}
        <VerificationRestrictionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />

      </div>
    </>
  );
}