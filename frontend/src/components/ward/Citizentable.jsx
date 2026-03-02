import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

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
      {[45, 60, 35, 30, 20, 15].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-3.5 bg-gray-100 rounded animate-pulse"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function CitizenTable({ citizens, isLoading, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Citizen Name", "Email", "Phone", "Joined Date", "Status", ""].map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                    i === 5 ? "text-right" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : citizens.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-400">No approved citizens found</p>
                    <p className="text-xs text-gray-300">Try adjusting your search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              citizens.map((citizen) => (
                <tr
                  key={citizen.id}
                  className="hover:bg-blue-50/40 transition-colors duration-100 group"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(citizen.full_name ?? citizen.name ?? "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[160px]">
                        {citizen.full_name ?? citizen.name ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">
                    {citizen.email ?? "—"}
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {citizen.phone ?? citizen.mobile ?? "—"}
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(citizen.joined_at ?? citizen.created_at)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={citizen.status ?? "approved"} />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onView(citizen.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                        text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg
                        transition-all duration-150 group-hover:shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
      {!isLoading && citizens.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{citizens.length}</span> citizen{citizens.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}