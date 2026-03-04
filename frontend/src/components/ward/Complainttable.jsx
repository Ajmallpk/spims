import StatusBadge from "@/components/ward/StatusBadge";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const CATEGORY_COLORS = {
  water:       "bg-blue-50 text-blue-700",
  road:        "bg-orange-50 text-orange-700",
  electricity: "bg-yellow-50 text-yellow-700",
  sanitation:  "bg-green-50 text-green-700",
  other:       "bg-gray-100 text-gray-600",
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[50, 35, 25, 20, 25, 12].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: w + "%" }} />
        </td>
      ))}
    </tr>
  );
}

export default function ComplaintTable({ complaints, isLoading, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Title", "Citizen", "Category", "Status", "Created Date", ""].map((col, i) => (
                <th key={i} className={"px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider " + (i === 5 ? "text-right" : "text-left")}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-400">No complaints found</p>
                    <p className="text-xs text-gray-300">Try adjusting your filters or search</p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((c) => {
                const catKey = (c.category ?? "other").toLowerCase();
                const catStyle = CATEGORY_COLORS[catKey] ?? CATEGORY_COLORS.other;
                return (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors duration-100 group">
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="font-medium text-gray-800 truncate">{c.title ?? "Untitled"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(c.citizen_name ?? c.citizen?.name ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="text-gray-700 text-sm truncate max-w-[120px]">
                          {c.citizen_name ?? c.citizen?.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={"inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold " + catStyle}>
                        {c.category ? c.category.charAt(0).toUpperCase() + c.category.slice(1) : "Other"}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => onView(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-all duration-150 group-hover:shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && complaints.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{complaints.length}</span> complaint{complaints.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}