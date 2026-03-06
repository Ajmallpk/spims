import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import panchayathApi from "@/api/panchayathApi";
import { handleAuthError } from "@/service/panchayathurls";
import toast from "react-hot-toast";

export default function WardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ward, setWard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await panchayathApi.wardDetail(id);
        setWard(res.data);
      } catch (err) {
        handleAuthError(err);
        toast.error("Ward detail error:", err);
        setError("Failed to load ward details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Loading ward details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            ← Back to Ward List
          </button>

          <h1 className="text-2xl font-black text-slate-900">
            {ward.ward_name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            <p>Ward ID: {ward.id}</p>
          </p>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <DetailItem label="Email" value={ward.email} />
          <DetailItem label="Contact" value={ward.official_contact} />
          <DetailItem label="Status" value={ward.status} />
          <DetailItem label="Joined Date" value={formatDate(ward.date_joined)} />

        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}