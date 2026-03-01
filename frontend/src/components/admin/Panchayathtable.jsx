import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/admin/Statusbadge";

const formatNumber = (n) => (n !== undefined && n !== null ? n.toLocaleString() : "—");

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-200 rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />
      </td>
    ))}
  </tr>
);

const PanchayathTable = ({ panchayaths, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Panchayath Name", "Email", "Total Wards", "Total Complaints", "Status", "Action"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : panchayaths.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm font-medium">No panchayaths found</p>
                    <p className="text-xs">Try adjusting your search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              panchayaths.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-100 group">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                      {p.panchayath_name || p.name || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.email || "—"}</td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{formatNumber(p.total_wards)}</td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{formatNumber(p.total_complaints)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status || "Approved"} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/admin/panchayaths/${p.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-150"
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

      {!isLoading && panchayaths.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">{panchayaths.length}</span>{" "}
            panchayath{panchayaths.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default PanchayathTable;