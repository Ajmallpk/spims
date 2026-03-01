const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const memberStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "active") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s === "inactive") return "bg-gray-100 text-gray-500 border-gray-200";
  if (s === "suspended") return "bg-red-100 text-red-600 border-red-200";
  return "bg-blue-100 text-blue-600 border-blue-200";
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${55 + (i % 3) * 20}%` }}
        />
      </td>
    ))}
  </tr>
);

/**
 * WardMemberTable
 * Props:
 *  - members: array
 *  - isLoading: boolean
 */
const WardMemberTable = ({ members, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700">Ward Members</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Registered citizens in this ward
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {["Member Name", "Email", "Status", "Joined Date"].map((col) => (
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
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : !members || members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg
                      className="w-8 h-8 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium">No members found</p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member, idx) => (
                <tr
                  key={member.id || idx}
                  className="hover:bg-gray-50 transition-colors duration-100 group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">
                          {(member.name || member.full_name || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                        {member.name || member.full_name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {member.email || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${memberStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status || "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(member.joined_date || member.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && members && members.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {members.length}
            </span>{" "}
            member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default WardMemberTable;