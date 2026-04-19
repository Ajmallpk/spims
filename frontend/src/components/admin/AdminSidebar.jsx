import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  MapPin,
  UserCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Panchayath Verification",
    path: "/admin/panchayath-verifications",
    icon: ClipboardCheck,
  },
  {
    label: "Panchayath List",
    path: "/admin/panchayaths",
    icon: Building2,
  },
  {
    label: "Ward List",
    path: "/admin/wards",
    icon: MapPin,
  },
  {
    label: "Citizen List",
    path: "/admin/citizens",
    icon: Users,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: UserCircle,
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout/");
    } catch (err) {
      console.log("Logout error", err);
    }

    localStorage.removeItem("role");
    localStorage.removeItem("status");

    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-gray-900 flex flex-col h-full shadow-2xl flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-lg shadow-lg">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold tracking-wide leading-tight">
            SPIMS
          </p>
          <p className="text-gray-400 text-xs tracking-widest uppercase">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                }`}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 transition-colors duration-200 ${isActive
                  ? "text-emerald-400"
                  : "text-gray-500 group-hover:text-gray-300"
                  }`}
                size={18}
              />
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-red-600 hover:bg-red-700">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <button onClick={handleLogout} className="text-xs font-semibold text-gray-200 truncate ">
              Logout
            </button>
            <button className="text-xs text-gray-500 truncate"></button>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;