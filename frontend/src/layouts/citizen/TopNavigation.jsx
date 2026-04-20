import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import citizenapi from "@/service/citizenurls";




const navItems = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: "explore",
    label: "Explore Issues",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("NOT_VERIFIED");


  useEffect(() => {

    const fetchVerificationStatus = async () => {
      try {

        const res = await citizenapi.getVerificationStatus();
        const data = res.data.data

        if (!data.submitted) {
          setVerificationStatus("NOT_VERIFIED");
        }
        else if (data.status === "PENDING") {
          setVerificationStatus("PENDING");
        }
        else if (data.status === "APPROVED") {
          setVerificationStatus("APPROVED");
        }

      } catch (error) {
        console.error("Failed to fetch verification status", error);
      }

    };

    fetchVerificationStatus();

  }, []);

  return (
    <div className="sticky top-0 z-40 pt-4 pb-2 bg-gray-100">
      {/* Top bar with logo + search + user */}
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between mb-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-sm tracking-wide">SPIMS</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-6">
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search wards, issues, authorities..."
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none flex-1"
            />
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Avatar alt="Citizen User" size="sm" />
        </div>
      </div>

      {/* Floating pill nav */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-full shadow-md px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id === "home" ? "/citizen" : `/citizen/${item.id}`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === (item.id === "home" ? "/citizen" : `/citizen/${item.id}`)
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Verified badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border
  ${verificationStatus === "APPROVED"
                ? "bg-teal-50 text-teal-700 border-teal-100"
                : "bg-red-50 text-red-700 border-red-100"
              }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            {verificationStatus === "APPROVED"
              ? "Verified Citizen"
              : "Not Verified"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;