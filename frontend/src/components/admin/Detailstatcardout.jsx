/**
 * DetailStatCard
 * Props:
 *  - label: string
 *  - value: number | string
 *  - icon: LucideIcon component
 *  - iconColor: tailwind text-* class  (e.g. "text-blue-500")
 *  - iconBg: tailwind bg-* class       (e.g. "bg-blue-50")
 *  - isLoading: boolean
 */
const DetailStatCard = ({ label, value, icon: Icon, iconColor = "text-blue-500", iconBg = "bg-blue-50", isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-gray-200 mb-4" />
        <div className="w-16 h-7 rounded bg-gray-200 mb-2" />
        <div className="w-24 h-4 rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-default">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${iconBg}`}>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>
      <p className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">
        {value !== undefined && value !== null ? value.toLocaleString() : "—"}
      </p>
      <p className="text-sm text-gray-500 font-medium leading-snug">{label}</p>
    </div>
  );
};

export default DetailStatCard;