// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import complaintapi from "@/service/complaintsurls";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, ThumbsUp, MessageCircle, CheckCircle2, MapPin, User, Tag, Clock, ChevronDown, ChevronUp, Send, MoreHorizontal, Pencil, Trash2, CornerDownRight } from "lucide-react";

// const Avatar = ({ name, size = "md" }) => {
//   const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
//   const colors = ["bg-blue-400", "bg-indigo-400", "bg-sky-400", "bg-cyan-400", "bg-teal-400"];
//   const color = colors[name?.charCodeAt(0) % colors.length] || "bg-blue-400";
//   const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
//   return (
//     <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
//       {initials}
//     </div>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const map = {
//     PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200" },
//     IN_PROGRESS: { label: "In Progress", cls: "bg-blue-100 text-blue-700 border-blue-200" },
//     RESOLVED: { label: "Resolved", cls: "bg-green-100 text-green-700 border-green-200" },
//     REJECTED: { label: "Rejected", cls: "bg-red-100 text-red-700 border-red-200" },
//   };
//   const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
//   return (
//     <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current" />
//       {s.label}
//     </span>
//   );
// };

// const formatTime = (date) => {
//   const now = new Date();
//   const commentTime = new Date(date);
//   const seconds = Math.floor((now - commentTime) / 1000);
//   if (seconds < 60) return "Just now";
//   if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//   if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
//   if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
//   if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
//   return `${Math.floor(seconds / 31536000)}y ago`;
// };

// const CommentItem = ({ comment, currentUser, editingCommentId, editedText, setEditedText, setEditingCommentId, replyingTo, setReplyingTo, replyText, setReplyText, handleDeleteComment, handleEditComment, handleReply, isReply = false }) => {
//   const isOwner = currentUser?.id === comment.user_id;
//   const isEditing = editingCommentId === comment.id;

//   return (
//     <div className={`flex gap-3 ${isReply ? "ml-10 mt-3" : ""}`}>
//       <Avatar name={comment.user_name} size={isReply ? "sm" : "md"} />
//       <div className="flex-1 min-w-0">
//         <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50">
//           <div className="flex items-center justify-between gap-2">
//             <span className="font-semibold text-gray-800 text-sm">{comment.user_name}</span>
//             <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(comment.created_at)}</span>
//           </div>
//           {isEditing ? (
//             <div className="mt-2">
//               <textarea
//                 value={editedText}
//                 onChange={(e) => setEditedText(e.target.value)}
//                 rows={2}
//                 className="w-full text-sm border border-blue-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
//               />
//               <div className="flex gap-2 mt-2">
//                 <button onClick={() => handleEditComment(comment.id)} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition">Save</button>
//                 <button onClick={() => setEditingCommentId(null)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition">Cancel</button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.comment}</p>
//           )}
//         </div>

//         <div className="flex items-center gap-3 mt-1.5 ml-2">
//           {!isReply && (
//             <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-xs text-gray-400 hover:text-blue-500 font-medium flex items-center gap-1 transition">
//               <CornerDownRight className="w-3 h-3" /> Reply
//             </button>
//           )}
//           {isOwner && !isEditing && (
//             <>
//               <button onClick={() => { setEditingCommentId(comment.id); setEditedText(comment.comment); }} className="text-xs text-gray-400 hover:text-blue-500 font-medium flex items-center gap-1 transition">
//                 <Pencil className="w-3 h-3" /> Edit
//               </button>
//               <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition">
//                 <Trash2 className="w-3 h-3" /> Delete
//               </button>
//             </>
//           )}
//         </div>

//         {replyingTo === comment.id && (
//           <div className="mt-3 ml-0 flex gap-2 items-end">
//             <textarea
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               placeholder="Write a reply..."
//               rows={2}
//               className="flex-1 text-sm border border-blue-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none bg-white"
//             />
//             <button onClick={() => handleReply(comment.id)} className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl transition flex-shrink-0">
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {comment.replies?.length > 0 && (
//           <div className="mt-2 space-y-1">
//             {comment.replies.map(reply => (
//               <CommentItem
//                 key={reply.id}
//                 comment={reply}
//                 currentUser={currentUser}
//                 editingCommentId={editingCommentId}
//                 editedText={editedText}
//                 setEditedText={setEditedText}
//                 setEditingCommentId={setEditingCommentId}
//                 replyingTo={replyingTo}
//                 setReplyingTo={setReplyingTo}
//                 replyText={replyText}
//                 setReplyText={setReplyText}
//                 handleDeleteComment={handleDeleteComment}
//                 handleEditComment={handleEditComment}
//                 handleReply={handleReply}
//                 isReply
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const IssueDetailPage = () => {
//   const { id } = useParams();
//   const [issue, setIssue] = useState(null);
//   const [isUpvoting, setIsUpvoting] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editedText, setEditedText] = useState("");
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [showResolution, setShowResolution] = useState(false);
//   const [activeMedia, setActiveMedia] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchIssue = async () => {
//       try {
//         const res = await complaintapi.getComplaintDetail(id);
//         setIssue(res.data.data);
//         const commentRes = await complaintapi.getComments(id);
//         setComments(commentRes.data.results || []);
//         const userRes = await complaintapi.getCurrentUser();
//         setCurrentUser(userRes.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchIssue();
//   }, [id]);

//   const handleUpvote = async () => {
//     try {
//       setIsUpvoting(true);
//       const res = await complaintapi.toggleUpvote(id);
//       setIssue(prev => ({ ...prev, upvotes_count: res.data.data.upvotes_count, is_upvoted: res.data.data.is_upvoted }));
//     } catch (err) { console.log(err); }
//     finally { setIsUpvoting(false); }
//   };

//   const handleCommentSubmit = async () => {
//     if (!newComment.trim()) return;
//     try {
//       await complaintapi.createComment(id, { comment: newComment });
//       const commentRes = await complaintapi.getComments(id);
//       setComments(commentRes.data.results || []);
//       setNewComment("");
//     } catch (err) { console.log(err); }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await complaintapi.deleteComment(commentId);
//       const commentRes = await complaintapi.getComments(id);
//       setComments(commentRes.data.results || []);
//     } catch (err) { console.log(err); }
//   };

//   const handleEditComment = async (commentId) => {
//     try {
//       await complaintapi.editComment(commentId, { comment: editedText });
//       const commentRes = await complaintapi.getComments(id);
//       setComments(commentRes.data.results || []);
//       setEditingCommentId(null);
//       setEditedText("");
//     } catch (err) { console.log(err); }
//   };

//   const handleReply = async (parentId) => {
//     if (!replyText.trim()) return;
//     try {
//       await complaintapi.createComment(id, { comment: replyText, parent: parentId });
//       const commentRes = await complaintapi.getComments(id);
//       setComments(commentRes.data.results || []);
//       setReplyText("");
//       setReplyingTo(null);
//     } catch (err) { console.log(err); }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       {/* Top nav bar */}
//       <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-blue-100 px-4 py-3 flex items-center gap-3">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <span className="font-semibold text-gray-800 text-base">Issue Details</span>
//       </div>

//       <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

//         {/* Skeleton */}
//         {!issue && (
//           <div className="bg-white rounded-3xl shadow-sm border border-blue-50 p-5 animate-pulse space-y-4">
//             <div className="h-5 bg-blue-100 rounded-full w-3/4" />
//             <div className="h-4 bg-blue-50 rounded-full w-1/2" />
//             <div className="h-32 bg-blue-50 rounded-2xl" />
//           </div>
//         )}

//         {issue && (
//           <>
//             {/* Main Post Card */}
//             <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">

//               {/* Author row */}
//               <div className="flex items-center gap-3 px-5 pt-5 pb-3">
//                 <Avatar name={issue.citizen_name} size="lg" />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-gray-800 text-sm">{issue.citizen_name}</p>
//                   <div className="flex items-center gap-2 flex-wrap mt-0.5">
//                     <span className="flex items-center gap-1 text-xs text-gray-400">
//                       <MapPin className="w-3 h-3" /> {issue.ward_name}
//                     </span>
//                   </div>
//                 </div>
//                 <StatusBadge status={issue.status} />
//               </div>

//               {/* Title & Meta */}
//               <div className="px-5 pb-3">
//                 <h1 className="text-lg font-bold text-gray-900 leading-snug">{issue.title}</h1>
//                 <div className="flex items-center gap-3 mt-2 flex-wrap">
//                   <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
//                     <Tag className="w-3 h-3" /> {issue.category}
//                   </span>
//                   <span className="inline-flex items-center gap-1 text-xs text-gray-400">
//                     <MapPin className="w-3 h-3" /> {issue.location}
//                   </span>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="px-5 pb-4">
//                 <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
//               </div>

//               {/* Media */}
//               {issue.media?.length > 0 && (
//                 <div className="relative bg-black">
//                   {issue.media[activeMedia]?.file_type === "IMAGE" ? (
//                     <img
//                       src={issue.media[activeMedia].file.replace("http://", "https://")}
//                       alt=""
//                       className="w-full max-h-96 object-cover"
//                     />
//                   ) : (
//                     <video controls className="w-full max-h-96">
//                       <source src={issue.media[activeMedia].file.replace("http://", "https://")} />
//                     </video>
//                   )}
//                   {issue.media.length > 1 && (
//                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                       {issue.media.map((_, i) => (
//                         <button
//                           key={i}
//                           onClick={() => setActiveMedia(i)}
//                           className={`w-2 h-2 rounded-full transition ${i === activeMedia ? "bg-white" : "bg-white/50"}`}
//                         />
//                       ))}
//                     </div>
//                   )}
//                   {issue.media.length > 1 && (
//                     <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
//                       {activeMedia + 1}/{issue.media.length}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Action bar */}
//               <div className="flex items-center gap-1 px-4 py-3 border-t border-blue-50">
//                 <button
//                   onClick={handleUpvote}
//                   disabled={isUpvoting}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
//                     issue.is_upvoted
//                       ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
//                       : "bg-blue-50 text-blue-600 hover:bg-blue-100"
//                   }`}
//                 >
//                   <ThumbsUp className="w-4 h-4" />
//                   {issue.upvotes_count} {issue.upvotes_count === 1 ? "Upvote" : "Upvotes"}
//                 </button>

//                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
//                   <MessageCircle className="w-4 h-4" />
//                   {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
//                 </button>

//                 <div className="ml-auto">
//                   <button
//                     onClick={() => setShowResolution(prev => !prev)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
//                       showResolution
//                         ? "bg-green-500 text-white"
//                         : "bg-green-50 text-green-600 hover:bg-green-100"
//                     }`}
//                   >
//                     <CheckCircle2 className="w-4 h-4" />
//                     Resolution
//                     {showResolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Resolution Card */}
//             {showResolution && issue.resolution && (
//               <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
//                 <div className="flex items-center gap-2 px-5 py-4 border-b border-green-50">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <CheckCircle2 className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400 font-medium">Resolved by</p>
//                     <p className="font-semibold text-gray-800 text-sm">{issue.resolution.authority_name}</p>
//                   </div>
//                 </div>
//                 <div className="px-5 py-4">
//                   <p className="text-sm text-gray-600 leading-relaxed">{issue.resolution.message}</p>
//                 </div>
//                 {issue.resolution.media?.length > 0 && (
//                   <div className="grid gap-2 px-5 pb-5">
//                     {issue.resolution.media.map(media => (
//                       <div key={media.id} className="rounded-2xl overflow-hidden">
//                         {media.file_type === "IMAGE" ? (
//                           <img src={media.file.replace("http://", "https://")} alt="" className="w-full object-cover" />
//                         ) : (
//                           <video controls className="w-full">
//                             <source src={media.file.replace("http://", "https://")} />
//                           </video>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Comments Section */}
//             <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">
//               <div className="px-5 py-4 border-b border-blue-50 flex items-center gap-2">
//                 <MessageCircle className="w-4 h-4 text-blue-500" />
//                 <span className="font-semibold text-gray-800 text-sm">
//                   {comments.length === 0 ? "No comments yet" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
//                 </span>
//               </div>

//               {/* Comment input */}
//               <div className="flex gap-3 px-5 py-4 border-b border-blue-50">
//                 <Avatar name={currentUser?.username || currentUser?.name || "You"} size="md" />
//                 <div className="flex-1 flex gap-2 items-end">
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Share your thoughts..."
//                     rows={2}
//                     onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
//                     className="flex-1 text-sm bg-blue-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 resize-none transition"
//                   />
//                   <button
//                     onClick={handleCommentSubmit}
//                     disabled={!newComment.trim()}
//                     className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition flex-shrink-0"
//                   >
//                     <Send className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Comments list */}
//               {comments.length === 0 ? (
//                 <div className="px-5 py-10 text-center">
//                   <MessageCircle className="w-8 h-8 text-blue-100 mx-auto mb-2" />
//                   <p className="text-sm text-gray-400">Be the first to comment</p>
//                 </div>
//               ) : (
//                 <div className="px-5 py-4 space-y-5">
//                   {comments.map(comment => (
//                     <CommentItem
//                       key={comment.id}
//                       comment={comment}
//                       currentUser={currentUser}
//                       editingCommentId={editingCommentId}
//                       editedText={editedText}
//                       setEditedText={setEditedText}
//                       setEditingCommentId={setEditingCommentId}
//                       replyingTo={replyingTo}
//                       setReplyingTo={setReplyingTo}
//                       replyText={replyText}
//                       setReplyText={setReplyText}
//                       handleDeleteComment={handleDeleteComment}
//                       handleEditComment={handleEditComment}
//                       handleReply={handleReply}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IssueDetailPage;






import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import complaintapi from "@/service/complaintsurls";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ThumbsUp, MessageCircle, CheckCircle2,
  MapPin, Tag, ChevronDown, ChevronUp, Send,
  Pencil, Trash2, CornerDownRight, X, ChevronRight
} from "lucide-react";

import toast from "react-hot-toast";

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
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
  return `${Math.floor(seconds / 31536000)}y`;
};

const CommentItem = ({
  comment, currentUser,
  editingCommentId, editedText, setEditedText, setEditingCommentId,
  replyingTo, setReplyingTo, replyText, setReplyText,
  handleDeleteComment, handleEditComment, handleReply,
  isReply = false,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = currentUser?.id === comment.user_id;
  const isEditing = editingCommentId === comment.id;
  const replyCount = comment.replies?.length || 0;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-9" : ""}`}>
      <Avatar name={comment.user_name} size={isReply ? "sm" : "md"} />
      <div className="flex-1 min-w-0">
        <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-gray-800 text-sm">{comment.user_name}</span>
            <span className="text-[11px] text-gray-400">{formatTime(comment.created_at)}</span>
          </div>
          {isEditing ? (
            <div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={2}
                autoFocus
                className="w-full text-sm bg-white border border-blue-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEditComment(comment.id)} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition">Save</button>
                <button onClick={() => setEditingCommentId(null)} className="text-xs bg-white hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium border border-gray-200 transition">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1.5 ml-1">
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-[11px] font-semibold text-gray-400 hover:text-blue-500 transition flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" /> Reply
            </button>
          )}
          {isOwner && !isEditing && (
            <>
              <button
                onClick={() => { setEditingCommentId(comment.id); setEditedText(comment.comment); }}
                className="text-[11px] font-semibold text-gray-400 hover:text-blue-500 transition flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3 flex gap-2 items-end ml-1">
            <Avatar name={currentUser?.username || "You"} size="sm" />
            <div className="flex-1 flex gap-2 items-end">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.user_name}…`}
                rows={1}
                autoFocus
                className="flex-1 text-sm bg-white border border-blue-200 rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              />
              <button
                onClick={() => handleReply(comment.id)}
                disabled={!replyText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white p-2 rounded-xl transition flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(p => !p)}
            className="mt-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition"
          >
            <span className="w-5 h-px bg-blue-300 inline-block" />
            {showReplies
              ? `Hide ${replyCount} repl${replyCount > 1 ? "ies" : "y"}`
              : `View ${replyCount} repl${replyCount > 1 ? "ies" : "y"}`}
          </button>
        )}

        {showReplies && replyCount > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-blue-100 pl-3">
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

const CommentsSheet = ({
  open, onClose,
  comments, currentUser, newComment, setNewComment,
  handleCommentSubmit,
  editingCommentId, editedText, setEditedText, setEditingCommentId,
  replyingTo, setReplyingTo, replyText, setReplyText,
  handleDeleteComment, handleEditComment, handleReply,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex-shrink-0 px-5 pt-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-base">
              {comments.length === 0 ? "Comments" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-7 h-7 text-blue-300" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to share your thoughts</p>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-5">
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

        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-end gap-3">
          <Avatar name={currentUser?.username || currentUser?.name || "You"} size="md" />
          <div className="flex-1 flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-blue-300 focus-within:bg-white transition">
            <textarea
              ref={inputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              rows={1}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
              className="flex-1 text-sm bg-transparent outline-none resize-none max-h-24"
              style={{ overflowY: "auto" }}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              className="text-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition flex-shrink-0 pb-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} className="bg-white" />
      </div>
    </>
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
  const [showComments, setShowComments] = useState(false);
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
         toast.error("Failed to load issue details");
         }
    };
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    try {
      setIsUpvoting(true);
      const res = await complaintapi.toggleUpvote(id);
      setIssue(prev => ({ ...prev, upvotes_count: res.data.data.upvotes_count, is_upvoted: res.data.data.is_upvoted }));
    } catch (err) { 
      console.log(err); 
      toast.error("Failed to update upvote");
    }
    finally { setIsUpvoting(false); }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await complaintapi.createComment(id, { comment: newComment });
      // toast.success("Comment added");
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setNewComment("");
    } catch (err) { 
      console.log(err);
      toast.error("Failed to add comment");
     }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await complaintapi.deleteComment(commentId);
      // toast.success("Comment deleted");
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
    } catch (err) { 
      console.log(err); 
      toast.error("Failed to delete comment");
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await complaintapi.editComment(commentId, { comment: editedText });
      // toast.success("Comment updated");
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setEditingCommentId(null);
      setEditedText("");
    } catch (err) { 
      console.log(err); 
      toast.error("Failed to update comment");
    }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;
    try {
      await complaintapi.createComment(id, { comment: replyText, parent: parentId });
      // toast.success("Reply added");
      const commentRes = await complaintapi.getComments(id);
      setComments(commentRes.data.results || []);
      setReplyText("");
      setReplyingTo(null);
    } catch (err) { 
      console.log(err); 
      toast.error("Failed to add reply");
    }
  };

  const sharedCommentProps = {
    currentUser,
    editingCommentId, editedText, setEditedText, setEditingCommentId,
    replyingTo, setReplyingTo, replyText, setReplyText,
    handleDeleteComment, handleEditComment, handleReply,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-blue-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800 text-base">Issue Details</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {!issue && (
          <div className="bg-white rounded-3xl shadow-sm border border-blue-50 p-5 animate-pulse space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 bg-blue-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-blue-100 rounded-full w-1/3" />
                <div className="h-3 bg-blue-50 rounded-full w-1/4" />
              </div>
            </div>
            <div className="h-5 bg-blue-100 rounded-full w-3/4" />
            <div className="h-4 bg-blue-50 rounded-full w-1/2" />
            <div className="h-48 bg-blue-50 rounded-2xl" />
          </div>
        )}

        {issue && (
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">

              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <Avatar name={issue.citizen_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{issue.citizen_name}</p>
                  <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" /> {issue.ward_name}
                  </span>
                </div>
                <StatusBadge status={issue.status} />
              </div>

              <div className="px-5 pb-3">
                <h1 className="text-lg font-bold text-gray-900 leading-snug">{issue.title}</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                    <Tag className="w-3 h-3" /> {issue.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" /> {issue.location}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
              </div>

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
                    <>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {issue.media.map((_, i) => (
                          <button key={i} onClick={() => setActiveMedia(i)}
                            className={`w-2 h-2 rounded-full transition ${i === activeMedia ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {activeMedia + 1}/{issue.media.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-blue-50">
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
                  {issue.upvotes_count}
                </button>

                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  {comments.length > 0 ? comments.length : ""} Comment{comments.length !== 1 ? "s" : ""}
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

              {/* Comment preview strip */}
              {comments.length > 0 && (
                <button
                  onClick={() => setShowComments(true)}
                  className="w-full flex items-center gap-3 px-5 py-3 border-t border-blue-50 hover:bg-blue-50/50 transition group"
                >
                  <Avatar name={comments[0].user_name} size="sm" />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="font-semibold text-gray-700 text-xs">{comments[0].user_name} </span>
                    <span className="text-xs text-gray-500 truncate">{comments[0].comment}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0" />
                </button>
              )}
            </div>

            {/* Resolution */}
            {showResolution && issue.resolution && (
              <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-green-50">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Resolved by</p>
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

            {showResolution && !issue.resolution && (
              <div className="bg-white rounded-3xl shadow-sm border border-green-50 px-5 py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No resolution has been posted yet</p>
              </div>
            )}
          </>
        )}
      </div>

      <CommentsSheet
        open={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        currentUser={currentUser}
        newComment={newComment}
        setNewComment={setNewComment}
        handleCommentSubmit={handleCommentSubmit}
        {...sharedCommentProps}
      />
    </div>
  );
};

export default IssueDetailPage;