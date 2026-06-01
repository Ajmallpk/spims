import React from "react";
import { MessageSquare } from "lucide-react";

const ComplaintChatListHeader = ({ totalCount = 0, openCount = 0 }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
              Complaint Chats
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage citizen complaint conversations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-xl font-bold text-slate-800 leading-none">{totalCount}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Total</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-xl font-bold text-emerald-600 leading-none">{openCount}</p>
            <p className="text-xs text-emerald-600 mt-0.5 font-medium">Open</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-xl font-bold text-red-500 leading-none">{totalCount - openCount}</p>
            <p className="text-xs text-red-500 mt-0.5 font-medium">Closed</p>
          </div>
        </div>
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-blue-100 via-slate-200 to-transparent" />
    </div>
  );
};

export default ComplaintChatListHeader;