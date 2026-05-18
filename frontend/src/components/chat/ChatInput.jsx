import { useState, useRef } from "react";



const EmojiPicker = ({ onSelect, onClose }) => {
    const emojis = ["😊", "👍", "🙏", "✅", "📋", "📌", "⚠️", "🔔", "💬", "📞", "🏛️", "📄", "✔️", "❌", "🔴", "🟢"];
    return (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-10">
            <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => { onSelect(emoji); onClose(); }}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ChatInput = ({
    onSendMessage,
    disabled,
    socketRef,
    replyMessage,
    clearReply,
}) => {


    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const fileRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleSend = () => {

        if (!text.trim()) return;

        onSendMessage({
            text: text.trim()
        });

        if (socketRef?.current) {

            socketRef.current.send(
                JSON.stringify({
                    type: "typing",
                    is_typing: false,
                })
            );

        }

        setText("");

    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        onSendMessage({
            text: "",
            file: {
                originalFile: file,

                name: file.name,

                type: file.type,

                size:
                    (file.size / 1024).toFixed(0) + " KB",

                fileType: isImage
                    ? "image"
                    : "pdf",

                url: isImage
                    ? URL.createObjectURL(file)
                    : null,

                preview: isImage
                    ? URL.createObjectURL(file)
                    : null,
            },
        });
        e.target.value = "";
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            onSendMessage({
                text: "",
                file: { fileType: "voice", duration: "0:08" },
            });
        } else {
            setIsRecording(true);
        }
    };

    return (
        <>
            {replyMessage && (
                <div className="px-4 pt-3 bg-gray-50 border-t border-gray-200">

                    <div className="flex items-start justify-between bg-white border border-gray-200 rounded-xl px-3 py-2">

                        <div className="min-w-0">

                            <p className="text-xs font-semibold text-blue-600">
                                Replying to {replyMessage.senderName}
                            </p>

                            <p className="text-sm text-gray-600 truncate">
                                {replyMessage.text}
                            </p>

                        </div>

                        <button
                            onClick={clearReply}
                            className="text-gray-400 hover:text-red-500"
                        >
                            ✕
                        </button>

                    </div>

                </div>
            )}

            <div className="bg-white border-t border-gray-200 px-4 py-3"></div>
            <div className="bg-white border-t border-gray-200 px-4 py-3">
                <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                        {showEmoji && (
                            <EmojiPicker
                                onSelect={(e) => setText((t) => t + e)}
                                onClose={() => setShowEmoji(false)}
                            />
                        )}
                        <div className="flex items-end bg-gray-100 rounded-2xl px-3 py-2.5 gap-2">
                            <button
                                onClick={() => setShowEmoji((v) => !v)}
                                className="text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0 mb-0.5"
                                title="Emoji"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <textarea
                                value={text}
                                onChange={(e) => {

                                    setText(e.target.value);

                                    if (socketRef?.current) {

                                        socketRef.current.send(
                                            JSON.stringify({
                                                type: "typing",
                                                is_typing: true,
                                            })
                                        );

                                    }

                                    // CLEAR OLD TIMER
                                    if (typingTimeoutRef.current) {

                                        clearTimeout(
                                            typingTimeoutRef.current
                                        );

                                    }

                                    // STOP TYPING AFTER 1 SECOND
                                    typingTimeoutRef.current = setTimeout(() => {

                                        if (socketRef?.current) {

                                            socketRef.current.send(
                                                JSON.stringify({
                                                    type: "typing",
                                                    is_typing: false,
                                                })
                                            );

                                        }

                                    }, 1000);

                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={disabled ? "Select a chat to start messaging" : "Type a message..."}
                                disabled={disabled}
                                rows={1}
                                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-32 leading-relaxed disabled:cursor-not-allowed"
                                style={{ overflowY: text.split("\n").length > 3 ? "auto" : "hidden" }}
                            />

                            <button
                                onClick={() => fileRef.current?.click()}
                                className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0 mb-0.5"
                                title="Attach file"
                                disabled={disabled}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <button
                        onClick={text.trim() ? handleSend : toggleRecording}
                        disabled={disabled}
                        className={`w-11 h-11 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : text.trim()
                                ? "bg-blue-600 hover:bg-blue-700 scale-105"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        title={isRecording ? "Stop recording" : text.trim() ? "Send" : "Voice message"}
                    >
                        {isRecording ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                        ) : text.trim() ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        )}
                    </button>
                </div>

                {isRecording && (
                    <div className="flex items-center gap-2 mt-2 px-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span className="text-xs text-red-500 font-medium">Recording... Click mic to send</span>
                    </div>
                )}
            </div>
            </>
            );
};

export default ChatInput;