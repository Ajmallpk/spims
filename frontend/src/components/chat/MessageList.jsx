import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const DateSeparator = ({ date }) => (
    <div className="flex items-center gap-3 my-4 px-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            {date}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);

const groupMessagesByDate = (messages) => {

    const groups = [];

    let currentDate = null;

    messages.forEach((msg) => {

        const msgDate = new Date(
            msg.created_at
        ).toDateString();

        if (msgDate !== currentDate) {

            currentDate = msgDate;

            groups.push({
                type: "date",
                value: msgDate,
            });

        }

        groups.push({
            type: "message",
            value: msg,
        });

    });

    return groups;
};

const MessageList = ({ messages, currentUserId, isTyping, typingUser, onReply, onDelete, loadMoreMessages, hasMore, loadingMore, }) => {
    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleScroll = () => {

        if (!containerRef.current)
            return;

        if (
            containerRef.current
                .scrollTop < 100 &&
            hasMore &&
            !loadingMore
        ) {

            loadMoreMessages();

        }

    };

    const grouped = groupMessagesByDate(messages);

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth"
        >
            <div className="flex flex-col gap-1 py-4">

                {loadingMore && (
                    <div className="text-center text-xs text-gray-400 py-2">
                        Loading older messages...
                    </div>
                )}

                {grouped.map((item, i) => {
                    if (item.type === "date") {
                        return <DateSeparator key={`date-${i}`} date={item.value} />;
                    }
                    const msg = item.value;
                    return (
                        <div key={msg.id} className="px-4 py-0.5">
                            <MessageBubble
                                message={msg}
                                onReply={onReply}
                                onDelete={onDelete}
                                isCurrentUser={
                                    Number(msg.sender) === Number(currentUserId)
                                }
                            />
                        </div>
                    );
                })}

                {isTyping && (
                    <TypingIndicator name={typingUser} />
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;