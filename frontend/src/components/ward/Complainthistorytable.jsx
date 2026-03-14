import StatusBadge from "@/components/ward/StatusBadge";
import { useNavigate } from "react-router-dom";
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
      {[55, 30, 20, 25, 15].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function ComplaintHistoryTable({ complaints, isLoading }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Complaint History</h3>
          <p className="text-xs text-gray-400 mt-0.5">All complaints raised by this citizen</p>
        </div>
        {!isLoading && complaints?.length > 0 && (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
            {complaints.length} total
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Complaint Title", "Category", "Status", "Created Date", ""].map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : !complaints || complaints.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No complaints filed by this citizen</p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => navigate(`/ward/complaints/${complaint.id}`)}
                  className="cursor-pointer hover:bg-blue-50/30 transition-colors duration-100 group"
                >
                  {/* Title */}
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-800 line-clamp-1 max-w-[220px] block">
                      {complaint.title ?? "Untitled Complaint"}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                      {complaint.category ?? "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                    {formatDate(complaint.created_at)}
                  </td>

                  {/* Future View button placeholder */}
                  <td className="px-5 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                        text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg
                        transition-colors opacity-0 group-hover:opacity-100"
                      title="View complaint"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}