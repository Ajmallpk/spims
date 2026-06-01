import React from "react";
import { ArrowLeft, FileText, LockOpen, Lock } from "lucide-react";

const ComplaintChatPageHeader = ({
  isClosed,
  onBack,
  onViewComplaint,
  onCloseChat,
  onReopenChat,
}) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
        {/* Left — back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex-shrink-0 w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-800 leading-tight truncate">
              Complaint Chat
            </h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">
              Citizen Communication
            </p>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onViewComplaint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            View Complaint
          </button>

          {/* Mobile view-complaint icon only */}
          <button
            onClick={onViewComplaint}
            className="sm:hidden w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150"
            aria-label="View complaint"
          >
            <FileText className="w-4 h-4" />
          </button>

          {isClosed ? (
            <button
              onClick={onReopenChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all duration-150 shadow-sm"
            >
              <LockOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reopen Chat</span>
              <span className="sm:hidden">Reopen</span>
            </button>
          ) : (
            <button
              onClick={onCloseChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all duration-150 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close Chat</span>
              <span className="sm:hidden">Close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintChatPageHeader;