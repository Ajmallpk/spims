// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import panchayathApi from "@/service/panchayathurls";

// export default function ComplaintDetail() {

//     const { id } = useParams();

//     const navigate = useNavigate();

//     const [complaint, setComplaint] =
//         useState(null);

//     const [loading, setLoading] =
//         useState(true);

//     useEffect(() => {

//         const fetchComplaint = async () => {

//             try {

//                 const res =
//                     await panchayathApi
//                         .getComplaintFullDetail(id);


//                 console.log("fulldetail=", res.data.data)

//                 setComplaint(
//                     res.data.data
//                 );

//             }

//             catch (err) {

//                 console.log(err);

//             }

//             finally {

//                 setLoading(false);

//             }

//         };

//         fetchComplaint();

//     }, [id]);

//     if (loading) {

//         return (
//             <div className="p-6">
//                 Loading...
//             </div>
//         );

//     }

//     if (!complaint) {

//         return (
//             <div className="p-6">
//                 Complaint not found
//             </div>
//         );

//     }

//     return (

//         <div className="p-6 space-y-4">

//             <button
//                 onClick={() => navigate(-1)}
//                 className="px-4 py-2 bg-blue-100 rounded"
//             >
//                 ← Back
//             </button>

//             <h1 className="text-2xl font-bold">
//                 {complaint.title}
//             </h1>


//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//                 <div className="bg-white border rounded-xl p-4">
//                     <p className="text-xs text-slate-500">
//                         Upvotes
//                     </p>
//                     <p className="text-2xl font-bold">
//                         {complaint.upvotes_count}
//                     </p>
//                 </div>

//                 <div className="bg-white border rounded-xl p-4">
//                     <p className="text-xs text-slate-500">
//                         Comments
//                     </p>
//                     <p className="text-2xl font-bold">
//                         {complaint.comments_count}
//                     </p>
//                 </div>

//                 <div className="bg-white border rounded-xl p-4">
//                     <p className="text-xs text-slate-500">
//                         Reassigned
//                     </p>
//                     <p className="text-2xl font-bold">
//                         {complaint.is_reassigned ? "Yes" : "No"}
//                     </p>
//                 </div>

//                 <div className="bg-white border rounded-xl p-4">
//                     <p className="text-xs text-slate-500">
//                         Status
//                     </p>
//                     <p className="text-lg font-bold">
//                         {complaint.status}
//                     </p>
//                 </div>

//             </div>

//             <div className="flex items-center gap-2">
//                 <span className="font-semibold">
//                     Status:
//                 </span>

//                 <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold
//       ${complaint.status === "RESOLVED"
//                             ? "bg-green-100 text-green-700"
//                             : complaint.status === "PENDING"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : complaint.status === "IN_PROGRESS"
//                                     ? "bg-blue-100 text-blue-700"
//                                     : complaint.status === "ESCALATED"
//                                         ? "bg-red-100 text-red-700"
//                                         : "bg-gray-100 text-gray-700"
//                         }`}
//                 >
//                     {complaint.status}
//                 </span>
//             </div>

//             <div className="flex items-center gap-2">
//                 <span className="font-semibold">
//                     Category:
//                 </span>

//                 <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
//                     {complaint.category}
//                 </span>
//             </div>

//             <div className="bg-slate-50 border rounded-xl p-4">

//                 <h3 className="font-bold mb-3">
//                     Citizen Information
//                 </h3>

//                 <p>
//                     <strong>Name:</strong>{" "}
//                     {complaint.citizen_name}
//                 </p>

//                 <p>
//                     <strong>Email:</strong>{" "}
//                     {complaint.citizen_email}
//                 </p>

//             </div>

//             <div className="bg-white border rounded-xl p-4">

//                 <h3 className="font-bold mb-2">
//                     Location
//                 </h3>

//                 <p>
//                     📍 {complaint.location}
//                 </p>

//             </div>


//             <div className="bg-white border rounded-xl p-4">

//                 <h3 className="font-bold mb-3">
//                     Important Dates
//                 </h3>

//                 <p>
//                     Created:
//                     {" "}
//                     {new Date(
//                         complaint.created_at
//                     ).toLocaleString()}
//                 </p>

//                 <p>
//                     Updated:
//                     {" "}
//                     {new Date(
//                         complaint.updated_at
//                     ).toLocaleString()}
//                 </p>

//                 {complaint.resolved_at && (

//                     <p>
//                         Resolved:
//                         {" "}
//                         {new Date(
//                             complaint.resolved_at
//                         ).toLocaleString()}
//                     </p>

//                 )}

//             </div>


//             <div className="bg-white border rounded-xl p-4">

//                 <h3 className="font-bold mb-4">
//                     Complaint Media
//                 </h3>

//                 {complaint.complaint_media?.length > 0 ? (

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                         {complaint.complaint_media.map(
//                             (media, index) => (

//                                 <div
//                                     key={index}
//                                     className="border rounded-lg overflow-hidden"
//                                 >

//                                     {media.file_type === "IMAGE" ? (

//                                         <img
//                                             src={media.file}
//                                             alt="Complaint Media"
//                                             className="w-full h-64 object-cover"
//                                         />

//                                     ) : (

//                                         <video
//                                             controls
//                                             className="w-full"
//                                         >
//                                             <source src={media.file} />
//                                         </video>

//                                     )}

//                                 </div>

//                             )
//                         )}

//                     </div>

//                 ) : (

//                     <p className="text-slate-500">
//                         No complaint media uploaded
//                     </p>

//                 )}

//             </div>


//             <div className="bg-white border rounded-xl p-4">

//                 <h3 className="font-bold mb-2">
//                     Registered Date
//                 </h3>

//                 <p>
//                     {new Date(
//                         complaint.created_at
//                     ).toLocaleString()}
//                 </p>

//             </div>

//             <div className="bg-white border rounded-xl p-4">

//                 <h3 className="font-bold mb-2">
//                     Complaint Description
//                 </h3>

//                 <p className="text-slate-600">
//                     {complaint.description}
//                 </p>

//             </div>

//             {complaint.escalation_reason && (

//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4">

//                     <h3 className="font-bold text-red-700 mb-2">
//                         Escalation Reason
//                     </h3>

//                     <p>
//                         {complaint.escalation_reason}
//                     </p>

//                 </div>

//             )}


//             {complaint.reassign_note && (

//                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

//                     <h3 className="font-bold text-blue-700 mb-2">
//                         Reassignment Note
//                     </h3>

//                     <p>
//                         {complaint.reassign_note}
//                     </p>

//                 </div>

//             )}

//             {complaint.resolution && (

//                 <div className="bg-green-50 border border-green-200 rounded-xl p-5">

//                     <h3 className="font-bold text-green-700 mb-4">
//                         Resolution Details
//                     </h3>

//                     <p className="text-slate-700 mb-5">
//                         {complaint.resolution.message}
//                     </p>

//                     <h4 className="font-semibold mb-3">
//                         Resolution Media
//                     </h4>

//                     {complaint.resolution.media?.length > 0 ? (

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                             {complaint.resolution.media.map(
//                                 (media, index) => (

//                                     <div
//                                         key={index}
//                                         className="border rounded-lg overflow-hidden bg-white"
//                                     >

//                                         {media.file_type === "IMAGE" ? (

//                                             <img
//                                                 src={media.file}
//                                                 alt="Resolution Media"
//                                                 className="w-full h-64 object-cover"
//                                             />

//                                         ) : (

//                                             <video
//                                                 controls
//                                                 className="w-full"
//                                             >
//                                                 <source src={media.file} />
//                                             </video>

//                                         )}

//                                     </div>

//                                 )
//                             )}

//                         </div>

//                     ) : (

//                         <p className="text-slate-500">
//                             No resolution media uploaded
//                         </p>

//                     )}

//                 </div>

//             )}



//         </div>

//     );

// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import panchayathApi from "@/service/panchayathurls";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
    RESOLVED: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Resolved" },
    PENDING: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400", label: "Pending" },
    IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", label: "In Progress" },
    ESCALATED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Escalated" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", label: status };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function StatCard({ label, value, accent }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold ${accent ?? "text-slate-800"}`}>{value}</p>
        </div>
    );
}

function SectionCard({ title, icon, children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                    {icon && <span className="text-base">{icon}</span>}
                    <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                </div>
            )}
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <span className="text-xs font-medium text-slate-400 w-28 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
            <span className="text-sm text-slate-700">{value}</span>
        </div>
    );
}

function MediaGrid({ items, emptyText = "No media uploaded" }) {
    if (!items?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <span className="text-3xl mb-2">🖼️</span>
                <p className="text-sm">{emptyText}</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((media, i) =>
                media.file_type === "IMAGE" ? (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={media.file} alt="Media" className="w-full h-56 object-cover" />
                    </div>
                ) : (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-100 bg-black">
                        <video controls className="w-full">
                            <source src={media.file} />
                        </video>
                    </div>
                )
            )}
        </div>
    );
}

function SkeletonLoader() {
    return (
        <div className="p-6 space-y-5 animate-pulse">
            <div className="h-5 w-24 bg-slate-200 rounded-lg" />
            <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
                ))}
            </div>
            <div className="h-40 bg-slate-200 rounded-2xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
    );
}

export default function ComplaintDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await panchayathApi.getComplaintFullDetail(id);
                console.log("fulldetail=", res.data.data);
                setComplaint(res.data.data);
            } catch (err) {
                console.log(err);
                toast.error(
                    err?.response?.data?.message ||
                    "Failed to load complaint details."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    if (loading) return <SkeletonLoader />;

    if (!complaint) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400">
                <span className="text-5xl mb-3">📋</span>
                <p className="text-lg font-medium text-slate-600">Complaint not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-sm text-teal-600 hover:underline">
                    ← Go back
                </button>
            </div>
        );
    }

    const formattedDate = (d) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

            {/* Back + Header */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                            Complaint #{id}
                        </p>
                        <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                            {complaint.title}
                        </h1>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                        <StatusBadge status={complaint.status} />
                        {complaint.is_reassigned && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                                🔁 Reassigned
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Upvotes" value={complaint.upvotes_count} accent="text-teal-600" />
                <StatCard label="Comments" value={complaint.comments_count} accent="text-blue-600" />
                <StatCard label="Status" value={STATUS_CONFIG[complaint.status]?.label ?? complaint.status} />
                <StatCard label="Category" value={complaint.category} />
            </div>

            {/* Citizen + Location side by side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SectionCard title="Citizen Information" icon="👤">
                    <InfoRow label="Name" value={complaint.citizen_name} />
                    <InfoRow label="Email" value={complaint.citizen_email} />
                </SectionCard>

                <SectionCard title="Location" icon="📍">
                    <p className="text-sm text-slate-700 leading-relaxed">{complaint.location}</p>
                </SectionCard>
            </div>

            {/* Description */}
            <SectionCard title="Description" icon="📝">
                <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
            </SectionCard>

            {/* Dates */}
            <SectionCard title="Timeline" icon="🕐">
                <InfoRow label="Submitted" value={formattedDate(complaint.created_at)} />
                <InfoRow label="Last Updated" value={formattedDate(complaint.updated_at)} />
                {complaint.resolved_at && (
                    <InfoRow label="Resolved" value={formattedDate(complaint.resolved_at)} />
                )}
            </SectionCard>

            {/* Complaint Media */}
            <SectionCard title="Complaint Media" icon="🖼️">
                <MediaGrid items={complaint.complaint_media} emptyText="No complaint media uploaded" />
            </SectionCard>

            {/* Escalation */}
            {complaint.escalation_reason && (
                <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-red-200">
                        <span>⚠️</span>
                        <h3 className="text-sm font-semibold text-red-700">Escalation Reason</h3>
                    </div>
                    <div className="px-5 py-4">
                        <p className="text-sm text-red-800 leading-relaxed">{complaint.escalation_reason}</p>
                    </div>
                </div>
            )}

            {/* Reassignment Note */}
            {complaint.reassign_note && (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-violet-200">
                        <span>🔁</span>
                        <h3 className="text-sm font-semibold text-violet-700">Reassignment Note</h3>
                    </div>
                    <div className="px-5 py-4">
                        <p className="text-sm text-violet-900 leading-relaxed">{complaint.reassign_note}</p>
                    </div>
                </div>
            )}

            {/* Resolution */}
            {complaint.resolution && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-emerald-200">
                        <span>✅</span>
                        <h3 className="text-sm font-semibold text-emerald-700">Resolution Details</h3>
                    </div>
                    <div className="px-5 py-5 space-y-4">
                        <p className="text-sm text-slate-700 leading-relaxed">{complaint.resolution.message}</p>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Resolution Media</p>
                            <MediaGrid items={complaint.resolution.media} emptyText="No resolution media uploaded" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}