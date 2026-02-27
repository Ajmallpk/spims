import { Routes, Route } from "react-router-dom"
import LandingPage from '@/pages/common/LandingPage'
import Authentication from '@/pages/common/Authentication'

//Block

// import RoleSelectionLanding from "@/pages/RoleSelectionLanding"
// import BlockLogin from "@/features/block/pages/BlockLogin"
// import BlockSignup from "@/features/block/pages/BlockSignup"

import BlockLayout from "@/features/block/layout/BlockLayout"
import BlockHome from "@/features/block/pages/BlockHome"
import BlockProfile from "@/features/block/pages/BlockProfile"
import BlockVerification from "@/features/block/pages/BlockVerification"
import PageLocked from "@/features/block/pages/PageLocked"
import PanchayathApprovals from "@/features/block/pages/PanchayathApprovals"
// import EscalatedComplaints from "@/features/block/pages/EscalatedComplaints"
// import PanchayathMonitoring from "@/features/block/pages/PanchayathMonitoring"
// import Communication from "@/features/block/pages/Communication"


// panchayath // 

/* ───────── PANCHAYATH MODULE ───────── */
import PanchayathLayout from "@/layouts/panjayath/PanchayathDashboardLayout";
import PanchayathHome from "@/pages/panjayath/PanchayathHome";
import PanchayathProfile from "@/pages/panjayath/PanchayathProfile";
import PanchayathVerification from "@/pages/panjayath/PanchayathVerification";
import WardApprovals from "@/pages/panjayath/WardApproval";
import EscalatedComplaints from "@/pages/panjayath/EscalatedComplaints";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard"
import BlockApprovals from "@/pages/admin/BlockApprovals"
import ListBlocks from "@/pages/admin/ListBlocks"
import Profile from "@/pages/admin/Profile"
import AdminDashboardLayout from "@/layouts/admin/AdminDashboardLayout"
import AdminLogin from "@/pages/auth/AdminLogin"
import AdminProtectedRoute from "@/routes/AdminProtectedRoute"


// citizen pages 

import AuthPage from "@/pages/citizen/AuthPage"



export default function App() {
  return (
    <Routes>

      <Route path="/citizen/registration" element={<AuthPage/>}/>

      {/* ───────── PUBLIC ROUTES ───────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Authentication />} />
      

      {/* ───────── BLOCK ROUTES ───────── */}
      <Route path="/block" element={<BlockLayout />}>

        <Route index element={<BlockHome />} />
        <Route path="profile" element={<BlockProfile />} />
        <Route path="blockverification" element={<BlockVerification />} />
        <Route path="approvals" element={<PanchayathApprovals />} />
        <Route path="escalations" element={<PageLocked />} />
        <Route path="monitoring" element={<PageLocked />} />
        <Route path="communication" element={<PageLocked />} />

      </Route>

      {/* ───────── PANCHAYATH ROUTES ───────── */}

      <Route path="/panchayath" element={<PanchayathLayout />}>
        <Route index element={<PanchayathHome />} />
        <Route path="profile" element={<PanchayathProfile />} />
        <Route path="verification" element={<PanchayathVerification />} />
        <Route path="approvals" element={<WardApprovals />} />
        <Route path="escalations" element={<EscalatedComplaints />} />
        <Route path="monitoring" element={<PageLocked />} />
        <Route path="communication" element={<PageLocked />} />
      </Route>
      

      {/* ───────── ADMIN ROUTES ───────── */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboardLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="approvals" element={<BlockApprovals />} />
        <Route path="blocks" element={<ListBlocks />} />
        <Route path="profile" element={<Profile />} />
      </Route>

    </Routes>
  )
}





