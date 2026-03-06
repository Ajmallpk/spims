import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import PanchayathStatsGrid from "@/components/admin/Panchayathstatsgrid";
import WardTable from "@/components/admin/Wardtable";

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

const PanchayathDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get(
          `/api/admin/panchayath/${id}/details/`,
          { headers: getAuthHeaders() }
        );
        setData(res);
      } catch (err) {
        toast.error("Error fetching panchayath details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const authority = data?.authority || data?.panchayath_authority || {};
  const wards = data?.wards || [];

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
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {data?.panchayath_name || data?.name || "Panchayath Details"}
            </h1>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Drill-down analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <PanchayathStatsGrid stats={data} isLoading={loading} />

      {/* Authority Details Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Panchayath Authority Details
            </h2>
            <p className="text-xs text-gray-400">Registered authority information</p>
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
            <AuthorityDetailRow
              icon={User}
              label="Full Name"
              value={authority.name || authority.full_name}
            />
            <AuthorityDetailRow
              icon={Mail}
              label="Email"
              value={authority.email}
            />
            <AuthorityDetailRow
              icon={Phone}
              label="Phone"
              value={authority.phone}
            />
            <AuthorityDetailRow
              icon={MapPin}
              label="Office Address"
              value={authority.office_address || authority.address}
            />
            <AuthorityDetailRow
              icon={Calendar}
              label="Joined Date"
              value={formatDate(authority.joined_date || authority.created_at)}
            />
            <AuthorityDetailRow
              icon={Building2}
              label="License Number"
              value={authority.license_number}
            />
          </div>
        )}
      </div>

      {/* Ward Table */}
      <WardTable wards={wards} isLoading={loading} />
    </div>
  );
};

export default PanchayathDetails;