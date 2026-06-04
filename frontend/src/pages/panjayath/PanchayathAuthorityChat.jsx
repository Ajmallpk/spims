import { useState, useEffect, useRef } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import EmptyChatState from "@/components/chat/EmptyChatState";
import ChatSkeleton from "@/components/chat/ChatSkeleton";
import authoritychatapi from "@/service/authoritychaturls";
import { handleApiError } from "@/utils/handleApiError";

const PanchayathAuthorityChat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);



  useEffect(() => {

    const fetchInbox = async () => {

      try {

        setIsLoading(true);

        const res = await authoritychatapi.getInbox();

        console.log("AUTHORITY INBOX:", res.data);

        const formattedContacts = (res.data || []).map((chat) => ({
          id: chat.id,

          chat_user: chat.chat_user,

          name: chat.chat_user,

          lastMessage:
            chat.last_message?.message || "",

          isOnline: false,

          unreadCount:
            chat.unread_count || 0,

          role: "Ward",
        }));

        setContacts(formattedContacts);



      } catch (error) {

        handleApiError(
          error,
          "Failed to load inbox"
        );

      } finally {

        setIsLoading(false);

      }
    };

    const storedUser = {
      id: Number(localStorage.getItem("user_id")),
      name: localStorage.getItem("name"),
      designation: "Panchayath Authority",
    };

    setCurrentUser(storedUser);

    fetchInbox();

  }, []);




  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      )
    );
    fetchMessages(
      contact.id,
      1,
      true
    );

    setIsMobileSidebarOpen(false);
  };

  const fetchMessages = async (
    chatId,
    page = 1,
    showLoader = false
  ) => {

    try {

      if (showLoader) {

        setIsLoading(true);

      }

      if (page > 1) {

        setLoadingMore(true);

      }

      const res =
        await authoritychatapi.getMessages(
          chatId,
          page
        );

      console.log(
        "CHAT MESSAGES:",
        res.data
      );

      const newMessages =
        res.data.results || [];

      if (page === 1) {

        setMessages(
          newMessages.reverse()
        );

      } else {

        setMessages((prev) => [
          ...newMessages.reverse(),
          ...prev,
        ]);

      }

      setNextPage(
        res.data.next
      );

      setHasMore(
        !!res.data.next
      );

    } catch (error) {

      handleApiError(
        error,
        "Failed to load messages"
      );

    } finally {

      setIsLoading(false);

      setLoadingMore(false);

    }

  };



  // }, [selectedContact]);
  const connectWebSocket = () => {

    if (!selectedContact) return;

    if (socketRef.current) {

      socketRef.current.close();

    }

    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/chat/authority/${selectedContact.id}/`
    );

    socketRef.current.onopen = () => {

      console.log(
        "WebSocket Connected"
      );

      reconnectAttemptsRef.current = 0;

    };

    socketRef.current.onmessage = (
      event
    ) => {

      const response = JSON.parse(
        event.data
      );

      console.log(
        "SOCKET EVENT:",
        response
      );

      const eventType = response.type;

      const data = response.data;

      // NEW MESSAGE
      if (eventType === "message") {

        setMessages((prev) => {

          const exists = prev.some(
            (msg) => msg.id === data.id
          );

          if (exists) return prev;

          return [...prev, data];

        });

        if (
          data.sender_name !== currentUser?.name
        ) {

          socketRef.current.send(
            JSON.stringify({
              type: "delivered",
              message_id: data.id
            })
          )

          socketRef.current.send(
            JSON.stringify({
              type: "seen",
              message_id: data.id
            })
          )

        }

      }

      // TYPING
      if (eventType === "typing") {

        setIsTyping(
          data.is_typing
        );

      }

      // DELIVERY UPDATE
      if (
        eventType ===
        "delivery_update"
      ) {

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.message_id
              ? {
                ...msg,
                is_delivered: true,
              }
              : msg
          )
        );

      }

      // SEEN UPDATE
      if (
        eventType ===
        "seen_update"
      ) {

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.message_id
              ? {
                ...msg,
                is_read: true,
              }
              : msg
          )
        );

      }

      // MESSAGE DELETED
      if (
        eventType ===
        "message_deleted"
      ) {

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.message_id
              ? {
                ...msg,
                is_deleted: true,
                display_message:
                  "This message was deleted",
              }
              : msg
          )
        );

      }

      // PRESENCE
      if (
        eventType === "presence" ||
        eventType === "presence_update"
      ) {

        console.log(
          "CONTACT USER:",
          selectedContact?.chat_user
        );

        console.log(
          "PRESENCE DATA USER:",
          data.user
        );


        setContacts((prev) =>
          prev.map((contact) =>
            contact.chat_user === data.user
              ? {
                ...contact,
                isOnline:
                  data.is_online,
                lastSeen:
                  data.last_seen,
              }
              : contact
          )
        );

        setSelectedContact((prev) => {

          if (!prev) return prev;

          if (prev.chat_user !== data.user) {

            return prev;

          }

          if (
            prev.isOnline === data.is_online &&
            prev.lastSeen === data.last_seen
          ) {

            return prev;

          }

          return {
            ...prev,
            isOnline: data.is_online,
            lastSeen: data.last_seen,
          };

        });

      }

      // ERROR
      if (eventType === "error") {

        console.error(data);

      }

    };

    socketRef.current.onclose = (event) => {

      console.log("WebSocket Disconnected");

      if (
        !event.wasClean &&
        reconnectAttemptsRef.current < 5
      ) {

        reconnectAttemptsRef.current += 1;

        reconnectTimeoutRef.current =
          setTimeout(() => {

            connectWebSocket();

          }, 3000);

      }

    };

  };


  useEffect(() => {

    if (!selectedContact?.id) {

      return;

    }

    connectWebSocket();

    return () => {

      clearTimeout(
        reconnectTimeoutRef.current
      );

      socketRef.current?.close();

    };

  }, [selectedContact?.id]);






  const handleSendMessage = async ({
    text,
    file,
  }) => {

    if (!selectedContact) return;

    try {

      // FILE MESSAGE
      if (file) {

        const formData = new FormData();

        formData.append(
          "message",
          text || ""
        );

        formData.append(
          "file",
          file.originalFile
        );

        const res =
          await authoritychatapi.sendMessage(
            selectedContact.id,
            formData
          );



        return;
      }

      // TEXT MESSAGE
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          message: text,
          reply_to: replyMessage?.id || null,
        })
      );

      setReplyMessage(null);

      // UPDATE SIDEBAR
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? {
              ...c,
              lastMessage: text,
            }
            : c
        )
      );

    } catch (error) {

      handleApiError(
        error,
        "Failed to send message"
      );

    }

  };




  const handleDeleteMessage = async (messageId) => {

    try {

      await authoritychatapi.deleteMessage(
        messageId
      );

    } catch (error) {

      handleApiError(
        error,
        "Failed to delete message"
      );

    }

  };




  const loadMoreMessages = async () => {

    if (
      !hasMore ||
      loadingMore ||
      !selectedContact
    ) return;

    const nextPageNumber =
      new URL(nextPage)
        .searchParams.get("page");

    await fetchMessages(
      selectedContact.id,
      nextPageNumber
    );

  };


  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden font-sans">
      <div
        className={`
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:relative z-30 md:z-auto
          transition-transform duration-300 ease-in-out
          h-full flex-shrink-0
        `}
      >
        <ChatSidebar
          contacts={contacts}
          selectedId={selectedContact?.id}
          onSelectContact={handleSelectContact}
          currentUser={currentUser}
          isLoading={isLoading}
          title="SPIMS Chat"
          subtitle="Internal Authority Communication"
          searchPlaceholder="Search ward chats..."
          sectionTitle="WARDS"
          currentRoleLabel="Panchayath Authority"
        />
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50">
        {!selectedContact ? (
          <>
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-semibold text-gray-800">SPIMS Chat</span>
            </div>
            <EmptyChatState />
          </>
        ) : (
          <>
            <ChatHeader
              contact={selectedContact}
              onBack={() => {
                setIsMobileSidebarOpen(true);
                setSelectedContact(null);
              }}
            />

            {isLoading ? (
              <div className="flex-1 overflow-hidden">
                <ChatSkeleton type="messages" />
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUser?.id}
                isTyping={isTyping}
                typingUser={selectedContact?.name?.split("–")[0]?.trim()}
                onReply={setReplyMessage}
                onDelete={handleDeleteMessage}
                loadMoreMessages={loadMoreMessages}
                hasMore={hasMore}
                loadingMore={loadingMore}
              />
            )}

            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              socketRef={socketRef}
              replyMessage={replyMessage}
              clearReply={() => setReplyMessage(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PanchayathAuthorityChat;