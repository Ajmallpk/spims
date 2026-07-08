import React, { useState, useMemo, useEffect, useRef } from "react";
import ComplaintChatHeader from "@/components/ward/ComplaintChatListHeader";
import ComplaintChatSearch from "@/components/ward/ComplaintChatSearch";
import ComplaintChatCard from "@/components/ward/ComplaintChatCard";
import ComplaintChatEmptyState from "@/components/ward/ComplaintChatEmptyState";
import ComplaintChatSkeleton from "@/components/ward/ComplaintChatListSkeleton";
import { complaintchatapi } from "@/service/complaintchaturls";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── Dummy data ─────────────────────────────────────────────────────────────
const DUMMY_CHATS = [
    {
        id: 28,
        title: "Road Damage Near School",
        citizen: "Ajmal Khan",
        lastMessage: "Please provide more details about the exact location.",
        time: "10:30 AM",
        unreadCount: 2,
        isClosed: false,
    },
    {
        id: 35,
        title: "Street Light Not Working",
        citizen: "Rahul Nair",
        lastMessage: "Issue has been resolved. Thank you for your patience.",
        time: "Yesterday",
        unreadCount: 0,
        isClosed: true,
    },
    {
        id: 41,
        title: "Garbage Pile on Main Street",
        citizen: "Sreelakshmi P",
        lastMessage: "We have assigned a cleanup crew for tomorrow morning.",
        time: "Mon",
        unreadCount: 5,
        isClosed: false,
    },
    {
        id: 19,
        title: "Open Drainage Causing Flooding",
        citizen: "Mohammed Riyas",
        lastMessage: "Can you send a photo of the affected area?",
        time: "Mon",
        unreadCount: 1,
        isClosed: false,
    },
    {
        id: 52,
        title: "Illegal Construction Near Park",
        citizen: "Divya Krishnan",
        lastMessage: "Our inspector visited and filed the report.",
        time: "Sun",
        unreadCount: 0,
        isClosed: true,
    },
    {
        id: 63,
        title: "Water Supply Interruption",
        citizen: "Arun Suresh",
        lastMessage: "The pipeline repair is scheduled for this Friday.",
        time: "Sat",
        unreadCount: 3,
        isClosed: false,
    },
    {
        id: 74,
        title: "Stray Animal Menace",
        citizen: "Nusrath Fathima",
        lastMessage: "Please contact the municipal animal control unit.",
        time: "Fri",
        unreadCount: 0,
        isClosed: false,
    },
    {
        id: 80,
        title: "Broken Footpath Tiles",
        citizen: "Sanjith Mohan",
        lastMessage: "Repair work completed and area is safe now.",
        time: "Fri",
        unreadCount: 0,
        isClosed: true,
    },
];

// ── Filter tabs ────────────────────────────────────────────────────────────
const TABS = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "closed", label: "Closed" },
];

// ── Page component ─────────────────────────────────────────────────────────
const ComplaintChatList = () => {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const socketRef = useRef(null);

    // Navigate helper — swap with react-router useNavigate in real project

    useEffect(() => {

        const loadChats = async () => {

            try {

                setIsLoading(true);

                const res =
                    await complaintchatapi.getInbox();


                console.log(
                    "Complaint Inbox",
                    res.data
                );

                const formattedChats =
                    res.data.map(chat => {

                        console.log(
                            "LAST MESSAGE =",
                            chat.last_message
                        );

                        return {

                            id: chat.complaint,

                            title: chat.complaint_title,

                            authority: chat.chat_user,

                            lastMessage:
                                chat.last_message?.message ||
                                "No messages yet",

                            unreadCount: chat.unread_count,

                            isClosed: chat.is_closed,

                            time: new Date(chat.created_at)
                                .toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })

                        };

                    });

                setChats(
                    formattedChats
                );

            }

            catch (error) {

                console.log(error);
                toast.error("Failed to load chats");

            }

            finally {

                setIsLoading(false);

            }

        };

        loadChats();

    }, []);




    useEffect(() => {

        socketRef.current = new WebSocket(
            "ws://localhost:8000/ws/inbox/?role=ward"
        );

        socketRef.current.onopen = () => {

            console.log("COMPLAINT INBOX WS CONNECTED");

        };

        socketRef.current.onmessage = (event) => {

            const response = JSON.parse(event.data);

            console.log(
                "COMPLAINT SIDEBAR UPDATE",
                response
            );

            if (
                response.type === "sidebar_update"
            ) {

                const data = response.data;

                setChats(prev =>
                    prev.map(chat =>
                        chat.id === data.chat_id
                            ? {
                                ...chat,
                                lastMessage:
                                    data.last_message,

                                unreadCount:
                                    (chat.unreadCount || 0) + 1
                            }
                            : chat
                    )
                );

            }

        };

        socketRef.current.onclose = () => {

            console.log(
                "COMPLAINT INBOX WS CLOSED"
            );

        };

        return () => {

            socketRef.current?.close();

        };

    }, []);






    const handleCardClick = (complaintId) => {
        navigate(`/ward/complaint-chats/${complaintId}`);
    };

    const filtered = useMemo(() => {
        if (!Array.isArray(chats)) {
            return [];
        }
        const q = query.toLowerCase().trim();
        return chats.filter((chat) => {
            const matchesTab =
                activeTab === "all"
                    ? true
                    : activeTab === "open"
                        ? !chat.isClosed
                        : chat.isClosed;

            const matchesQuery =
                !q ||
                chat.title.toLowerCase().includes(q) ||
                chat.citizen.toLowerCase().includes(q);

            return matchesTab && matchesQuery;
        });
    }, [query, activeTab, chats]);

    const openCount =
        (chats || []).filter(
            (c) => !c.isClosed
        ).length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">

                {/* Header */}
                <ComplaintChatHeader
                    totalCount={chats.length}
                    openCount={openCount}
                />

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === tab.key
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <ComplaintChatSearch
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                    resultCount={filtered.length}
                    placeholder="Search by complaint title or citizen name..."
                />

                {/* Card list or states */}
                {isLoading ? (
                    <ComplaintChatSkeleton count={5} />
                ) : filtered.length === 0 ? (
                    <ComplaintChatEmptyState isFiltered={!!query || activeTab !== "all"} />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((chat) => (
                            <ComplaintChatCard
                                key={chat.id}
                                complaint={chat}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintChatList;