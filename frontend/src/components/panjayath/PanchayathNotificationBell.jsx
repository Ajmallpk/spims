import {

 Bell

}

from "lucide-react"

import {

 useState,
 useRef

}

from "react"

import NotificationPanel
from "./NotificationPanel"

export default function
PanchayathNotificationBell({

 notifications,

 setNotifications,

 unreadCount,

 setUnreadCount

}){

 const [

 isOpen,

 setIsOpen

 ]=

 useState(false)

 const bellRef=

 useRef(null)

 return(

 <div
 className="relative"
 >

 <button

 ref={bellRef}

 onClick={()=>

 setIsOpen(
 prev=>!prev
 )

 }

 className="

 relative

 p-2

 rounded-lg

 hover:bg-gray-100

 "

 >

 <Bell
 className="
 w-5
 h-5
 "
 />

 {

 unreadCount>0&&(

 <span

 className="

 absolute

 top-1

 right-1

 bg-red-500

 text-white

 text-[9px]

 rounded-full

 px-1

 "

 >

 {

 unreadCount>9

 ?

 "9+"

 :

 unreadCount

 }

 </span>

 )

 }

 </button>

 <NotificationPanel

 isOpen={isOpen}

 notifications={
 notifications
 }

 setNotifications={
 setNotifications
 }

 unreadCount={
 unreadCount
 }

 setUnreadCount={
 setUnreadCount
 }

 anchorRef={
 bellRef
 }

 />

 </div>

 )

}