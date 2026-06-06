import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/Adminheader";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([])

  const [unreadCount, setUnreadCount] = useState(0)

  const WS_BASE_URL =
    "ws://localhost:8000";




  useEffect(() => {

    let socket = null

    const connectSocket = () => {

      socket = new WebSocket(
        `${WS_BASE_URL}/ws/notifications/?role=admin`
      )

      socket.onopen = () => {
        console.log("ADMIN WS CONNECTED")
      }

      socket.onmessage = (event) => {

        console.log("MESSAGE RECEIVED", event.data)

        const data = JSON.parse(event.data)

        const newNotification = {
          id: Date.now(),
          title: data.title,
          message: data.message,
          notification_type: data.notification_type,
          is_read: false,
          created_at: new Date().toISOString()
        }

        setNotifications(prev => [
          newNotification,
          ...prev
        ])

        setUnreadCount(prev => prev + 1)
      }

      socket.onerror = (error) => {
        console.log("ADMIN WS ERROR", error)
      }

      socket.onclose = () => {
        console.log("ADMIN WS CLOSED")
      }

    }

    connectSocket()

    return () => {
      socket?.close()
    }

  }, [])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader

          notifications={notifications}

          setNotifications={setNotifications}

          unreadCount={unreadCount}

          setUnreadCount={setUnreadCount}

        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;