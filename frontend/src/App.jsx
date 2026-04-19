import { Routes, Route } from "react-router-dom"
import LandingPage from '@/pages/common/LandingPage'
import Authentication from '@/pages/common/Authentication'
import VerificationGuard from "@/components/panjayath/VerificationGuard"
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/routes/ProtectedRoute";
import CitizenProtectedRoute from "./routes/CitizenProtectedRouters";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import SuspendedModal from "@/components/common/SuspendedModal";
import { useEffect } from "react";
import { useSuspension } from "@/context/SuspensionContext";
import axiosInstance from "@/api/axiosInstance";




/* ───────── ADMIN MODULE ───────── */
import AdminLayout from "@/layouts/admin/AdminLayout"
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import PanchayathVerificationRequests from "@/pages/admin/PanchayathVerificationRequests"
import PanchayathList from "@/pages/admin/PanchayathList"
import AdminWardList from "@/pages/admin/AdminWardlist"
import AdminProfile from "@/pages/admin/AdminProfile"
import PanchayathDetail from "./pages/admin/PanchayathDetail"
import WardDetailsPage from "./pages/admin/Warddetailsout";
import PanchayathDetails from "./pages/admin/Panchayathdetails";
import AdminCitizenList from "@/pages/admin/CitizenList";
import AdminCitizenDetail from "@/pages/admin/CitizenDetail";




/* ───────── PANCHAYATH MODULE ───────── */
import PanchayathLayout from "@/layouts/panjayath/PanchayathLayout";
import PanchayathDashboard from "@/pages/panjayath/PanchayathDashboard";
import PanchayathProfile from "@/pages/panjayath/PanchayathProfile";
import WardVerificationRequests from "@/pages/panjayath/WardVerificationRequests";
import WardList from "@/pages/panjayath/WardList";
import WardDetail from "@/pages/panjayath/WardDetail";
import PanchayathEmailChangeConfirm from "./components/panjayath/PanchayathEmailChangeConfirm";
import EscalatedComplaints from "./pages/panjayath/EscalatedComplaints";
import PanchayathComplaintDetail from "./pages/panjayath/PanchayathComplaintDetail";


/* ───────── WARD MODULE ───────── */
import WardLayout from "@/layouts/ward/WardLayout";
import WardDashboard from "@/pages/ward/WardDashboard";
import WardProfile from "@/pages/ward/WardProfile";
import CitizenVerificationRequests from "@/pages/ward/CitizenVerificationRequests";
import CitizenList from "@/pages/ward/CitizenList";
import CitizenDetails from "@/pages/ward/CitizenDetails";
import ComplaintList from "@/pages/ward/ComplaintList";
import ComplaintViewer from "./components/ward/ComplaintViewer";
import WardEmailChangeConfirm from "./components/ward/WardEmailChangeConfirm";
import ComplaintDetails from "./pages/ward/Complaintdetails";
import ReassignedComplaints from "@/pages/ward/ReassignedComplaints";
import ReassignedComplaintDetail from "@/pages/ward/ReassignedComplaintDetail";




// citizen pages 
import AuthPage from "@/pages/citizen/AuthPage"
import CitizenLayout from "@/layouts/citizen/CitizenLayout"
import CitizenHome from "@/pages/citizen/Home"
import CitizenProfile from "@/pages/citizen/Profile"
import CitizenVerification from "@/pages/citizen/Verification"
import Messages from "./pages/citizen/Messages";
import EmailChangeConfirm from "./components/citizen/EmailChangeConfirm";
import ForgotPassword from "@/pages/citizen/ForgotPassword"
import VerifyResetOTP from "@/pages/citizen/VerifyResetOTP"
import ResetPassword from "@/pages/citizen/ResetPassword"



export default function App() {

  const { setIsSuspended } = useSuspension();

  // useEffect(() => {
  //   registerSuspensionSetter(setIsSuspended);
  // }, [setIsSuspended]);


  useEffect(() => {
    axiosInstance.get("auth/csrf/");
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <SuspendedModal />
      <Routes>


      // CITIZEN LOGIN (NO LAYOUT) //
        <Route path="/citizen/registration" element={<AuthPage />} />

        <Route path="/citizen/forgot-password" element={<ForgotPassword />} />

        <Route path="/citizen/verify-reset-otp" element={<VerifyResetOTP />} />

        <Route path="/citizen/reset-password" element={<ResetPassword />} />



      // PUBLIC ROUTES FOR AUTHORITY //
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Authentication />} />



      // ADMIN LOGIN (NO LAYOUT) //
        <Route path="/admin/login" element={<AdminLogin />} />


        <Route path="/email-change-confirm/:token" element={<EmailChangeConfirm />} />

        <Route path="/ward/email-change-confirm/:token" element={<WardEmailChangeConfirm />} />

        <Route
          path="/panchayath/email-change-confirm/:token"
          element={<PanchayathEmailChangeConfirm />}
        />


        {/* ───────── CITIZEN ROUTES ───────── */}

        <Route
          path="/citizen"
          element={
            <CitizenProtectedRoute>
              <CitizenLayout />
            </CitizenProtectedRoute>
          }
        >

          <Route index element={<CitizenHome />} />

          <Route path="home" element={<CitizenHome />} />

          {/* <Route path="explore" element={<ExploreIssues />} /> */}

          {/* <Route path="notifications" element={<Notifications />} /> */}

          <Route path="messages" element={<Messages />} />

          {/* <Route path="insights" element={<Insights />} /> */}

          <Route path="profile" element={<CitizenProfile />} />

          <Route path="verification" element={<CitizenVerification />} />


        </Route>

        {/* ───────── CITIZEN ROUTES ───────── */}






        {/* ───────── PANCHAYATH ROUTES ───────── */}

        <Route
          path="/panchayath"
          element={
            <ProtectedRoute allowedRoles={["PANCHAYATH"]}>
              <PanchayathLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <VerificationGuard>
                <PanchayathDashboard />
              </VerificationGuard>
            }
          />

          <Route
            path="dashboard"
            element={
              <VerificationGuard>
                <PanchayathDashboard />
              </VerificationGuard>
            }
          />

          <Route path="profile" element={<PanchayathProfile />} />

          <Route
            path="ward-verifications"
            element={
              <VerificationGuard>
                <WardVerificationRequests />
              </VerificationGuard>
            }
          />

          <Route
            path="wards"
            element={
              <VerificationGuard>
                <WardList />
              </VerificationGuard>
            }
          />

          <Route
            path="ward/:id"
            element={
              <VerificationGuard>
                <WardDetail />
              </VerificationGuard>
            }
          />

          <Route
            path="escalated-complaints"
            element={
              <VerificationGuard>
                <EscalatedComplaints />
              </VerificationGuard>
            }
          />

          <Route
            path="complaints/:id"
            element={
              <VerificationGuard>
                <PanchayathComplaintDetail />
              </VerificationGuard>
            }
          />

        </Route>

        {/* ───────── PANCHAYATH ROUTES ───────── */}





        {/* ───────── ADMIN ROUTES ───────── */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="panchayath-verifications" element={<PanchayathVerificationRequests />} />
          <Route path="panchayaths" element={<PanchayathList />} />
          <Route path="wards" element={<AdminWardList />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="panchayaths/:id" element={<PanchayathDetails />} />
          <Route path="wards/:id" element={<WardDetailsPage />} />
          <Route path="citizens" element={<AdminCitizenList />} />
          <Route path="citizens/:id" element={<AdminCitizenDetail />} />
        </Route>

        {/* ───────── ADMIN ROUTES ───────── */}




        {/* ───────── WARD ROUTES ───────── */}

        <Route
          path="/ward"
          element={
            <ProtectedRoute allowedRoles={["WARD"]}>
              <WardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WardDashboard />} />
          <Route path="dashboard" element={<WardDashboard />} />
          <Route path="profile" element={<WardProfile />} />
          <Route path="citizen-verifications" element={<CitizenVerificationRequests />} />
          <Route path="citizens" element={<CitizenList />} />
          <Route path="citizens/:id" element={<CitizenDetails />} />

          {/* Complaint module (UI ready, backend next week) */}
          <Route path="complaints" element={<ComplaintList />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          <Route
            path="complaint-view/:id"
            element={<ComplaintViewer />}
          />

          <Route path="reassigned-complaints" element={<ReassignedComplaints />} />
          <Route path="reassigned-complaints/:id" element={<ReassignedComplaintDetail />} />

        </Route>


        {/* ───────── WARD ROUTES ───────── */}

      </Routes>
    </>
  )
}





