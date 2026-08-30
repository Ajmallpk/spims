const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    number: "text-blue-800",
    bar: "bg-blue-500",
    icon: "text-blue-400",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    number: "text-amber-800",
    bar: "bg-amber-500",
    icon: "text-amber-400",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    number: "text-green-800",
    bar: "bg-green-500",
    icon: "text-green-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    number: "text-purple-800",
    bar: "bg-purple-500",
    icon: "text-purple-400",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    number: "text-red-800",
    bar: "bg-red-500",
    icon: "text-red-400",
  },
};

export default function DetailStatCard({ label, value, color = "blue", icon }) {
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${styles.bg} ${styles.border} border rounded-lg flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className={`h-1.5 w-10 ${styles.bar} rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-200`} />
      </div>
      <div>
        <p className={`text-3xl font-extrabold ${styles.number} leading-tight tracking-tight`}>
          {typeof value === "number" ? value.toLocaleString() : (value ?? 0)}
        </p>
        <p className="text-sm text-gray-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}