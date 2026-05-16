const TypingIndicator = ({ name }) => {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-blue-600">
          {name?.charAt(0) || "W"}
        </span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 mb-1">{name} is typing...</span>
    </div>
  );
};

export default TypingIndicator;