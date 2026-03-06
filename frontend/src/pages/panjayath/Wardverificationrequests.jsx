// pages/WardVerificationRequests.jsx
// SPIMS – Smart Panchayath Issue Management System
// Ward Verification Requests page for Panchayath admin.
//
// Fetches: GET /api/panchayath/ward-verifications/
// Opens:   WardApprovalModal on "View" click
// Shows:   Success toast after approve/reject

import { useState, useEffect, useCallback } from "react";
import panchayathApi from "@/service/panchayathurls";
import WardApprovalModal from "@/components/panjayath/Wardapprovalmodal";
import StatusBadge from "@/components/panjayath/StatusBadge";
// import { handleAuthError } from "@/service/panchayathurls";
import toast from "react-hot-toast";
// ─── Helpers ─────────────────────────────────────────────────────────────────




function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Toast notification
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = type === "success";

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        flex items-start gap-3
        px-5 py-4 rounded-2xl shadow-2xl border
        max-w-sm w-full
        animate-fade-in
        ${isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-rose-50 border-rose-200 text-rose-800"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSuccess ? "bg-emerald-100" : "bg-rose-100"
          }`}
      >
        {isSuccess ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-rose-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-snug">
          {isSuccess ? "Action Successful" : "Action Failed"}
        </p>
        <p className="text-xs font-medium mt-0.5 opacity-80">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-current opacity-40 hover:opacity-80 transition-opacity mt-0.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Skeleton row
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-200 rounded-lg animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

// Empty state
function EmptyState({ onRefresh }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-700">No Verification Requests</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">
        There are currently no ward verification requests to review.
      </p>
      <button
        onClick={onRefresh}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors duration-150 shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Refresh
      </button>
    </div>
  );
}

// Error state
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-rose-400">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-700">Failed to Load Requests</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors duration-150 shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Retry
      </button>
    </div>
  );
}

// Filter Tab Button
function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100"
        }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function WardVerificationRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [selectedWard, setSelectedWard] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState(null); // { message, type }

  // ── Fetch requests ─────────────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const { data } = await panchayathApi.wardVerifications();
      // Support both array response and { results: [] } pagination envelope
      setRequests(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      if (err.response?.status === 401) {
         panchayathApi.handleAuthError(err);
        toast.error("Unauthorized: JWT may be expired.");
      }
      setFetchError(
        err.response?.data?.detail ||
        err.message ||
        "An unexpected error occurred while fetching requests."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ── Handle modal success ───────────────────────────────────────────────────
  const handleSuccess = (action) => {
    const messages = {
      approved: "Ward verification has been approved successfully.",
      rejected: "Ward verification has been rejected with reason.",
    };
    setToast({ message: messages[action] ?? "Action completed.", type: "success" });
    fetchRequests();
    setTimeout(() => {
      window.dispatchEvent(new Event("ward-status-updated"));
    }, 300);
  };


  // ── Filtering + search ─────────────────────────────────────────────────────
  const filteredRequests = requests.filter((r) => {
    const matchStatus =
      activeFilter === "ALL" ||
      (r.status || "").toUpperCase() === activeFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      (r.ward_name || r.name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  // Count per status
  const countByStatus = (status) =>
    requests.filter((r) => (r.status || "").toUpperCase() === status).length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Ward Verification Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Review, approve, or reject submitted ward verifications
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      {!isLoading && !fetchError && requests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", count: requests.length, cls: "from-slate-50 to-slate-100 border-slate-200 text-slate-700" },
            { label: "Pending", count: countByStatus("PENDING"), cls: "from-amber-50 to-yellow-100/70 border-amber-200 text-amber-700" },
            { label: "Approved", count: countByStatus("APPROVED"), cls: "from-emerald-50 to-green-100/70 border-emerald-200 text-emerald-700" },
            { label: "Rejected", count: countByStatus("REJECTED"), cls: "from-rose-50 to-red-100/70 border-rose-200 text-rose-700" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border bg-gradient-to-br ${s.cls} px-4 py-3 flex items-center justify-between shadow-sm`}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">{s.label}</span>
              <span className="text-2xl font-black">{s.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            {STATUS_FILTERS.map((f) => (
              <FilterTab
                key={f}
                label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                count={f === "ALL" ? requests.length : countByStatus(f)}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0 w-full sm:w-60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ward or email…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all duration-150"
            />
          </div>
        </div>

        {/* Responsive table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  "Ward Name",
                  "Email",
                  "Submitted Date",
                  "Status",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Loading skeletons */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {/* Error */}
              {!isLoading && fetchError && (
                <tr>
                  <td colSpan={5}>
                    <ErrorState message={fetchError} onRetry={fetchRequests} />
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!isLoading && !fetchError && filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState onRefresh={fetchRequests} />
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!isLoading &&
                !fetchError &&
                filteredRequests.map((ward) => (
                  <tr
                    key={ward.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-colors duration-100 group"
                  >
                    {/* Ward Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-none">
                            {ward.ward_name || ward.name || "—"}
                          </p>
                          {ward.ward_number && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              Ward #{ward.ward_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 font-medium">
                        {ward.email || "—"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {formatDate(ward.submitted_at || ward.created_at)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={ward.status || "PENDING"} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedWard(ward)}
                        className="
                          inline-flex items-center gap-1.5
                          px-3.5 py-1.5
                          rounded-lg
                          bg-blue-50 hover:bg-blue-600
                          text-blue-700 hover:text-white
                          text-xs font-bold
                          border border-blue-200 hover:border-blue-600
                          transition-all duration-150
                          shadow-sm
                        "
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        {!isLoading && !fetchError && filteredRequests.length > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredRequests.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">{requests.length}</span>{" "}
              requests
              {activeFilter !== "ALL" && (
                <span className="text-slate-400"> · filtered by {activeFilter.toLowerCase()}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── Ward Approval Modal ── */}
      {selectedWard && (
        <WardApprovalModal
          ward={selectedWard}
          onClose={() => setSelectedWard(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}