import React from "react";
import { ChevronRight, User } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
];

const getAvatarColor = (name = "") => {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
};

const ComplaintChatCard = ({ complaint, onClick }) => {
  const { id, title, citizen, authority, lastMessage, time, unreadCount, isClosed } = complaint;
  const initials = getInitials(
    authority || citizen
  );
  const avatarColor = getAvatarColor(
    authority || citizen
  );
  const hasUnread = unreadCount > 0 && !isClosed;

  return (
    <div
      onClick={() => onClick(id)}
      className={`group relative flex items-start gap-4 bg-white border rounded-2xl px-4 py-4 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 ${hasUnread ? "border-blue-200 bg-blue-50/30" : "border-slate-200"
        }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor}`}
      >
        {initials || <User className="w-4 h-4" />}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* Complaint title */}
            <p
              className={`text-sm font-semibold truncate ${hasUnread ? "text-slate-900" : "text-slate-700"
                }`}
            >
              {title}
            </p>
            {/* Citizen + ID */}
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              <span className="font-medium text-slate-600">
                {authority || citizen}
              </span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="font-mono text-slate-400">#{id}</span>
            </p>
          </div>

          {/* Right meta: time + badge */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
            <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${isClosed
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-700"
                }`}
            >
              {isClosed ? "CLOSED" : "OPEN"}
            </span>
          </div>
        </div>

        {/* Last message row */}
        <div className="flex items-center justify-between mt-2 gap-2">
          <p className="text-xs text-slate-500 truncate flex-1">{lastMessage}</p>

          {hasUnread && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <div className="flex-shrink-0 self-center text-slate-300 group-hover:text-blue-400 transition-colors">
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default ComplaintChatCard;