import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import panchayathApi from "@/service/panchayathurls";
// import { handleAuthError } from "@/service/panchayathurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

export default function WardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ward, setWard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("WARD ID FROM URL =", id);


  useEffect(() => {
    console.log(
      "COMPLAINTS STATE",
      complaints
    );
  }, [complaints]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await panchayathApi.wardDetail(id);
        setWard(res.data.data);

        const complaintRes =
          await panchayathApi.wardComplaints(id);


        console.log("FULL RESPONSE", complaintRes.data);

        setComplaints(
          complaintRes.data.data
        );
        console.log(complaints);
      } catch (err) {
        panchayathApi.handleAuthError(err);
        handleApiError(
          err,
          "Failed to load ward details"
        );
        setError("Failed to load ward details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const filteredComplaints =
    statusFilter === "ALL"
      ? complaints
      : complaints.filter(
        (c) => c.status === statusFilter
      );

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
            Ward ID: {ward.id}
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


      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-xl font-black text-slate-800">
                Ward Complaints
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Total {filteredComplaints.length} complaints found
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${statusFilter === "ALL"
                    ? "bg-slate-800 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${statusFilter === "PENDING"
                    ? "bg-yellow-500 text-white shadow"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  }`}
              >
                Pending
              </button>

              <button
                onClick={() => setStatusFilter("IN_PROGRESS")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${statusFilter === "IN_PROGRESS"
                    ? "bg-blue-500 text-white shadow"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
              >
                In Progress
              </button>

              <button
                onClick={() => setStatusFilter("RESOLVED")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${statusFilter === "RESOLVED"
                    ? "bg-green-600 text-white shadow"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
              >
                Resolved
              </button>

              <button
                onClick={() => setStatusFilter("ESCALATED")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${statusFilter === "ESCALATED"
                    ? "bg-red-600 text-white shadow"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
              >
                Escalated
              </button>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          {filteredComplaints.length === 0 ? (

            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>

              <h3 className="text-lg font-bold text-slate-700">
                No Complaints Found
              </h3>

              <p className="text-slate-500 mt-1">
                No complaints available for this filter.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {filteredComplaints.map((complaint) => (

                <div
                  key={complaint.id}
                  onClick={() =>
                    navigate(
                      `/panchayath/complaint/${complaint.id}`
                    )
                  }
                  className="group bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
                >

                  {/* Top */}
                  <div className="flex justify-between items-start mb-3">

                    <div>
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                        {complaint.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        Complaint #{complaint.id}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold
                  ${complaint.status === "RESOLVED"
                          ? "bg-green-100 text-green-700"
                          : complaint.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : complaint.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                    >
                      {complaint.status}
                    </span>

                  </div>

                  {/* Citizen */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {complaint.citizen_name?.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {complaint.citizen_name}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between">

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {complaint.category}
                    </span>

                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      View Details →
                    </span>

                  </div>
                          
                </div>

              ))}

            </div>

          )}

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