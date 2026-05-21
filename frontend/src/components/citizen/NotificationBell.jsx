/**
 * NotificationBell.jsx
 * Drop-in replacement / wrapper for the bell icon in TopNavigation.
 * Manages open/close state and passes anchorRef to NotificationPanel.
 *
 * Props:
 *   unreadCount : number   – shown as red badge (pass from parent state)
 *   token       : string
 *
 * Usage inside TopNavigation.jsx:
 *   import NotificationBell from "./NotificationBell";
 *   ...
 *   <NotificationBell unreadCount={unreadCount} token={token} />
 */

import { useState, useRef } from "react";
import NotificationPanel from "@/pages/citizen/Notificationpanel";

const NotificationBell = ({
    unreadCount = 0,
    token,
    notifications,
    setNotifications,
    setUnreadCount
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);

    const toggle = () => setIsOpen((v) => !v);
    const close = () => setIsOpen(false);

    return (
        // Relative wrapper so the panel is positioned relative to this element
        <div className="relative">
            {/* Bell button */}
            <button
                ref={bellRef}
                onClick={toggle}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${isOpen
                    ? "bg-teal-50 text-teal-600"
                    : "hover:bg-gray-100 text-gray-600"
                    }`}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            <NotificationPanel
                isOpen={isOpen}
                onClose={close}
                anchorRef={bellRef}
                token={token}

                notifications={notifications}
                setNotifications={setNotifications}

                unreadCount={unreadCount}
                setUnreadCount={setUnreadCount}
            />
        </div>
    );
};

export default NotificationBell;