import React, { useState, useEffect, useRef } from "react";
import ComplaintChatPageHeader from "@/components/ward/ComplaintChatPageHeader";
import ComplaintChatInfoCard from "@/components/ward/ComplaintChatInfoCard";
import ComplaintChatMessages from "@/components/ward/ComplaintChatMessages";
import ComplaintChatInput from "@/components/ward/ComplaintChatInput";
import ComplaintChatClosedState from "@/components/ward/ComplaintChatClosedState";
import ComplaintChatPageSkeleton from "@/components/ward/ComplaintChatPageSkeleton";
import { useParams, useNavigate } from "react-router-dom";
import { complaintchatapi } from "@/service/complaintchaturls";
import wardapi from "@/service/wardurls";
import citizenapi from "@/service/citizenurls";






// ── Page ───────────────────────────────────────────────────────────────────
const CitizenComplaintChatPage = () => {
  const { complaintId } = useParams();
  console.log("PARAM ID =", complaintId);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const messageRefs = useRef({});

  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);


  const [complaint, setComplaint] = useState({
    id: complaintId,
    title: "",
    citizen: "",
  });



  const WS_BASE_URL =
    "ws://localhost:8000";



  console.log(
    "CITIZEN PAGE RENDER",
    localStorage.getItem("user_id"),
    localStorage.getItem("role")
  );




  const loadMore = async () => {


    const container =
      document.querySelector(
        ".chat-scroll-container"
      );

    const oldHeight =
      container?.scrollHeight || 0;



    if (!hasMore || loadingMore) {
      return;
    }

    setLoadingMore(true);

    const nextPage = page + 1;

    const res =
      await complaintchatapi.getMessages(
        complaintId,
        nextPage
      );

    const results =
      res.data.results || [];

    const loggedInUserId =
      Number(
        localStorage.getItem("user_id")
      );





    console.log(
      "CITIZEN USER ID",
      loggedInUserId
    );


    console.log(
      "CITIZEN USER ID =",
      loggedInUserId
    );

    results.forEach(msg => {

      console.log(
        "MESSAGE ID =", msg.id,
        "SENDER =", msg.sender,
        "NAME =", msg.sender_name
      );

    });

    const formattedMessages =
      results.reverse().map((msg) => ({

        id: msg.id,

        sender:
          msg.sender === loggedInUserId
            ? "citizen"
            : "ward",

        message:
          msg.display_message,

        isDeleted:
          msg.is_deleted,

        replyData:
          msg.reply_data,

        fileType:
          msg.file_type,

        fileUrl:
          msg.file_url,

        voiceDuration:
          msg.voice_duration,

        time:
          new Date(
            msg.created_at
          ).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

        isDelivered:
          msg.is_delivered,

        isRead:
          msg.is_read,

      }));

    setMessages(prev => {

      const updated = [

        ...formattedMessages,

        ...prev

      ];

      setTimeout(() => {

        const newHeight =
          container?.scrollHeight || 0;

        container.scrollTop =
          newHeight - oldHeight;

      }, 0);

      return updated;

    });

    setPage(nextPage);

    setHasMore(
      !!res.data.next
    );

    setLoadingMore(false);

  };



  useEffect(() => {

    loadMessages();

    loadComplaintInfo();

    connectWebSocket();

    return () => {

      socketRef.current?.close();

    };

  }, [complaintId]);


  const loadMessages = async () => {

    try {

      setIsLoading(true);

      const res =
        await complaintchatapi.getMessages(
          complaintId,
          page
        );

      console.log(
        "MESSAGES RESPONSE",
        res.data
      );


      console.log(
        "FIRST MESSAGE",
        res.data.results?.[0]
      );

      const results =
        res.data.results || [];

      const loggedInUserId = Number(
        localStorage.getItem("user_id")
      );




      console.log(
        "CITIZEN USER ID",
        loggedInUserId
      );


      results.forEach((msg) => {

        console.log(
          "LOAD MESSAGE =>",
          "LOCAL USER =", loggedInUserId,
          typeof loggedInUserId,
          "MSG SENDER =", msg.sender,
          typeof msg.sender
        );

      });

      const formattedMessages =
        results.reverse().map((msg) => ({

          id: msg.id,

          sender:
            msg.sender === loggedInUserId
              ? "citizen"
              : "ward",

          message:
            msg.display_message,


          isDeleted:
            msg.is_deleted,

          replyData:
            msg.reply_data,

          fileType:
            msg.file_type,

          fileUrl:
            msg.file_url,

          voiceDuration:
            msg.voice_duration,

          time:
            new Date(
              msg.created_at
            ).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          isDelivered:
            msg.is_delivered,

          isRead:
            msg.is_read,

        }));

      if (page === 1) {

        setMessages(formattedMessages);

      } else {

        setMessages(prev => [

          ...formattedMessages,

          ...prev

        ]);

      }


      setHasMore(
        !!res.data.next
      );


      if (res.data.chat) {

        setIsClosed(
          res.data.chat.is_closed
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setIsLoading(false);

    }

  };






  const loadComplaintInfo = async () => {

    try {

      const res =
        await citizenapi.getComplaintDetail(
          complaintId
        );

      console.log(
        "COMPLAINT INFO",
        res.data
      );

      const complaintData =
        res.data.data;



      console.log("COMPLAINT DATA", complaintData);


      console.log(
        "COMPLAINT DATA",
        complaintData
      );

      setComplaint({
        id: complaintData.id,
        title: complaintData.title,
        citizen: complaintData.ward_name,
      });

    } catch (error) {

      console.log(error);

    }

  };


  const connectWebSocket = () => {




    socketRef.current =
      // new WebSocket(
      //   `ws://127.0.0.1:8000/ws/chat/complaint/${complaintId}/?role=citizen`
      // );

      new WebSocket(
        `${WS_BASE_URL}/ws/chat/complaint/${complaintId}/?role=citizen`
      )

    socketRef.current.onopen = () => {

      console.log(
        "COMPLAINT CHAT WS CONNECTED"
      );

    };

    socketRef.current.onmessage = (event) => {

      const data = JSON.parse(event.data);

      console.log("WS MESSAGE", data);

      if (data.type === "message") {

        const msg = data.data;

        console.log(
          "CITIZEN WS RAW MESSAGE",
          JSON.stringify(msg, null, 2)
        );

        // console.log("MESSAGE DATA", msg);


        console.log(
          "WS READ LOCALSTORAGE",
          localStorage.getItem("user_id"),
          localStorage.getItem("role")
        );

        const loggedInUserId =
          Number(
            localStorage.getItem("user_id")
          );


        console.log(
          "WS MESSAGE CHECK =>",
          "LOCAL USER =", loggedInUserId,
          typeof loggedInUserId,
          "MSG SENDER =", msg.sender,
          typeof msg.sender
        );


        console.log(
          "CITIZEN LOCAL USER ID =",
          loggedInUserId
        );

        console.log(
          "MESSAGE SENDER ID =",
          msg.sender
        );

        console.log(
          "MESSAGE SENDER NAME =",
          msg.sender_name
        );


        console.log(
          "CITIZEN USER ID",
          loggedInUserId
        );

        // const msg = data.data;

        if (
          msg.sender !== loggedInUserId
        ) {

          socketRef.current.send(
            JSON.stringify({
              type: "delivered",
              message_id: msg.id
            })
          );

        }




        const formattedMessage = {

          id: msg.id,

          sender:
            msg.sender === loggedInUserId
              ? "citizen"
              : "ward",

          message:
            msg.display_message,


          isDeleted:
            msg.is_deleted,

          replyData:
            msg.reply_data,

          fileType:
            msg.file_type,

          fileUrl:
            msg.file_url,


          voiceDuration:
            msg.voice_duration,

          time:
            new Date(
              msg.created_at
            ).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          isDelivered:
            msg.is_delivered,

          isRead:
            msg.is_read,

        };

        setMessages(prev => {

          const updated = [
            ...prev,
            formattedMessage
          ];

          setTimeout(() => {

            const bottom =
              document.getElementById(
                "chat-bottom"
              );

            bottom?.scrollIntoView({
              behavior: "smooth"
            });

          }, 100);

          return updated;

        });
      }


      if (
        data.type ===
        "delivery_update"
      ) {

        const messageId =
          data.data.message_id;

        setMessages(prev =>
          prev.map(msg =>

            msg.id === messageId

              ? {
                ...msg,
                isDelivered: true
              }

              : msg

          )
        );

      }



      if (
        data.type ===
        "seen_update"
      ) {

        const messageId =
          data.data.message_id;

        setMessages(prev =>
          prev.map(msg =>

            msg.id === messageId

              ? {
                ...msg,
                isRead: true
              }

              : msg

          )
        );

      }


      if (
        data.type === "message_deleted"
      ) {

        console.log(
          "DELETE EVENT RECEIVED",
          data
        );


        console.log(
          "BEFORE UPDATE",
          messages
        );

        const messageId =
          data.data.message_id;

        setMessages(prev =>
          prev.map(msg => {

            // Deleted message itself
            if (msg.id === messageId) {

              return {
                ...msg,
                message: "This message was deleted",
                isDeleted: true,
                fileType: null,
                fileUrl: null,
              };

            }

            // Messages that are replying to deleted message
            if (
              msg.replyData &&
              msg.replyData.id === messageId
            ) {

              return {
                ...msg,
                replyData: {
                  ...msg.replyData,
                  is_deleted: true,
                  file_type: null,
                  file_url: null,
                  message: "This message was deleted",
                }
              };

            }

            return msg;

          })
        );

      }



    };

    socketRef.current.onerror = (
      error
    ) => {

      console.log(
        "WS ERROR",
        error
      );

    };

    socketRef.current.onclose = () => {

      console.log(
        "WS CLOSED"
      );

    };

  };

  // Navigation helpers — replace with useNavigate() in real project

  const handleBack = () => navigate("/citizen/messages");
  const handleViewComplaint = () =>
    navigate(`/citizen/complaints/${complaintId}`);





  const handleSend = async (
    text,
    file,
    voiceDuration
  ) => {

    try {

      const formData = new FormData();

      formData.append(
        "message",
        text
      );

      if (replyTo) {

        formData.append(
          "reply_to",
          replyTo.id
        );

      }

      setReplyTo(null);

      if (file) {

        formData.append(
          "file",
          file
        );

        if (voiceDuration) {

          formData.append(
            "voice_duration",
            voiceDuration
          );

        }

      }

      await complaintchatapi.sendMessage(
        complaintId,
        formData
      );

      // await loadMessages();

    } catch (error) {

      console.log(
        "SEND ERROR",
        error
      );

    }

  };


  const complaintData = {
    ...complaint,
    isClosed,
  };

  if (isLoading) return <ComplaintChatPageSkeleton />;





  const handleDelete = async (
    messageId
  ) => {

    try {

      await complaintchatapi
        .deleteMessage(
          messageId
        );

    }

    catch (error) {

      console.log(error);

    }

  };



  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 rounded-xl overflow-hidden">
      {/* 1 — Top header bar */}
      <ComplaintChatPageHeader
        isClosed={isClosed}
        onBack={handleBack}
        onViewComplaint={handleViewComplaint}
        showChatControls={false}
      />

      {/* 2 — Complaint info strip */}
      <ComplaintChatInfoCard complaint={complaintData} />

      {/* 3 — Scrollable messages */}
      <div className="flex-1 min-h-0">
        <ComplaintChatMessages
          messages={messages}
          onReply={setReplyTo}
          onDelete={handleDelete}
          messageRefs={messageRefs}
          loadMore={loadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
          currentRole="citizen"
        />
      </div>
      {/* 4 — Input or closed state */}
      {isClosed ? (

        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4">

              <p className="text-sm font-semibold text-red-700">
                Chat Closed
              </p>

              <p className="text-xs text-red-500 mt-1">
                This chat was closed by the authority. You can no longer send messages in this complaint.
              </p>

            </div>
          </div>
        </div>

      ) : (

        <ComplaintChatInput
          onSend={handleSend}
          replyTo={replyTo}
          clearReply={() => setReplyTo(null)}
        />

      )}
    </div>
  );
};

export default CitizenComplaintChatPage;