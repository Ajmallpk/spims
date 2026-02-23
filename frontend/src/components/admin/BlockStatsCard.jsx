export default function BlockStatsCard({ title, value, subtext, color, icon, trend }) {
  const colorMap = {
    blue: {
      icon: "bg-blue-500/15 text-blue-400",
      accent: "from-blue-500/60",
      glow: "hover:border-blue-500/30 hover:shadow-blue-500/10",
      trend: "text-blue-400 bg-blue-400/10",
    },
    green: {
      icon: "bg-emerald-500/15 text-emerald-400",
      accent: "from-emerald-500/60",
      glow: "hover:border-emerald-500/30 hover:shadow-emerald-500/10",
      trend: "text-emerald-400 bg-emerald-400/10",
    },
    yellow: {
      icon: "bg-amber-500/15 text-amber-400",
      accent: "from-amber-500/60",
      glow: "hover:border-amber-500/30 hover:shadow-amber-500/10",
      trend: "text-amber-400 bg-amber-400/10",
    },
    red: {
      icon: "bg-red-500/15 text-red-400",
      accent: "from-red-500/60",
      glow: "hover:border-red-500/30 hover:shadow-red-500/10",
      trend: "text-red-400 bg-red-400/10",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`
        relative group rounded-2xl p-5 flex flex-col gap-3
        bg-slate-900/60 backdrop-blur-sm
        border border-slate-700/50 overflow-hidden
        transition-all duration-300 cursor-default
        hover:-translate-y-0.5 hover:shadow-xl ${c.glow}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

      {/* Top: icon + trend */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${c.trend}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-slate-100 font-mono tracking-tight leading-none">
        {value}
      </p>

      {/* Label + subtext */}
      <div className="space-y-0.5 mt-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
          {title}
        </p>
        {subtext && (
          <p className="text-xs text-slate-600 leading-snug">{subtext}</p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${c.accent} to-transparent opacity-60`} />
    </div>
  );
}