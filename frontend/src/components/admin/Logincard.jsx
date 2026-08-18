// import { ShieldCheck } from "lucide-react";
// import LoginForm from "@/components/admin/Loginform";

// const LoginCard = () => {
//   return (
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
//       {/* Brand Header */}
//       <div className="flex flex-col items-center text-center mb-8">
//         {/* Logo mark */}
//         <div className="flex items-center justify-center w-14 h-14 bg-blue-700 rounded-2xl shadow-lg mb-4">
//           <ShieldCheck className="w-7 h-7 text-white" />
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
//           Admin Login
//         </h1>

//         {/* System subtitle */}
//         <p className="text-xs text-gray-400 font-medium tracking-wide mt-1.5 leading-relaxed max-w-xs">
//           SPIMS – Smart Panchayath Issue Management System
//         </p>

//         {/* Divider */}
//         <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-4" />
//       </div>

//       {/* Form */}
//       <LoginForm />

//       {/* Footer note */}
//       <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
//         Restricted access. Authorised administrators only.
//         <br />
//         Unauthorised access is prohibited.
//       </p>
//     </div>
//   );
// };

// export default LoginCard;






import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/Loginform";

const LoginCard = () => {
  return (
    <div className="relative bg-balck rounded-3xl shadow-2xl shadow-black/30 w-full max-w-md overflow-hidden">
      {/* Institutional accent bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-blue-900" />
        <div className="flex-1 bg-blue-900" />
        <div className="flex-1 bg-blue-900" />
      </div>

      <div className="p-8 sm:p-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Seal emblem */}
          <div className="relative flex items-center justify-center w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200" />
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-900 rounded-full shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 tracking-[0.2em] uppercase mb-1.5">
            Secure Access
          </span>

          <h1 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Admin Login
          </h1>

          <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed max-w-xs">
            SPIMS – Smart Panchayath Issue Management System
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-400 mt-7 pt-5 border-t border-slate-100 leading-relaxed">
          Restricted access · Authorised administrators only
          <br />
          Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default LoginCard;