import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import panchayathApi from "@/service/panchayathurls";
// import { handleAuthError } from "@/service/panchayathurls";
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
        setWard(res.data.data);
      } catch (err) {
        panchayathApi.handleAuthError(err);
        toast.error(err?.response?.data?.message || "Failed to load ward details");
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
            className="flex items-center gap-2 w-fit px-4 py-2 mb-4 
             text-sm font-medium text-blue-600 
             bg-blue-100 rounded-lg 
             hover:bg-blue-300 hover:text-blue-700 
             transition-all duration-200"
          >
            <span className="text-lg">←</span>
            Back to Ward List
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

          <DetailItem label="Ward Name" value={ward.ward_name} />
          <DetailItem label="Officer Name" value={ward.officer_name} />

          <DetailItem label="Email" value={ward.email} />
          <DetailItem label="Contact Number" value={ward.phone} />

          <DetailItem label="Office Address" value={ward.address} />
          <DetailItem label="Status" value={ward.status} />

          <DetailItem label="Submitted Date" value={formatDate(ward.submitted_at)} />


        </div>
        {ward.documents?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Verification Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ward.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noreferrer"
                  className="border rounded-lg overflow-hidden hover:shadow-md"
                >
                  <img
                    src={doc}
                    alt="Document"
                    className="w-full h-40 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
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