import {
  Building2,
  MapPin,
  MessageSquareWarning,
  Users,
  ClipboardList,
  GitBranch,
} from "lucide-react";
import StatCard from "@/components/admin/Statcard";

const statConfig = [
  {
    key: "total_panchayaths",
    label: "Total Panchayaths",
    icon: Building2,
    gradient: "bg-gradient-to-br from-blue-600 to-blue-800",
    iconBg: "bg-blue-500/50",
  },
  {
    key: "total_wards",
    label: "Total Wards",
    icon: MapPin,
    gradient: "bg-gradient-to-br from-violet-600 to-violet-800",
    iconBg: "bg-violet-500/50",
  },
  {
    key: "total_complaints",
    label: "Total Complaints",
    icon: MessageSquareWarning,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-700",
    iconBg: "bg-amber-500/50",
  },
  {
    key: "total_citizens",
    label: "Total Citizens",
    icon: Users,
    gradient: "bg-gradient-to-br from-teal-500 to-teal-700",
    iconBg: "bg-teal-500/50",
  },
  {
    key: "pending_panchayath_verifications",
    label: "Pending Panchayath Verifications",
    icon: ClipboardList,
    gradient: "bg-gradient-to-br from-rose-500 to-rose-700",
    iconBg: "bg-rose-500/50",
  },
  {
    key: "pending_ward_verifications",
    label: "Pending Ward Verifications",
    icon: GitBranch,
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-500/50",
  },
];

const StatsGrid = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {statConfig.map((config) => (
        <StatCard
          key={config.key}
          label={config.label}
          value={stats?.[config.key]}
          icon={config.icon}
          gradient={config.gradient}
          iconBg={config.iconBg}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default StatsGrid;