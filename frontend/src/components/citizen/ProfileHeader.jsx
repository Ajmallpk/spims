// citizen/components/ProfileHeader.jsx
import { ShieldCheck, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/citizen/StatusBadge";

function Skeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-44" />
          <div className="h-3.5 bg-gray-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ProfileHeader({ profile, verificationStatus, loading }) {
  const navigate = useNavigate();
  if (loading) return <Skeleton />;

  const name = profile?.full_name || profile?.name || "Citizen";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatar = profile?.profile_image || profile?.avatar;

  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left: avatar + name + badge */}
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100 shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{name}</h1>
              {verificationStatus === "APPROVED" && (
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <div className="mt-1.5">
              <StatusBadge status={verificationStatus || "NOT_SUBMITTED"} size="md" />
            </div>
          </div>
        </div>

        {/* Right: edit verification button */}
        <button
          onClick={() => navigate("/citizen/verification")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <Edit3 className="w-4 h-4" />
          Manage Verification
        </button>
      </div>
    </div>
  );
}