import { useState } from "react";

export default function Topbar({ title = "Dashboard", subtitle = "Overview & Analytics" }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount] = useState(4);

  const notifications = [
    { id: 1, text: "New block approval request from Ward 12", time: "2m ago", type: "approval" },
    { id: 2, text: "Issue #2041 escalated to district level", time: "18m ago", type: "alert" },
    { id: 3, text: "Panchayath report submitted for review", time: "1h ago", type: "info" },
    { id: 4, text: "System maintenance scheduled at 02:00", time: "3h ago", type: "system" },
  ];

  const typeColor = {
    approval: "#3b82f6",
    alert: "#f59e0b",
    info: "#22c55e",
    system: "#8b5cf6",
  };

  return (
    <header
      className="flex items-center justify-between px-8 relative z-[999]"
      style={{
        height: "70px",
        background: "rgba(8,14,28,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
              boxShadow: "0 0 8px rgba(59,130,246,0.6)",
            }}
          />
          <div>
            <h1
              className="font-bold text-lg leading-tight"
              style={{
                color: "#e2e8f0",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </h1>
            <p className="text-xs leading-tight" style={{ color: "#475569" }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 mx-2" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Status chip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
          <span className="text-xs font-medium" style={{ color: "#22c55e", fontFamily: "'Courier New', monospace" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            width: 180,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <span className="text-xs" style={{ color: "#334155" }}>Search issues...</span>
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.05)", color: "#334155", fontFamily: "monospace" }}
          >
            ⌘K
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              width: 40,
              height: 40,
              background: notifOpen ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
              border: notifOpen ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" className="w-5 h-5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
            </svg>
            {notifCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-bold rounded-full"
                style={{
                  width: 18,
                  height: 18,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  fontSize: 10,
                  boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                }}
              >
                {notifCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 top-12 rounded-2xl overflow-hidden z-50"
              style={{
                width: 320,
                background: "rgba(10,18,40,0.97)",
                border: "1px solid rgba(59,130,246,0.18)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(29,78,216,0.1)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-sm font-semibold text-slate-200">Notifications</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}
                >
                  {notifCount} new
                </span>
              </div>

              <div className="py-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: typeColor[n.type], boxShadow: `0 0 6px ${typeColor[n.type]}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                      <p className="text-xs mt-1" style={{ color: "#334155" }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3">
                <button className="w-full text-xs text-center py-2 rounded-xl transition-colors duration-150"
                  style={{ color: "#3b82f6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", color: "white" }}
          >
            SA
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-300">Super Admin</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="w-3.5 h-3.5">
            <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}