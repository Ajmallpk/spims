// layout/PanchayathHeader.jsx
// SPIMS – Smart Panchayath Issue Management System
// Top header bar: dynamic page title, role badge, notification bell, avatar.

import { useLocation } from "react-router-dom";

// Map route paths → human-readable titles + subtitles
const ROUTE_META = {
  "/panchayath/dashboard": {
    title: "Dashboard",
    subtitle: "Administrative overview & ward statistics",
  },
  "/panchayath/ward-verification-requests": {
    title: "Ward Verification Requests",
    subtitle: "Review and manage pending ward verifications",
  },
  "/panchayath/ward-list": {
    title: "Ward List",
    subtitle: "All registered wards under this Panchayath",
  },
  "/panchayath/profile": {
    title: "My Profile",
    subtitle: "Account settings and verification documents",
  },
};

const DEFAULT_META = {
  title: "Panchayath Portal",
  subtitle: "Smart Panchayath Issue Management System",
};

export default function PanchayathHeader({ onMenuToggle }) {
  const location = useLocation();
  const meta = ROUTE_META[location.pathname] ?? DEFAULT_META;

  // Read display name from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.panchayath_name || "Panchayath Admin";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-4">
        {/* Left: hamburger (mobile) + page title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Page title block */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-black text-slate-900 tracking-tight truncate leading-none">
                {meta.title}
              </h1>
              {/* Role badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                PANCHAYATH
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate leading-none hidden sm:block">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notification bell */}
          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200 mx-1" />

          {/* User avatar + name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
              {initials || "PA"}
            </div>
            <div className="hidden md:block leading-none">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}