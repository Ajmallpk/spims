// components/VerificationStatusCard.jsx
// SPIMS – Smart Panchayath Issue Management System
// Displays the current verification status of the Panchayath account.
// Handles all 4 states: NOT_SUBMITTED | PENDING | APPROVED | REJECTED
//
// Props:
//   verificationStatus  {object}  - Status object: { status, rejection_reason, reviewed_at, submitted_at }
//   isLoading           {boolean} - Show skeleton

import StatusBadge from "@/components/panjayath/Statusbadge";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Status content config ────────────────────────────────────────────────────

const STATUS_CONTENT = {
  NOT_SUBMITTED: {
    title: "Verification Not Submitted",
    message:
      "Your account is not yet verified. Please complete the verification form below and submit your official documents to gain full access to SPIMS features.",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    borderColor: "border-slate-200",
    headerBg: "bg-slate-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
        />
      </svg>
    ),
  },
  PENDING: {
    title: "Verification Under Review",
    message:
      "Your verification request has been submitted and is currently being reviewed by the District Administration. You will be notified once the review is complete. This typically takes 1–3 working days.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
    headerBg: "bg-amber-50/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  APPROVED: {
    title: "Account Verified",
    message:
      "Your Panchayath account has been officially verified. You now have full access to all SPIMS features including ward management, complaint oversight, and administrative reports.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    headerBg: "bg-emerald-50/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
  REJECTED: {
    title: "Verification Rejected",
    message:
      "Your verification request was not approved. Please review the rejection reason below, make the necessary corrections, and resubmit your verification with updated documents.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    borderColor: "border-rose-200",
    headerBg: "bg-rose-50/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    ),
  },
};

// ─── Timeline Step ────────────────────────────────────────────────────────────

function TimelineStep({ label, done, active, isLast }) {
  return (
    <div className="flex items-start gap-3">
      {/* Step indicator */}
      <div className="flex flex-col items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
            done && !active
              ? "bg-emerald-500 border-emerald-500"
              : active
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-slate-300"
          }`}
        >
          {done && !active ? (
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
            </svg>
          ) : active ? (
            <span className="w-2 h-2 rounded-full bg-white" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          )}
        </div>
        {!isLast && (
          <div className={`w-px flex-1 min-h-[20px] mt-1 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
        )}
      </div>

      {/* Label */}
      <p
        className={`text-xs font-semibold pt-1 pb-4 ${
          active ? "text-blue-700" : done ? "text-emerald-700" : "text-slate-400"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * VerificationStatusCard
 * @param {object}  verificationStatus  - { status, rejection_reason, submitted_at, reviewed_at }
 * @param {boolean} isLoading
 */
export default function VerificationStatusCard({ verificationStatus, isLoading }) {
  const status = (verificationStatus?.status || "NOT_SUBMITTED").toUpperCase();
  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT.NOT_SUBMITTED;

  // Timeline steps derived from current status
  const steps = [
    {
      label: "Verification Documents Submitted",
      done: ["PENDING", "APPROVED", "REJECTED"].includes(status),
      active: false,
    },
    {
      label: "Under Administrative Review",
      done: ["APPROVED", "REJECTED"].includes(status),
      active: status === "PENDING",
    },
    {
      label: status === "REJECTED" ? "Review Completed — Rejected" : "Approved & Access Granted",
      done: status === "APPROVED",
      active: status === "REJECTED",
    },
  ];

  return (
    <div className={`bg-white rounded-2xl border ${content.borderColor} shadow-md overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b ${content.borderColor} ${content.headerBg}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${content.iconBg} flex items-center justify-center ${content.iconColor} flex-shrink-0`}>
              {isLoading ? (
                <div className="w-full h-full rounded-xl bg-slate-200 animate-pulse" />
              ) : (
                content.icon
              )}
            </div>
            <div>
              {isLoading ? (
                <>
                  <div className="h-4 w-40 bg-slate-200 rounded-lg animate-pulse mb-1.5" />
                  <div className="h-3 w-24 bg-slate-100 rounded-lg animate-pulse" />
                </>
              ) : (
                <>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    Verification Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{content.title}</p>
                </>
              )}
            </div>
          </div>

          {/* Badge */}
          {!isLoading && <StatusBadge status={status} />}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {isLoading ? (
          <div className="space-y-2.5">
            <div className="h-3 w-full bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3 w-3/5 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ) : (
          <>
            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">{content.message}</p>

            {/* Rejection reason block */}
            {status === "REJECTED" && verificationStatus?.rejection_reason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-rose-800 leading-relaxed">
                      {verificationStatus.rejection_reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex flex-wrap gap-4">
              {verificationStatus?.submitted_at && (
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <span className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Submitted:</span>{" "}
                    {formatDate(verificationStatus.submitted_at)}
                  </span>
                </div>
              )}
              {verificationStatus?.reviewed_at && (
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Reviewed:</span>{" "}
                    {formatDate(verificationStatus.reviewed_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 pt-4 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Verification Progress
              </p>
              {steps.map((step, i) => (
                <TimelineStep
                  key={i}
                  label={step.label}
                  done={step.done}
                  active={step.active}
                  isLast={i === steps.length - 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}