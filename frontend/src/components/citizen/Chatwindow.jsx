/**
 * ChatWindow.jsx
 * Main chat panel combining header, messages, and input.
 *
 * Props:
 *   conversation      : object | null
 *   messages          : array
 *   messagesLoading   : boolean
 *   sending           : boolean
 *   onSend            : (text) => Promise<void>
 *   noConversation    : boolean  – show placeholder when nothing selected
 */

import ChatHeader from "@/components/citizen/Chatheader";
import ChatMessages from "@/components/citizen/Chatmessages";
import ChatInput from "@/components/citizen/Chatinput";

const NothingSelected = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
    <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-8 h-8 text-teal-300"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500">Select a conversation</p>
      <p className="text-xs text-gray-400 mt-1">
        Choose a complaint from the left to open the chat
      </p>
    </div>
  </div>
);

const ChatWindow = ({
  conversation,
  messages,
  messagesLoading,
  sending,
  onSend,
  noConversation,
}) => {
  const isClosed =
    conversation?.status === "CLOSED" || conversation?.status === "RESOLVED";

  return (
    <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col overflow-hidden">
      {noConversation || !conversation ? (
        <NothingSelected />
      ) : (
        <>
          <ChatHeader conversation={conversation} loading={false} />
          <ChatMessages messages={messages} loading={messagesLoading} />
          <ChatInput
            onSend={onSend}
            disabled={isClosed}
            loading={sending}
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;