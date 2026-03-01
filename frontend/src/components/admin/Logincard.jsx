import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/Loginform";

const LoginCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Logo mark */}
        <div className="flex items-center justify-center w-14 h-14 bg-blue-700 rounded-2xl shadow-lg mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Admin Login
        </h1>

        {/* System subtitle */}
        <p className="text-xs text-gray-400 font-medium tracking-wide mt-1.5 leading-relaxed max-w-xs">
          SPIMS – Smart Panchayath Issue Management System
        </p>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-4" />
      </div>

      {/* Form */}
      <LoginForm />

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        Restricted access. Authorised administrators only.
        <br />
        Unauthorised access is prohibited.
      </p>
    </div>
  );
};

export default LoginCard;