import { Bell } from "lucide-react"
import { useState,useRef } from "react"
import NotificationPanel from "./NotificationPanel"

export default function WardNotificationBell({

 unreadCount,
 notifications,
 setNotifications,
 setUnreadCount

}) {

 const [isOpen,setIsOpen]=useState(false)

 const bellRef=useRef(null)

 return (

  <div className="relative">

   <button
    ref={bellRef}
    onClick={()=>setIsOpen(prev=>!prev)}
    className="
    relative
    w-9
    h-9
    rounded-lg
    flex
    items-center
    justify-center
    text-gray-500
    hover:bg-gray-100
    "
   >

    <Bell className="w-5 h-5"/>

    {unreadCount>0 && (

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

      {unreadCount>9?"9+":unreadCount}

     </span>

    )}

   </button>

   <NotificationPanel
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