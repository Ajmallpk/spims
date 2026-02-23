const alerts = [
  {
    id: 1,
    title: "Mass Complaint Spike — Tirur Municipal Block",
    description:
      "Unusual surge of 340+ complaints filed within 2 hours across 6 wards. Possible coordinated civic incident or infrastructure failure. Escalated to District Collector.",
    time: "12 minutes ago",
    severity: "critical",
    badge: "ACTIVE",
    category: "Infrastructure",
  },
  {
    id: 2,
    title: "Unauthorized API Access Attempt Detected",
    description:
      "18 consecutive failed authentication attempts from unrecognized IP range 203.0.113.xx. Temporary rate-limiting enforced. Security team notified.",
    time: "47 minutes ago",
    severity: "high",
    badge: null,
    category: "Security",
  },
  {
    id: 3,
    title: "Panchayath Data Sync Failure — Malappuram Zone 3",
    description:
      "Automated sync job failed for 4 consecutive cycles. 1,200+ citizen records may be out of date. Manual override available in data panel.",
    time: "2 hours ago",
    severity: "high",
    badge: null,
    category: "Data Integrity",
  },
];

const categoryColor = {
  Infrastructure: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Security: "text-red-400 bg-red-400/10 border-red-400/20",
  "Data Integrity": "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

function AlertItem({ alert }) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={`
        group flex flex-col gap-2.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${isCritical
          ? "bg-red-950/30 border-red-500/30 hover:border-red-400/50 hover:bg-red-950/40"
          : "bg-slate-800/40 border-slate-700/40 hover:border-red-500/20 hover:bg-slate-800/60"
        }
      `}
    >
      {/* Top: category + badge + time */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border font-mono ${categoryColor[alert.category]}`}>
          {alert.category}
        </span>
        <div className="flex items-center gap-2">
          {alert.badge && (
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              {alert.badge}
            </span>
          )}
          <span className="text-xs text-slate-600 font-mono whitespace-nowrap">{alert.time}</span>
        </div>
      </div>

      {/* Title */}
      <p className={`text-sm font-bold leading-snug ${isCritical ? "text-red-200" : "text-slate-200"}`}>
        {alert.title}
      </p>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed">{alert.description}</p>

      {/* Action row */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isCritical ? "bg-red-400" : "bg-amber-400"}`} />
          <span className={`text-xs font-semibold ${isCritical ? "text-red-400" : "text-amber-400"}`}>
            {isCritical ? "Requires immediate attention" : "Monitoring"}
          </span>
        </div>
        <button
          className={`
            text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 active:scale-95
            ${isCritical
              ? "text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/50"
              : "text-slate-400 bg-slate-700/30 border-slate-600/40 hover:text-slate-200 hover:bg-slate-700/60"
            }
          `}
        >
          Investigate →
        </button>
      </div>
    </div>
  );
}

export default function CriticalAlertsPanel() {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-red-500/25 overflow-hidden shadow-lg shadow-red-950/20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-red-500/15 bg-red-950/10">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-400 to-red-700" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-300 font-mono">
              Critical Governance Alerts
            </p>
            <p className="text-xs text-slate-600 mt-0.5">Requires admin action</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 font-mono px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping absolute" style={{ position: "static" }} />
            3 Active
          </span>
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>

      {/* Footer action */}
      <div className="px-5 py-3 border-t border-red-500/10 bg-red-950/5 flex items-center justify-between">
        <p className="text-xs text-slate-600 font-mono">
          Auto-refresh: <span className="text-slate-500">30s</span>
        </p>
        <button className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150">
          View All Incidents
        </button>
      </div>
    </div>
  );
}