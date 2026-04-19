// import { useState, useEffect } from "react";
// import { adminapi } from "@/service/adminurls";
// import StatsGrid from "@/components/admin/Statsgrid";
// import VerificationAlertSection from "@/components/admin/Verificationalertsection";
// import CriticalAlertSection from "@/components/admin/Criticalalertsection";
// import toast from "react-hot-toast";
// import ComplaintStatusChart from "@/components/admin/ComplaintStatusChart";
// import { handleApiError } from "@/utils/handleApiError";


// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [verifications, setVerifications] = useState([]);
//   const [criticalAlerts, setCriticalAlerts] = useState([]);

//   const [loadingStats, setLoadingStats] = useState(true);
//   const [loadingVerifications, setLoadingVerifications] = useState(true);
//   const [loadingAlerts, setLoadingAlerts] = useState(true);

//   useEffect(() => {
//     const fetchDashboardStats = async () => {
//       try {
//         const { data } = await adminapi.dashboard()
//         setStats(data);
//       } catch (err) {
//         handleApiError(err, "Failed to load dashboard stats");
//       } finally {
//         setLoadingStats(false);
//       }
//     };

//     const fetchRecentVerifications = async () => {
//       try {
//         const { data } = await adminapi.recentVerification()
//         setVerifications(data);
//       } catch (err) {
//         toast.error("Error fetching recent verifications:", err);
//       } finally {
//         setLoadingVerifications(false);
//       }
//     };

//     const fetchCriticalAlerts = async () => {
//       try {
//         const { data } = await adminapi.criticalAlert()
//         setCriticalAlerts(data);
//       } catch (err) {
//         toast.error("Error fetching critical alerts:", err);
//       } finally {
//         setLoadingAlerts(false);
//       }
//     };

//     fetchDashboardStats();
//     fetchRecentVerifications();
//     fetchCriticalAlerts();
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Welcome Banner */}
//       <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-900 rounded-xl p-6 text-white shadow-md">
//         <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-1">
//           Smart Panchayath Issue Management System
//         </p>
//         <h2 className="text-2xl font-bold tracking-tight">
//           Welcome back, Administrator 👋
//         </h2>
//         <p className="text-gray-400 text-sm mt-1">
//           Here's an overview of the current system status and pending actions.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <StatsGrid stats={stats} isLoading={loadingStats} />
//       <ComplaintStatusChart data={stats?.complaint_status_chart} />

//       {/* Bottom Sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <VerificationAlertSection
//           verifications={verifications}
//           isLoading={loadingVerifications}
//         />
//         <CriticalAlertSection
//           alerts={criticalAlerts}
//           isLoading={loadingAlerts}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





import { useState, useEffect, useRef } from "react";
import { adminapi } from "@/service/adminurls";
import StatsGrid from "@/components/admin/Statsgrid";
import VerificationAlertSection from "@/components/admin/Verificationalertsection";
import CriticalAlertSection from "@/components/admin/Criticalalertsection";
import toast from "react-hot-toast";
import ComplaintStatusChart from "@/components/admin/ComplaintStatusChart";
import { handleApiError } from "@/utils/handleApiError";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVerifications, setLoadingVerifications] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const hasFetched = useRef(false); // ✅ added

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDashboardStats = async () => {
      try {
        const { data } = await adminapi.dashboard();
        setStats(data);
      } catch (err) {
        handleApiError(err, "Failed to load dashboard stats");
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchRecentVerifications = async () => {
      try {
        const { data } = await adminapi.recentVerification();
        setVerifications(data);
      } catch (err) {
        toast.error("Error fetching recent verifications");
      } finally {
        setLoadingVerifications(false);
      }
    };

    const fetchCriticalAlerts = async () => {
      try {
        const { data } = await adminapi.criticalAlert();
        setCriticalAlerts(data);
      } catch (err) {
        toast.error("Error fetching critical alerts");
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchDashboardStats();
    fetchRecentVerifications();
    fetchCriticalAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-900 rounded-xl p-6 text-white shadow-md">
        <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-1">
          Smart Panchayath Issue Management System
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, Administrator 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Here's an overview of the current system status and pending actions.
        </p>
      </div>

      <StatsGrid stats={stats} isLoading={loadingStats} />
      <ComplaintStatusChart data={stats?.complaint_status_chart} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VerificationAlertSection
          verifications={verifications}
          isLoading={loadingVerifications}
        />
        <CriticalAlertSection
          alerts={criticalAlerts}
          isLoading={loadingAlerts}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;