import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Users,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import DetailStatCard from "@/components/admin/Detailstatcard";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AuthorityDetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800 font-semibold mt-0.5 break-words">{value || "—"}</p>
    </div>
  </div>
);

const severityColor = (severity) => {
  const s = severity?.toLowerCase();
  if (s === "high") return "bg-red-100 text-red-700";
  if (s === "medium") return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
};

const statusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "resolved") return "bg-emerald-100 text-emerald-700";
  if (s === "in_progress" || s === "in progress") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
};

const WardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get(
          `/api/admin/ward/${id}/details/`,
          { headers: getAuthHeaders() }
        );
        setData(res);
      } catch (err) {
        console.error("Error fetching ward details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const authority = data?.ward_authority || data?.authority || {};
  const complaints = data?.complaints || [];

  const statCards = [
    { key: "total_users", label: "Total Users", icon: Users, iconColor: "text-violet-500", iconBg: "bg-violet-50" },
    { key: "total_complaints", label: "Total Complaints", icon: MessageSquareWarning, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
    { key: "pending_complaints", label: "Pending Complaints", icon: Clock, iconColor: "text-orange-500", iconBg: "bg-orange-50" },
    { key: "resolved_complaints", label: "Resolved Complaints", icon: CheckCircle2, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm transition-all duration-150"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          {loading ? (
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {data?.ward_name || data?.name || "Ward Details"}
            </h1>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Ward analytics overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <DetailStatCard
            key={s.key}
            label={s.label}
            value={data?.[s.key]}
            icon={s.icon}
            iconColor={s.iconColor}
            iconBg={s.iconBg}
            isLoading={loading}
          />
        ))}
      </div>

      {/* Ward Authority Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-teal-50 rounded-lg">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Ward Authority Details</h2>
            <p className="text-xs text-gray-400">Assigned ward officer information</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5 animate-pulse">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AuthorityDetailRow icon={User} label="Full Name" value={authority.name || authority.full_name} />
            <AuthorityDetailRow icon={Mail} label="Email" value={authority.email} />
            <AuthorityDetailRow icon={Phone} label="Phone" value={authority.phone} />
            <AuthorityDetailRow icon={MapPin} label="Address" value={authority.address || authority.office_address} />
            <AuthorityDetailRow icon={Calendar} label="Joined Date" value={formatDate(authority.joined_date || authority.created_at)} />
          </div>
        )}
      </div>

      {/* Complaints Preview Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2.5">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700">Complaints</h3>
            <p className="text-xs text-gray-400">Recent complaints filed in this ward</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {["#", "Title", "Filed By", "Date", "Severity", "Status"].map((col) => (
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
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-4/5" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <CheckCircle2 className="w-8 h-8 opacity-30" />
                      <p className="text-sm font-medium">No complaints filed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                complaints.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 truncate max-w-[180px]">
                        {c.title || c.subject || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{c.filed_by || c.citizen_name || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {formatDate(c.created_at || c.filed_date)}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.severity ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${severityColor(c.severity)}`}>
                          {c.severity}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(c.status)}`}>
                        {c.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardDetails;