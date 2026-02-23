// import { useState } from "react";
// import Sidebar from "@/components/admin/Sidebar";
// import Topbar from "@/components/admin/Topbar";
// import { Outlet, useLocation, useNavigate } from "react-router-dom"

// const pageMeta = {
//     dashboard: { title: "Dashboard", subtitle: "Smart Panchayath Issue Overview" },
//     approvals: { title: "Block Authority Approvals", subtitle: "Pending & Processed Approval Requests" },
//     blocks: { title: "List Blocks", subtitle: "All Registered Block Authorities" },
//     profile: { title: "Profile", subtitle: "Account Settings & Preferences" },
// };

// export default function AdminDashboardLayout() {
//     const location = useLocation()
//     const navigate = useNavigate()

//     const activePage = location.pathname.split("/")[2] || "dashboard"
//     const meta = pageMeta[activePage] || pageMeta.dashboard;
//     const handleNavigate = (page) => {
//         navigate(page === "dashboard" ? "/admin" : `/admin/${page}`)
//     }

//     return (
//         <div
//             className="min-h-screen flex"
//             style={{
//                 background: "radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.06) 0%, transparent 60%), #070d1b",
//             }}
//         >
//             {/* Sidebar */}
//             <Sidebar activeItem={activePage} onNavigate={handleNavigate} />

//             {/* Main content area */}
//             <div className="flex flex-col flex-1 min-h-screen" style={{ marginLeft: "260px" }}>
//                 {/* Topbar */}
//                 <Topbar title={meta.title} subtitle={meta.subtitle} />

//                 {/* Page content */}
//                 <main
//                     className="flex-1 overflow-auto p-8"
//                     style={{
//                         background: "transparent",
//                     }}
//                 >
//                     {/* Decorative grid lines */}
//                     <div
//                         className="fixed inset-0 pointer-events-none"
//                         style={{
//                             backgroundImage:
//                                 "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
//                             backgroundSize: "60px 60px",
//                             marginLeft: "260px",
//                         }}
//                     />

//                     {/* Rendered children */}
//                     <div className="relative z-10"><Outlet /></div>
//                 </main>
//             </div>
//         </div>
//     );
// }

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const pageMeta = {
  dashboard: { title: "Dashboard", subtitle: "Smart Panchayath Issue Overview" },
  approvals: { title: "Block Authority Approvals", subtitle: "Pending & Processed Approval Requests" },
  blocks: { title: "List Blocks", subtitle: "All Registered Block Authorities" },
  profile: { title: "Profile", subtitle: "Account Settings & Preferences" },
};

export default function AdminDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activePage = location.pathname.split("/")[2] || "dashboard";
  const meta = pageMeta[activePage] || pageMeta.dashboard;

  const handleNavigate = (page) => {
    navigate(page === "dashboard" ? "/admin" : `/admin/${page}`);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.06) 0%, transparent 60%), #070d1b",
      }}
    >
      {/* Fixed Sidebar */}
      <Sidebar activeItem={activePage} onNavigate={handleNavigate} />

      {/* Main wrapper */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
        }}
      >
        {/* Topbar */}
        <Topbar title={meta.title} subtitle={meta.subtitle} />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8 relative">

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
}