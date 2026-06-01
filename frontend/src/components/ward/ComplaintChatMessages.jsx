import React, { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ComplaintChatMessage from "./ComplaintChatMessage";

const EmptyChatState = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <MessageCircle className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-sm font-semibold text-slate-600">No messages yet</h3>
    <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-relaxed">
      Start the conversation with the citizen regarding this complaint.
    </p>
  </div>
);

const ComplaintChatMessages = ({ messages, onReply, onDelete, messageRefs, loadMore, hasMore, loadingMore, }) => {
  const bottomRef = useRef(null);
  // const messageRefs = useRef({});
  const containerRef = useRef(null);

  const firstLoadRef = useRef(true);






  useEffect(() => {

    if (
      firstLoadRef.current &&
      messages.length > 0
    ) {

      bottomRef.current?.scrollIntoView({
        behavior: "auto"
      });

      firstLoadRef.current = false;

    }

  }, [messages]);


  const handleScroll = () => {

    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    if (
      container.scrollTop <= 20 &&
      hasMore &&
      !loadingMore
    ) {


      console.log(
        "LOAD MORE CALLED"
      );


      console.log(
        "SCROLL TOP",
        container.scrollTop
      );

      loadMore();

    }

  };

  if (!messages || messages.length === 0) {
    return (
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
chat-scroll-container
h-full
overflow-y-auto
bg-slate-50
px-4
py-4
"
      >
        <EmptyChatState />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
chat-scroll-container
h-full
overflow-y-auto
bg-slate-50
px-4
py-4
"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg) => (
          <ComplaintChatMessage key={msg.id} message={msg} onReply={onReply} onDelete={onDelete} messageRefs={messageRefs} />
        ))}
        <div
          id="chat-bottom"
          ref={bottomRef}
        />
      </div>
    </div>
  );
};

export default ComplaintChatMessages;