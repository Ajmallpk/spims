import StatusBadge from "@/components/admin/Statusbadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const VerificationTable = ({ requests, isLoading, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Head */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Panchayath Name",
                "Email",
                "Submitted Date",
                "Status",
                "Action",
              ].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg
                      className="w-10 h-10 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      No verification requests found
                    </p>
                    <p className="text-xs">
                      New requests will appear here when submitted
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-gray-50 transition-colors duration-100 group"
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                      {req.panchayath_name || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {req.email || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(req.submitted_at)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onView(req)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-150"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!isLoading && requests.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {requests.length}
            </span>{" "}
            request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationTable;