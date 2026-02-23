const statusConfig = {
  Active: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dot: "bg-emerald-400",
    glow: "",
  },
  Pending: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    dot: "bg-amber-400",
    glow: "",
  },
  Suspended: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dot: "bg-red-400",
    glow: "",
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border font-mono whitespace-nowrap ${cfg.text} ${cfg.bg} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" className="w-7 h-7">
          <path
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-slate-500 font-bold font-mono text-sm">
        {hasFilters ? "No results match your filters" : "No blocks registered"}
      </p>
      <p className="text-slate-700 text-xs mt-1.5 max-w-xs">
        {hasFilters
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Block authorities will appear here once registered."}
      </p>
    </div>
  );
}

export default function BlockListTable({ data, onViewProfile, onSuspend, onActivate, hasFilters }) {
  if (data.length === 0) return <EmptyState hasFilters={hasFilters} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px]">
        <thead>
          <tr className="border-b border-slate-700/50">
            {[
              "#",
              "Block Name",
              "Email",
              "Phone",
              "Status",
              "Panchayaths",
              "Wards",
              "Created",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-600 font-mono whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/25">
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className="group transition-colors duration-150 hover:bg-slate-800/30"
            >
              {/* Index */}
              <td className="px-4 py-4">
                <span className="text-xs font-mono text-slate-700">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </td>

              {/* Block Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-200"
                    style={{
                      background: `linear-gradient(135deg, ${row.avatarColor}22, ${row.avatarColor}11)`,
                      border: `1px solid ${row.avatarColor}30`,
                    }}
                  >
                    {row.blockName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 whitespace-nowrap">
                      {row.blockName}
                    </p>
                    <p className="text-xs text-slate-600 font-mono">{row.district}</p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-500 font-mono">{row.email}</span>
              </td>

              {/* Phone */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-500 font-mono whitespace-nowrap">
                  {row.phone}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>

              {/* Total Panchayaths */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-300 font-mono">
                    {row.totalPanchayaths}
                  </span>
                  <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500/60"
                      style={{ width: `${Math.min((row.totalPanchayaths / 80) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </td>

              {/* Total Wards */}
              <td className="px-4 py-4">
                <span className="text-sm font-bold text-slate-300 font-mono">
                  {row.totalWards}
                </span>
              </td>

              {/* Created Date */}
              <td className="px-4 py-4">
                <span className="text-xs text-slate-600 font-mono whitespace-nowrap">
                  {row.createdDate}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5">
                  {/* View Profile */}
                  <button
                    onClick={() => onViewProfile(row)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-3 h-3"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Profile
                  </button>

                  {/* Suspend — only if Active */}
                  {row.status === "Active" && (
                    <button
                      onClick={() => onSuspend(row.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-3 h-3"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeLinecap="round" />
                      </svg>
                      Suspend
                    </button>
                  )}

                  {/* Activate — only if Suspended */}
                  {row.status === "Suspended" && (
                    <button
                      onClick={() => onActivate(row.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-3 h-3"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Activate
                    </button>
                  )}

                  {/* Pending — no action except view */}
                  {row.status === "Pending" && (
                    <span className="text-xs text-amber-700 font-mono font-semibold px-2">
                      Awaiting
                    </span>
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