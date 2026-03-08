/**
 * ChatInput.jsx
 * Message compose area at the bottom of ChatWindow.
 *
 * Props:
 *   onSend   : (text) => Promise<void>
 *   disabled : boolean  – true when chat is closed/resolved
 *   loading  : boolean  – message sending in progress
 */

import { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSend, disabled = false, loading = false }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Auto-focus when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) inputRef.current.focus();
  }, [disabled]);

  const canSend = text.trim().length > 0 && !disabled && !loading;

  const handleSend = async () => {
    if (!canSend) return;
    const msg = text.trim();
    setText("");
    await onSend?.(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex-shrink-0 border-t border-gray-100 ${disabled ? "bg-gray-50" : "bg-white"}`}>
      {/* Closed chat notice */}
      {disabled && (
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-xs text-gray-400 font-medium">
            This conversation is closed. You cannot send new messages.
          </p>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 p-4">
        {/* Text input */}
        <div className={`flex-1 relative rounded-2xl border transition-all ${
          disabled
            ? "bg-gray-100 border-gray-200 opacity-60"
            : "bg-gray-100 border-transparent focus-within:border-teal-300 focus-within:bg-white focus-within:shadow-sm"
        }`}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            placeholder={disabled ? "Chat is closed" : "Type your message…"}
            rows={1}
            className="w-full bg-transparent px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none leading-relaxed max-h-28 overflow-y-auto"
            style={{ minHeight: "40px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
            canSend
              ? "bg-teal-500 hover:bg-teal-600 text-white hover:shadow-md active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          title="Send message (Enter)"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      {/* Hint */}
      {!disabled && (
        <p className="text-center text-xs text-gray-400 pb-2 -mt-1">
          Press <kbd className="bg-gray-100 border border-gray-200 rounded px-1 text-gray-500">Enter</kbd> to send
        </p>
      )}
    </div>
  );
};

export default ChatInput;