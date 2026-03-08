/**
 * EmptyMessagesState.jsx
 * Shown when the citizen has no conversations yet.
 */

const EmptyMessagesState = () => {
  return (
    <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col items-center justify-center gap-5 p-8 text-center">
      {/* Animated icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-10 h-10 text-teal-400"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        {/* Floating dots */}
        <span className="absolute top-1 right-1 w-3 h-3 bg-teal-300 rounded-full opacity-60 animate-ping" />
        <span className="absolute top-1 right-1 w-3 h-3 bg-teal-400 rounded-full" />
      </div>

      <div className="space-y-2 max-w-xs">
        <h3 className="text-base font-bold text-gray-800">No messages yet</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          You will receive messages here when ward authorities contact you regarding a complaint.
        </p>
      </div>

      {/* Status pills */}
      <div className="flex flex-col items-center gap-2 mt-1">
        {[
          { icon: "🔔", text: "Authorities initiate conversations" },
          { icon: "📋", text: "Linked to your filed complaints" },
          { icon: "💬", text: "Reply directly from here" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 text-xs text-gray-500"
          >
            <span>{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyMessagesState;