import { Routes, Route } from "react-router-dom"
import LandingPage from '@/pages/common/LandingPage'
import Authentication from '@/pages/common/Authentication'



/* ───────── ADMIN MODULE ───────── */
import AdminLayout from "@/layouts/admin/AdminLayout"
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import PanchayathVerificationRequests from "@/pages/admin/PanchayathVerificationRequests"
import PanchayathList from "@/pages/admin/PanchayathList"
import AdminWardList from "@/pages/admin/AdminWardlist"
import AdminProfile from "@/pages/admin/AdminProfile"
import PanchayathDetail from "./pages/admin/PanchayathDetail"





/* ───────── PANCHAYATH MODULE ───────── */
import PanchayathLayout from "@/layouts/panjayath/PanchayathLayout";

import PanchayathDashboard from "@/pages/panjayath/PanchayathDashboard";
import PanchayathProfile from "@/pages/panjayath/PanchayathProfile";
import WardVerificationRequests from "@/pages/panjayath/WardVerificationRequests";
import WardList from "@/pages/panjayath/WardList";

// Admin Pages



// citizen pages 

import AuthPage from "@/pages/citizen/AuthPage"



export default function App() {
  return (
    <Routes>

      <Route path="/citizen/registration" element={<AuthPage />} />

      // PUBLIC ROUTES FOR AUTHORITY //
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Authentication />} />

      // ADMIN LOGIN (NO LAYOUT) //
      <Route path="/admin/login" element={<AdminLogin />} />


  
      

      //PANCHAYATH ROUTES //

      <Route path="/panchayath" element={<PanchayathLayout />}>
        <Route index element={<PanchayathDashboard />} />
        <Route path="dashboard" element={<PanchayathDashboard />} />
        <Route path="profile" element={<PanchayathProfile />} />
        <Route path="ward-verifications" element={<WardVerificationRequests />} />
        <Route path="wards" element={<WardList />} />
        {/* <Route path="ward/:id" element={<WardDetail />} /> */}

      </Route>


      //ADMIN ROUTES//

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="panchayath-verifications" element={<PanchayathVerificationRequests />} />
        <Route path="panchayaths" element={<PanchayathList />} />
        <Route path="wards" element={<AdminWardList />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="/admin/panchayaths/:id" element={<PanchayathDetail />} />
      </Route>

    </Routes>
  )
}





