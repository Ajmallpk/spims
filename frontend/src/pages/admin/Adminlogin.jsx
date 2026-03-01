import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "@/components/admin/Logincard";

const AdminLogin = () => {
  const navigate = useNavigate();

  // Redirect if already authenticated as ADMIN
  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");
    if (token && role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <LoginCard />
      </div>

      {/* Bottom branding */}
      <p className="mt-8 text-xs text-gray-500 text-center relative z-10">
        © {new Date().getFullYear()} SPIMS. Government of Kerala. All rights reserved.
      </p>
    </div>
  );
};

export default AdminLogin;