// components/VerificationPendingModal.jsx
// SPIMS – Smart Panchayath Issue Management System
// Modal: Shown when verification has been submitted but is awaiting admin approval.

export default function VerificationPendingModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-pending-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400" />

        <div className="p-7">
          {/* Animated icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 mx-auto mb-5 relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-7 h-7 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-40" />
          </div>

          {/* Title */}
          <h2
            id="verification-pending-title"
            className="text-center text-xl font-black text-slate-900 tracking-tight"
          >
            Verification Pending
          </h2>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-blue-300 rounded-full mx-auto my-3" />

          {/* Message */}
          <p className="text-center text-sm text-slate-500 leading-relaxed px-2">
            Your verification request is under review. Access will be
            granted after approval by the District Administration Office.
          </p>

          {/* Status tracker */}
          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Verification Status
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Documents Submitted", done: true },
                { label: "Under Administrative Review", done: true, active: true },
                { label: "Approval & Access Grant", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done
                        ? step.active
                          ? "bg-blue-500 text-white"
                          : "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step.done && !step.active ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : step.active ? (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      step.active
                        ? "text-blue-700"
                        : step.done
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="mt-4 rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 flex gap-3 items-start">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            <p className="text-xs text-sky-700 leading-snug">
              You will receive a notification once your account has been
              approved. Typically takes 1–3 working days.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold transition-colors duration-150"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}