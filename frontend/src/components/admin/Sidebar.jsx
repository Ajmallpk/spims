import { useState } from "react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "approvals",
    label: "Block Authority Approvals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "blocks",
    label: "List Blocks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeItem = "dashboard", onNavigate }) {
  const [hovered, setHovered] = useState(null);

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: "260px",
        background: "linear-gradient(180deg, #080e1c 0%, #0a1628 60%, #080e1c 100%)",
        borderRight: "1px solid rgba(59,130,246,0.12)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            boxShadow: "0 0 16px rgba(29,78,216,0.5)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
            <path d="M3 21l9-18 9 18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 15h10" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p
            className="font-bold tracking-widest text-xs"
            style={{
              color: "#60a5fa",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.2em",
            }}
          >
            GOVCONTROL
          </p>
          <p className="text-gray-500 text-xs tracking-wide mt-0.5">SPIMS v2.0</p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-6 pt-6 pb-2">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "rgba(148,163,184,0.5)", letterSpacing: "0.18em", fontFamily: "'Courier New', monospace" }}
        >
          Navigation
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const isHovered = hovered === item.id && !isActive;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 relative group"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(37,99,235,0.15) 100%)"
                  : isHovered
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(59,130,246,0.25)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 0 20px rgba(29,78,216,0.15), inset 0 0 20px rgba(29,78,216,0.05)"
                  : "none",
              }}
            >
              {/* Left border highlight */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 3,
                    height: "60%",
                    background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.8)",
                    left: -1,
                  }}
                />
              )}

              <span
                style={{
                  color: isActive ? "#60a5fa" : isHovered ? "#94a3b8" : "#475569",
                  transition: "color 0.2s",
                  filter: isActive ? "drop-shadow(0 0 4px rgba(96,165,250,0.5))" : "none",
                }}
              >
                {item.icon}
              </span>

              <span
                className="text-sm font-medium leading-tight"
                style={{
                  color: isActive ? "#e2e8f0" : isHovered ? "#94a3b8" : "#475569",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "#3b82f6",
                    boxShadow: "0 0 6px rgba(59,130,246,0.9)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom divider */}
      <div style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }} className="mx-4" />

      {/* Logout */}
      <div className="px-3 py-4">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.border = "1px solid rgba(239,68,68,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.border = "1px solid transparent";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
            Logout
          </span>
        </button>

        {/* Admin badge */}
        <div
          className="mx-1 mt-3 rounded-xl p-3 flex items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", color: "white" }}
          >
            SA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-300 truncate">Super Admin</p>
            <p className="text-xs text-slate-600 truncate">admin@spims.gov.in</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
        </div>
      </div>
    </aside>
  );
}