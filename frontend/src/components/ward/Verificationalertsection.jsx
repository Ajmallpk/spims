import { UserCheck, ArrowRight, Clock } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div>
          <div className="h-3.5 bg-gray-200 rounded w-32 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
      <div className="h-6 bg-gray-100 rounded-full w-16" />
    </div>
  );
}

export default function VerificationAlertSection({ verifications, isLoading, onViewAll }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Recent Citizen Verification Requests</h3>
            <p className="text-xs text-gray-400">Latest 5 requests</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : !Array.isArray(verifications) || verifications.length === 0 ? (
          <div className="py-10 text-center">
            <UserCheck className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No verification requests found</p>
          </div>
        ) : (
          Array.isArray(verifications) &&
          verifications.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(v.citizen_name ?? v.name ?? "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {v.citizen_name ?? v.name ?? "Unknown Citizen"}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    Submitted: {formatDate(v.submitted_at ?? v.created_at)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : v.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
              >
                {v.status
                  ? v.status.charAt(0).toUpperCase() + v.status.slice(1)
                  : "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}