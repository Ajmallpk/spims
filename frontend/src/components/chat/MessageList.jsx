import { useEffect, useRef, useState } from "react";
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
    const messageRefs = useRef({});
    const [highlightedId, setHighlightedId] = useState(null)

    const previousHeightRef = useRef(0);

    const firstLoadDoneRef = useRef(false);

    useEffect(() => {

        if (
            !containerRef.current ||
            !messages.length
        ) return;

        const container =
            containerRef.current;

        // OPEN CHAT -> GO BOTTOM

        if (
            !firstLoadDoneRef.current
        ) {

            const scrollBottom = () => {

                container.scrollTop =
                    container.scrollHeight;

            };

            setTimeout(
                scrollBottom,
                100
            );

            setTimeout(
                scrollBottom,
                300
            );

            setTimeout(
                scrollBottom,
                600
            );

            firstLoadDoneRef.current =
                true;

            return;

        }

        // LOAD OLD MESSAGES

        if (loadingMore) {

            requestAnimationFrame(() => {

                const newHeight =
                    container.scrollHeight;

                const diff =
                    newHeight -
                    previousHeightRef.current;

                container.scrollTop += diff;

            });

        }

    }, [messages]);


    const handleScroll = () => {

        if (!containerRef.current)
            return;

        if (

            containerRef.current.scrollTop < 100
            &&
            hasMore
            &&
            !loadingMore

        ) {

            previousHeightRef.current =
                containerRef.current.scrollHeight;

            loadMoreMessages();

        }

    };

    const grouped = groupMessagesByDate(messages);


    useEffect(() => {

        firstLoadDoneRef.current =
            false;

    }, [currentUserId]);



    const scrollToMessage = (messageId) => {

        const target =
            messageRefs.current[messageId]

        if (!target) return

        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })

        setHighlightedId(messageId)

        setTimeout(() => {

            setHighlightedId(null)

        }, 2000)

    }

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

                    console.log("MSG SENDER:", msg.sender);
                    console.log("CURRENT USER:", currentUserId);
                    console.log(
                        "MATCH:",
                        Number(msg.sender) === Number(currentUserId)
                    );
                    return (
                        <div
                            key={msg.id}
                            ref={(el) => {

                                messageRefs.current[msg.id] = el

                            }}
                            className={`
                                    px-4 py-0.5
                                    transition-all
                                    ${highlightedId === msg.id
                                    ? "bg-yellow-200 rounded-lg"
                                    : ""
                                }
`}
                        >
                            <MessageBubble
                                message={msg}
                                onReply={onReply}
                                onDelete={onDelete}
                                onReplyClick={scrollToMessage}
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