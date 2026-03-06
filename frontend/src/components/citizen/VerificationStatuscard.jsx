// citizen/components/VerificationStatusCard.jsx
import { ShieldCheck, ShieldAlert, Clock, ShieldOff, Info } from "lucide-react";
import StatusBadge from "@/components/citizen/StatusBadge";

const STATUS_META = {
  NOT_SUBMITTED: {
    icon: ShieldOff,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
    title: "Not Yet Verified",
    message:
      "You have not submitted your verification documents yet. Complete verification to report civic issues in your community.",
  },
  PENDING: {
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    title: "Under Review",
    message:
      "Your verification documents have been submitted and are currently being reviewed by your ward authority. This typically takes 1–2 business days.",
  },
  APPROVED: {
    icon: ShieldCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Identity Verified",
    message:
      "Your identity has been verified. You are now a verified citizen and can report issues, upvote, and comment in your community feed.",
  },
  REJECTED: {
    icon: ShieldAlert,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    title: "Verification Rejected",
    message:
      "Your verification request was rejected. Please review the reason below and resubmit with correct documents.",
  },
};

export default function VerificationStatusCard({ status, rejectionReason, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
      </div>
    );
  }

  const currentStatus = status || "NOT_SUBMITTED";
  const meta = STATUS_META[currentStatus] || STATUS_META.NOT_SUBMITTED;
  const Icon = meta.icon;

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.iconBg}`}>
            <Icon className={`w-5 h-5 ${meta.iconColor}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{meta.title}</h4>
            <div className="mt-1">
              <StatusBadge status={currentStatus} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{meta.message}</p>

      {/* Rejection reason */}
      {currentStatus === "REJECTED" && rejectionReason && (
        <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
          <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection Reason</p>
            <p className="text-xs text-red-600 leading-relaxed">{rejectionReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}