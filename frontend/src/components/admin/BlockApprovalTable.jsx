const statusConfig = {
  Pending: {
    label: "Pending",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    dot: "bg-amber-400",
  },
  Approved: {
    label: "Approved",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dot: "bg-red-400",
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border font-mono ${cfg.text} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function BlockApprovalTable({ data, onView, onApprove, onReject, filter }) {
  const filtered = filter === "All" ? data : data.filter((r) => r.status === filter);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="w-7 h-7">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-slate-500 font-semibold font-mono">No records found</p>
        <p className="text-slate-700 text-sm mt-1">No {filter !== "All" ? filter.toLowerCase() : ""} requests to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-slate-700/50">
            {["#", "Block Name", "Full Name", "Email", "Phone", "Submitted", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-600 font-mono whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {filtered.map((row, idx) => (
            <tr
              key={row.id}
              className="group transition-colors duration-150 hover:bg-slate-800/30"
            >
              {/* Index */}
              <td className="px-4 py-4">
                <span className="text-xs font-mono text-slate-700">{String(idx + 1).padStart(2, "0")}</span>
              </td>

              {/* Block Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-slate-700/60 text-slate-300">
                    {row.blockName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-200 whitespace-nowrap">{row.blockName}</span>
                </div>
              </td>

              {/* Full Name */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-400">{row.name}</span>
              </td>

              {/* Email */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-500 font-mono">{row.email}</span>
              </td>

              {/* Phone */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-500 font-mono">{row.phone}</span>
              </td>

              {/* Submitted Date */}
              <td className="px-4 py-4">
                <span className="text-xs text-slate-600 font-mono whitespace-nowrap">{row.submittedDate}</span>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  {/* View */}
                  <button
                    onClick={() => onView(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>

                  {/* Approve — only if pending */}
                  {row.status === "Pending" && (
                    <button
                      onClick={() => onApprove(row.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Approve
                    </button>
                  )}

                  {/* Reject — only if pending */}
                  {row.status === "Pending" && (
                    <button
                      onClick={() => onReject(row)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                      </svg>
                      Reject
                    </button>
                  )}

                  {/* Status label if not pending */}
                  {row.status === "Approved" && (
                    <span className="text-xs text-emerald-600 font-mono font-semibold">✓ Approved</span>
                  )}
                  {row.status === "Rejected" && (
                    <span className="text-xs text-red-600 font-mono font-semibold">✗ Rejected</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}