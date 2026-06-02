import React, { useState } from "react";

const ComplaintChatMessage = ({ message, onReply, messageRefs, onDelete, currentRole = "ward" }) => {
  const {
    sender,
    message: text,
    time,
    isDelivered,
    isRead,
    fileType,
    fileUrl,
    isDeleted,
  } = message;
  const isOwnMessage =
    currentRole === "ward"
      ? sender === "ward"
      : sender === "citizen";


  const [previewOpen, setPreviewOpen] = useState(false);


  console.log("FILE TYPE =", fileType);
  console.log("FULL MESSAGE =", message);

  return (
    <div
      ref={(el) => {

        if (el) {

          messageRefs.current[
            message.id
          ] = el;

        }

      }}
      className={`flex ${isOwnMessage
        ? "justify-end"
        : "justify-start"
        }`}
    >
      <div className={`flex flex-col max-w-[78%] sm:max-w-[65%] ${isOwnMessage ? "items-end" : "items-start"
        }`}>
        {/* Sender label */}
        <span className="text-[10px] font-semibold text-slate-400 mb-1 px-1 uppercase tracking-wide">

          {
            currentRole === "ward"

              ? (
                isOwnMessage
                  ? "You (Ward)"
                  : "Citizen"
              )

              : (
                isOwnMessage
                  ? "You"
                  : "Ward Officer"
              )
          }

        </span>

        {/* Bubble */}
        <div
          onDoubleClick={() => onReply(message)}
          className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${isOwnMessage
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
            }`}
        >


          {
            message.replyData && (

              <div
                onClick={() => {

                  const target =

                    messageRefs.current[
                    message.replyData.id
                    ];

                  if (target) {

                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "center"
                    });

                  }

                }}

                className="
        mb-2
        p-2
        rounded-lg
        cursor-pointer
    "
              >

                <p className="font-semibold">

                  {
                    message.replyData.sender
                  }

                </p>




                {
                  message.replyData?.is_deleted ? (

                    <p className="italic text-gray-400">
                      This message was deleted
                    </p>

                  ) : message.replyData.file_type === "IMAGE" ? (

                    <img
                      src={message.replyData.file_url}
                      alt="reply-preview"
                      className="w-16 h-16 object-cover rounded"
                    />

                  ) : message.replyData.file_type === "VIDEO" ? (

                    <video className="w-24 rounded">
                      <source src={message.replyData.file_url} />
                    </video>

                  ) : message.replyData.file_type === "PDF" ? (

                    <span>📄 PDF</span>

                  ) : message.replyData.file_type === "AUDIO" ? (

                    <span>🎵 Audio</span>

                  ) : (

                    <p>{message.replyData.message}</p>

                  )
                }

              </div>

            )
          }
          {isDeleted ? (

            <p className="italic text-gray-400">
              This message was deleted
            </p>

          ) : fileType === "IMAGE" ? (

            <img
              src={fileUrl}
              alt="chat"
              onClick={() =>
                setPreviewOpen(true)
              }
              className="
    max-w-[250px]
    rounded-xl
    cursor-pointer
  "
            />

          ) : fileType === "VIDEO" ? (

            <video
              controls
              onClick={() =>
                setPreviewOpen(true)
              }
              className="
    max-w-[300px]
    rounded-xl
    cursor-pointer
  "
            >
              <source
                src={fileUrl}
                type="video/mp4"
              />
            </video>

          ) : fileType === "AUDIO" ? (

            <audio controls>
              <source src={fileUrl} />
            </audio>

          ) : fileType === "PDF" ? (

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="
            block
            p-3
            rounded-xl
            bg-red-50
            border
            border-red-200
        "
            >
              📄 Open PDF
            </a>

          ) : (

            <p className="text-sm">
              {text}
            </p>

          )}
        </div>

        {/* Time */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">

          {time}

          {isOwnMessage && isRead ? (

            <span className="ml-1 text-blue-500">
              ✓✓
            </span>

          ) : isOwnMessage && isDelivered ? (

            <span className="ml-1 text-emerald-500">
              ✓
            </span>

          ) : null}

        </span>



        {/* Delete Button */}
        {
          isOwnMessage &&
          !message.isDeleted && (

            <button
              onClick={() =>
                onDelete(message.id)
              }
              className="
        text-xs
        text-red-500
        mt-1
      "
            >
              Delete
            </button>

          )
        }
      </div>

      {
        previewOpen && (
          <div
            onClick={() =>
              setPreviewOpen(false)
            }
            className="
        fixed
        inset-0
        bg-black/90
        z-[9999]
        flex
        items-center
        justify-center
        p-4
      "
          >

            <button
              onClick={() =>
                setPreviewOpen(false)
              }
              className="
          absolute
          top-4
          right-4
          text-white
          text-4xl
        "
            >
              ×
            </button>

            {
              fileType === "IMAGE" ? (

                <img
                  src={fileUrl}
                  alt=""
                  className="
              max-w-full
              max-h-full
              object-contain
            "
                />

              ) : fileType === "VIDEO" ? (

                <video
                  controls
                  autoPlay
                  className="
              max-w-full
              max-h-full
            "
                >
                  <source src={fileUrl} />
                </video>

              ) : null
            }

          </div>
        )
      }
    </div>
  );
};

export default ComplaintChatMessage;