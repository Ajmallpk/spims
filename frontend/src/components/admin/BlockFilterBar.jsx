const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Suspended", label: "Suspended" },
];

const statusDot = {
  All: "bg-slate-500",
  Active: "bg-emerald-400",
  Pending: "bg-amber-400",
  Suspended: "bg-red-400",
};

export default function BlockFilterBar({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onClear,
  totalResults,
}) {
  const hasActiveFilter = searchTerm !== "" || selectedStatus !== "All";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50">

      {/* Left: search + status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">

        {/* Search input */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 focus-within:border-blue-500/50 focus-within:bg-slate-800/80 transition-all duration-200"
          style={{ minWidth: 240 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by block name or email..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-700 focus:outline-none w-full font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-150 cursor-pointer">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[selectedStatus]}`} />
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-sm text-slate-300 font-mono focus:outline-none cursor-pointer appearance-none pr-6"
              style={{ minWidth: 130 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-300">
                  {opt.label}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0 pointer-events-none absolute right-3">
              <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Clear button */}
        {hasActiveFilter && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-mono text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200 hover:border-slate-600/60 transition-all duration-150 whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {/* Right: result count */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/30 border border-slate-700/30 self-start sm:self-auto">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="text-xs font-mono text-slate-500">
          <span className="text-slate-300 font-semibold">{totalResults}</span> records
        </span>
      </div>
    </div>
  );
}