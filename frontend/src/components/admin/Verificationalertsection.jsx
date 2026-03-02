import { useNavigate } from "react-router-dom";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import AlertCard from "@/components/admin/Alertcard";

const VerificationAlertSection = ({ verifications, isLoading }) => {
  const navigate = useNavigate();

  const topFive = verifications?.slice(0, 5) || [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Recent Verification Requests
            </h3>
            <p className="text-xs text-gray-400">Latest pending approvals</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/panchayath-verifications")}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-150"
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
        ) : topFive.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No pending verification requests</p>
          </div>
        ) : (
          topFive.map((item) => (
            <AlertCard
              key={item.id}
              variant="verification"
              title={item.panchayath_name || item.ward_name || "Unknown"}
              subtitle={`Submitted: ${
                item.submitted_date
                  ? new Date(item.submitted_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"
              }`}
              actionLabel="Review"
              onAction={() =>
                navigate(`/admin/panchayath-verifications/${item.id}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VerificationAlertSection;