export default function StatsCard({ title, value, subtext, highlightColor, icon, trend }) {
  const isHighlighted = !!highlightColor;

  return (
    <div
      className={`
        relative group rounded-2xl p-5 flex flex-col gap-3
        bg-slate-900/60 backdrop-blur-sm
        border transition-all duration-300 cursor-default overflow-hidden
        hover:-translate-y-0.5 hover:shadow-xl
        ${isHighlighted
          ? "border-blue-500/40 shadow-blue-500/10 shadow-lg hover:border-blue-400/60 hover:shadow-blue-500/20"
          : "border-slate-700/50 hover:border-slate-600/70"
        }
      `}
    >
      {/* Ambient glow for highlighted card */}
      {isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-blue-900/10 pointer-events-none rounded-2xl" />
      )}

      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
            ${isHighlighted ? "bg-blue-500/15 text-blue-400" : "bg-slate-800/80 text-slate-400"}
          `}
        >
          {icon || (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4.5 h-4.5 w-[18px] h-[18px]">
              <path d="M3 13l4-4 4 4 4-6 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {trend && (
          <span
            className={`
              text-xs font-semibold px-2 py-0.5 rounded-full font-mono
              ${trend.startsWith("+") ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}
            `}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-slate-100 tracking-tight font-mono leading-none">
          {value}
        </p>
      </div>

      {/* Title + subtext */}
      <div className="mt-auto space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </p>
        <p
          className={`text-xs leading-snug ${
            isHighlighted ? "text-blue-400 font-semibold" : "text-slate-500"
          }`}
        >
          {subtext}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-px
          ${isHighlighted
            ? "bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-600/40 to-transparent"
          }
        `}
      />
    </div>
  );
}