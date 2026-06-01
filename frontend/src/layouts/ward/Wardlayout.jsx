import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WardSidebar from "@/components/ward/Wardsidebar";
import WardHeader from "@/components/ward/Wardheader";
import VerificationRequiredModal from "@/components/panjayath/VerificationRequiredModal";
import VerificationPendingModal from "@/components/panjayath/VerificationPendingModal";
import axiosInstance from "@/api/axiosInstance";
import WardNotificationBell from "@/components/ward/WardNotificationBell";
import wardapi from "@/service/wardurls";
const PROTECTED_PATHS = [
  "/ward/dashboard",
  "/ward/citizen-verifications",
  "/ward/citizens",
  "/ward/complaints",
];

export default function WardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const role = localStorage.getItem("role");
  const isVerified = localStorage.getItem("is_verified") === "true";
  const verificationSubmitted = localStorage.getItem("verification_submitted") === "true";


  useEffect(() => {

    const loadNotifications = async () => {

      try {

        const notifRes =
          await wardapi.getNotifications()

        const unreadRes =
          await wardapi.getUnreadCount()

        setNotifications(

          notifRes.data.results.data

        )

        setUnreadCount(

          unreadRes.data.data.unread_count

        )

      }

      catch (error) {

        console.log(
          error
        )

      }

    }

    loadNotifications()

  }, [])




  useEffect(() => {

    let socket = null

    const connectSocket = () => {

      const token =
        localStorage.getItem(
          "access"
        )

      if (!token)
        return

      console.log(
        "WARD TOKEN:",
        token
      )

      socket =
        new WebSocket(

          `ws://127.0.0.1:8000/ws/notifications/?token=${token}`

        )

      socket.onopen = () => {

        console.log(
          "WARD WS CONNECTED"
        )

      }

      socket.onmessage = (
        event
      ) => {

        const data =
          JSON.parse(
            event.data
          )

        console.log(
          "WARD NOTIFICATION",
          data
        )

        const newNotification = {

          id: Date.now(),

          title:
            data.title,

          message:
            data.message,

          notification_type:
            data.notification_type,

          is_read: false,

          created_at:
            new Date()
              .toISOString()

        }

        setNotifications(
          prev => [

            newNotification,

            ...prev

          ]
        )

        setUnreadCount(
          prev =>
            prev + 1
        )

      }

      socket.onclose = () => {

        console.log(
          "WARD SOCKET CLOSED"
        )

        setTimeout(

          () => {

            connectSocket()

          },

          3000

        )

      }

      socket.onerror = (error) => {

        console.log(
          "WARD WS ERROR",
          error
        )

      }

    }

    connectSocket()

    return () => {

      socket?.close()

    }

  }, [])

  useEffect(() => {
    const syncVerification = async () => {
      try {
        const res = await axiosInstance.get("/ward/profile/");
        const status = res.data.data.verification_status;

        const isApproved = status === "APPROVED";

        localStorage.setItem("is_verified", isApproved ? "true" : "false");
        localStorage.setItem(
          "verification_submitted",
          status === "PENDING" ? "true" : "false"
        );
      } catch (err) {
        console.error("Verification sync failed:", err);
      }
    };

    syncVerification();
  }, []);

  useEffect(() => {
    if (role !== "WARD") {
      navigate("/login", { replace: true });
      return;
    }

    const isProtectedRoute = PROTECTED_PATHS.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isVerified && isProtectedRoute) {
      if (verificationSubmitted) {
        setShowPendingModal(true);
      } else {
        setShowRequiredModal(true);
      }
      navigate("/ward/profile", { replace: true });
    }
  }, [location.pathname, role, isVerified, verificationSubmitted, navigate]);

  if (role !== "WARD") return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <WardSidebar
        isVerified={isVerified}
        verificationSubmitted={verificationSubmitted}
        onShowRequired={() => setShowRequiredModal(true)}
        onShowPending={() => setShowPendingModal(true)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <WardHeader

          notifications={notifications}

          setNotifications={
            setNotifications
          }

          unreadCount={
            unreadCount
          }

          setUnreadCount={
            setUnreadCount
          }

        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {showRequiredModal && (
        <VerificationRequiredModal
          onClose={() => setShowRequiredModal(false)}
          onGoToProfile={() => {
            setShowRequiredModal(false);
            navigate("/ward/profile");
          }}
        />
      )}

      {showPendingModal && (
        <VerificationPendingModal onClose={() => setShowPendingModal(false)} />
      )}
    </div>
  );
}