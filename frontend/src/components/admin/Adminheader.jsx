import { useLocation } from "react-router-dom";
import { Bell, ShieldCheck, Menu } from "lucide-react";

const routeTitleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/panchayath-verification": "Panchayath Verification Requests",
  "/admin/panchayaths": "Panchayath List",
  "/admin/wards": "Ward List",
  "/admin/profile": "Profile",
};

const AdminHeader = () => {
  const location = useLocation();

  const pageTitle =
    Object.entries(routeTitleMap).find(([key]) =>
      location.pathname.startsWith(key)
    )?.[1] || "Admin Panel";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            SPIMS
          </p>
          <h1 className="text-gray-800 text-xl font-bold leading-tight tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Role Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg">
          <ShieldCheck size={15} className="text-emerald-600" />
          <span className="text-xs font-bold tracking-widest uppercase">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;