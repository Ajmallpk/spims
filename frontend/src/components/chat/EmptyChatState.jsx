const EmptyChatState = ({
  title = "SPIMS Internal Chat",
  description = "Select a chat to start messaging",
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 select-none">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h2>
      <p className="text-gray-400 text-sm text-center max-w-xs leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-col gap-2 w-64">
        {[
          { icon: "🔒", text: "Encrypted internal communication" },
          { icon: "⚡", text: "Real-time message delivery" },
          { icon: "🏛️", text: "Panchayath ↔ Ward only" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs text-gray-500">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyChatState;