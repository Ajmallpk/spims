import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import AlertCard from "@/components/admin/Alertcard";

const CriticalAlertSection = ({ alerts, isLoading }) => {
  const navigate = useNavigate();

  const getSeverity = (reportCount) => {
    if (reportCount >= 10) return "High";
    if (reportCount >= 5) return "Medium";
    return "Low";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-50 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Critical Alerts</h3>
            <p className="text-xs text-gray-400">
              High-priority issues requiring action
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/critical-alerts")}
          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors duration-150"
        >
          View All
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-gray-100 animate-pulse"
            />
          ))
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No critical alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const severity = alert.severity || getSeverity(alert.report_count);
            return (
              <AlertCard
                key={alert.id}
                variant="critical"
                title={alert.reported_user || alert.user || "Unknown User"}
                subtitle={`Reports: ${alert.report_count ?? 0} · ${
                  alert.issue_type || "Unspecified Issue"
                }`}
                badge={severity}
                actionLabel="Review"
                onAction={() => navigate(`/admin/critical-alerts/${alert.id}`)}
              />
            );
          })
        )}
      </div>

      {/* Red accent footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-500 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-gray-500 font-medium">High</span>
          </div>
          <span className="ml-auto text-xs text-gray-400">
            Severity levels
          </span>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertSection;