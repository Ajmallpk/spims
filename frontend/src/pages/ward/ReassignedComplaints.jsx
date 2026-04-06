import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import wardapi from "@/service/wardurls";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const CATEGORY_CONFIG = {
  ROAD: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  WATER: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  ELECTRICITY: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  WASTE: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  OTHER: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
};

const STATUS_CONFIG = {
  PENDING: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
    label: "Pending",
    cardAccent: "border-l-yellow-400",
  },
  // extend as needed
  IN_PROGRESS: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "In Progress",
    cardAccent: "border-l-amber-400",
  },
  RESOLVED: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Resolved",
    cardAccent: "border-l-emerald-500",
  },
  ESCALATED: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Escalated",
    cardAccent: "border-l-red-500",
  },
};

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────
// REUSABLE: CategoryBadge
// ─────────────────────────────────────────────
export function CategoryBadge({ category }) {
  const c = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {category ?? "OTHER"}
    </span>
  );
}

// ─────────────────────────────────────────────
// REUSABLE: StatusBadge
// ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// REUSABLE: SkeletonCard
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-slate-200 shadow-sm p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
        <div className="h-5 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="h-5 bg-slate-200 rounded w-4/5 mb-2" />
      <div className="h-5 bg-slate-200 rounded w-3/5 mb-5" />
      <div className="space-y-2 mb-5">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-28" />
        <div className="h-8 bg-slate-200 rounded-lg w-24" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REUSABLE: ComplaintCard
// ─────────────────────────────────────────────
export function ComplaintCard({ complaint, onClick, search }) {
  const status = complaint.status ?? "PENDING";
  const accent = (STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING).cardAccent;

  return (
    <article
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-slate-100 border-l-4 ${accent} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col gap-3 p-5`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
          {complaint.complaint_id ?? complaint.id}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Title */}
      <h3 className="text-slate-800 font-bold text-base leading-snug line-clamp-2 group-hover:text-yellow-700 transition-colors">
        {complaint.title}
      </h3>

      <div className="text-xs text-slate-600">
        👤 {complaint.citizen_name}
        {search?.trim() !== "" &&
          complaint.citizen_name?.toLowerCase().includes(search.toLowerCase()) && (
            <span className="text-green-600 text-xs ml-1">(matched)</span>
          )}
      </div>

      <div className="text-xs text-slate-400">
        📧 {complaint.citizen_email}
      </div>

      {/* Category */}
      <div>
        <CategoryBadge category={complaint.category} />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-auto">
        <div className="text-xs text-slate-600">
          👤 {complaint.citizen_name}
        </div>

        <div className="text-xs text-slate-400">
          📧 {complaint.citizen_email}
        </div>
        {complaint.location && (
          <div className="flex items-start gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{complaint.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(complaint.created_at ?? complaint.createdAt)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600 group-hover:text-white bg-yellow-50 group-hover:bg-yellow-600 border border-yellow-200 group-hover:border-yellow-600 px-3 py-1.5 rounded-lg transition-all duration-150">
          View Details
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// REUSABLE: EmptyState
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-16 h-16 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-slate-700 font-semibold text-base mb-1">
        No reassigned complaints
      </h3>
      <p className="text-slate-400 text-sm max-w-xs">
        There are no pending reassigned complaints assigned to your ward at
        this time.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE: ReassignedComplaints
// ─────────────────────────────────────────────
export default function ReassignedComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending"); // default
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await wardapi.getReassignedComplaints({
          status: statusFilter,
          search: search,
          category: category,
        });
        // Support both paginated { results: [] } and plain array responses
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results ?? [];
        setComplaints(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ??
          "Failed to load reassigned complaints. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [statusFilter, search, category]);

  const handleCardClick = (id) => {
    navigate(`/ward/reassigned-complaints/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-6">
          {["SPIMS", "Ward Dashboard", "Reassigned Complaints"].map(
            (crumb, i, arr) => (
              <span key={crumb} className="flex items-center gap-1.5">
                <span
                  className={
                    i === arr.length - 1
                      ? "text-slate-600 font-semibold"
                      : "hover:text-slate-600 cursor-pointer transition-colors"
                  }
                  onClick={() => {
                    if (i === 0) navigate("/");
                    if (i === 1) navigate("/ward/dashboard");
                  }}
                >
                  {crumb}
                </span>
                {i < arr.length - 1 && (
                  <svg
                    className="w-3 h-3 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </span>
            )
          )}
        </nav>

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 border border-yellow-200 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Reassigned Complaints
              </h1>
            </div>
            <p className="text-slate-500 text-sm">
              Pending complaints reassigned to your ward for action
            </p>
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                {complaints.length}{" "}
                {complaints.length === 1 ? "Complaint" : "Complaints"} Pending
              </span>
            </div>
          )}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold text-sm">Failed to load complaints</p>
              <p className="text-xs mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mb-5">

          {/* Toggle Buttons */}
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg ${statusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
              }`}
          >
            Reassigned
          </button>

          <button
            onClick={() => setStatusFilter("resolved")}
            className={`px-4 py-2 rounded-lg ${statusFilter === "resolved" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
          >
            Resolved
          </button>

          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg ${statusFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            All
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="ROAD">Road</option>
            <option value="WATER">Water</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="WASTE">Waste</option>
          </select>

        </div>

        {/* ── Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? null : complaints.length === 0 ? (
            <EmptyState />
          ) : (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id ?? complaint.complaint_id}
                complaint={complaint}
                search={search}
                onClick={() =>
                  handleCardClick(complaint.id ?? complaint.complaint_id)
                }
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && !error && complaints.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            SPIMS – Smart Panchayath Issue Management System &nbsp;•&nbsp; Ward
            Module
          </div>
        )}
      </div>
    </div>
  );
}