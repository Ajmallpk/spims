import { useState } from "react";
import SearchBar from "./SearchBar";
import ChatUserCard from "./ChatUserCard";
import ChatSkeleton from "./ChatSkeleton";

const ChatSidebar = ({
  contacts,
  selectedId,
  onSelectContact,
  currentUser,
  isLoading,

  title = "SPIMS Chat",
  subtitle = "Internal Communication",

  searchPlaceholder = "Search chats...",

  sectionTitle = "Chats",

  currentRoleLabel = "Authority",
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "online" && c.isOnline) ||
      (filter === "unread" && c.unreadCount > 0);
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-80 flex-shrink-0 flex flex-col h-full bg-white border-r border-gray-200">
      <div className="px-4 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-lg text-gray-900 tracking-tight">
              {title}
            </h1>

            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 p-2.5 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{currentUser?.name?.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-900 truncate">{currentUser?.name}</p>
            <p className="text-xs text-blue-500 truncate">
              {currentUser?.designation || currentRoleLabel}
            </p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
        />

        <div className="flex gap-1.5 mt-3">
          {[
            { key: "all", label: "All" },
            // { key: "online", label: "Online" },
            { key: "unread", label: "Unread" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2.5">
          {sectionTitle} ({filtered.length})
        </p>

        {isLoading ? (
          <ChatSkeleton type="sidebar" />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-400">No chats found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((contact) => (
              <ChatUserCard
                key={contact.id}
                contact={contact}
                isSelected={contact.id === selectedId}
                onClick={() => onSelectContact(contact)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-center text-xs text-gray-400">
          🔒 Secure · Internal Use Only
        </p>
      </div>
    </div>
  );
};

export default ChatSidebar;