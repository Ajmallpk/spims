import { useState } from "react";
import OnlineStatus from "./OnlineStatus";

const ChatHeader = ({ contact, onBack }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!contact) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">
            {contact.chat_user?.charAt(0) || "W"}
          </span>
        </div>
        {/* <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${contact.isOnline ? "bg-emerald-500" : "bg-gray-400"}`} /> */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800 truncate">{contact.chat_user}</h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            {contact.role || "Ward"}
          </span>
        </div>
        {/* <OnlineStatus
          isOnline={contact.isOnline}
          lastSeen={contact.lastSeen}
          showLabel={true}
        /> */}
      </div>

      <div className="flex items-center gap-1">
        {/* <button
          className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
          title="Call"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button> */}

        {/* <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
            title="More options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden">
              {["View Profile", "Search in Chat", "Clear Messages", "Mute Notifications"].map((item) => (
                <button
                  key={item}
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ChatHeader;