import FilePreview from "./FilePreview";

const SeenStatus = ({ status, isSent }) => {
    if (!isSent) return null;
    if (status === "seen") {
        return (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }
    if (status === "delivered") {
        return (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        );
    }
    return (
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
        </svg>
    );
};

const ReplyPreview = ({
    reply,
    isSent
}) => (

    <div
        className={`flex border-l-2 rounded-lg px-2 py-1.5 mb-2 text-xs ${isSent
            ? "border-blue-300 bg-blue-700"
            : "border-blue-400 bg-gray-100"
            }`}
    >

        <div>

            <p
                className={`font-semibold mb-0.5 ${isSent
                    ? "text-blue-200"
                    : "text-blue-600"
                    }`}
            >
                {reply.sender}
            </p>

            {

                reply.file_type === "IMAGE"
                &&

                <p>
                    📷 Image
                </p>

            }

            {

                reply.file_type === "VIDEO"
                &&

                <p>
                    🎥 Video
                </p>

            }

            {

                reply.file_type === "AUDIO"
                &&

                <p>
                    🎤 Voice
                </p>

            }

            {

                !reply.file_type
                &&

                <p>
                    {reply.message}
                </p>

            }

        </div>

    </div>

)

const MessageBubble = ({ message, isCurrentUser, onReply, onDelete, onReplyClick }) => {
    const {
        display_message,
        created_at,
        sender_name,
        is_read,
        is_delivered,
        file_url,
        file_type,
        reply_data,
        is_forwarded,

    } = message;


    const handleReply = () => {

        onReply({
            id: message.id,
            text: message.display_message,
            senderName: message.sender_name,
        });

    };


    const handleDelete = () => {

        onDelete(message.id);

    };

    return (

        <div
            className={`flex items-end gap-2 group ${isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {!isCurrentUser && (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mb-1">
                    <span className="text-xs font-semibold text-blue-600">
                        {message.sender_name?.charAt(0) || "W"}
                    </span>
                </div>
            )}

            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                {!isCurrentUser && sender_name && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">
                        {sender_name}
                    </p>
                )}

                {is_forwarded && (
                    <div className={`flex items-center gap-1 text-xs mb-1 ${isCurrentUser ? "text-blue-200" : "text-gray-400"}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Forwarded</span>
                    </div>
                )}

                <div

                    className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${isCurrentUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                >

                    <button
                        onClick={handleReply}
                        className={`
                            absolute top-1
                            ${isCurrentUser ? "-left-10" : "-right-10"}
                            opacity-0 group-hover:opacity-100
                            transition
                            bg-white
                            border
                            shadow-sm
                            rounded-full
                            p-1.5
                        `}
                    >
                        ↩
                    </button>


                    {isCurrentUser && !message.is_deleted && (
                        <button
                            onClick={handleDelete}
                            className="
                                    absolute top-10
                                    -left-10
                                    opacity-0 group-hover:opacity-100
                                    transition
                                    bg-red-500
                                    text-white
                                    rounded-full
                                    p-1.5
                                    shadow-sm
                                "
                        >
                            🗑
                        </button>
                    )}

                    {/* {reply_data && (
                        <ReplyPreview
                            reply={reply_data}
                            isSent={isCurrentUser}
                        />
                    )} */}

                    {reply_data && (

                        <div
                            onClick={() =>
                                onReplyClick(
                                    reply_data.id
                                )
                            }
                            className="cursor-pointer"
                        >

                            <ReplyPreview
                                reply={reply_data}
                                isSent={isCurrentUser}
                            />

                        </div>

                    )}

                    {
                        !message.is_deleted &&
                        file_url && (

                            <FilePreview
                                file_url={message.file_url}
                                file_type={message.file_type}
                                file={{
                                    name: "Attachment"
                                }}
                                isSent={isCurrentUser}
                            />

                        )
                    }

                    {/* {display_message && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {display_message}
                        </p>
                    )} */}

                    {display_message && (
                        <p
                            className={`
            text-sm leading-relaxed whitespace-pre-wrap break-words
            ${message.is_deleted
                                    ? "italic opacity-60"
                                    : ""
                                }
        `}
                        >
                            {display_message}
                        </p>
                    )}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isCurrentUser ? "opacity-80" : ""}`}>
                        <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-400"}`}>
                            {new Date(created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        <SeenStatus
                            status={
                                is_read
                                    ? "seen"
                                    : is_delivered
                                        ? "delivered"
                                        : "sending"
                            }
                            isSent={isCurrentUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;