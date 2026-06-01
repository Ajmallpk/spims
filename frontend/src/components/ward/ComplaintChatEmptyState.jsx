import React from "react";
import { MessageSquareDashed } from "lucide-react";

const ComplaintChatEmptyState = ({ isFiltered = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <MessageSquareDashed className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-700">
        {isFiltered ? "No chats match your search" : "No complaint chats yet"}
      </h3>
      <p className="mt-1.5 text-sm text-slate-400 max-w-xs leading-relaxed">
        {isFiltered
          ? "Try a different keyword — you can search by complaint title or citizen name."
          : "Complaint chats will appear here once ward officers initiate conversations with citizens."}
      </p>
    </div>
  );
};

export default ComplaintChatEmptyState;