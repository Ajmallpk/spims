const StatCard = ({ label, value, icon: Icon, gradient, iconBg, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl shadow-md bg-white p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div className="w-16 h-4 rounded bg-gray-200" />
        </div>
        <div className="w-20 h-8 rounded bg-gray-200 mb-2" />
        <div className="w-28 h-4 rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl shadow-md p-5 text-white relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default ${gradient}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 shadow-md ${iconBg}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Value */}
      <p className="text-3xl font-extrabold tracking-tight leading-none mb-1">
        {value !== undefined && value !== null ? value.toLocaleString() : "—"}
      </p>

      {/* Label */}
      <p className="text-sm font-medium text-white/80 leading-snug">{label}</p>
    </div>
  );
};

export default StatCard;