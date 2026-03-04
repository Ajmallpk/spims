function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message, currentRole = "WARD" }) {
  const isWard = (message.sender_role ?? message.role ?? "").toUpperCase() === "WARD";

  return (
    <div className={`flex ${isWard ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] flex flex-col gap-0.5 ${isWard ? "items-end" : "items-start"}`}>
        {/* Sender label */}
        <span className="text-xs text-gray-400 font-medium px-1">
          {isWard ? "You (Ward)" : (message.sender_name ?? "Citizen")}
        </span>

        {/* Bubble */}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isWard
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
        }`}>
          {message.message ?? message.content ?? ""}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 px-1">{formatTime(message.created_at ?? message.timestamp)}</span>
      </div>
    </div>
  );
}