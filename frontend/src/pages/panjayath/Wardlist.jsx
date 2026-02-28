// pages/WardList.jsx
// SPIMS – Smart Panchayath Issue Management System
// Ward List page — shows only approved wards under this Panchayath.
//
// API: GET /api/panchayath/wards/?status=approved&page={n}&search={q}
// Auth: Authorization: Bearer {access}
// Supports: pagination, debounced search, error + empty states

import { useState, useEffect, useCallback } from "react";
import WardSearchBar from "@/components/panjayath/Wardsearchbar";
import WardTable from "@/components/panjayath/Wardtable";
import Pagination from "@/components/panjayath/Pagination";
import panchayathApi from "@/service/panchayathurls";


// ─── Sub-components ───────────────────────────────────────────────────────────

// Full-page loading spinner (initial load only)
function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-slate-500 font-medium">Loading wards…</p>
    </div>
  );
}

// Empty state — no results
function EmptyState({ hasSearch, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {hasSearch ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-700">
        {hasSearch ? "No matching wards found" : "No Approved Wards Yet"}
      </h3>
      <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">
        {hasSearch
          ? "Try adjusting your search query to find what you're looking for."
          : "Approved wards will appear here once verified by the Panchayath."}
      </p>
      {hasSearch && (
        <button
          onClick={onClear}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          Clear Search
        </button>
      )}
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
      <h3 className="text-base font-bold text-slate-700">Failed to Load Wards</h3>
      <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors duration-150"
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

// ─── Summary Stat Card ────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, borderColor, iconBg }) {
  return (
    <div className={`bg-white rounded-xl border ${borderColor} shadow-sm px-5 py-4 flex items-center gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false); // soft reload (page/search change)
  const [fetchError, setFetchError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchWards = useCallback(
    async ({ page = 1, search = "", isInitial = false } = {}) => {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      setFetchError("");

      try {
        const { data } = await panchayathApi.wards({
          status: "approved",
          page,
          ...(search.trim() && { search: search.trim() }),
        });

        if (Array.isArray(data)) {
          setWards(data);
          setTotalPages(1);
          setTotalCount(data.length);
        } else {
          setWards(data.results ?? []);
          setTotalCount(data.count ?? data.total ?? 0);
          setTotalPages(
            data.total_pages ??
            data.num_pages ??
            Math.ceil((data.count ?? 0) / (data.page_size ?? 10)) ??
            1
          );
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.error("[WardList] Unauthorized – JWT may be expired.");
        } else {
          console.error("[WardList] Fetch error:", err);
        }
        setFetchError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while loading wards."
        );
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    },
    []
  );

  // Initial mount
  useEffect(() => {
    fetchWards({ page: 1, search: "", isInitial: true });
  }, [fetchWards]);

  // Re-fetch when page or search changes (not on first mount — handled above)
  useEffect(() => {
    fetchWards({ page: currentPage, search: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  // ── Search handler (called by WardSearchBar after debounce) ───────────────
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // ── Page change ────────────────────────────────────────────────────────────
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Retry ─────────────────────────────────────────────────────────────────
  const handleRetry = () => {
    fetchWards({ page: currentPage, search: searchQuery, isInitial: isLoading });
  };

  const showTableSkeleton = isLoading || isRefetching;
  const showEmptyState = !isLoading && !fetchError && wards.length === 0;
  const showError = !isLoading && !!fetchError;
  const showTable = !isLoading && !fetchError && wards.length > 0;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {/* Breadcrumb hint */}
            <span className="text-xs text-slate-400 font-medium">Panchayath</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-xs text-blue-600 font-semibold">Ward List</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Approved Wards
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Manage and monitor ward authorities under your Panchayath
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRetry}
          disabled={isLoading || isRefetching}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50 self-start sm:self-auto"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary Stats (only when data available) ── */}
      {!isLoading && !fetchError && totalCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Approved Wards"
            value={totalCount}
            sub="Total under this Panchayath"
            borderColor="border-emerald-200"
            iconBg="bg-emerald-100"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
          />
          <StatCard
            label="Current Page"
            value={`${currentPage} / ${totalPages}`}
            sub="Use pagination to navigate"
            borderColor="border-blue-200"
            iconBg="bg-blue-100"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
            }
          />
          <StatCard
            label="Showing on Page"
            value={wards.length}
            sub={searchQuery ? `Filtered by "${searchQuery}"` : "All wards on this page"}
            borderColor="border-slate-200"
            iconBg="bg-slate-100"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            }
          />
        </div>
      )}

      {/* ── Main Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Ward Registry</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalCount > 0
                ? `${totalCount} approved ward${totalCount !== 1 ? "s" : ""} registered`
                : "Approved wards under this Panchayath"}
            </p>
          </div>

          {/* Search bar */}
          <WardSearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>

        {/* Active search indicator */}
        {searchQuery && !isLoading && (
          <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search results for{" "}
              <span className="bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                {searchQuery}
              </span>
            </p>
            <button
              onClick={() => handleSearchChange("")}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="p-5">
          {/* Initial loading spinner */}
          {isLoading && <PageSpinner />}

          {/* Error */}
          {showError && (
            <ErrorState message={fetchError} onRetry={handleRetry} />
          )}

          {/* Empty */}
          {showEmptyState && (
            <EmptyState
              hasSearch={!!searchQuery}
              onClear={() => handleSearchChange("")}
            />
          )}

          {/* Table (also shown while re-fetching with skeleton) */}
          {(showTable || (isRefetching && !isLoading)) && (
            <div className="space-y-4">
              <WardTable wards={wards} isLoading={isRefetching} />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isRefetching}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}