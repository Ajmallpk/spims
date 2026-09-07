// components/StatusBadge.jsx
// SPIMS – Smart Panchayath Issue Management System
// Reusable status badge for ward verification states.
// Statuses: PENDING | APPROVED | REJECTED

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    containerCls: "bg-amber-50 text-amber-700 border-amber-200",
    dotCls: "bg-amber-400",
    pulseCls: "animate-pulse",
  },
  APPROVED: {
    label: "Approved",
    containerCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotCls: "bg-emerald-500",
    pulseCls: "",
  },
  REJECTED: {
    label: "Rejected",
    containerCls: "bg-rose-50 text-rose-700 border-rose-200",
    dotCls: "bg-rose-500",
    pulseCls: "",
  },
};

/**
 * StatusBadge
 * @param {string} status - "PENDING" | "APPROVED" | "REJECTED"
 * @param {string} [className] - Optional extra Tailwind classes
 */
export default function StatusBadge({ status, className = "" }) {
  // Normalize to uppercase so callers can pass lowercase/mixed
  const key = (status || "PENDING").toUpperCase();
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.PENDING;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        text-[11px] font-bold uppercase tracking-wider
        border
        ${config.containerCls}
        ${className}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotCls} ${config.pulseCls}`}
      />
      {config.label}
    </span>
  );
}