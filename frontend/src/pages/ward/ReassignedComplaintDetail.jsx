import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wardapi from "@/service/wardurls";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const CATEGORY_CONFIG = {
  ROAD:        { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  WATER:       { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  ELECTRICITY: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  WASTE:       { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  OTHER:       { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
};

const STATUS_CONFIG = {
  PENDING:     { bg: "bg-yellow-100",  text: "text-yellow-700",  border: "border-yellow-200",  dot: "bg-yellow-500",  label: "Pending",     accent: "border-l-yellow-400"  },
  IN_PROGRESS: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "In Progress", accent: "border-l-amber-400"   },
  RESOLVED:    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "Resolved",    accent: "border-l-emerald-500" },
  ESCALATED:   { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "Escalated",   accent: "border-l-red-500"     },
};

const TIMELINE_ICON_PATHS = {
  filed:      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  received:   "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  update:     "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  escalated:  "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  reassigned: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  resolved:   "M5 13l4 4L19 7",
};

const TIMELINE_STYLE = {
  filed:      { bg: "bg-blue-100",    color: "text-blue-600"    },
  received:   { bg: "bg-slate-100",   color: "text-slate-600"   },
  update:     { bg: "bg-amber-100",   color: "text-amber-600"   },
  escalated:  { bg: "bg-red-100",     color: "text-red-600"     },
  reassigned: { bg: "bg-indigo-100",  color: "text-indigo-600"  },
  resolved:   { bg: "bg-emerald-100", color: "text-emerald-600" },
};

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function isVideo(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// ─────────────────────────────────────────────
// CategoryBadge
// ─────────────────────────────────────────────
export function CategoryBadge({ category }) {
  const c = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {category ?? "OTHER"}
    </span>
  );
}

// ─────────────────────────────────────────────
//  StatusBadge
// ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────
//  SectionCard
// ─────────────────────────────────────────────
export function SectionCard({ title, iconPath, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          {iconPath && (
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
              </svg>
            </div>
          )}
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  InfoRow
// ─────────────────────────────────────────────
export function InfoRow({ label, value, iconPath }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      {iconPath && (
        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center mt-0.5 flex-shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-700 font-semibold mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ImagePreviewModal
// ─────────────────────────────────────────────
export function ImagePreviewModal({ src, caption, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <img src={src} alt={caption} className="w-full max-h-[70vh] object-contain bg-slate-900" />
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-sm text-slate-600 font-medium truncate max-w-xs">{caption}</p>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition-all ml-4 flex-shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MediaGrid
// ─────────────────────────────────────────────
function MediaGrid({ items = [], onPreview }) {
  if (!items.length) {
    return (
      <p className="text-sm text-slate-400 italic text-center py-4">
        No media files attached.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => {
        const url   = item.file ?? item.url ?? item;
        const label = item.caption ?? item.name ?? `File ${i + 1}`;
        const vid   = isVideo(url);

        return vid ? (
          <div
            key={i}
            className="col-span-2 rounded-xl overflow-hidden border border-slate-100 shadow-sm"
          >
            <video controls className="w-full" style={{ maxHeight: 220 }}>
              <source src={url} />
              Your browser does not support video.
            </video>
            <p className="text-xs text-slate-500 font-medium px-3 py-2 bg-slate-50 border-t border-slate-100">
              {label}
            </p>
          </div>
        ) : (
          <div
            key={i}
            className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md aspect-video"
            onClick={() => onPreview({ url, caption: label })}
          >
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs font-medium truncate">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  ResolveModal
// ─────────────────────────────────────────────
function ResolveModal({ onClose, onConfirm, loading }) {
  const [message, setMessage]   = useState("");
  const [files, setFiles]       = useState([]);
  const canSubmit = message.trim().length > 0 && !loading;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Mark as Resolved</h3>
              <p className="text-xs text-slate-500">Provide resolution details and any proof of completion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all disabled:opacity-40"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Resolution Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
              Resolution Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the steps taken to resolve this complaint..."
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-300 transition-all"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
              Upload Proof / Media
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer transition-all text-emerald-600">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs font-semibold">Click to upload or drag & drop</p>
              <p className="text-xs opacity-60 mt-0.5">Images, videos, PDFs — up to 20 MB each</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {f.name.length > 22 ? f.name.slice(0, 22) + "…" : f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(message, files)}
            disabled={!canSubmit}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              "Confirm Resolution"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Timeline
// ─────────────────────────────────────────────
function Timeline({ events = [] }) {
  if (!events.length) {
    return <p className="text-sm text-slate-400 italic text-center py-4">No timeline events yet.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[17px] top-0 bottom-0 w-px bg-slate-100" />
      <div className="space-y-4">
        {events.map((item, i) => {
          const typeKey = item.type ?? "update";
          const style   = TIMELINE_STYLE[typeKey] ?? TIMELINE_STYLE.update;
          const iconD   = TIMELINE_ICON_PATHS[typeKey] ?? TIMELINE_ICON_PATHS.update;
          return (
            <div key={i} className="flex gap-4 relative">
              <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0 z-10 border-2 border-white shadow-sm`}>
                <svg className={`w-4 h-4 ${style.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconD} />
                </svg>
              </div>
              <div className="flex-1 pb-1">
                <p className="text-sm font-semibold text-slate-700">{item.event ?? item.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {item.actor && <span className="text-xs text-slate-400">{item.actor}</span>}
                  {item.actor && <span className="w-1 h-1 bg-slate-300 rounded-full" />}
                  <span className="text-xs text-slate-400">{formatDateTime(item.date ?? item.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex gap-2 mb-4">
          <div className="h-5 bg-slate-200 rounded-full w-20" />
          <div className="h-5 bg-slate-200 rounded-full w-24" />
        </div>
        <div className="h-7 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-7 bg-slate-200 rounded w-1/2 mb-6" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="h-14 bg-slate-100 rounded-xl" />
        </div>
      </div>
      {/* Two-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-40" />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-56" />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-44" />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-36" />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-28" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE: ReassignedComplaintDetail
// ─────────────────────────────────────────────
export default function ReassignedComplaintDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [complaint,     setComplaint]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState(null);
  const [previewImg,    setPreviewImg]    = useState(null);
  const [showModal,     setShowModal]     = useState(false);
  const [resolving,     setResolving]     = useState(false);
  const [resolveError,  setResolveError]  = useState(null);
  const [resolveSuccess,setResolveSuccess]= useState(false);

  // ── Fetch complaint ──
  const fetchComplaint = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const { data } = await wardapi.getReassignedComplaintDetail(id);
      setComplaint(data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.detail ?? "Failed to load complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchComplaint(); }, [fetchComplaint]);

  // ── Resolve complaint ──
  const handleResolve = async (message, files) => {
    try {
      setResolving(true);
      setResolveError(null);

      const formData = new FormData();
      formData.append("resolution_description", message);
      files.forEach((f) => formData.append("media_files", f));

      await wardapi.resolveReassignedComplaint(id, formData);

      setResolveSuccess(true);
      setShowModal(false);
      // Refresh data so status updates
      await fetchComplaint();
    } catch (err) {
      setResolveError(
        err?.response?.data?.detail ?? "Failed to resolve complaint. Please try again."
      );
    } finally {
      setResolving(false);
    }
  };

  // ─────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb placeholder */}
          <div className="h-4 bg-slate-200 rounded w-64 mb-6 animate-pulse" />
          <PageSkeleton />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Error Loading Complaint</h3>
          <p className="text-sm text-slate-500 mb-5">{fetchError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={fetchComplaint}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // HELPERS from data
  // ─────────────────────────────────────────
  const status          = complaint.status ?? "PENDING";
  const statusCfg       = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const isResolved      = status === "RESOLVED";
  const originalMedia   = complaint.media ?? complaint.original_media ?? [];
  const panchayathMedia = complaint.reassign_media ?? complaint.panchayath_media ?? [];
  const timeline        = complaint.timeline ?? [];
  const citizen         = complaint.citizen ?? {};
  const ward            = complaint.ward ?? {};

  // ─────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-6 flex-wrap">
          {[
            { label: "SPIMS",                   path: "/"                              },
            { label: "Ward Dashboard",           path: "/ward/dashboard"               },
            { label: "Reassigned Complaints",    path: "/ward/reassigned-complaints"   },
            { label: complaint.complaint_id ?? `#${id}`, path: null                   },
          ].map((crumb, i, arr) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <span
                onClick={() => crumb.path && navigate(crumb.path)}
                className={
                  i === arr.length - 1
                    ? "text-slate-600 font-semibold"
                    : "hover:text-slate-600 cursor-pointer transition-colors"
                }
              >
                {crumb.label}
              </span>
              {i < arr.length - 1 && (
                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          ))}
        </nav>

        {/* ── Success Banner ── */}
        {resolveSuccess && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Complaint marked as resolved</p>
              <p className="text-xs text-emerald-600 mt-0.5">The complaint status has been updated successfully.</p>
            </div>
          </div>
        )}

        {/* ── Resolve Error Banner ── */}
        {resolveError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-sm">Resolution failed</p>
              <p className="text-xs mt-0.5 text-red-600">{resolveError}</p>
            </div>
          </div>
        )}

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-hidden">
          <div className={`h-1.5 w-full ${isResolved ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500"}`} />
          <div className="p-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                {complaint.complaint_id ?? complaint.id}
              </span>
              <CategoryBadge category={complaint.category} />
              <StatusBadge status={status} />
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-5">
              {complaint.title}
            </h1>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Location",
                  value: complaint.location,
                  icon:  "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                },
                {
                  label: "Date Filed",
                  value: formatDate(complaint.created_at ?? complaint.createdAt),
                  icon:  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                    <p className="text-sm font-semibold text-slate-700">{m.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Reassign Note */}
            {complaint.reassign_note && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                      Reassignment Note from Panchayath
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">{complaint.reassign_note}</p>
                    {complaint.reassigned_at && (
                      <p className="text-xs text-blue-500 mt-2 font-medium">
                        Reassigned on {formatDateTime(complaint.reassigned_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <SectionCard
              title="Complaint Description"
              iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            >
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {complaint.description || "No description provided."}
              </p>
            </SectionCard>

            {/* Supporting Media from Panchayath */}
            <SectionCard
              title="Supporting Media from Panchayath"
              iconPath="4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            >
              <MediaGrid items={panchayathMedia} onPreview={setPreviewImg} />
            </SectionCard>

            {/* Original Complaint Media */}
            <SectionCard
              title="Original Complaint Media"
              iconPath="15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            >
              <MediaGrid items={originalMedia} onPreview={setPreviewImg} />
            </SectionCard>

            {/* Timeline */}
            <SectionCard
              title="Activity Timeline"
              iconPath="12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            >
              <Timeline events={timeline} />
            </SectionCard>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-6">

            {/* Citizen Details */}
            <SectionCard
              title="Citizen Details"
              iconPath="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {(citizen.name ?? "C").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{citizen.name || "—"}</p>
                  <p className="text-xs text-slate-400">Complainant</p>
                </div>
              </div>
              <InfoRow
                label="Email"
                value={citizen.email}
                iconPath="3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
              <InfoRow
                label="Phone"
                value={citizen.phone}
                iconPath="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </SectionCard>

            {/* Ward Details */}
            <SectionCard
              title="Ward Details"
              iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <p className="font-bold text-slate-700 text-sm">
                  {ward.name || complaint.ward_name || "—"}
                </p>
              </div>
              {ward.officer && (
                <>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Ward Officer</p>
                  <InfoRow
                    label="Officer Name"
                    value={ward.officer}
                    iconPath="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                  {ward.officer_phone && (
                    <InfoRow
                      label="Phone"
                      value={ward.officer_phone}
                      iconPath="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  )}
                </>
              )}
            </SectionCard>

            {/* Action Panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Actions</h2>
              </div>
              <div className="p-5">
                {isResolved ? (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4">
                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-emerald-700 text-sm">Complaint Resolved</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        This complaint has been successfully resolved.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setResolveError(null); setShowModal(true); }}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Resolved
                    </button>
                    <p className="text-xs text-slate-400 text-center mt-3">
                      {status === "PENDING"
                        ? "This complaint is pending your action."
                        : "This complaint is currently in progress."}
                    </p>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          SPIMS – Smart Panchayath Issue Management System &nbsp;•&nbsp; Ward Module &nbsp;•&nbsp;{" "}
          {complaint.complaint_id ?? `ID: ${id}`}
        </div>
      </div>

      {/* ── Modals ── */}
      {previewImg && (
        <ImagePreviewModal
          src={previewImg.url}
          caption={previewImg.caption}
          onClose={() => setPreviewImg(null)}
        />
      )}
      {showModal && (
        <ResolveModal
          loading={resolving}
          onClose={() => setShowModal(false)}
          onConfirm={handleResolve}
        />
      )}
    </div>
  );
}