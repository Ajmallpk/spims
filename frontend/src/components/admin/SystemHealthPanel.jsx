const barData = [
  { label: "00", inflow: 30, escalation: 5 },
  { label: "04", inflow: 18, escalation: 2 },
  { label: "08", inflow: 55, escalation: 8 },
  { label: "10", inflow: 72, escalation: 12 },
  { label: "12", inflow: 88, escalation: 15 },
  { label: "14", inflow: 95, escalation: 10 },
  { label: "16", inflow: 100, escalation: 18 },
  { label: "18", inflow: 82, escalation: 14 },
  { label: "20", inflow: 60, escalation: 9 },
  { label: "22", inflow: 40, escalation: 6 },
  { label: "Now", inflow: 48, escalation: 7 },
];

const loginStats = [
  { label: "Active Sessions", value: "1,240", color: "text-emerald-400", dot: "bg-emerald-400" },
  { label: "Failed Attempts", value: "14", color: "text-red-400", dot: "bg-red-400" },
  { label: "Avg Duration", value: "14m", color: "text-blue-400", dot: "bg-blue-400" },
];

function BarChart() {
  const maxVal = 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Chart area */}
      <div className="flex items-end gap-1 h-24 px-1">
        {barData.map((d, i) => (
          <div key={i} className="group flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
            {/* Escalation bar (stacked on top concept - separate thin bar) */}
            <div className="relative w-full flex flex-col items-center gap-px justify-end h-full">
              {/* Inflow bar */}
              <div
                className="w-full rounded-sm bg-gradient-to-t from-blue-600/70 to-blue-400/60 group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-200 relative"
                style={{ height: `${(d.inflow / maxVal) * 100}%`, minHeight: 2 }}
              >
                {/* Escalation overlay as thin top stripe */}
                <div
                  className="absolute top-0 left-0 right-0 rounded-sm bg-amber-400/70"
                  style={{ height: `${Math.round((d.escalation / d.inflow) * 100)}%`, minHeight: 1, maxHeight: "40%" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1 px-1">
        {barData.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={`text-xs font-mono ${d.label === "Now" ? "text-blue-400 font-bold" : "text-slate-700"}`}>
              {d.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-1 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-blue-400/70" />
          <span className="text-xs text-slate-600">Complaint inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-amber-400/70" />
          <span className="text-xs text-slate-600">Escalations</span>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, percent, color }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-xs font-bold font-mono ${color}`}>{value}</span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function SystemHealthPanel() {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              System Health
            </p>
            <p className="text-xs text-slate-600 mt-0.5">Last 24 Hours</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-emerald-400/60 shadow-sm" />
          <span className="text-xs text-emerald-400 font-semibold font-mono">NOMINAL</span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pt-4 pb-2">
        <BarChart />
      </div>

      {/* Metrics */}
      <div className="px-5 pb-4 flex flex-col gap-3 mt-1">
        <MetricRow label="Complaint Inflow" value="+12%" percent={72} color="text-blue-400" />
        <MetricRow label="Escalation Rate" value="4.2%" percent={22} color="text-amber-400" />
        <MetricRow label="Resolution Rate" value="94.6%" percent={94} color="text-emerald-400" />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-slate-700/40" />

      {/* Login Activity */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-3">
          Login Activity Summary
        </p>
        <div className="grid grid-cols-3 gap-3">
          {loginStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              <p className={`text-base font-bold font-mono leading-none ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}