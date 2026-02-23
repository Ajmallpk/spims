import { useState } from "react";

const quickReasons = [
  "Documents are unclear or illegible",
  "Aadhaar details do not match records",
  "Appointment letter is invalid or expired",
  "Incomplete submission — missing documents",
  "Identity verification failed",
];

export default function RejectReasonModal({ block, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [error, setError] = useState("");

  if (!block) return null;

  const handleQuickSelect = (r) => {
    setSelectedQuick(r);
    setReason(r);
    setError("");
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    onConfirm(block.id, reason.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,9,20,0.90)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #130a0a 0%, #0d0a14 100%)",
          borderColor: "rgba(239,68,68,0.25)",
          boxShadow: "0 0 60px rgba(239,68,68,0.08), 0 25px 50px rgba(0,0,0,0.7)",
        }}
      >
        {/* Red top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-red-500/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
                <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold font-mono tracking-tight text-red-200">
                Reject Verification Request
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {block.name} — {block.blockName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-500 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Warning notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/6 border border-red-500/15">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0 mt-0.5">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs text-red-400/80 leading-relaxed">
              This action will notify the applicant via email. The rejection reason will be included in the notification. This action can be reviewed by a higher authority.
            </p>
          </div>

          {/* Quick reasons */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-2.5">
              Quick Select Reason
            </p>
            <div className="flex flex-col gap-1.5">
              {quickReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickSelect(r)}
                  className={`text-left text-xs px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                    selectedQuick === r
                      ? "bg-red-500/12 border-red-500/30 text-red-300"
                      : "bg-slate-800/40 border-slate-700/40 text-slate-500 hover:border-slate-600/60 hover:text-slate-400"
                  }`}
                >
                  <span className="mr-2">{selectedQuick === r ? "●" : "○"}</span>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom textarea */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-2">
              Custom Reason
            </p>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setSelectedQuick(null);
                setError("");
              }}
              placeholder="Type a detailed rejection reason for the applicant..."
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-300 placeholder-slate-700 bg-slate-900/60 border border-slate-700/50 focus:outline-none focus:border-red-500/40 focus:bg-slate-900/80 transition-all duration-150 resize-none font-mono"
            />
            {error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" /><line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-red-500/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 bg-slate-800/60 border border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl text-white bg-red-600/80 border border-red-500/50 hover:bg-red-600 hover:border-red-400/70 transition-all duration-150 active:scale-95"
            style={{ boxShadow: "0 0 20px rgba(239,68,68,0.2)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}