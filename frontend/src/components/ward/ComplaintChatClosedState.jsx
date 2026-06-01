import React from "react";
import { Lock, LockOpen } from "lucide-react";

const ComplaintChatClosedState = ({ onReopen }) => {
  return (
    <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-500" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700">Chat Closed</p>
            <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
              This complaint conversation was closed by the authority. The citizen cannot send new messages until this chat is reopened.
            </p>
          </div>

          {/* Reopen button */}
          <button
            onClick={onReopen}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all duration-150 shadow-sm self-start sm:self-center"
          >
            <LockOpen className="w-3.5 h-3.5" />
            Reopen Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintChatClosedState;