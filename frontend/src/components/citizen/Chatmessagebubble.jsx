/**
 * ChatMessageBubble.jsx
 * Individual message bubble — citizen (right) or authority (left).
 *
 * Props:
 *   message : {
 *     id, text, senderType: "CITIZEN"|"AUTHORITY",
 *     senderName, sentAt, status: "SENT"|"DELIVERED"|"READ",
 *     attachment?: { url, name, type }
 *   }
 */

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ReadReceipt = ({ status }) => {
  if (status === "READ")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-teal-300">
        <polyline points="1 9 8 16 23 1" />
        <polyline points="7 16 14 9" />
      </svg>
    );
  if (status === "DELIVERED")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-gray-400">
        <polyline points="1 9 8 16 23 1" />
        <polyline points="7 16 14 9" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-gray-400">
      <polyline points="1 9 8 16 23 1" />
    </svg>
  );
};

const AttachmentPreview = ({ attachment, isCitizen }) => {
  const isImage = attachment?.type?.startsWith("image/");
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 mt-1 rounded-lg p-2 transition-opacity hover:opacity-80 ${
        isCitizen ? "bg-teal-400/30" : "bg-white/60"
      }`}
    >
      {isImage ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-32 h-20 object-cover rounded"
        />
      ) : (
        <>
          <div className={`w-8 h-8 rounded flex items-center justify-center ${isCitizen ? "bg-white/20" : "bg-gray-200"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${isCitizen ? "text-white" : "text-gray-600"}`}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className={`text-xs font-medium truncate max-w-[100px] ${isCitizen ? "text-white" : "text-gray-700"}`}>
            {attachment.name}
          </span>
        </>
      )}
    </a>
  );
};

const ChatMessageBubble = ({ message }) => {
  const isCitizen = message.senderType === "CITIZEN";

  return (
    <div className={`flex flex-col gap-1 max-w-[75%] ${isCitizen ? "self-end items-end ml-auto" : "self-start items-start"}`}>
      {/* Sender label (authority only, first message) */}
      {!isCitizen && message.senderName && (
        <span className="text-xs text-gray-400 font-medium px-1">{message.senderName}</span>
      )}

      {/* Bubble */}
      <div
        className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isCitizen
            ? "bg-teal-500 text-white rounded-2xl rounded-br-md"
            : "bg-gray-200 text-gray-800 rounded-2xl rounded-bl-md"
        }`}
      >
        {/* Text */}
        {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}

        {/* Attachment */}
        {message.attachment && (
          <AttachmentPreview attachment={message.attachment} isCitizen={isCitizen} />
        )}
      </div>

      {/* Timestamp + read receipt */}
      <div className={`flex items-center gap-1 px-1 ${isCitizen ? "flex-row-reverse" : "flex-row"}`}>
        <span className="text-xs text-gray-400">{formatTime(message.sentAt)}</span>
        {isCitizen && message.status && <ReadReceipt status={message.status} />}
      </div>
    </div>
  );
};

export default ChatMessageBubble;