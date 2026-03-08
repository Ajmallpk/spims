/**
 * ProfileStats.jsx
 * Activity statistics cards for the citizen.
 *
 * Props:
 *   issues  : array
 *   loading : boolean
 */

const StatCard = ({ label, value, icon, colorClasses, loading }) => (
  <div
    className={`${colorClasses} rounded-xl p-4 text-center space-y-2 transition-transform hover:-translate-y-0.5 hover:shadow-md`}
  >
    {loading ? (
      <div className="h-20 bg-white/50 rounded-lg animate-pulse" />
    ) : (
      <>
        <div className="w-9 h-9 rounded-xl bg-white/80 shadow-sm flex items-center justify-center mx-auto">
          {icon}
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs font-semibold text-gray-500 leading-tight">{label}</p>
      </>
    )}
  </div>
);

const ProfileStats = ({ issues = [], loading }) => {
  const total = issues.length;
  const resolved = issues.filter((i) =>
    ["RESOLVED", "CLOSED"].includes(i.status)
  ).length;
  const pending = issues.filter((i) =>
    ["PENDING", "OPEN"].includes(i.status)
  ).length;

  const stats = [
    {
      label: "Total Issues Posted",
      value: total,
      colorClasses: "bg-gray-50 border border-gray-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "Resolved Issues",
      value: resolved,
      colorClasses: "bg-green-50 border border-green-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-500">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Pending Issues",
      value: pending,
      colorClasses: "bg-yellow-50 border border-yellow-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-yellow-500">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gray-800">Activity Overview</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;