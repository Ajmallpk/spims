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

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // useEffect(() => {

  //   let socket = null

  //   const connectSocket = () => {

  //     socket = new WebSocket(
  //       "ws://localhost:8000/ws/notifications/"
  //     )

  //     socket.onopen = () => {

  //       console.log(
  //         "Notification websocket connected"
  //       )

  //     }

  //     socket.onmessage = (event) => {

  //       const data = JSON.parse(
  //         event.data
  //       )

  //       console.log(
  //         "Realtime notification",
  //         data
  //       )

  //       const newNotification = {

  //         id: Date.now(),

  //         title: data.title,

  //         message: data.message,

  //         notification_type:
  //           data.notification_type,

  //         is_read: false,

  //         created_at:
  //           new Date().toISOString()

  //       }

  //       setNotifications(
  //         prev => [
  //           newNotification,
  //           ...prev
  //         ]
  //       )

  //       setUnreadCount(
  //         prev => prev + 1
  //       )

  //     }

  //     socket.onclose = () => {

  //       console.log(
  //         "Socket disconnected"
  //       )

  //       setTimeout(
  //         connectSocket,
  //         3000
  //       )

  //     }

  //   }

  //   connectSocket()

  //   return () => {

  //     socket?.close()

  //   }

  // }, [])



  useEffect(() => {

    let socket = null

    const connectSocket = () => {

      const token =
        localStorage.getItem(
          "access"
        )

      if (!token)
        return

      socket = new WebSocket(
        `ws://localhost:8000/ws/notifications/?token=${token}`
      )

      socket.onopen = () => {

        console.log(
          "Notification websocket connected"
        )

      }

      socket.onmessage = (event) => {

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

          notification_type:
            data.notification_type,

          is_read: false,

          created_at:
            new Date().toISOString()

        }

        setNotifications(
          prev => [
            newNotification,
            ...prev
          ]
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