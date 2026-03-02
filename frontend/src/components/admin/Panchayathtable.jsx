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

const PanchayathTable = ({ panchayaths, isLoading, onSuspend, onActivate }) => {
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
                <tr key={p.id}
                  onClick={() => navigate(`/admin/panchayaths/${p.id}`)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors duration-100 group">
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
                  <td className="px-5 py-4 space-x-2">
                    {p.status === "ACTIVE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSuspend(p.id);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-150"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();  
                          onActivate(p.id);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-150"
                      >
                        Activate
                      </button>
                    )}
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