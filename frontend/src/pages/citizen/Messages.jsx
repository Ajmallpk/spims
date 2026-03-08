/**
 * Messages.jsx
 * Citizen Messages page — ticket-based chat system.
 * Fetches conversations and messages, manages all state.
 *
 * Replace getAuthToken() with your actual auth utility.
 */

import { useState, useEffect, useCallback } from "react";
import ConversationList from "@/components/citizen/Conversationlist";
import ChatWindow from "@/components/citizen/Chatwindow";
import EmptyMessagesState from "@/components/citizen/Emptymessagesstate";

// ─── Auth helper ──────────────────────────────────────────────────────────────
const getAuthToken = () => localStorage.getItem("spims_token") || "";

// ─── Fetch helper ─────────────────────────────────────────────────────────────
const fetchWithAuth = async (url, token, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Messages = () => {
  const token = getAuthToken();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // ── Fetch conversations ────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchWithAuth("/api/citizen/messages/", token);
      const list = data?.results ?? data ?? [];
      setConversations(list);
      // Auto-select first if available
      if (list.length > 0 && !selectedConversation) {
        setSelectedConversation(list[0]);
      }
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Fetch messages for selected conversation ───────────────────────────────
  useEffect(() => {
    if (!selectedConversation?.complaintId) return;

    const fetchMessages = async () => {
      setMessagesLoading(true);
      try {
        const data = await fetchWithAuth(
          `/api/citizen/complaint/${selectedConversation.complaintId}/messages/`,
          token
        );
        setMessages(data?.results ?? data ?? []);

        // Mark unread as read — optimistic update
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?.complaintId, token]);

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = async (text) => {
    if (!text.trim() || !selectedConversation?.complaintId) return;

    // Optimistic message
    const optimisticMsg = {
      id: `opt_${Date.now()}`,
      text,
      senderType: "CITIZEN",
      senderName: "You",
      sentAt: new Date().toISOString(),
      status: "SENT",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    setSending(true);
    try {
      const sent = await fetchWithAuth(
        `/api/citizen/complaint/${selectedConversation.complaintId}/send-message/`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ message: text }),
        }
      );

      // Replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? { ...optimisticMsg, ...sent } : m))
      );

      // Update last message preview in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-gray-100 pt-4 pb-3 border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-600">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Messages</h1>
            <p className="text-xs text-gray-400">SPIMS · Complaint Conversations</p>
          </div>
          <button
            onClick={loadConversations}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 text-xs text-teal-600 font-medium px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && !loading && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Failed to load conversations</p>
              <p className="text-xs text-red-500">{fetchError}</p>
            </div>
            <button onClick={loadConversations} className="text-xs text-red-600 font-semibold hover:underline">Retry</button>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!loading && conversations.length === 0 ? (
          <EmptyMessagesState />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Conversation list */}
            <div className="col-span-12 md:col-span-4">
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
                loading={loading}
              />
            </div>

            {/* Right: Chat window */}
            <div className="col-span-12 md:col-span-8">
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                messagesLoading={messagesLoading}
                sending={sending}
                onSend={handleSend}
                noConversation={!selectedConversation}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;