import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import VerificationRestrictionModal from "@/components/common/VerificationRestrictionModal";

/* ─── NAV ITEMS ───────────────────────────────────────── */
import {
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  Lock
} from "lucide-react";
const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/panchayath",
    icon: LayoutDashboard,
  },
  {
    label: "Ward Approvals",
    path: "/panchayath/approvals",
    icon: CheckCircle2,
  },
  {
    label: "Escalated Complaints",
    path: "/panchayath/escalations",
    icon: AlertTriangle,
  },
  {
    label: "Profile",
    path: "/panchayath/profile",
    free: true,
    icon: User,
  },
];

export default function PanchayathLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const storedVerified = localStorage.getItem("is_verified");
  const isVerified = storedVerified === "true";

  /* ─── Auto Redirect if Not Verified ─────────────────── */
  useEffect(() => {
    if (!isVerified && location.pathname !== "/panchayath/profile") {
      navigate("/panchayath/profile", { replace: true });
    }
  }, [isVerified, location.pathname]);

  const handleNavigation = (path, free = false) => {
    if (!isVerified && !free) {
      setShowModal(true);
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="font-body flex min-h-screen bg-[#f8faff] text-[#475569]">

      {/* ───────── SIDEBAR ───────── */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] flex flex-col z-30"
        style={{ boxShadow: "4px 0 24px rgba(26,86,219,.04)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-[#e2e8f0]">
          <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-1">
            SPIMS Portal
          </p>
          <h2
            className="font-black text-[#0f172a] leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
            }}
          >
            Panchayath Panel
          </h2>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <button
            onClick={() => navigate("/panchayath/profile")}
            className="mx-4 mt-4 px-4 py-3 rounded-xl text-left transition-colors duration-150 hover:bg-[#fef3c7]"
            style={{
              background: "#fffbeb",
              border: "1.5px solid #fcd34d",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#d97706",
                  animation: "pulse 2s infinite",
                }}
              />
              <p className="text-[0.7rem] font-bold text-[#d97706]">
                Verification Pending
              </p>
            </div>
            <p className="text-[0.65rem] text-[#92400e] mt-0.5 pl-[18px]">
              Complete your profile verification
            </p>
          </button>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 mt-4 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, path, free, icon: Icon }) => {
            const isActive = location.pathname === path;
            const locked = !isVerified && !free;

            return (
              <button
                key={path}
                onClick={() => handleNavigation(path, free)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? "#1a56db" : "transparent",
                  color: isActive ? "white" : locked ? "#cbd5e1" : "#475569",
                }}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{label}</span>

                {locked && <Lock size={14} style={{ opacity: 0.5 }} />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 mt-auto mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ color: "#dc2626" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#fef2f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-[#e2e8f0]">
          <p className="text-[0.65rem] text-[#94a3b8] leading-relaxed tracking-wide">
            SPIMS · Panchayath Level
            <br />
            Government of Kerala
          </p>
        </div>
      </aside>

      {/* ───────── MAIN CONTENT ───────── */}
      <main className="ml-64 flex-1 overflow-y-auto">
        <div className="max-w-[1140px] mx-auto py-16 px-10">
          <Outlet />
        </div>
      </main>

      {/* Verification Modal */}
      <VerificationRestrictionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}