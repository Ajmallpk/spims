/**
 * ChatMessages.jsx
 * Scrollable messages area, auto-scrolls to bottom on new messages.
 *
 * Props:
 *   messages : array
 *   loading  : boolean
 */

import { useEffect, useRef } from "react";
import ChatMessageBubble from "@/components/citizen/Chatmessagebubble";

const formatDateDivider = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isNewDay = (a, b) => {
  if (!a) return true;
  return new Date(a.sentAt).toDateString() !== new Date(b.sentAt).toDateString();
};

const SkeletonBubble = ({ align }) => (
  <div className={`flex flex-col gap-1 max-w-[65%] animate-pulse ${align === "right" ? "self-end items-end ml-auto" : "self-start items-start"}`}>
    <div className={`h-10 w-48 rounded-2xl ${align === "right" ? "bg-teal-100 rounded-br-md" : "bg-gray-200 rounded-bl-md"}`} />
    <div className="h-2.5 w-12 bg-gray-100 rounded" />
  </div>
);

const ChatMessages = ({ messages = [], loading }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sorted = [...messages].sort(
    (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-gray-50/50 to-white flex flex-col"
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBubble align="left" />
          <SkeletonBubble align="right" />
          <SkeletonBubble align="left" />
          <SkeletonBubble align="right" />
          <SkeletonBubble align="left" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-8 h-8 text-gray-300"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-sm text-gray-400 font-medium">No messages yet</p>
          <p className="text-xs text-gray-300">
            The conversation will appear here once started
          </p>
        </div>
      ) : (
        <>
          {sorted.map((msg, idx) => (
            <div key={msg.id} className="flex flex-col">
              {/* Date divider */}
              {isNewDay(sorted[idx - 1], msg) && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                    {formatDateDivider(msg.sentAt)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
              <ChatMessageBubble message={msg} />
            </div>
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;