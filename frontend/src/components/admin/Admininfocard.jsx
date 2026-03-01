import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import RoleBadge from "@/components/admin/Rolebadge";
import StatusBadge from "@/components/admin/StatusBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoRow = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-start gap-3.5 py-3.5 border-b border-gray-100 last:border-0">
    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {children ? (
        children
      ) : (
        <p className="text-sm font-semibold text-gray-800 break-words">
          {value || "—"}
        </p>
      )}
    </div>
  </div>
);

const SkeletonInfoCard = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="bg-gray-200 h-32 w-full" />
    <div className="px-6 py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3.5 py-3.5 border-b border-gray-100 last:border-0"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-14 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminInfoCard = ({ profile, isLoading }) => {
  if (isLoading) return <SkeletonInfoCard />;

  const initials = (profile?.full_name || profile?.name || "AD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/30 border-2 border-indigo-400/50 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-extrabold text-white tracking-wide">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              {profile?.full_name || profile?.name || "Administrator"}
            </h2>
            <p className="text-gray-400 text-sm truncate mt-0.5">
              {profile?.email || "—"}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <RoleBadge role={profile?.role || "ADMIN"} />
              <StatusBadge status={profile?.status || "Active"} />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-2">
        <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
        <InfoRow icon={Phone} label="Phone Number" value={profile?.phone} />
        <InfoRow icon={ShieldCheck} label="Role">
          <RoleBadge role={profile?.role || "ADMIN"} />
        </InfoRow>
        <InfoRow icon={User} label="Account Status">
          <StatusBadge status={profile?.status || "Active"} />
        </InfoRow>
        <InfoRow
          icon={Calendar}
          label="Date Joined"
          value={formatDate(profile?.date_joined || profile?.created_at)}
        />
        <InfoRow
          icon={Clock}
          label="Last Login"
          value={formatDateTime(profile?.last_login)}
        />
      </div>
    </div>
  );
};

export default AdminInfoCard;