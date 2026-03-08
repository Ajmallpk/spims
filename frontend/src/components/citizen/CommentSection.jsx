import { useState } from "react";
import Avatar from "@/components/ui/Avatar";

const CommentSection = ({ comments = [], issueId }) => {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  const handlePost = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      authorName: "You",
      text: commentText.trim(),
      timeAgo: "Just now",
    };
    setLocalComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Comment list */}
      {localComments.map((comment) => (
        <div key={comment.id} className="flex gap-2.5">
          <Avatar alt={comment.authorName} size="sm" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{comment.authorName}</span>
              <span className="text-xs text-gray-400">{comment.timeAgo}</span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
          </div>
        </div>
      ))}

      {/* Input */}
      <div className="flex items-center gap-2 pt-1">
        <Avatar alt="You" size="sm" />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
        />
        <button
          onClick={handlePost}
          disabled={!commentText.trim()}
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-200 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;