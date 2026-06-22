import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import complaintapi from "@/service/complaintsurls";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ThumbsUp, MessageCircle, CheckCircle2, MapPin, User, Tag, Clock, ChevronDown, ChevronUp, Send, MoreHorizontal, Pencil, Trash2, CornerDownRight } from "lucide-react";

const Avatar = ({ name, size = "md" }) => {
  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const colors = ["bg-blue-400", "bg-indigo-400", "bg-sky-400", "bg-cyan-400", "bg-teal-400"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "bg-blue-400";
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    IN_PROGRESS: { label: "In Progress", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    RESOLVED: { label: "Resolved", cls: "bg-green-100 text-green-700 border-green-200" },
    REJECTED: { label: "Rejected", cls: "bg-red-100 text-red-700 border-red-200" },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
};

const formatTime = (date) => {
  const now = new Date();
  const commentTime = new Date(date);
  const seconds = Math.floor((now - commentTime) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
};

const CommentItem = ({ comment, currentUser, editingCommentId, editedText, setEditedText, setEditingCommentId, replyingTo, setReplyingTo, replyText, setReplyText, handleDeleteComment, handleEditComment, handleReply, isReply = false }) => {
  const isOwner = currentUser?.id === comment.user_id;
  const isEditing = editingCommentId === comment.id;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-3" : ""}`}>
      <Avatar name={comment.user_name} size={isReply ? "sm" : "md"} />
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-gray-800 text-sm">{comment.user_name}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(comment.created_at)}</span>
          </div>
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={2}
                className="w-full text-sm border border-blue-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEditComment(comment.id)} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition">Save</button>
                <button onClick={() => setEditingCommentId(null)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.comment}</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1.5 ml-2">
          {!isReply && (
            <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-xs text-gray-400 hover:text-blue-500 font-medium flex items-center gap-1 transition">
              <CornerDownRight className="w-3 h-3" /> Reply
            </button>
          )}
          {isOwner && !isEditing && (
            <>
              <button onClick={() => { setEditingCommentId(comment.id); setEditedText(comment.comment); }} className="text-xs text-gray-400 hover:text-blue-500 font-medium flex items-center gap-1 transition">
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3 ml-0 flex gap-2 items-end">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="flex-1 text-sm border border-blue-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none bg-white"
            />
            <button onClick={() => handleReply(comment.id)} className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl transition flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-2 space-y-1">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                editingCommentId={editingCommentId}
                editedText={editedText}
                setEditedText={setEditedText}
                setEditingCommentId={setEditingCommentId}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleDeleteComment={handleDeleteComment}
                handleEditComment={handleEditComment}
                handleReply={handleReply}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const IssueDetailPage = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showResolution, setShowResolution] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await complaintapi.getComplaintDetail(id);
        setIssue(res.data.data);
        const commentRes = await complaintapi.getComments(id);
        setComments(commentRes.data.results || []);
        const userRes = await complaintapi.getCurrentUser();
        setCurrentUser(userRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    try {
      setIsUpvoting(true);
      const res = await complaintapi.toggleUpvote(id);
      setIssue(prev => ({ ...prev, upvotes_count: res.data.data.upvotes_count, is_upvoted: res.data.data.is_upvoted }));
    } catch (err) { console.log(err); }
    finally { setIsUpvoting(false); }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await complaintapi.createComment(id, { comment: newComment });
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setNewComment("");
    } catch (err) { console.log(err); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await complaintapi.deleteComment(commentId);
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
    } catch (err) { console.log(err); }
  };

  const handleEditComment = async (commentId) => {
    try {
      await complaintapi.editComment(commentId, { comment: editedText });
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setEditingCommentId(null);
      setEditedText("");
    } catch (err) { console.log(err); }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;
    try {
      await complaintapi.createComment(id, { comment: replyText, parent: parentId });
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setReplyText("");
      setReplyingTo(null);
    } catch (err) { console.log(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Top nav bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-blue-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800 text-base">Issue Details</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Skeleton */}
        {!issue && (
          <div className="bg-white rounded-3xl shadow-sm border border-blue-50 p-5 animate-pulse space-y-4">
            <div className="h-5 bg-blue-100 rounded-full w-3/4" />
            <div className="h-4 bg-blue-50 rounded-full w-1/2" />
            <div className="h-32 bg-blue-50 rounded-2xl" />
          </div>
        )}

        {issue && (
          <>
            {/* Main Post Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">

              {/* Author row */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <Avatar name={issue.citizen_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{issue.citizen_name}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /> {issue.ward_name}
                    </span>
                  </div>
                </div>
                <StatusBadge status={issue.status} />
              </div>

              {/* Title & Meta */}
              <div className="px-5 pb-3">
                <h1 className="text-lg font-bold text-gray-900 leading-snug">{issue.title}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                    <Tag className="w-3 h-3" /> {issue.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" /> {issue.location}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
              </div>

              {/* Media */}
              {issue.media?.length > 0 && (
                <div className="relative bg-black">
                  {issue.media[activeMedia]?.file_type === "IMAGE" ? (
                    <img
                      src={issue.media[activeMedia].file.replace("http://", "https://")}
                      alt=""
                      className="w-full max-h-96 object-cover"
                    />
                  ) : (
                    <video controls className="w-full max-h-96">
                      <source src={issue.media[activeMedia].file.replace("http://", "https://")} />
                    </video>
                  )}
                  {issue.media.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {issue.media.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveMedia(i)}
                          className={`w-2 h-2 rounded-full transition ${i === activeMedia ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  )}
                  {issue.media.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {activeMedia + 1}/{issue.media.length}
                    </div>
                  )}
                </div>
              )}

              {/* Action bar */}
              <div className="flex items-center gap-1 px-4 py-3 border-t border-blue-50">
                <button
                  onClick={handleUpvote}
                  disabled={isUpvoting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    issue.is_upvoted
                      ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {issue.upvotes_count} {issue.upvotes_count === 1 ? "Upvote" : "Upvotes"}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
                </button>

                <div className="ml-auto">
                  <button
                    onClick={() => setShowResolution(prev => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      showResolution
                        ? "bg-green-500 text-white"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolution
                    {showResolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Resolution Card */}
            {showResolution && issue.resolution && (
              <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-green-50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Resolved by</p>
                    <p className="font-semibold text-gray-800 text-sm">{issue.resolution.authority_name}</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{issue.resolution.message}</p>
                </div>
                {issue.resolution.media?.length > 0 && (
                  <div className="grid gap-2 px-5 pb-5">
                    {issue.resolution.media.map(media => (
                      <div key={media.id} className="rounded-2xl overflow-hidden">
                        {media.file_type === "IMAGE" ? (
                          <img src={media.file.replace("http://", "https://")} alt="" className="w-full object-cover" />
                        ) : (
                          <video controls className="w-full">
                            <source src={media.file.replace("http://", "https://")} />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-blue-50 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-800 text-sm">
                  {comments.length === 0 ? "No comments yet" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Comment input */}
              <div className="flex gap-3 px-5 py-4 border-b border-blue-50">
                <Avatar name={currentUser?.username || currentUser?.name || "You"} size="md" />
                <div className="flex-1 flex gap-2 items-end">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={2}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
                    className="flex-1 text-sm bg-blue-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 resize-none transition"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments list */}
              {comments.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-100 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Be the first to comment</p>
                </div>
              ) : (
                <div className="px-5 py-4 space-y-5">
                  {comments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUser={currentUser}
                      editingCommentId={editingCommentId}
                      editedText={editedText}
                      setEditedText={setEditedText}
                      setEditingCommentId={setEditingCommentId}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleDeleteComment={handleDeleteComment}
                      handleEditComment={handleEditComment}
                      handleReply={handleReply}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IssueDetailPage;