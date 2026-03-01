import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/admin/Statusbadge";

const formatNumber = (n) =>
  n !== undefined && n !== null ? n.toLocaleString() : "—";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${55 + (i % 3) * 15}%` }}
        />
      </td>
    ))}
  </tr>
);

const WardTable = ({ wards, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Ward Name",
                "Panchayath",
                "Total Users",
                "Total Complaints",
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

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
            ) : wards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-sm font-medium">No wards found</p>
                    <p className="text-xs">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              wards.map((ward) => (
                <tr
                  key={ward.id}
                  className="hover:bg-gray-50 transition-colors duration-100 group"
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                      {ward.ward_name || ward.name || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {ward.panchayath_name || ward.panchayath || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">
                    {formatNumber(ward.total_users)}
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">
                    {formatNumber(ward.total_complaints)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={ward.status || "Approved"} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/admin/wards/${ward.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-150"
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

      {!isLoading && wards.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">{wards.length}</span>{" "}
            ward{wards.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default WardTable;