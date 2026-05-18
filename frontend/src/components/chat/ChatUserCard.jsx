const ChatUserCard = ({ contact, isSelected, onClick }) => {
  const { name, role, lastMessage, timestamp, unreadCount, isOnline } = contact;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left relative ${
        isSelected
          ? "bg-blue-600"
          : "hover:bg-gray-100 bg-white"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
            isSelected
              ? "bg-blue-400 text-white"
              : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
          }`}
        >
          {name?.charAt(0) || "W"}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
            isSelected ? "border-blue-600" : "border-white"
          } ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p
            className={`font-semibold text-sm truncate ${
              isSelected ? "text-white" : "text-gray-800"
            }`}
          >
            {name}
          </p>
          <span
            className={`text-xs flex-shrink-0 ml-2 ${
              isSelected ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {timestamp}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                isSelected ? "bg-blue-500 text-blue-100" : "bg-gray-100 text-gray-500"
              }`}
            >
              {role}
            </span>
            <p
              className={`text-xs truncate ${
                isSelected ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {lastMessage}
            </p>
          </div>

          {unreadCount > 0 && (
            <span
              className={`flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${
                isSelected
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 text-white"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatUserCard;