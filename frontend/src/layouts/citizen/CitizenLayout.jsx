// import TopNavigation from "@/layouts/citizen/TopNavigation";
// import { Outlet } from "react-router-dom";

// const CitizenLayout = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <TopNavigation />

//       <main className="max-w-3xl mx-auto py-6 px-4">
//         <Outlet />
//       </main>

//     </div>
//   );
// };

// export default CitizenLayout;




import TopNavigation from "@/layouts/citizen/TopNavigation"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"

const CitizenLayout = () => {

  console.log("CITIZEN LAYOUT RENDERED")

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const WS_BASE_URL =
    "ws://localhost:8000";


  console.log(
    "CURRENT ROLE",
    localStorage.getItem("role")
  )

  console.log(
    "CURRENT USER",
    localStorage.getItem("user_id")
  )


  useEffect(() => {

    const role =
      localStorage.getItem("role");

    if (role !== "CITIZEN") {

      console.log(
        "WRONG ROLE INSIDE CITIZEN LAYOUT",
        role
      );

    }

  }, []);




  useEffect(() => {

    let socket = null

    const connectSocket = () => {





      const WS_URL =
        `${WS_BASE_URL}/ws/notifications/?role=citizen`

      console.log(
        "CONNECTING TO:",
        WS_URL
      )

      console.log("WS URL:", WS_URL)
      socket =
        new WebSocket(
          WS_URL
        )


      socket.onopen = () => {

        console.log(
          "Notification websocket connected"
        )

      }

      socket.onmessage = (event) => {

        console.log(
          "RAW WS EVENT:",
          event.data
        )

        const data =
          JSON.parse(
            event.data
          )

        console.log(
          "Realtime notification",
          data
        )

        const newNotification = {

          id: Date.now(),

          title: data.title,

          message: data.message,

          type:
            data.notification_type,

          notification_type:
            data.notification_type,

          is_read: false,

          createdAt:
            new Date().toISOString(),

          created_at:
            new Date().toISOString()

        }

        console.log(
          "ADDING TO STATE:",
          newNotification
        )

        setNotifications(
          prev => {

            console.log(
              "PREVIOUS:",
              prev
            )

            return [
              newNotification,
              ...prev
            ]

          }
        )

        setUnreadCount(
          prev => prev + 1
        )

      }

      socket.onclose = () => {

        console.log(
          "Socket disconnected"
        )

        setTimeout(
          connectSocket,
          3000
        )

      }

    }

    connectSocket()

    return () => {

      socket?.close()

    }

  }, [])

  return (

    <div
      className="min-h-screen bg-gray-100"
    >

      <TopNavigation

        notifications={notifications}

        unreadCount={unreadCount}

        setNotifications={
          setNotifications
        }

        setUnreadCount={
          setUnreadCount
        }

      />

      <main
        className="
 max-w-3xl
 mx-auto
 py-6
 px-4
 "
      >

        <Outlet />

      </main>

    </div>

  )

}

export default CitizenLayout