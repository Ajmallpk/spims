export default function BlockApprovalDetailsModal({ block, onClose, onApprove, onReject }) {
  if (!block) return null;

  const statusConfig = {
    Pending: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
    Approved: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
    Rejected: { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
  };
  const sc = statusConfig[block.status] || statusConfig.Pending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,9,20,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/60 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1526 0%, #0a1020 100%)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-700/50"
          style={{ background: "rgba(13,21,38,0.97)", backdropFilter: "blur(10px)" }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight">
                Verification Request
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Block Authority Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${sc.text} ${sc.bg} ${sc.border}`}>
              {block.status.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Full Name", value: block.name, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "Block Name", value: block.blockName, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
                { label: "Email Address", value: block.email, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Phone Number", value: block.phone, icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { label: "Submitted Date", value: block.submittedDate, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: "District", value: block.district, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
              ].map((field) => (
                <div key={field.label}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" className="w-4 h-4">
                      <path d={field.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600 font-mono">{field.label}</p>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-3">
              Submitted Documents
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Aadhaar Image */}
              <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-700/40 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <p className="text-xs font-semibold text-slate-400 font-mono">Aadhaar Card</p>
                </div>
                <div className="flex items-center justify-center h-28 bg-slate-900/50">
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-mono">aadhaar_front.jpg</span>
                  </div>
                </div>
              </div>

              {/* Live Selfie */}
              <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-700/40 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-xs font-semibold text-slate-400 font-mono">Live Selfie</p>
                </div>
                <div className="flex items-center justify-center h-28 bg-slate-900/50">
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span className="text-xs font-mono">selfie_live.jpg</span>
                  </div>
                </div>
              </div>

              {/* Appointment Letter */}
              <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-700/40 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <p className="text-xs font-semibold text-slate-400 font-mono">Appointment Letter</p>
                </div>
                <div className="flex items-center justify-center h-28 bg-slate-900/50 cursor-pointer group hover:bg-slate-800/60 transition-colors">
                  <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-slate-400 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="text-xs font-mono">appointment.pdf</span>
                    <span className="text-xs text-blue-500 group-hover:text-blue-400">Click to view</span>
                  </div>
                </div>
              </div>

              {/* Government ID */}
              <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-700/40 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <p className="text-xs font-semibold text-slate-400 font-mono">Government ID</p>
                </div>
                <div className="flex items-center justify-center h-28 bg-slate-900/50 cursor-pointer group hover:bg-slate-800/60 transition-colors">
                  <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-slate-400 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M16 10a2 2 0 11-4 0 2 2 0 014 0zM6 9h4M6 13h4M6 17h12" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-mono">govt_id.pdf</span>
                    <span className="text-xs text-blue-500 group-hover:text-blue-400">Click to view</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        {block.status === "Pending" && (
          <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/50"
            style={{ background: "rgba(13,21,38,0.97)", backdropFilter: "blur(10px)" }}>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 bg-slate-800/60 border border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
            >
              Close
            </button>
            <button
              onClick={() => { onReject(block); onClose(); }}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-150 active:scale-95"
            >
              Reject
            </button>
            <button
              onClick={() => { onApprove(block.id); onClose(); }}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-150 active:scale-95"
            >
              Approve Request
            </button>
          </div>
        )}
        {block.status !== "Pending" && (
          <div className="flex justify-end px-6 py-4 border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-xl text-slate-300 bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-150"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}