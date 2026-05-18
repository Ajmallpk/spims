const OnlineStatus = ({ isOnline, lastSeen, showLabel = true, size = "sm" }) => {
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex">
        <span
          className={`${dotSize} rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"
            }`}
        />
        {isOnline && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping`}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-xs text-gray-500">
          {isOnline
            ? "Online"
            : lastSeen
              ? `Last seen ${new Date(lastSeen).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
              : "Offline"}
        </span>
      )}
    </div>
  );
};

export default OnlineStatus;