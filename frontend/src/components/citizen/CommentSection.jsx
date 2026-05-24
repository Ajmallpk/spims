import { useState, useEffect, useRef } from "react";
import Avatar from "@/components/ui/Avatar";
import complaintapi from "@/service/complaintsurls";

const CommentSection = ({ issueId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionBox, setShowMentionBox] = useState(false);
  const [mentionUsers, setMentionUsers] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const inputRef = useRef(null);
  const socketRef = useRef(null);



  const loadComments = async () => {
    try {

      const userRes = await complaintapi.getCurrentUser();
      setCurrentUser(userRes.data);

      const res = await complaintapi.getComments(
        issueId,
        page
      );

      const formatted = res.data.results
        .sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        .map((c) => ({
          id: c.id,
          authorName: c.user_name,
          user_id: c.user_id,
          text: c.comment,
          timeAgo: c.created_at,

          replies:
            c.replies?.sort(
              (a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            ) || [],
        }));

      if (page === 1) {
        setLocalComments(formatted);
      } else {
        setLocalComments((prev) => [
          ...prev,
          ...formatted,
        ]);
      }

      setHasMore(res.data.next !== null);

    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  useEffect(() => {

    loadComments();

    socketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/comments/${issueId}/`
    );

    socketRef.current.onopen = () => {
      console.log("Comment socket connected");
    };

    socketRef.current.onmessage = (event) => {

      const data = JSON.parse(event.data);

      if (data.action === "edit") {

        setLocalComments((prev) =>

          prev.map((comment) => ({

            ...comment,

            text:
              comment.id === data.id
                ? data.comment
                : comment.text,

            replies: (comment.replies || []).map(
              (reply) => ({
                ...reply,

                comment:
                  reply.id === data.id
                    ? data.comment
                    : reply.comment
              })
            )

          }))
        );

        return;
      }

      if (data.action === "delete") {

        setLocalComments((prev) =>

          prev
            .filter(
              (comment) => comment.id !== data.id
            )

            .map((comment) => ({

              ...comment,

              replies: (comment.replies || []).filter(
                (reply) => reply.id !== data.id
              )

            }))
        );

        return;
      }

      const newComment = {
        id: data.id,
        authorName: data.user_name,
        user_id: data.user_id,
        text: data.comment,
        timeAgo: data.created_at,
        parent_id: data.parent_id,
        replies: [],
      };

      setLocalComments((prev) => {

        const exists = prev.some(
          (comment) => comment.id === data.id
        );

        if (exists) return prev;

        if (data.parent_id) {

          return prev.map((comment) => {

            if (comment.id === data.parent_id) {

              setExpandedReplies((prevExpanded) => ({
                ...prevExpanded,
                [comment.id]: true
              }));

              return {

                ...comment,

                replies: [
                  {
                    id: data.id,
                    user_name: data.user_name,
                    user_id: data.user_id,
                    comment: data.comment,
                    created_at: data.created_at
                  },

                  ...(comment.replies || [])
                ]
              };
            }

            return comment;
          });
        }

        return [newComment, ...prev];
      });

    };

    socketRef.current.onclose = () => {
      console.log("Comment socket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };

  }, [issueId]);



  const handlePost = async () => {
    if (!commentText.trim()) return;
    setPosting(true);

    try {
      const res = await complaintapi.createComment(issueId, {
        comment: commentText,
        parent: replyingTo?.id || null,
      });

      const commentData = res.data.data;


      setCommentText("");
      setReplyingTo(null);
      onCommentAdded?.();

    } catch (error) {
      handleApiError(error, "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };



  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);

    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} days ago`;

    return past.toLocaleDateString();
  };


  const renderCommentText = (text) => {

    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {

      if (part.startsWith("@")) {

        return (
          <span
            key={index}
            className="text-teal-600 font-medium cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Comment list */}
      {/* {localComments.map((comment) => (
        <div key={comment.id} className="flex gap-2.5">
          <Avatar alt={comment.authorName} size="sm" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{comment.authorName}</span>
              <span className="text-xs text-gray-400">
                {formatTimeAgo(comment.timeAgo)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
          </div>
        </div>
      ))} */}


      {localComments.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-3">
          No comments yet
        </div>
      ) : (
        localComments.map((comment) => (
          <div key={comment.id} className="flex gap-2.5">
            <Avatar alt={comment.authorName} size="sm" />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {comment.authorName}
                </span>

                <span className="text-xs text-gray-400">
                  {formatTimeAgo(comment.timeAgo)}
                </span>
              </div>

              <div className="flex items-start justify-between mt-0.5">

                {editingCommentId === comment.id ? (

                  <div className="flex items-center gap-2 w-full">

                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm outline-none"
                    />

                    <button
                      onClick={async () => {
                        try {

                          await complaintapi.editComment(comment.id, {
                            comment: editText,
                          });

                          setEditingCommentId(null);
                          setEditText("");

                        } catch (err) {
                          handleApiError(err, "Failed to edit comment");
                        }
                      }}
                      className="text-xs text-green-600 font-medium"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditText("");
                      }}
                      className="text-xs text-gray-500"
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  <p className="text-sm text-gray-600">
                    {renderCommentText(comment.text)}
                  </p>

                )}

                {comment.user_id === currentUser?.id && (
                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditText(comment.text);
                      }}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        try {

                          await complaintapi.deleteComment(
                            comment.id
                          );

                        } catch (err) {
                          handleApiError(err, "Failed to delete comment");
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>

                  </div>
                )}

              </div>


              {comment.replies?.length > 0 && (
                <button
                  onClick={() =>
                    setExpandedReplies((prev) => ({
                      ...prev,
                      [comment.id]: !prev[comment.id],
                    }))
                  }
                  className="text-xs text-gray-500 hover:text-gray-700 mt-1 mb-2 block"
                >
                  {expandedReplies[comment.id]
                    ? "Hide replies"
                    : `View replies (${comment.replies.length})`}
                </button>
              )}

              {/* Replies */}
              {comment.replies?.length > 0 &&
                expandedReplies[comment.id] && (
                  <div className="mt-3 ml-6 space-y-3 border-l border-gray-200 pl-4">

                    {comment.replies.map((reply) => (

                      <div key={reply.id} className="flex gap-2">

                        <Avatar alt={reply.user_name} size="sm" />

                        <div className="flex-1">

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-semibold text-gray-800">
                              {reply.user_name}
                            </span>

                            <span className="text-[11px] text-gray-400">
                              {formatTimeAgo(reply.created_at)}
                            </span>

                          </div>

                          <p className="text-sm text-gray-600">
                            {renderCommentText(reply.comment)}
                          </p>




                          <button
                            onClick={() => {
                              setReplyingTo({
                                id: comment.id,
                                authorName: reply.user_name,
                              });

                              setTimeout(() => {
                                inputRef.current?.focus();
                              }, 0);
                            }}
                            className="text-xs text-teal-600 mt-1 hover:underline"
                          >
                            Reply
                          </button>

                        </div>
                      </div>
                    ))}

                  </div>
                )}

              <button
                onClick={() => {
                  setReplyingTo({
                    id: comment.id,
                    authorName: comment.authorName,
                  });

                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }}
                className="text-xs text-teal-600 mt-1 hover:underline"
              >
                Reply
              </button>
            </div>
          </div>
        ))
      )}

      {replyingTo && (
        <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-3 py-2">
          <div className="text-xs text-teal-700">
            Replying to <span className="font-semibold">{replyingTo.authorName}</span>
          </div>

          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-500 hover:text-red-500 text-sm"
          >
            ✕
          </button>
        </div>
      )}




      {/* Input */}
      <div className="relative flex items-center gap-2 pt-1">
        <Avatar alt="You" size="sm" />
        <input
          type="text"
          ref={inputRef}
          value={commentText}
          onChange={async (e) => {

            const value = e.target.value;

            setCommentText(value);

            const mentionMatch = value.match(/@(\w*)$/);

            if (mentionMatch) {

              const query = mentionMatch[1];

              setMentionQuery(query);

              try {

                const res = await complaintapi.searchUsers(query);

                setMentionUsers(res.data);

                setShowMentions(true);

              } catch (err) {

                console.error(err);

              }

            } else {

              setShowMentions(false);

            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
        />

        {showMentions && mentionUsers.length > 0 && (

          <div className="absolute bottom-16 left-12 bg-white border border-gray-200 rounded-xl shadow-lg w-64 z-50 max-h-52 overflow-y-auto">

            {mentionUsers.map((user) => (

              <button
                key={user.id}
                onClick={() => {

                  const updatedText = commentText.replace(
                    /@\w*$/,
                    `@${user.username} `
                  );

                  setCommentText(updatedText);

                  setShowMentions(false);

                  inputRef.current?.focus();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                @{user.username}
              </button>

            ))}

          </div>

        )}
        <button
          onClick={handlePost}
          disabled={!commentText.trim() || posting}
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-200 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
      {hasMore && localComments.length > 0 && (
        <div className="flex justify-center pt-3">

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Load more comments
          </button>

        </div>
      )}
    </div>
  );
};

export default CommentSection;