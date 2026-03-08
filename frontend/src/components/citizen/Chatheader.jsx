/**
 * ChatHeader.jsx
 * Top bar of the chat window showing complaint info and authority details.
 *
 * Props:
 *   conversation : object | null
 *   loading      : boolean
 */

const STATUS_CONFIG = {
  OPEN:     { label: "Open",     cls: "bg-green-100 text-green-700" },
  PENDING:  { label: "Pending",  cls: "bg-yellow-100 text-yellow-700" },
  RESOLVED: { label: "Resolved", cls: "bg-teal-100 text-teal-700" },
  CLOSED:   { label: "Closed",   cls: "bg-gray-100 text-gray-500" },
  ESCALATED:{ label: "Escalated",cls: "bg-red-100 text-red-600" },
};

const AVATAR_COLORS = [
  "bg-teal-500","bg-indigo-500","bg-violet-500",
  "bg-orange-400","bg-pink-500","bg-emerald-500",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "AU";

const ChatHeader = ({ conversation, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-shrink-0 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!conversation) return null;

  const {
    complaintTitle,
    authorityName,
    wardName,
    category,
    status = "OPEN",
    complaintId,
  } = conversation;

  const statusConf = STATUS_CONFIG[status] ?? STATUS_CONFIG.OPEN;
  const isClosed = status === "CLOSED" || status === "RESOLVED";

  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 flex-shrink-0 bg-white rounded-t-xl">
      {/* Left: avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColor(authorityName)}`}
          >
            {getInitials(authorityName)}
          </div>
          {!isClosed && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {complaintTitle}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-500">{authorityName}</span>
            {wardName && (
              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full px-2 py-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {wardName}
              </span>
            )}
            {category && (
              <span className="text-xs bg-gray-100 text-gray-500 rounded-md px-1.5 py-0.5 font-medium">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: status + complaint ID */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {complaintId && (
          <span className="text-xs text-gray-400 hidden sm:block">
            #{complaintId}
          </span>
        )}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConf.cls}`}>
          {statusConf.label}
        </span>
        {isClosed && (
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 hidden sm:block">
            Chat closed
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;