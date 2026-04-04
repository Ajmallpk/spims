const STATUS_STYLES = {
  pending: {
    container: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    label: "Pending",
  },
  in_progress: {
    container: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    label: "In Progress",
  },
  resolved: {
    container: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
    label: "Resolved",
  },
  escalated: {
    container: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    label: "Escalated",
  },
};

export default function StatusBadge({ status }) {
  const key = (status ?? "pending").toLowerCase();
  const styles = STATUS_STYLES[key] ?? STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.container}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot} ${
          key === "pending" ? "animate-pulse" : ""
        }`}
      />
      {styles.label}
    </span>
  );
}