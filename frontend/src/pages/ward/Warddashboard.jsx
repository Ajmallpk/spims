import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsGrid from "@/components/ward/Statsgrid";
import VerificationAlertSection from "@/components/ward/Verificationalertsection";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";


export default function WardDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentVerifications();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const res = await wardapi.dashboard();
      setStats(res.data.data);
    } catch (err) {
      // interceptor will show toast
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentVerifications = async () => {
    try {
      setIsLoadingVerifications(true);
      const res = await wardapi.recentVerifications();
      setVerifications(res.data.data ?? []);
    } catch (err) {
      // interceptor will show toast
    } finally {
      setIsLoadingVerifications(false);
    }
  };

  const statsData = [
    {
      label: "Total Complaints",
      value: stats?.total_complaints ?? 0,
      color: "blue",
      icon: "📋",
    },
    {
      label: "Pending Complaints",
      value: stats?.pending_complaints ?? 0,
      color: "amber",
      icon: "⏳",
    },
    {
      label: "Resolved Complaints",
      value: stats?.resolved_complaints ?? 0,
      color: "green",
      icon: "✅",
    },
    {
      label: "Pending Citizen Verifications",
      value: stats?.pending_citizen_verifications ?? 0,
      color: "purple",
      icon: "👤",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Welcome back, Ward Officer 👋</h2>
        <p className="text-blue-100 text-sm mt-1">
          Here's what's happening in your ward today.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={statsData} isLoading={isLoadingStats} />

      {/* Verification Alert Section */}
      <VerificationAlertSection
        verifications={verifications}
        isLoading={isLoadingVerifications}
        onViewAll={() => navigate("/ward/citizen-verifications")}
      />
    </div>
  );
}