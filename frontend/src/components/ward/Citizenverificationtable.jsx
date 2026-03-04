import StatusBadge from "@/components/ward/Statusbadge";

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
    <tr className="border-b border-gray-50">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function CitizenVerificationTable({ requests, isLoading, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Citizen Name
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Submitted Date
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-400">No verification requests found</p>
                    <p className="text-xs text-gray-300">New requests will appear here once submitted</p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-50/40 transition-colors duration-100 group"
                >
                  {/* Citizen Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(req.full_name ?? req.name ?? "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[160px]">
                        {req.full_name ?? req.name ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">
                    {req.email ?? "—"}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(req.submitted_at ?? req.created_at)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={req.status} />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onView(req)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-all duration-150 group-hover:shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
            Showing <span className="font-semibold text-gray-600">{requests.length}</span> request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}