import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminapi } from "@/service/adminurls"
import { getNotificationRoute } from "@/utils/notificationRouter";

export default function AdminNotificationPanel({

    isOpen,

    notifications,

    setNotifications,

    unreadCount,

    setUnreadCount,

    anchorRef

}) {

    const panelRef = useRef(null)
    const navigate = useNavigate()

    const [filter, setFilter] = useState("all")


    useEffect(() => {

        const loadNotifications = async () => {

            try {

                const res =
                    await adminapi
                        .getNotifications()

                const data =

                    res.data.results
                        ?.data || []

                setNotifications(
                    data
                )

            }

            catch (error) {

                console.log(error)

            }

        }

        if (isOpen) {

            loadNotifications()

        }

    }, [isOpen, setNotifications])

    useEffect(() => {

        const handleClick = (e) => {

            if (

                panelRef.current &&

                !panelRef.current.contains(
                    e.target
                ) &&

                anchorRef.current &&

                !anchorRef.current.contains(
                    e.target
                )

            ) {

                return

            }

        }

        document.addEventListener(
            "mousedown",
            handleClick
        )

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClick
            )

        }

    }, [])

    if (!isOpen)
        return null

    const markAllRead = async () => {

        setNotifications(

            prev =>

                prev.map(
                    n => ({
                        ...n,
                        is_read: true
                    })
                )

        )

        setUnreadCount(0)

        try {

            await adminapi
                .markAllNotificationsRead()

        }

        catch (error) {

            console.log(error)

        }

    }

    const handleMarkOne = async (item) => {

        if (item.is_read)
            return

        try {

            await adminapi
                .markNotificationRead(
                    item.id
                )

            setNotifications(

                prev =>

                    prev.map(

                        n =>

                            n.id === item.id

                                ? {
                                    ...n,
                                    is_read: true
                                }

                                : n

                    )

            )

            setUnreadCount(

                prev =>

                    prev > 0

                        ? prev - 1

                        : 0

            )

        }

        catch (error) {

            console.log(error)

        }

    }


    const handleNotificationClick = async (notification) => {

        // Mark notification as read
        if (!notification.is_read) {

            try {

                await adminapi.markNotificationRead(notification.id);

                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id
                            ? { ...n, is_read: true }
                            : n
                    )
                );

                setUnreadCount(prev => prev > 0 ? prev - 1 : 0);

            } catch (error) {

                console.log(error);

            }

        }

        // Get route from notification target
        const route = getNotificationRoute(notification);


        console.log(route);
        console.log(notification);

        if (route) {

            navigate(route);

            return;

        }

        // Fallback
        navigate("/admin/dashboard");

    };

    const displayed =

        filter === "unread"

            ?

            notifications.filter(
                n => !n.is_read
            )

            :

            notifications

    return (

        <div

            ref={panelRef}

            className="
      absolute
      right-0
      top-12
      w-80
      bg-white
      border
      border-gray-100
      rounded-2xl
      shadow-xl
      z-50
      overflow-hidden
      "

        >

            {/* Header */}

            <div
                className="
        px-4
        py-3
        border-b
        border-gray-100
        flex
        items-center
        justify-between
        "
            >

                <div
                    className="
          flex
          items-center
          gap-2
          "
                >

                    <span
                        className="
            text-sm
            font-medium
            text-gray-800
            "
                    >

                        Notifications

                    </span>

                    {

                        unreadCount > 0 && (

                            <span

                                className="
                bg-blue-50
                text-blue-600
                text-xs
                px-2
                py-0.5
                rounded-full
                "

                            >

                                {unreadCount}

                            </span>

                        )

                    }

                </div>

                {

                    unreadCount > 0 && (

                        <button

                            onClick={markAllRead}

                            className="
              text-xs
              text-blue-500
              hover:text-blue-700
              "

                        >

                            Mark all read

                        </button>

                    )

                }

            </div>

            {/* Filter */}

            <div
                className="
        px-2
        py-2
        border-b
        "
            >

                <div
                    className="
          flex
          gap-2
          "
                >

                    <button

                        onClick={() =>
                            setFilter("all")
                        }

                        className={

                            filter === "all"

                                ?

                                "bg-blue-500 text-white px-3 py-1 rounded"

                                :

                                "px-3 py-1"

                        }

                    >

                        All

                    </button>

                    <button

                        onClick={() =>
                            setFilter("unread")
                        }

                        className={

                            filter === "unread"

                                ?

                                "bg-blue-500 text-white px-3 py-1 rounded"

                                :

                                "px-3 py-1"

                        }

                    >

                        Unread

                    </button>

                </div>

            </div>

            {/* Notifications */}

            <div
                className="
        max-h-80
        overflow-y-auto
        "
            >

                {

                    displayed.length === 0

                        ?

                        (

                            <div
                                className="
                py-8
                text-center
                text-gray-400
                "
                            >

                                No Notifications

                            </div>

                        )

                        :

                        displayed.map(

                            item => (

                                <div

                                    key={item.id}

                                    onClick={() =>
                                        handleNotificationClick(item)
                                    }

                                    className={`

                  p-4
                  border-b
                  cursor-pointer
                  hover:bg-gray-50

                  ${item.is_read

                                            ?

                                            "bg-white"

                                            :

                                            "bg-blue-50"

                                        }

                  `}

                                >

                                    <div
                                        className="
                    flex
                    justify-between
                    "
                                    >

                                        <h4
                                            className="
                      font-medium
                      text-sm
                      "
                                        >

                                            {item.title}

                                        </h4>

                                        {

                                            !item.is_read && (

                                                <div

                                                    className="
                          w-2
                          h-2
                          bg-blue-500
                          rounded-full
                          "

                                                />

                                            )

                                        }

                                    </div>

                                    <p
                                        className="
                    text-xs
                    text-gray-500
                    mt-1
                    "
                                    >

                                        {item.message}

                                    </p>

                                </div>

                            )

                        )

                }

            </div>

        </div>

    )

}