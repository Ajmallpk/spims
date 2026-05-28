// import { useEffect, useRef } from "react"
// import wardapi from "@/service/wardurls"

// export default function NotificationPanel({

//     isOpen,

//     notifications,

//     setNotifications,

//     unreadCount,

//     setUnreadCount,

//     anchorRef

// }) {

//     const panelRef =
//         useRef(null)

//     useEffect(() => {

//         const handleClick =
//             (e) => {

//                 if (

//                     panelRef.current &&

//                     !panelRef.current.contains(
//                         e.target
//                     )

//                     &&

//                     anchorRef.current &&

//                     !anchorRef.current.contains(
//                         e.target
//                     )

//                 ) {

//                     return

//                 }

//             }

//         document.addEventListener(
//             "mousedown",
//             handleClick
//         )

//         return () => {

//             document.removeEventListener(
//                 "mousedown",
//                 handleClick
//             )

//         }

//     }, [])

//     if (!isOpen)
//         return null

//     const markAllRead = async () => {

//         setNotifications(

//             prev =>

//                 prev.map(

//                     n => ({

//                         ...n,

//                         is_read: true

//                     })

//                 ))

//         setUnreadCount(0)

//         try {

//             await wardapi
//                 .markAllNotificationsRead()

//         }

//         catch (error) {

//             console.log(error)

//         }

//     }

//     return (

//         <div

//             ref={panelRef}

//             className="
//         absolute
//         right-0
//         top-12
//         w-80
//         bg-white
//         shadow-xl
//         border
//         rounded-xl
//         z-50
//         "

//         >

//             <div
//                 className="
//             p-3
//             border-b
//             flex
//             justify-between
//             "
//             >

//                 <h3
//                     className="
//                 font-semibold
//                 "
//                 >

//                     Notifications

//                 </h3>

//                 {

//                     unreadCount > 0 && (

//                         <button

//                             onClick={
//                                 markAllRead
//                             }

//                             className="
//                     text-blue-600
//                     text-sm
//                     "

//                         >

//                             Mark All

//                         </button>

//                     )

//                 }

//             </div>

//             <div
//                 className="
//             max-h-96
//             overflow-y-auto
//             "
//             >

//                 {

//                     notifications.length === 0

//                         ?

//                         (

//                             <div
//                                 className="
//             p-5
//             text-center
//             text-gray-400
//             "
//                             >

//                                 No Notifications

//                             </div>

//                         )

//                         :

//                         notifications.map(

//                             item => (

//                                 <div

//                                     key={item.id}

//                                     onClick={async () => {

//                                         if (
//                                             item.is_read
//                                         )
//                                             return

//                                         try {

//                                             await wardapi
//                                                 .markNotificationRead(
//                                                     item.id
//                                                 )

//                                             setNotifications(

//                                                 prev =>

//                                                     prev.map(

//                                                         n =>

//                                                             n.id === item.id

//                                                                 ?

//                                                                 {

//                                                                     ...n,

//                                                                     is_read: true

//                                                                 }

//                                                                 :

//                                                                 n

//                                                     )

//                                             )

//                                             setUnreadCount(

//                                                 prev =>

//                                                     prev > 0

//                                                         ?

//                                                         prev - 1

//                                                         :

//                                                         0

//                                             )

//                                         }

//                                         catch (error) {

//                                             console.log(
//                                                 error
//                                             )

//                                         }

//                                     }}

//                                     className={`

//  p-3
//  border-b
//  cursor-pointer

//  transition

//  ${item.is_read

//                                             ?

//                                             "bg-white"

//                                             :

//                                             "bg-blue-50"

//                                         }

//  hover:bg-gray-100

//  `}

//                                 >

//                                     <h4
//                                         className="
//  font-medium
//  "
//                                     >

//                                         {item.title}

//                                     </h4>

//                                     <p
//                                         className="
//  text-sm
//  text-gray-600
//  "
//                                     >

//                                         {item.message}

//                                     </p>

//                                     {

//                                         !item.is_read && (

//                                             <span
//                                                 className="
//  text-xs
//  text-blue-600
//  "
//                                             >

//                                                 Unread

//                                             </span>

//                                         )

//                                     }

//                                 </div>

//                             )

//                         )

//                 }

//             </div>

//         </div>

//     )

// }




import { useEffect, useRef, useState } from "react"
import wardapi from "@/service/wardurls"

export default function NotificationPanel({
  isOpen,
  notifications,
  setNotifications,
  unreadCount,
  setUnreadCount,
  anchorRef
}) {
  const panelRef = useRef(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const handleClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        return
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (!isOpen) return null

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
    try {
      await wardapi.markAllNotificationsRead()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkOne = async (item) => {
    if (item.is_read) return
    try {
      await wardapi.markNotificationRead(item.id)
      setNotifications(prev =>
        prev.map(n => n.id === item.id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0))
    } catch (error) {
      console.log(error)
    }
  }

  const displayed = filter === "unread"
    ? notifications.filter(n => !n.is_read)
    : notifications

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-sm font-medium text-gray-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Toggle */}
      <div className="px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1 text-xs rounded-md transition-all ${
              filter === "all"
                ? "bg-white text-gray-800 font-medium shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 py-1 text-xs rounded-md transition-all flex items-center justify-center gap-1.5 ${
              filter === "unread"
                ? "bg-white text-gray-800 font-medium shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs px-1.5 rounded-full leading-4">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          displayed.map(item => (
            <div
              key={item.id}
              onClick={() => handleMarkOne(item)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                item.is_read ? "bg-white" : "bg-blue-50/60"
              }`}
            >
              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.is_read ? "bg-gray-100" : "bg-blue-100"
              }`}>
                <svg className={`w-4 h-4 ${item.is_read ? "text-gray-400" : "text-blue-500"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}