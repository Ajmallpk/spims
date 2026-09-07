const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    number: "text-blue-800",
    bar: "bg-blue-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    number: "text-amber-800",
    bar: "bg-amber-500",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-100",
    number: "text-green-800",
    bar: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
    number: "text-purple-800",
    bar: "bg-purple-500",
  },
};

export default function StatCard({ label, value, color = "blue", icon }) {
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
      {/* Icon & Bar */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${styles.bg} ${styles.border} border rounded-lg flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className={`h-1.5 w-10 ${styles.bar} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
      </div>

      {/* Number */}
      <div>
        <p className={`text-3xl font-extrabold ${styles.number} leading-tight tracking-tight`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-gray-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}