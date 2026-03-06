// citizen/components/CommentSection.jsx
import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentSection({ issueId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`/api/citizen/issue/${issueId}/comment/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error("Comment failed");
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const visibleComments = expanded ? comments : comments.slice(0, 2);

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
      {/* Comment count toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {comments.length === 0
          ? "No comments yet"
          : `${comments.length} comment${comments.length > 1 ? "s" : ""}`}
        {comments.length > 2 && (
          <span className="text-indigo-500">
            {expanded ? "\u00b7 Show less" : "\u00b7 See all"}
          </span>
        )}
      </button>

      {/* Comment list */}
      <div className="space-y-2">
        {visibleComments.map((c, idx) => (
          <div key={c.id || idx} className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold flex-shrink-0">
              {(c.citizen_name || c.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex items-baseline justify-between gap-2 mb-0.5">
                <span className="text-xs font-semibold text-gray-800">
                  {c.citizen_name || c.name || "Citizen"}
                </span>
                <span className="text-[10px] text-gray-400 flex-shrink-0">
                  {formatTime(c.created_at || c.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {c.text || c.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xs px-3.5 py-2 bg-gray-100 rounded-xl border border-transparent focus:outline-none focus:border-indigo-300 focus:bg-white transition-all placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}