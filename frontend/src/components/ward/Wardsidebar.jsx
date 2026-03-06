import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  MessageSquareWarning,
  UserCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/ward/dashboard", icon: LayoutDashboard, protected: true },
  { label: "Citizen Verifications", path: "/ward/citizen-verifications", icon: UserCheck, protected: true },
  { label: "Citizen List", path: "/ward/citizens", icon: Users, protected: true },
  { label: "All Complaints", path: "/ward/complaints", icon: MessageSquareWarning, protected: true },
  { label: "Profile", path: "/ward/profile", icon: UserCircle, protected: false },
];

export default function WardSidebar({
  isVerified,
  verificationSubmitted,
  onShowRequired,
  onShowPending,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, item) => {
    if (item.protected && !isVerified) {
      e.preventDefault();
      if (verificationSubmitted) {
        onShowPending();
      } else {
        onShowRequired();
      }
    }
  };

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${collapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-800 leading-tight truncate">SPIMS</p>
            <p className="text-xs text-gray-400 truncate">Ward Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const locked = item.protected && !isVerified;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className={() => {
                const isActive = location.pathname.startsWith(item.path);

                return `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${locked
                    ? "text-gray-400 cursor-pointer hover:bg-gray-50"
                    : isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`;
              }}
            >
              <span className="flex-shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {locked && <Lock className="w-3.5 h-3.5 text-gray-300" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>

      {/* User Info Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">Ward Officer</p>
              <p className="text-xs text-gray-400 truncate">
                {isVerified ? "✓ Verified" : "Pending Verification"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}