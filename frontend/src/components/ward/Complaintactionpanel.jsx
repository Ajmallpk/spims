const LOCKED_STATUSES = ["resolved", "escalated", "closed"];

export default function ComplaintActionPanel({ status, chatOpen, onResolve, onEscalate, onToggleChat }) {
  const statusKey = (status ?? "").toLowerCase().replace(/ /g, "_");
  const isLocked = LOCKED_STATUSES.includes(statusKey);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</h3>
      {isLocked && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-gray-500 font-medium">
            Actions locked — complaint is <span className="font-bold text-gray-700">{statusKey}</span>.
          </p>
        </div>
      )}
      <div className="space-y-2.5">
        <button onClick={onResolve} disabled={isLocked}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Mark as Resolved
        </button>
        <button onClick={onEscalate} disabled={isLocked}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
          Escalate Complaint
        </button>
        <button onClick={onToggleChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {chatOpen ? "Hide Chat" : "Open Chat"}
        </button>
      </div>
    </div>
  );
}