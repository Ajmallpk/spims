/**
 * ConversationItem.jsx
 * Single clickable conversation row inside ConversationList.
 *
 * Props:
 *   conversation   : object
 *   isSelected     : boolean
 *   onClick        : () => void
 */

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "AU";

const AVATAR_COLORS = [
  "bg-teal-500", "bg-indigo-500", "bg-violet-500",
  "bg-orange-400", "bg-pink-500", "bg-emerald-500",
];

const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0)
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const {
    complaintTitle,
    authorityName,
    lastMessage,
    lastMessageAt,
    unreadCount = 0,
    status = "OPEN",
    category,
  } = conversation;

  const isClosed = status === "CLOSED" || status === "RESOLVED";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 text-left transition-all duration-150 border-b border-gray-50 last:border-0 hover:bg-gray-50 ${
        isSelected ? "bg-teal-50 border-l-2 border-l-teal-500 hover:bg-teal-50" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColor(authorityName)}`}
        >
          {getInitials(authorityName)}
        </div>
        {/* Online / active indicator */}
        {!isClosed && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Text area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p className={`text-sm font-semibold truncate leading-tight ${isSelected ? "text-teal-700" : "text-gray-900"}`}>
            {complaintTitle}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
            {formatTime(lastMessageAt)}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-1 truncate">
          {authorityName}
          {category && (
            <span className="ml-1 text-gray-400">· {category}</span>
          )}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400 truncate flex-1 leading-snug">
            {lastMessage || "No messages yet"}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {isClosed && (
              <span className="text-[10px] bg-gray-100 text-gray-400 rounded-full px-1.5 py-0.5 font-medium">
                Closed
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;