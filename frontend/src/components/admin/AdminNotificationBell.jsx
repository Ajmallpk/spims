import { Bell } from "lucide-react"
import { useState, useRef } from "react"
import AdminNotificationPanel from "./AdminNotificationPanel"

export default function AdminNotificationBell({

  unreadCount,

  notifications,

  setNotifications,

  setUnreadCount

}) {

  const [isOpen, setIsOpen] = useState(false)

  const bellRef = useRef(null)

  return (

    <div className="relative">

      <button

        ref={bellRef}

        onClick={() => setIsOpen(prev => !prev)}

        className="
        relative
        p-2
        rounded-lg
        text-gray-400
        hover:text-gray-600
        hover:bg-gray-100
        transition-colors
        duration-200
        "

      >

        <Bell size={18} />

        {

          unreadCount > 0 && (

            <span

              className="
              absolute
              top-1
              right-1
              min-w-[16px]
              h-4
              px-1
              bg-red-500
              text-white
              text-[9px]
              rounded-full
              flex
              items-center
              justify-center
              "

            >

              {

                unreadCount > 9

                  ? "9+"

                  : unreadCount

              }

            </span>

          )

        }

      </button>

      <AdminNotificationPanel

        isOpen={isOpen}

        notifications={notifications}

        setNotifications={setNotifications}

        unreadCount={unreadCount}

        setUnreadCount={setUnreadCount}

        anchorRef={bellRef}

      />

    </div>

  )

}