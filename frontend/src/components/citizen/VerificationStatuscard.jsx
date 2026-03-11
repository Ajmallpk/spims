/**
 * VerificationStatusCard.jsx
 * Shows current verification status with contextual messaging and rejection reason.
 * Props:
 *   verificationStatus: object { status, rejectionReason, submittedAt, reviewedAt }
 *   loading: boolean
 */

import StatusBadge from "@/components/citizen/Statusbadge";

const STATUS_META = {
  NOT_SUBMITTED: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-400">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    bg: "bg-gray-50",
    title: "Verification Not Started",
    message:
      "Complete the verification form to get your Citizen badge and unlock the ability to post issues in your ward.",
  },
  PENDING: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-yellow-500">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bg: "bg-yellow-50",
    title: "Verification Under Review",
    message:
      "Your documents have been submitted and are being reviewed by the ward authority. This usually takes 1–2 working days.",
  },
  APPROVED: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-teal-500">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bg: "bg-teal-50",
    title: "Verified Citizen",
    message:
      "Your identity has been confirmed. You can now post issues, vote, and comment across all wards.",
  },
  REJECTED: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-red-500">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    bg: "bg-red-50",
    title: "Verification Rejected",
    message:
      "Your verification request was not approved. Please review the reason below and re-submit with corrected documents.",
  },
};

const VerificationStatusCard = ({ verificationStatus, loading }) => {
  const status = verificationStatus?.status ?? "NOT_SUBMITTED";
  const meta = STATUS_META[status] ?? STATUS_META.NOT_SUBMITTED;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Verification Status</h3>
        {!loading && <StatusBadge status={status} />}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : (
        <>
          {/* Status card */}
          <div className={`${meta.bg} rounded-xl p-4 flex items-start gap-3`}>
            <div className="flex-shrink-0 mt-0.5">{meta.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{meta.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{meta.message}</p>
            </div>
          </div>

          {/* Rejection reason */}
          {status === "REJECTED" && verificationStatus?.rejectionReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Rejection Reason</p>
              </div>
              <p className="text-sm text-red-700 leading-relaxed">
                {verificationStatus.rejectionReason}
              </p>
            </div>
          )}

          {/* Timeline */}
          {(verificationStatus?.submittedAt || verificationStatus?.reviewedAt) && (
            <div className="space-y-2 pt-1 border-t border-gray-100">
              {verificationStatus.submittedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Submitted on</span>
                  <span className="text-gray-600 font-medium">{formatDate(verificationStatus.submittedAt)}</span>
                </div>
              )}
              {verificationStatus.reviewedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Reviewed on</span>
                  <span className="text-gray-600 font-medium">{formatDate(verificationStatus.reviewedAt)}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerificationStatusCard;