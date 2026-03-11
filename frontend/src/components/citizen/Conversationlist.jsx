/**
 * ConversationList.jsx
 * Left-panel list of all citizen complaint conversations.
 *
 * Props:
 *   conversations        : array
 *   selectedId           : string | null
 *   onSelectConversation : (conversation) => void
 *   loading              : boolean
 */

import { useState } from "react";
import ConversationItem from "@/components/citizen/Conversationitem";

const SkeletonItem = () => (
  <div className="flex items-start gap-3 p-4 border-b border-gray-50 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <div className="h-3.5 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-10 bg-gray-100 rounded" />
      </div>
      <div className="h-3 w-20 bg-gray-100 rounded" />
      <div className="h-3 w-40 bg-gray-100 rounded" />
    </div>
  </div>
);

const FILTERS = ["ALL", "OPEN", "RESOLVED", "CLOSED"];

const ConversationList = ({
  conversations = [],
  selectedId,
  onSelectConversation,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = conversations.filter((c) => {
    const matchSearch =
      !search ||
      c.complaintTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.authorityName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "ALL" || c.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-gray-800">Messages</h2>
          </div>
          {totalUnread > 0 && (
            <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalUnread} new
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search complaints…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-8 pr-4 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f
                  ? "bg-teal-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-8 h-8 text-gray-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-xs text-gray-400 font-medium">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onClick={() => onSelectConversation(conv)}
            />
          ))
        )}
      </div>

      {/* Footer count */}
      {!loading && conversations.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationList;