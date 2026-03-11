import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import AuthorityResponse from "@/components/citizen/Authorityresponse";
import CommentSection from "@/components/citizen/Commentsection";
import complaintapi from "@/service/complaintsurls";

const IssueCard = ({ issue }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvotes || 0);
  const [showComments, setShowComments] = useState(issue.authorityResponse ? true : false);

  const handleUpvote = async () => {
    try {
      await complaintapi.toggleUpvote(issue.id);

      setUpvoted((prev) => !prev);
      setUpvoteCount((prev) => (upvoted ? prev - 1 : prev + 1));

    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar alt={issue.citizenName} size="md" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{issue.citizenName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 flex-wrap">
              <span className="text-teal-600 font-medium">{issue.ward}</span>
              <span>•</span>
              <span>{issue.location}</span>
              <span>•</span>
              <span>{issue.timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
        {issue.category && (
          <span className="inline-block bg-gray-100 text-gray-600 rounded-md px-2.5 py-1 text-xs font-medium">
            {issue.category}
          </span>
        )}
      </div>

      {/* Image */}
      {issue.image && (
        <img
          src={issue.image}
          alt={issue.category}
          className="rounded-xl w-full object-cover max-h-72"
        />
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${upvoted
                ? "text-teal-600 bg-teal-50"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
          >
            <svg viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{upvoteCount} Upvotes</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{issue.commentCount} Comments</span>
          </button>
        </div>

        {/* Share */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Authority Response */}
      {issue.authorityResponse && (
        <AuthorityResponse response={issue.authorityResponse} />
      )}

      {/* Comments */}
      {showComments && (
        <CommentSection comments={issue.comments || []} issueId={issue.id} />
      )}
    </div>
  );
};

export default IssueCard;