// pages/Dashboard.jsx
// SPIMS – Smart Panchayath Issue Management System
// Panchayath Dashboard page — rendered inside PanchayathLayout via <Outlet />.
// Uses dummy static data only. No API calls.

// ─── Static mock data ────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import panchayathApi from "@/service/panchayathurls";
// import { handleAuthError } from "@/service/panchayathurls";
import toast from "react-hot-toast";






const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Ward 07 – Verification Submitted",
    desc: "Officer submitted documents for annual ward verification.",
    time: "10 min ago",
    badge: "Pending",
    badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
    dotCls: "bg-amber-400",
  },
  {
    id: 2,
    title: "Complaint #C-2041 Escalated",
    desc: "Road repair complaint in Ward 12 exceeded SLA — auto-escalated.",
    time: "45 min ago",
    badge: "Escalated",
    badgeCls: "bg-rose-100 text-rose-700 border-rose-200",
    dotCls: "bg-rose-500",
  },
  {
    id: 3,
    title: "Ward 24 – New Ward Registered",
    desc: "Muthuvara North registered and pending first verification.",
    time: "2 hrs ago",
    badge: "New",
    badgeCls: "bg-blue-100 text-blue-700 border-blue-200",
    dotCls: "bg-blue-500",
  },
  {
    id: 4,
    title: "Ward 03 – Verification Approved",
    desc: "Annual verification approved by District Collector office.",
    time: "Yesterday",
    badge: "Approved",
    badgeCls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotCls: "bg-emerald-500",
  },
  {
    id: 5,
    title: "Complaint #C-2039 Resolved",
    desc: "Street light outage in Ward 09 resolved by field officer.",
    time: "Yesterday",
    badge: "Resolved",
    badgeCls: "bg-teal-100 text-teal-700 border-teal-200",
    dotCls: "bg-teal-500",
  },
];

const WARD_PROGRESS = [
  { label: "Approved", count: 19, total: 24, barCls: "bg-emerald-500" },
  { label: "Pending", count: 5, total: 24, barCls: "bg-amber-400" },
  { label: "Rejected", count: 0, total: 24, barCls: "bg-rose-400" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ stat, index }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.bg} p-5 shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200 cursor-default`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Decorative orb */}
      <div
        className={`absolute -right-5 -top-5 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 pointer-events-none`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${stat.changeColor} mb-2`}>
            {stat.label}
          </p>
          <p className={`text-4xl font-black ${stat.textColor} leading-none`}>
            {stat.value}
          </p>
          <p className={`text-xs mt-2 font-semibold ${stat.changeColor}`}>
            {stat.change}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-sm`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ item }) {
  return (
    <div className="flex items-start gap-3 py-3 px-1 rounded-xl hover:bg-slate-50 transition-colors duration-150">
      <div className="flex-shrink-0 flex flex-col items-center pt-1.5 gap-1">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.dotCls}`} />
        <span className="w-px flex-1 min-h-[16px] bg-slate-200" />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</p>
          <span
            className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeCls}`}
          >
            {item.badge}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
        <p className="text-[11px] text-slate-400 font-medium mt-1">{item.time}</p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const panchayathName =
    dashboardData?.panchayath_name || "Panchayath";

  const STATS = [
    {
      id: 1,
      label: "Total Wards",
      value: dashboardData?.total_wards ?? "—",
      change: "+2 this month",
      positive: true,
      gradient: "from-blue-600 to-blue-400",
      bg: "from-blue-50 to-blue-100/70",
      border: "border-blue-200",
      iconBg: "bg-blue-600",
      textColor: "text-blue-700",
      changeColor: "text-blue-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Pending Verifications",
      value: dashboardData?.pending_wards ?? "—",
      change: "Awaiting review",
      positive: false,
      gradient: "from-amber-500 to-yellow-400",
      bg: "from-amber-50 to-yellow-100/70",
      border: "border-amber-200",
      iconBg: "bg-amber-500",
      textColor: "text-amber-700",
      changeColor: "text-amber-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Approved Wards",
      value: dashboardData?.approved_wards ?? "—",
      change: "79% completion",
      positive: true,
      gradient: "from-emerald-600 to-green-400",
      bg: "from-emerald-50 to-green-100/70",
      border: "border-emerald-200",
      iconBg: "bg-emerald-600",
      textColor: "text-emerald-700",
      changeColor: "text-emerald-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Total Complaints",
      value: "312",
      change: "+14 this week",
      positive: null,
      gradient: "from-violet-600 to-purple-400",
      bg: "from-violet-50 to-purple-100/70",
      border: "border-violet-200",
      iconBg: "bg-violet-600",
      textColor: "text-violet-700",
      changeColor: "text-violet-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
          />
        </svg>
      ),
    },
  ];

  const total = dashboardData?.total_wards ?? 0;
  const approved = dashboardData?.approved_wards ?? 0;
  const pending = dashboardData?.pending_wards ?? 0;
  const rejected = dashboardData?.rejected_wards ?? 0;

  const verificationProgress =
    total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

  const WARD_PROGRESS = [
    { label: "Approved", count: approved, total, barCls: "bg-emerald-500" },
    { label: "Pending", count: pending, total, barCls: "bg-amber-400" },
    { label: "Rejected", count: rejected, total, barCls: "bg-rose-400" },
  ];


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await panchayathApi.dashboard();
        setDashboardData(res.data.data);
      } catch (err) {
        panchayathApi.handleAuthError(err);
        toast.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard.");
      }finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
    const handleUpdate = () => {
      fetchDashboard();
    };

    window.addEventListener("ward-status-updated", handleUpdate);

    return () => {
      window.removeEventListener("ward-status-updated", handleUpdate);
    };
  }, []);
  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* ── Welcome banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-white" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
              Welcome back
            </p>
            <h2 className="text-xl font-black tracking-tight leading-tight">{panchayathName}</h2>
            <p className="text-blue-200 text-sm mt-1">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-center px-4 py-2.5 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-black leading-none">
                {verificationProgress}%
              </p>
              <p className="text-[10px] text-blue-100 font-semibold mt-0.5">Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          Overview Statistics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                <p className="text-xs text-slate-400 mt-0.5">Latest ward and complaint events</p>
              </div>
              <button className="text-xs text-blue-600 font-semibold hover:underline">
                View all
              </button>
            </div>
            <div className="px-4 py-2 max-h-80 overflow-y-auto divide-y divide-slate-50">
              {RECENT_ACTIVITY.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Ward Verification Progress */}
        <section>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Ward Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Current cycle status</p>
            </div>
            <div className="p-5 space-y-5">
              {WARD_PROGRESS.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                    <span className="text-xs font-black text-slate-800">
                      {item.count} / {item.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.barCls} transition-all duration-700`}
                      style={{
                        width: item.total
                          ? `${(item.count / item.total) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Overall */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Overall Progress</span>
                  <span className="text-sm font-black text-emerald-600">
                    {verificationProgress}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>
              </div>

              {/* Quick action */}
              <button className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors duration-150 shadow-sm">
                Review Pending Verifications →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}