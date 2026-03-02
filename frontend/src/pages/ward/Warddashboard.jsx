import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsGrid from "../components/StatsGrid";
import VerificationAlertSection from "../components/VerificationAlertSection";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function WardDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

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
      const res = await fetch(`${API_BASE}/api/ward/dashboard-stats/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentVerifications = async () => {
    try {
      setIsLoadingVerifications(true);
      const res = await fetch(`${API_BASE}/api/ward/recent-citizen-verifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVerifications(Array.isArray(data) ? data.slice(0, 5) : data.results?.slice(0, 5) ?? []);
    } catch (err) {
      console.error("Failed to fetch recent verifications:", err);
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