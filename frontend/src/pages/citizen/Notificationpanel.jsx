/**
 * NotificationPanel.jsx
 * Dropdown notification panel anchored to the bell icon in TopNavigation.
 *
 * Props:
 *   isOpen        : boolean
 *   onClose       : () => void
 *   anchorRef     : React.RefObject  – ref of the bell button (for positioning)
 *   token         : string
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import citizenapi from "@/service/citizenurls";
import { handleApiError } from "@/utils/handleApiError";
import { getNotificationRoute } from "@/utils/notificationRouter";

// ─── Types & config ───────────────────────────────────────────────────────────
const NOTIF_CONFIG = {
    COMPLAINT_UPDATE: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        bg: "bg-teal-50",
    },
    AUTHORITY_MESSAGE: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-indigo-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        bg: "bg-indigo-50",
    },
    STATUS_CHANGE: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        bg: "bg-green-50",
    },
    UPVOTE_MILESTONE: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-orange-500">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
        ),
        bg: "bg-orange-50",
    },
    ESCALATION: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        bg: "bg-red-50",
    },
    SYSTEM: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
        ),
        bg: "bg-gray-100",
    },
};

const FILTERS = ["All", "Unread", "Updates", "Messages"];

const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// ─── Single notification row ───────────────────────────────────────────────────
const NotificationItem = ({ notif, onMarkRead, onAction }) => {
    const conf = NOTIF_CONFIG[notif.type] ?? NOTIF_CONFIG.SYSTEM;

    return (
        <div
            onClick={() => {

                onAction?.(notif);

            }}
            className={`group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${notif.is_read ? "bg-white hover:bg-gray-50" : "bg-teal-50/30 hover:bg-teal-50/60"
                }`}
        >
            {/* Unread dot */}
            {!notif.is_read && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />
            )}

            {/* Icon bubble */}
            <div className={`w-9 h-9 rounded-xl ${conf.bg} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                {conf.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${notif.is_read ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                    {notif.message}
                </p>
                {notif.complaintTitle && (
                    <p className="text-xs text-teal-600 font-medium mt-0.5 truncate">
                        📋 {notif.complaintTitle}
                    </p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
            </div>

            {/* Mark read button on hover */}
            {!notif.is_read && (
                <button
                    onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id); }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full hover:bg-teal-100 flex items-center justify-center"
                    title="Mark as read"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-teal-500">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyNotifications = ({ filter }) => (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-gray-300">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-400">
                {filter === "Unread" ? "All caught up!" : "No notifications"}
            </p>
            <p className="text-xs text-gray-300 mt-0.5">
                {filter === "Unread"
                    ? "No unread notifications right now."
                    : "You'll see alerts about your complaints here."}
            </p>
        </div>
    </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonItem = () => (
    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 animate-pulse">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-2.5 w-16 bg-gray-100 rounded" />
        </div>
    </div>
);

// ─── Main panel ───────────────────────────────────────────────────────────────
const NotificationPanel = ({
    isOpen,
    onClose,
    anchorRef,
    token,

    notifications,
    setNotifications,

    unreadCount,
    setUnreadCount

}) => {
    const panelRef = useRef(null);
    // const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [markingAll, setMarkingAll] = useState(false);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                anchorRef?.current && !anchorRef.current.contains(e.target)
            ) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onClose]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Fetch notifications
    const loadNotifications =
        useCallback(async () => {

            setLoading(true)

            try {

                const res =
                    await citizenapi
                        .getNotifications()

                const data =

                    res.data.results
                        ?.data || []

                setNotifications(
                    data
                )

            }

            catch (error) {

                handleApiError(
                    error,
                    "Failed to load notifications"
                )

            }

            finally {

                setLoading(false)

            }

        }, [])

    useEffect(() => {
        if (isOpen) loadNotifications();
    }, [isOpen, loadNotifications]);

    // Mark one as read
    const markRead = useCallback(async (id) => {

        setNotifications(prev =>

            prev.map(n =>

                n.id === id

                    ? {

                        ...n,

                        is_read: true

                    }

                    : n

            )

        )

        setUnreadCount(prev =>

            prev > 0

                ? prev - 1

                : 0

        )

        try {

            await citizenapi.markNotificationRead(id)

        }

        catch (error) {

            console.log(error)

        }

    }, [])

    const handleNotificationClick = async (notification) => {

        if (!notification.is_read) {
            await markRead(notification.id);
        }

        onClose?.();

        const route = getNotificationRoute(notification);

        if (route) {
            navigate(route);
            return;
        }

        navigate("/citizen");
    };

    // Mark all as read
    const markAllRead = useCallback(async () => {

        setMarkingAll(true)

        setNotifications((prev) =>

            prev.map((n) => ({

                ...n,

                is_read: true

            }))

        )

        setUnreadCount(0)

        try {

            await citizenapi.markAllNotificationsRead()

        }

        catch (error) {

            handleApiError(
                error,
                "Failed to mark notifications as read"
            )

        }

        finally {

            setMarkingAll(false)

        }

    }, [])

    if (!isOpen) return null;

    // const unreadCount =
    //     notifications.filter((n) => !n.is_read).length;

    const filtered = notifications.filter((n) => {
        if (activeFilter === "Unread")
            return !n.is_read;
        if (activeFilter === "Updates") return ["COMPLAINT_UPDATE", "STATUS_CHANGE", "ESCALATION", "UPVOTE_MILESTONE"].includes(n.type);
        if (activeFilter === "Messages") return n.type === "AUTHORITY_MESSAGE";
        return true;
    });

    return (
        <>
            {/* Backdrop (mobile) */}
            <div className="fixed inset-0 z-40 sm:hidden bg-black/20" onClick={onClose} />

            {/* Panel */}
            <div
                ref={panelRef}
                className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
                style={{ maxHeight: "520px" }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={markingAll}
                                className="text-xs text-teal-600 hover:text-teal-700 font-semibold px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50"
                            >
                                {markingAll ? "Marking…" : "Mark all read"}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Filter tabs ── */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-50 flex-shrink-0 overflow-x-auto scrollbar-none">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeFilter === f
                                ? "bg-teal-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            {f}
                            {f === "Unread" && unreadCount > 0 && (
                                <span className={`ml-1 ${activeFilter === "Unread" ? "text-teal-100" : "text-teal-500"}`}>
                                    ({unreadCount})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── List ── */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
                    ) : filtered.length === 0 ? (
                        <EmptyNotifications filter={activeFilter} />
                    ) : (
                        filtered.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notif={n}
                                onMarkRead={markRead}
                                onAction={handleNotificationClick}
                            />
                        ))
                    )}
                </div>

                {/* ── Footer ── */}
                {!loading && notifications.length > 0 && (
                    <div className="flex-shrink-0 border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                        </p>
                        <button className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                            View all →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPanel;