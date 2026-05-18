const SkeletonBlock = ({ className }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

const ChatUserCardSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between mb-1.5">
        <SkeletonBlock className="h-3.5 w-28" />
        <SkeletonBlock className="h-3 w-10" />
      </div>
      <SkeletonBlock className="h-3 w-40" />
    </div>
  </div>
);

const MessageSkeleton = ({ align = "left" }) => (
  <div className={`flex ${align === "right" ? "justify-end" : "justify-start"} px-4 py-1`}>
    {align === "left" && <SkeletonBlock className="w-7 h-7 rounded-full mr-2 mt-1 flex-shrink-0" />}
    <div className={`flex flex-col gap-1 ${align === "right" ? "items-end" : "items-start"}`}>
      <SkeletonBlock className="h-10 w-48 rounded-2xl" />
      <SkeletonBlock className="h-3 w-16" />
    </div>
  </div>
);

const ChatSkeleton = ({ type = "sidebar" }) => {
  if (type === "sidebar") {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(6)].map((_, i) => (
          <ChatUserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="left" />
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
    </div>
  );
};

export default ChatSkeleton;