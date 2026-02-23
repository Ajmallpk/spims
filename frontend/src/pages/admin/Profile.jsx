import { useState } from "react";
import AdminDashboardLayout from "@/layouts/admin/AdminDashboardLayout";
import ProfileCard from "@/components/admin/ProfileCard";
import AccountSecurityPanel from "@/components/admin/AccountSecurityPanel";

// ─── Static Data ─────────────────────────────────────────────────────────────
const INITIAL_ADMIN = {
  fullName: "Muhammed Riyas K",
  email: "riyas.k@spims.gov.in",
  phone: "+91 94460 99001",
  designation: "District Programme Officer",
  department: "Local Self Government Dept.",
  joinedDate: "12 January 2024",
  adminId: "SPIMS-ADMIN-0001",
  role: "Super Admin",
};

const SECURITY_DATA = {
  lastLogin: "22 Feb 2026, 09:14 AM",
  accountCreated: "12 January 2024",
  loginIP: "103.21.58.214",
  device: "Chrome 121 · Windows 11",
  activeSessions: 2,
  twoFAEnabled: true,
  passwordLastChanged: "10 January 2026",
  sessions: [
    {
      device: "Chrome · Windows 11",
      location: "Tirur, Kerala",
      time: "Active now",
      current: true,
    },
    {
      device: "Safari · iPhone 14",
      location: "Malappuram, Kerala",
      time: "2 hours ago",
      current: false,
    },
  ],
};

// ─── Page Content ─────────────────────────────────────────────────────────────
function ProfileContent() {
  const [admin, setAdmin] = useState(INITIAL_ADMIN);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (updated) => {
    setAdmin((prev) => ({ ...prev, ...updated }));
    showToast("Profile updated successfully.");
  };

  return (
    <div className="flex flex-col gap-6 relative">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl"
          style={{
            background: "rgba(6,35,20,0.97)",
            border: "1px solid rgba(52,211,153,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold font-mono text-emerald-300">{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              Administrator Profile
            </h1>
          </div>
          <p className="text-sm text-slate-500 pl-3.5">
            Manage your system-level account and security settings
          </p>
        </div>

        {/* Breadcrumb-style date chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 self-start sm:self-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #22c55e" }} />
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Quick info strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Role", value: admin.role, color: "text-blue-400", bg: "bg-blue-400/8 border-blue-400/15" },
          { label: "Status", value: "Active", color: "text-emerald-400", bg: "bg-emerald-400/8 border-emerald-400/15" },
          { label: "Admin ID", value: admin.adminId, color: "text-slate-400", bg: "bg-slate-800/40 border-slate-700/40" },
          { label: "Last Login", value: "Today, 09:14 AM", color: "text-slate-400", bg: "bg-slate-800/40 border-slate-700/40" },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex flex-col gap-1 p-3.5 rounded-xl border ${item.bg}`}
          >
            <p className="text-xs text-slate-600 font-mono">{item.label}</p>
            <p className={`text-sm font-bold font-mono truncate ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">
        {/* Left: Profile Card */}
        <ProfileCard admin={admin} onSave={handleSave} />

        {/* Right: Security Panels */}
        <AccountSecurityPanel security={SECURITY_DATA} />
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  return <ProfileContent />
}