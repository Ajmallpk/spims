/**
 * StatusBadge
 * Props:
 *  - status: "Pending" | "Approved" | "Rejected" (case-insensitive)
 */

const statusConfig = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  approved: {
    label: "Approved",
    classes: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  const config = statusConfig[key] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;