import React, { useState, useRef } from "react";
import { Send } from "lucide-react";
import { ImageIcon } from "lucide-react";

const ComplaintChatInput = ({ onSend, replyTo, clearReply }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef(null);

  const mediaRecorderRef = useRef(null);

  const chunksRef = useRef([]);

  const handleSend = () => {

    const trimmed =
      text.trim();

    if (
      !trimmed &&
      !selectedFile
    ) {
      return;
    }

    onSend(
      trimmed,
      selectedFile
    );

    setText("");

    setSelectedFile(null);

    if (textareaRef.current) {

      textareaRef.current.style.height =
        "auto";

    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    // Auto-grow textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };


  const startRecording = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      const recorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {

        if (event.data.size > 0) {

          chunksRef.current.push(
            event.data
          );

        }

      };

      recorder.start();

      setIsRecording(true);

      setIsPaused(false);

      timerRef.current = setInterval(() => {

        setRecordingTime(prev => prev + 1);

      }, 1000);

    }

    catch (error) {

      console.log(
        "MIC ERROR",
        error
      );

    }

  };




  const pauseRecording = () => {

    mediaRecorderRef.current?.pause();

    setIsPaused(true);

    clearInterval(
      timerRef.current
    );

  };



  const resumeRecording = () => {

    mediaRecorderRef.current?.resume();

    setIsPaused(false);


    timerRef.current = setInterval(() => {

      setRecordingTime(prev => prev + 1);

    }, 1000);

  };





  const stopRecording = () => {

    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    recorder.stop();

    recorder.onstop = () => {

      const blob =
        new Blob(
          chunksRef.current,
          {
            type: "audio/webm"
          }
        );

      const audioFile =
        new File(
          [blob],
          "voice-message.webm",
          {
            type: "audio/webm"
          }
        );

      setSelectedFile(
        audioFile
      );

    };

    setIsRecording(false);

    setIsPaused(false);

    clearInterval(
      timerRef.current
    );

    setRecordingTime(0);

  };

  return (
    <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-1px_6px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">


          {
            replyTo && (

              <div
                className="
            mb-2
            p-2
            bg-slate-100
            border-l-4
            border-blue-500
            rounded
            "
              >

                <div
                  className="
                flex
                justify-between
                "
                >

                  <div>

                    <p
                      className="
        text-xs
        font-semibold
    "
                    >

                      Replying to

                      {" "}

                      {replyTo.sender}

                    </p>

                    <p className="text-sm truncate">

                      {
                        replyTo.isDeleted
                          ? "This message was deleted"

                          : replyTo.fileType === "IMAGE"
                            ? "📷 Image"

                            : replyTo.fileType === "VIDEO"
                              ? "🎥 Video"

                              : replyTo.fileType === "PDF"
                                ? "📄 PDF"

                                : replyTo.fileType === "AUDIO"
                                  ? "🎵 Audio"

                                  : replyTo.message
                      }

                    </p>

                  </div>

                  <button
                    onClick={clearReply}
                  >
                    ✕
                  </button>

                </div>

              </div>

            )
          }


          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="w-full bg-transparent resize-none px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed"
            style={{ maxHeight: "120px" }}
          />
        </div>


        {
          selectedFile && (

            <div
              className="
        flex
        items-center
        gap-2
        max-w-4xl
        mx-auto
        mt-2
        text-xs
      "
            >

              <span className="text-blue-600">
                Selected: {selectedFile.name}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedFile(null)
                }
                className="
          px-2
          py-1
          bg-red-100
          text-red-600
          rounded
          hover:bg-red-200
        "
              >
                Cancel
              </button>

            </div>

          )
        }


        <input
          type="file"
          id="chat-image"
          accept="image/*,.pdf,video/*,audio/*"
          className="hidden"
          onChange={(e) => {

            const file =
              e.target.files?.[0];

            if (file) {

              console.log(
                "SELECTED FILE",
                file
              );

              setSelectedFile(
                file
              );

            }

          }}
        />


        {
          !isRecording ? (

            <button
              type="button"
              onClick={startRecording}
              className="
        flex-shrink-0
        w-11
        h-11
        rounded-2xl
        bg-red-100
        text-red-600
      "
            >
              🎤
            </button>

          ) : (

            <div className="flex items-center gap-2">

              <span
                className="
    text-sm
    font-semibold
    text-red-500
  "
              >
                {Math.floor(recordingTime / 60)}
                :
                {String(
                  recordingTime % 60
                ).padStart(2, "0")}
              </span>

              {
                !isPaused ? (

                  <button
                    onClick={pauseRecording}
                    className="
              w-11
              h-11
              rounded-2xl
              bg-yellow-100
            "
                  >
                    ⏸
                  </button>

                ) : (

                  <button
                    onClick={resumeRecording}
                    className="
              w-11
              h-11
              rounded-2xl
              bg-green-100
            "
                  >
                    ▶
                  </button>

                )
              }

              <button
                onClick={stopRecording}
                className="
          w-11
          h-11
          rounded-2xl
          bg-red-500
          text-white
        "
              >
                ⏹
              </button>

            </div>

          )
        }

        <label
          htmlFor="chat-image"
          className="
    flex-shrink-0
    w-11
    h-11
    rounded-2xl
    bg-slate-100
    flex
    items-center
    justify-center
    cursor-pointer
    hover:bg-slate-200
  "
        >
          <ImageIcon className="w-4 h-4" />
        </label>

        <button
          onClick={handleSend}
          disabled={
            !text.trim() &&
            !selectedFile
          }
          className="flex-shrink-0 w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-md shadow-blue-200 active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-1.5">
        Press <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 rounded px-1 py-0.5">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 rounded px-1 py-0.5">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default ComplaintChatInput;