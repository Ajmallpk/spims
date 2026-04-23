import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import panchayathApi from "@/service/panchayathurls";


const CATEGORY_CONFIG = {
    ROAD: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
    WATER: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    ELECTRICITY: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
    WASTE: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    OTHER: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
};

const STATUS_CONFIG = {
    ESCALATED: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", label: "Escalated" },

    IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", label: "In Progress" },

    RESOLVED: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "Resolved" },

    // 👉 ADD THIS
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500", label: "Pending" },
};

const TIMELINE_ICONS = {
    filed: { bg: "bg-blue-100", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "text-blue-600" },
    received: { bg: "bg-slate-100", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", color: "text-slate-600" },
    update: { bg: "bg-amber-100", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "text-amber-600" },
    escalated: { bg: "bg-red-100", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: "text-red-600" },
};

function formatDate(dateStr) {
    if (!dateStr) return "N/A";   // ✅ ADD THIS LINE
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
function formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function CategoryBadge({ category }) {
    const c = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.text} ${c.border} tracking-wide`}>
            {category}
        </span>
    );
}

function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        dot: "bg-gray-400",
        label: status || "Unknown"
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}

function SectionCard({ title, icon, children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                    {icon && (
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                            </svg>
                        </div>
                    )}
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}

function InfoRow({ label, value, icon }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
            {icon && (
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </div>
            )}
            <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-sm text-slate-700 font-semibold mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function ImagePreviewModal({ src, caption, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <img src={src} alt={caption} className="w-full max-h-[70vh] object-cover" />
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50">
                        <p className="text-sm text-slate-600 font-medium">{caption}</p>
                        <button onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition-all">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionModal({ type, onClose, onConfirm }) {
    const [desc, setDesc] = useState("");
    const [files, setFiles] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const isResolve = type === "resolve";
    const config = isResolve
        ? { title: "Resolve Complaint", subtitle: "Provide resolution details and supporting media", color: "emerald", btnLabel: "Confirm Resolution", icon: "M5 13l4 4L19 7" }
        : { title: "Reassign Complaint", subtitle: "Provide a reason for reassigning this complaint", color: "blue", btnLabel: "Confirm Reassignment", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" };

    const colorMap = {
        emerald: { btn: "bg-emerald-600 hover:bg-emerald-700", ring: "focus:ring-emerald-500", upload: "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600" },
        blue: { btn: "bg-blue-600 hover:bg-blue-700", ring: "focus:ring-blue-500", upload: "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600" },
    };
    const col = colorMap[config.color];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-${config.color}-100`}>
                            <svg className={`w-4 h-4 text-${config.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={config.icon} />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">{config.title}</h3>
                            <p className="text-xs text-slate-500">{config.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                            {isResolve ? "Resolution Description" : "Reason for Reassignment"} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder={isResolve ? "Describe the actions taken to resolve this complaint..." : "Provide a clear reason for reassigning this complaint..."}
                            className={`w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${col.ring} focus:border-transparent resize-none text-slate-700 placeholder:text-slate-300 transition-all`}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                            {isResolve ? "Upload Proof / Media" : "Supporting Documents"}
                        </label>
                        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${col.upload}`}>
                            <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-xs font-semibold">Click to upload or drag & drop</p>
                            <p className="text-xs opacity-60 mt-0.5">Images, videos, PDFs up to 20MB</p>
                            <input type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} />
                        </label>
                        {files.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {files.map((f, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        {f.name.length > 20 ? f.name.slice(0, 20) + "…" : f.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (desc.trim()) setShowConfirm(true);
                        }}
                        disabled={!desc.trim() || loading}
                        className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${col.btn}`}
                    >
                        {config.btnLabel}
                    </button>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4">

                        <h3 className="text-lg font-bold text-gray-800">
                            {type === "resolve"
                                ? "Confirm Resolution"
                                : "Confirm Reassignment"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {type === "resolve"
                                ? "Are you sure you want to mark this complaint as resolved?"
                                : "Are you sure you want to reassign this complaint?"}
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2 bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await onConfirm(desc, files);
                                    setLoading(false);
                                    setShowConfirm(false);
                                }}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                {loading ? "Processing..." : "Confirm"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default function PanchayathComplaintDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewImg, setPreviewImg] = useState(null);
    const [modal, setModal] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);


    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await panchayathApi.getComplaintDetail(id);

                console.log("DETAIL 👉", res.data);

                const data = res.data.data;   // ✅ FIX HERE

                setComplaint(data);
                setCurrentStatus(data.status);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    const handleConfirm = async (type, desc, files) => {
        try {


            if (type === "resolve") {

                const formData = new FormData();
                formData.append("message", desc);

                files.forEach(file => {
                    formData.append("media_files", file);
                });

                await panchayathApi.resolveComplaint(id, formData);
            }


            if (type === "reassign") {

                await panchayathApi.reassignComplaint(id, {
                    reassign_note: desc
                });
            }


            const res = await panchayathApi.getComplaintDetail(id);
            const data = res.data.data;
            setComplaint(data);
            setCurrentStatus(data.status);

            setModal(null);

        } catch (err) {
            console.error(err);
        }
    };

    const handleStartWork = async () => {
        try {
            await panchayathApi.startWork(id);


            const res = await panchayathApi.getComplaintDetail(id);
            const data = res.data.data;
            setComplaint(data);
            setCurrentStatus(data.status);

        } catch (err) {
            console.error(err);
        }
    };

    const showResolve = currentStatus === "ESCALATED" || currentStatus === "IN_PROGRESS";
    const showReassign =
        currentStatus === "ESCALATED" ||
        currentStatus === "IN_PROGRESS";

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!complaint) {
        return <div className="p-10 text-center">No Data Found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Breadcrumb ── */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/panchayath/escalated-complaints")}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Escalated Complaints
                    </button>
                </div>
                <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-6">
                    {["SPIMS", "Panchayath Dashboard", "Complaints", "Detail"].map((crumb, i, arr) => (
                        <span key={crumb} className="flex items-center gap-1.5">
                            <span className={i === arr.length - 1 ? "text-slate-600 font-semibold" : "hover:text-slate-600 cursor-pointer transition-colors"}>
                                {crumb}
                            </span>
                            {i < arr.length - 1 && (
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </span>
                    ))}
                </nav>

                {/* ── Top Hero Card ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400" />
                    <div className="p-6">
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{complaint.id}</span>
                            <CategoryBadge category={complaint.category} />
                            <StatusBadge status={currentStatus} />
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-5">{complaint.title}</h1>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { label: "Location", value: complaint.location, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                                { label: "Date Filed", value: formatDate(complaint.created_at), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                            ].map((m) => (
                                <div key={m.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                                        <p className="text-sm font-semibold text-slate-700">{m.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Main Two-Column Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT – Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Description */}
                        <SectionCard title="Complaint Description" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
                        </SectionCard>

                        {/* Media Evidence */}
                        <SectionCard title="Media Evidence" icon="4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                            <div className="grid grid-cols-2 gap-3">
                                {complaint.media?.map((item, i) =>
                                    item.type === "image" ? (
                                        <div
                                            key={i}
                                            className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-100"
                                            onClick={() => setPreviewImg(item)}
                                        >
                                            <img
                                                src={item.url}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div key={i} className="col-span-2">
                                            <video controls className="w-full rounded-xl">
                                                <source src={item.url} />
                                            </video>
                                        </div>
                                    )
                                )}
                                {!complaint.media?.length && (
                                    <p className="text-sm text-slate-400 col-span-2 text-center">
                                        No media available
                                    </p>
                                )}
                            </div>
                        </SectionCard>

                        {/* Timeline */}
                        <SectionCard title="Activity Timeline" icon="12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                            <div className="relative">
                                <div className="absolute left-[17px] top-0 bottom-0 w-px bg-slate-100" />
                                <div className="space-y-4">
                                    {complaint.timeline?.map((item, i) => {
                                        const t = TIMELINE_ICONS[item.type] || TIMELINE_ICONS.update;
                                        return (
                                            <div key={i} className="flex gap-4 relative">
                                                <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center flex-shrink-0 z-10 border-2 border-white shadow-sm`}>
                                                    <svg className={`w-4 h-4 ${t.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 pb-1">
                                                    <p className="text-sm font-semibold text-slate-700">{item.event}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-400">{item.actor}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                        <span className="text-xs text-slate-400">{formatDateTime(item.date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* RIGHT – Sidebar Cards */}
                    <div className="space-y-6">

                        {/* Citizen Details */}
                        <SectionCard title="Citizen Details" icon="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm">{complaint.citizen?.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{complaint.citizen?.name}</p>
                                    <p className="text-xs text-slate-400">Complainant</p>
                                </div>
                            </div>
                            <InfoRow label="Email Address" value={complaint.citizen?.email} icon="3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            <InfoRow label="Phone Number" value={complaint.citizen?.phone} icon="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </SectionCard>

                        {/* Ward Details */}
                        <SectionCard title="Ward Details" icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z">
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                    </svg>
                                </div>
                                <p className="font-bold text-slate-700 text-sm">{complaint.ward?.name}</p>
                            </div>
                            {complaint.ward?.officer && (
                                <>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Ward Officer</p>
                                    <InfoRow label="Officer Name" value={complaint.ward?.officer} icon="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    <InfoRow label="Phone" value={complaint.ward?.officerPhone} icon="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    <InfoRow label="Email" value={complaint.ward?.officerEmail} icon="3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </>
                            )}
                        </SectionCard>

                        {/* ── Action Panel ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Actions</h2>
                            </div>
                            <div className="p-5 space-y-3">
                                {currentStatus === "RESOLVED" ? (
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-emerald-700 text-sm">Complaint Resolved</p>
                                            <p className="text-xs text-emerald-600 mt-0.5">This complaint has been successfully resolved.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {currentStatus === "ESCALATED" && (
                                            <button
                                                onClick={handleStartWork}
                                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-3 rounded-xl"
                                            >
                                                Viewed
                                            </button>
                                        )}
                                        {showResolve && (
                                            <button
                                                onClick={() => setModal("resolve")}
                                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Mark as Resolved
                                            </button>
                                        )}
                                        {showReassign && (
                                            <button
                                                onClick={() => setModal("reassign")}
                                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-400 text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-150"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                Reassign Complaint
                                            </button>
                                        )}
                                        <p className="text-xs text-slate-400 text-center pt-1">
                                            {currentStatus === "ESCALATED"
                                                ? "This complaint is escalated and awaiting action."
                                                : "This complaint is currently being addressed."}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                    SPIMS – Smart Panchayath Issue Management System &nbsp;•&nbsp; Complaint ID: {complaint.id}
                </div>
            </div>

            {/* ── Modals ── */}
            {previewImg && (
                <ImagePreviewModal src={previewImg.url} caption={previewImg.caption} onClose={() => setPreviewImg(null)} />
            )}
            {modal && (
                <ActionModal
                    type={modal}
                    onClose={() => setModal(null)}
                    onConfirm={(desc, files) => handleConfirm(modal, desc, files)}
                />
            )}
        </div>
    );
}