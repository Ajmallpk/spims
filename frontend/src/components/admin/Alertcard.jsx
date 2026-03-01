/**
 * AlertCard - Reusable card for both verification and critical alert lists.
 *
 * Props:
 *  - variant: "verification" | "critical"
 *  - title: string        (e.g. panchayath/ward name or reported user)
 *  - subtitle: string     (e.g. submitted date or report count label)
 *  - badge: string        (e.g. severity level for critical)
 *  - badgeColor: string   (tailwind color classes)
 *  - actionLabel: string  (button label)
 *  - onAction: function
 */
const severityColorMap = {
  Low: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Medium: "bg-orange-100 text-orange-700 border-orange-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const AlertCard = ({
  variant = "verification",
  title,
  subtitle,
  badge,
  actionLabel = "View",
  onAction,
}) => {
  const isVerification = variant === "verification";

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors duration-150 ${
        isVerification
          ? "bg-blue-50 border-blue-100 hover:bg-blue-100/60"
          : "bg-red-50 border-red-100 hover:bg-red-100/60"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isVerification ? "bg-blue-500" : "bg-red-500"
          }`}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {badge && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              severityColorMap[badge] ||
              "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {badge}
          </span>
        )}
        <button
          onClick={onAction}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 ${
            isVerification
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default AlertCard;