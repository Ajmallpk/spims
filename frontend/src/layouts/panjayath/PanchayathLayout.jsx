// layout/PanchayathLayout.jsx
// SPIMS – Smart Panchayath Issue Management System
// Root layout for all /panchayath/* routes.
//
// Responsibilities:
//   1. Reads role + is_verified + verification_submitted from localStorage.
//   2. Redirects non-PANCHAYATH roles to /login immediately.
//   3. If not verified → auto-show VerificationRequiredModal on mount.
//   4. Passes modal callbacks down to PanchayathSidebar.
//   5. Renders Header + Sidebar + <Outlet />.

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PanchayathHeader from "@/components/panjayath/PanchayathHeader";
import PanchayathSidebar from "@/components/panjayath/PanchayathSidebar";
import VerificationRequiredModal from "@/components/panjayath/VerificationRequiredModal";
import VerificationPendingModal from "@/components/panjayath/VerificationPendingModal";
import panchayathapi from "@/service/panchayathurls";


export default function PanchayathLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Read auth state from localStorage ────────────────────────────────────
  const [user, setUser] = useState(null)

  const [isVerified, setIsVerified] =
    useState(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // ── Mobile sidebar state ─────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)


  // ── Role guard ────────────────────────────────────────────────────────────

  const WS_BASE_URL =
    "ws://localhost:8000";


  useEffect(() => {

    const loadUser = async () => {

      try {

        const res =
          await panchayathapi.me()

        setUser(res.data)

        setIsVerified(
          res.data.is_verified
        )

      }

      catch (error) {

        navigate(
          "/login",
          { replace: true }
        )

      }

    }

    loadUser()

  }, [])







  useEffect(() => {
    if (
      user &&
      user.role !== "PANCHAYATH"
    ) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const syncVerification = async () => {
      try {
        const res = await panchayathapi.verificationStatus();
        const status = (res.data?.data?.status || "").toUpperCase();
        console.log("Verification API response:", res.data);
        const verified = status === "APPROVED";
        const submitted = ["PENDING", "APPROVED"].includes(status);

        // Update state
        setIsVerified(verified);
        setVerificationSubmitted(submitted);

        // Update localStorage


      } catch (err) {
        console.error("Verification sync failed:", err);
      }
    };

    if (
      user?.role === "PANCHAYATH"
    ) {
      syncVerification();
    }
  }, [user]);

  // ── Auto-show modal on mount if not verified ──────────────────────────────
  useEffect(() => {
    if (
      user?.role === "PANCHAYATH" &&
      isVerified === false
    ) {
      if (verificationSubmitted) {
        setShowPendingModal(true);
      } else {
        setShowRequiredModal(true);
      }
    } else {
      setShowPendingModal(false);
      setShowRequiredModal(false);
    }
  }, [isVerified, verificationSubmitted, user]);

  useEffect(() => {
    if (
      user?.role === "PANCHAYATH" &&
      isVerified &&
      location.pathname === "/panchayath"
    ) {
      navigate("/panchayath/dashboard", { replace: true });
    }
  }, [isVerified, user, location.pathname, navigate]);
  // useEffect(() => {
  //   if (role !== "PANCHAYATH") return;

  //   const justLoggedIn = localStorage.getItem("just_logged_in") === "true";

  //   if (isVerified && justLoggedIn) {
  //     localStorage.removeItem("just_logged_in"); // important
  //     navigate("/panchayath/dashboard", { replace: true });
  //   }

  // }, [isVerified, role, navigate]);





  useEffect(() => {

    const loadNotifications = async () => {

      try {

        const notif =

          await panchayathapi
            .getNotifications()

        const unread =

          await panchayathapi
            .getUnreadCount()

        setNotifications(

          notif.data
            .results
            .data

        )

        setUnreadCount(

          unread.data
            .data
            .unread_count

        )

      }

      catch (error) {

        console.log(error)

      }

    }

    loadNotifications()

  }, [])


  useEffect(() => {

    let socket = null

    const connectSocket = () => {



      socket =
        new WebSocket(
          `${WS_BASE_URL}/ws/notifications/?role=panchayath`
        )



      socket.onopen = () => {

        console.log(
          "PANCHAYATH WS CONNECTED"
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
          "PANCHAYATH NOTIFICATION:",
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
          "PANCHAYATH SOCKET CLOSED"
        )

        setTimeout(

          () => {

            connectSocket()

          },

          3000

        )

      }

      socket.onerror = (
        error
      ) => {

        console.log(
          "PANCHAYATH WS ERROR",
          error
        )

      }

    }

    connectSocket()

    return () => {

      socket?.close()

    }

  }, [])



  if (!user)
    return null;

  if (user.role !== "PANCHAYATH")
    return null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── Sidebar ── */}
      <PanchayathSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isVerified={isVerified}
        verificationSubmitted={verificationSubmitted}
        onShowRequiredModal={() => setShowRequiredModal(true)}
        onShowPendingModal={() => setShowPendingModal(true)}
      />

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <PanchayathHeader

          onMenuToggle={
            () => setSidebarOpen(
              o => !o
            )
          }

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

        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {showRequiredModal && (
        <VerificationRequiredModal onClose={() => setShowRequiredModal(false)} />
      )}
      {showPendingModal && (
        <VerificationPendingModal onClose={() => setShowPendingModal(false)} />
      )}
    </div>
  );
}