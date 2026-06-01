import React from "react";
import { Hash, MapPin, User, Circle } from "lucide-react";

const ComplaintChatInfoCard = ({ complaint }) => {
  const { id, title, citizen, isClosed } = complaint;

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* Complaint ID */}
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
              <span className="text-xs font-bold text-white font-mono">#{id}</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <MapPin className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
              <span className="text-xs font-semibold text-white truncate">{title}</span>
            </div>

            {/* Citizen */}
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
              <span className="text-xs text-blue-100">{citizen}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <Circle
                className={`w-2 h-2 flex-shrink-0 fill-current ${
                  isClosed ? "text-red-300" : "text-emerald-300"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isClosed ? "text-red-200" : "text-emerald-200"
                }`}
              >
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintChatInfoCard;