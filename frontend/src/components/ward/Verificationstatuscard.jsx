import StatusBadge from "@/components/ward/Statusbadge";

const STATUS_CONFIG = {
  not_submitted: {
    icon: "📋",
    bgClass: "bg-gray-50 border-gray-200",
    title: "Verification Not Submitted",
    message:
      "You haven't submitted your verification documents yet. Complete the form to unlock full ward management features.",
  },
  pending: {
    icon: "⏳",
    bgClass: "bg-amber-50 border-amber-200",
    title: "Verification Under Review",
    message:
      "Your documents have been submitted and are currently being reviewed by the administrative team. You will be notified once a decision is made.",
  },
  approved: {
    icon: "✅",
    bgClass: "bg-green-50 border-green-200",
    title: "Verification Approved",
    message:
      "Your identity and officer credentials have been verified. You now have full access to all ward management features.",
  },
  rejected: {
    icon: "❌",
    bgClass: "bg-red-50 border-red-200",
    title: "Verification Rejected",
    message:
      "Your verification submission was not approved. Please review the reason below, make the necessary corrections, and resubmit your documents.",
  },
};

export default function VerificationStatusCard({ status, rejectionReason }) {
  const key = (status ?? "not_submitted").toLowerCase();
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.not_submitted;

  return (
    <div className={`rounded-xl border ${config.bgClass} p-5 space-y-3.5`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl flex-shrink-0">{config.icon}</span>
          <p className="text-sm font-bold text-gray-800 leading-snug">{config.title}</p>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={key} />
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-gray-600 leading-relaxed">{config.message}</p>

      {/* Rejection Reason Box */}
      {key === "rejected" && rejectionReason && (
        <div className="px-4 py-3 bg-white border border-red-200 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            Rejection Reason
          </p>
          <p className="text-sm text-red-700 leading-relaxed">{rejectionReason}</p>
        </div>
      )}
    </div>
  );
}