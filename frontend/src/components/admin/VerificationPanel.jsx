const verificationItems = [
  {
    id: 1,
    title: "Ward Member Batch — Malappuram South",
    description: "23 new ward member registrations pending identity cross-verification with voter rolls.",
    status: "pending",
    count: 23,
    time: "Submitted 14m ago",
  },
  {
    id: 2,
    title: "Panchayath Operator Access — Tirur Block",
    description: "8 operator accounts awaiting role confirmation and digital signature validation.",
    status: "urgent",
    count: 8,
    time: "Submitted 1h ago",
  },
  {
    id: 3,
    title: "Citizen Profile Re-verification — Ward 7",
    description: "56 citizen records flagged for address mismatch against census data update.",
    status: "pending",
    count: 56,
    time: "Submitted 3h ago",
  },
];

function VerificationItem({ item }) {
  return (
    <div className="group flex flex-col gap-2.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-blue-500/30 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex-shrink-0 w-2 h-2 rounded-full mt-0.5 ${
              item.status === "urgent" ? "bg-amber-400 shadow-amber-400/50 shadow-sm" : "bg-blue-400 shadow-blue-400/40 shadow-sm"
            }`}
          />
          <p className="text-sm font-semibold text-slate-200 leading-snug truncate">{item.title}</p>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
            item.status === "urgent"
              ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
              : "text-blue-400 bg-blue-400/10 border border-blue-400/20"
          }`}
        >
          {item.count}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed pl-4">{item.description}</p>

      <div className="flex items-center justify-between pl-4">
        <span className="text-xs text-slate-600 font-mono">{item.time}</span>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-400/40 hover:text-blue-300 transition-all duration-150 active:scale-95">
          Review →
        </button>
      </div>
    </div>
  );
}

export default function VerificationPanel() {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              Verification Alerts
            </p>
            <p className="text-xs text-slate-600 mt-0.5">87 pending total</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-150">
          View All
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {verificationItems.map((item) => (
          <VerificationItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-700/40 bg-slate-900/40">
        <p className="text-xs text-slate-600 font-mono">
          Last synced: <span className="text-slate-500">2 minutes ago</span>
        </p>
      </div>
    </div>
  );
}