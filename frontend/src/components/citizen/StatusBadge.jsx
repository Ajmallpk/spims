/**
 * StatusBadge.jsx
 * Reusable issue status badge for SPIMS Citizen Profile.
 *
 * Props:
 *   status  : "PENDING" | "RESOLVED" | "ESCALATED" | "OPEN" | "CLOSED"
 *   size    : "sm" | "md" (default "md")
 */

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-400 animate-pulse",
  },
  OPEN: {
    label: "Open",
    classes: "bg-blue-50 text-blue-600 border border-blue-200",
    dot: "bg-blue-400",
  },
  RESOLVED: {
    label: "Resolved",
    classes: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  ESCALATED: {
    label: "Escalated",
    classes: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  CLOSED: {
    label: "Closed",
    classes: "bg-gray-100 text-gray-500 border border-gray-200",
    dot: "bg-gray-400",
  },
};

const StatusBadge = ({ status = "PENDING", size = "md" }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClass} ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;