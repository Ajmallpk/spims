import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WardSidebar from "@/components/ward/Wardsidebar";
import WardHeader from "@/components/ward/Wardheader";
import VerificationRequiredModal from "@/components/panjayath/VerificationRequiredModal";
import VerificationPendingModal from "@/components/panjayath/VerificationPendingModal";
import axiosInstance from "@/api/axiosInstance";
import WardNotificationBell from "@/components/ward/WardNotificationBell";
import wardapi from "@/service/wardurls";
import { toast } from "react-toastify";
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

  const [user, setUser] = useState(null);

  const [isVerified, setIsVerified] =
    useState(false);

  const [verificationSubmitted, setVerificationSubmitted] =
    useState(false);


  const [verificationLoaded, setVerificationLoaded] =
    useState(false);


  const WS_BASE_URL =
    "ws://localhost:8000";





  useEffect(() => {

    const loadUser = async () => {

      try {

        const res =
          await wardapi.me();

        setUser(res.data);


      }

      catch (error) {

        navigate(
          "/login",
          { replace: true }
        );

      }

    };

    loadUser();

  }, []);


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

    let reconnectTimer = null

    const connectSocket = () => {


      socket =
        new WebSocket(
          `${WS_BASE_URL}/ws/notifications/?role=ward`
        )

      socket.onopen = () => {

        console.log(
          "WARD WS CONNECTED"
        )

      }

      socket.onmessage = (
        event
      ) => {


        console.log("🔥 NOTIFICATION RECEIVED", event.data)

        const data =
          JSON.parse(
            event.data
          )


        toast.info(
          data.message
        )
        
        console.log(
          "WARD NOTIFICATION",
          data
        )

        const newNotification = {

          id: data.id,

          title: data.title,

          message: data.message,

          notification_type: data.notification_type,

          complaint: data.complaint_id,

          complaint_id: data.complaint_id,

          extra_data: data.extra_data || {},

          is_read: false,

          created_at: new Date().toISOString()

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

      socket.onclose = (event) => {

        console.log(
          "WARD SOCKET CLOSED",
          event.code,
          event.reason
        )

        if (!event.wasClean) {

          reconnectTimer = setTimeout(() => {

            connectSocket()

          }, 3000)

        }

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

      clearTimeout(reconnectTimer)

      socket?.close()

    }

  }, [])

  useEffect(() => {
    const syncVerification = async () => {
      try {

        const res =
          await axiosInstance.get("/ward/profile/");

        const status =
          res.data.data.verification_status;

        setIsVerified(
          status === "APPROVED"
        );

        setVerificationSubmitted(
          status === "PENDING" ||
          status === "APPROVED"
        );

      } catch (err) {

        console.error(
          "Verification sync failed:",
          err
        );

      } finally {

        setVerificationLoaded(true);

      }
    };

    syncVerification();
  }, []);

  useEffect(() => {

    if (!verificationLoaded) return;

    if (
      user &&
      user.role !== "WARD"
    ) {
      navigate("/login", {
        replace: true
      });

      return;
    }

    const isProtectedRoute =
      PROTECTED_PATHS.some((path) =>
        location.pathname.startsWith(path)
      );

    if (!isVerified && isProtectedRoute) {

      if (verificationSubmitted) {

        setShowPendingModal(true);

      } else {

        setShowRequiredModal(true);

      }

      navigate(
        "/ward/profile",
        { replace: true }
      );
    }

  }, [
    verificationLoaded,
    location.pathname,
    user?.role,
    isVerified,
    verificationSubmitted,
    navigate
  ]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role !== "WARD") {
    return null;
  }

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