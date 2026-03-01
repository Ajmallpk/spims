import {
  Users,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import DetailStatCard from "@/components/admin/Detailstatcard";

const statConfig = [
  {
    key: "total_users",
    label: "Total Users",
    icon: Users,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
  },
  {
    key: "total_complaints",
    label: "Total Complaints",
    icon: MessageSquareWarning,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    key: "pending_complaints",
    label: "Pending Complaints",
    icon: Clock,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    key: "resolved_complaints",
    label: "Resolved Complaints",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    key: "escalated_complaints",
    label: "Escalated Complaints",
    icon: TrendingUp,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
];

const WardStatsGrid = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {statConfig.map((config) => (
        <DetailStatCard
          key={config.key}
          label={config.label}
          value={stats?.[config.key]}
          icon={config.icon}
          iconColor={config.iconColor}
          iconBg={config.iconBg}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default WardStatsGrid;