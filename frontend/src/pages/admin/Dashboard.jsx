import AdminDashboardLayout from "@/layouts/admin/AdminDashboardLayout";
import StatsCard from "@/components/admin/StatsCard";
import VerificationPanel from "@/components/admin/VerificationPanel";
import SystemHealthPanel from "@/components/admin/SystemHealthPanel";
import CriticalAlertsPanel from "@/components/admin/CriticalAlertsPanel";
import { useEffect,useState } from "react";
import axios from "@/api/axiosInstance";



// ─── Dashboard Content (the actual page body) ────────────────────
function DashboardContent() {
  const [stats,setStats] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const fetchDashboard = async ()=>{
      try{
        const res = await axios.get("/api/admin/dashboard/");
        setStats(res.data)
      }catch(err){
        console.error("Dashboard API error:",err);
      }finally{
        setLoading(false)
      }
    }

    fetchDashboard()
  },[])
  if (loading){
    return <div className="text-white p-10">Loading Dashboard...</div>
  }

const statsData = [
  {
    title:"Total Blocks",
    value:stats?.total_blocks || 0,
    highlightColor : "blue"
  },
  {
    title:"Active Blocks",
    value:stats?.active_blocks || 0,
    highlightColor : "blue"
  },
  {
    title:"Suspended Blocks",
    value:stats?.suspended_blocks || 0,
    highlightColor : "blue"
  },
  {
    title:"Pending Verifications",
    value:stats?.pending_block_verifications || 0,
    highlightColor : "blue"
  }
]

  return (
    <div className="flex flex-col gap-7">

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Smart Panchayath Public Issue Management System — Central Control
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-3">
          System Overview
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Panels Row */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-mono mb-3">
          Operations & Intelligence
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <VerificationPanel />
          <SystemHealthPanel />
          <CriticalAlertsPanel />
        </div>
      </section>

    </div>
  );
}

// ─── Page Export (wraps content inside the layout) ───────────────
export default function DashboardPage() {
  return <DashboardContent />;
}