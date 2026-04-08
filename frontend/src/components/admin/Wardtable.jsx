import { useNavigate } from "react-router-dom";

const formatNumber = (n) => (n !== undefined && n !== null ? n.toLocaleString() : "—");

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-200 rounded" style={{ width: `${55 + (i % 3) * 15}%` }} />
      </td>
    ))}
  </tr>
);

const WardTable = ({ wards, isLoading, onSuspend, onActivate }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Section header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700">Wards</h3>
        <p className="text-xs text-gray-400 mt-0.5">All wards under this Panchayath</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Ward Name",
                "Panchayath",
                "Officer",
                "Total Users",
                "Total Complaints",
                "Pending",
                "Status",   
                "Action"
              ].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : !wards || wards.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm font-medium">No wards found</p>
                  </div>
                </td>
              </tr>
            ) : (
              wards.map((ward) => (
                <tr key={ward.id} className="hover:bg-gray-50 transition-colors duration-100 group">

                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                      {ward.ward_name || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {ward.panchayath_name || "—"}
                  </td>

                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {ward.officer_name || "—"}
                  </td>

                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {formatNumber(ward.total_users)}
                  </td>

                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {formatNumber(ward.total_complaints)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ward.pending_complaints > 0
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {formatNumber(ward.pending_complaints)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ward.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {ward.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 flex gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/admin/wards/${ward.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-150"
                    >
                      View
                    </button>

                    {/* Suspend / Activate Button */}
                    {ward.status === "ACTIVE" ? (
                      <button
                        onClick={() => onSuspend(ward.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-150"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(ward.id)}
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
    </div>
  );
};

export default WardTable;