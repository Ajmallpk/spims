
import { useState, useEffect, useCallback } from "react";
import WardSearchBar from "@/components/panjayath/Wardsearchbar";
import WardTable from "@/components/panjayath/Wardtable";
import Pagination from "@/components/panjayath/Pagination";
import panchayathApi from "@/service/panchayathurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
        <div className="absolute inset-[6px] rounded-full border-[2px] border-indigo-200 border-b-transparent animate-spin animation-delay-150" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-600">Loading wards</p>
        <p className="text-xs text-slate-400 mt-0.5">Fetching ward registry…</p>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/80 flex items-center justify-center shadow-inner">
          {hasSearch ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-9 h-9 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-9 h-9 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        {hasSearch ? "No matching wards" : "No Approved Wards Yet"}
      </h3>
      <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
        {hasSearch
          ? "Try adjusting your search query to find what you're looking for."
          : "Approved wards will appear here once verified by the Panchayath."}
      </p>
      {hasSearch && (
        <button
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all duration-150 hover:-translate-y-px"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          Clear Search
        </button>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/60 flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-9 h-9 text-rose-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">Failed to Load Wards</h3>
      <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold shadow-md shadow-rose-200 transition-all duration-150 hover:-translate-y-px"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Retry
      </button>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }) {
  const accents = {
    green: {
      border: "border-emerald-200/70",
      iconRing: "ring-emerald-100",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      dot: "bg-emerald-400",
      subText: "text-emerald-600/70",
    },
    blue: {
      border: "border-blue-200/70",
      iconRing: "ring-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      dot: "bg-blue-400",
      subText: "text-blue-600/70",
    },
    slate: {
      border: "border-slate-200/70",
      iconRing: "ring-slate-100",
      iconBg: "bg-gradient-to-br from-slate-500 to-slate-700",
      dot: "bg-slate-400",
      subText: "text-slate-500/70",
    },
  };

  const a = accents[accent] || accents.slate;

  return (
    <div className={`relative bg-white rounded-2xl border ${a.border} shadow-sm px-5 py-4 flex items-center gap-4 overflow-hidden group hover:shadow-md transition-shadow duration-200`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 pointer-events-none" />
      <div className={`relative w-11 h-11 rounded-2xl ${a.iconBg} ring-4 ${a.iconRing} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div className="relative min-w-0">
        <p className="text-2xl font-black text-slate-900 leading-none tracking-tight tabular-nums">{value}</p>
        <p className="text-xs font-semibold text-slate-500 mt-1 truncate">{label}</p>
        {sub && <p className={`text-[10px] font-medium ${a.subText} mt-0.5 truncate`}>{sub}</p>}
      </div>
      {/* Decorative dot */}
      <div className={`absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full ${a.dot} opacity-60`} />
    </div>
  );
}

// ─── Sort Select ──────────────────────────────────────────────────────────────

function SortSelect({ value, onChange, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300"
      >
        <option value="">Complaint Count</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortComplaint, setSortComplaint] = useState("");

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
        const params = { page };
        if (search.trim()) params.search = search.trim();
        if (sortComplaint) params.complaint_sort = sortComplaint;

        console.log("SORT:", sortComplaint);

        const { data } = await panchayathApi.listWard(params);

        if (Array.isArray(data)) {
          setWards(data);
          setTotalPages(1);
          setTotalCount(data.length);
        } else {
          const actualData = data.results?.data || [];
          setWards(actualData);
          setTotalCount(data.count ?? actualData.length);
          setTotalPages(
            data.total_pages ??
            data.num_pages ??
            Math.ceil((data.count ?? 0) / (data.page_size ?? 10)) ??
            1
          );
        }
      } catch (err) {
        panchayathApi.handleAuthError(err);
        handleApiError(err, "Failed to load wards");
        console.error(err);
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
    [sortComplaint]
  );

  useEffect(() => {
    fetchWards({ page: 1, search: "", isInitial: true });
  }, [fetchWards]);

  useEffect(() => {
    fetchWards({ page: currentPage, search: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, sortComplaint]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    fetchWards({ page: currentPage, search: searchQuery, isInitial: isLoading });
  };

  const showEmptyState = !isLoading && !fetchError && wards.length === 0;
  const showError = !isLoading && !!fetchError;
  const showTable = !isLoading && !fetchError && wards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-3">
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Panchayath</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-slate-300 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">Ward List</span>
            </nav>

            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Approved Wards
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Manage and monitor ward authorities under your Panchayath
                </p>
              </div>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRetry}
            disabled={isLoading || isRefetching}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-semibold shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto group"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${isRefetching ? "animate-spin" : "group-hover:rotate-180"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {isRefetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ── Summary Stats ── */}
        {!isLoading && !fetchError && totalCount > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              accent="green"
              label="Approved Wards"
              value={totalCount}
              sub="Total under this Panchayath"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
            />
            <StatCard
              accent="blue"
              label="Current Page"
              value={`${currentPage} / ${totalPages}`}
              sub="Use pagination to navigate"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
              }
            />
            <StatCard
              accent="slate"
              label="Showing on Page"
              value={wards.length}
              sub={searchQuery ? `Filtered by "${searchQuery}"` : "All wards on this page"}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              }
            />
          </div>
        )}

        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-200/50 overflow-hidden">

          {/* Card Header / Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white via-slate-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Ward Registry</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {totalCount > 0
                  ? `${totalCount} approved ward${totalCount !== 1 ? "s" : ""} registered`
                  : "Approved wards under this Panchayath"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <div className="flex-1 sm:flex-none sm:w-64">
                <WardSearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={isLoading}
                />
              </div>
              <div className="w-44">
                <SortSelect
                  value={sortComplaint}
                  onChange={(e) => {
                    setSortComplaint(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Active search indicator pill */}
          {searchQuery && !isLoading && (
            <div className="px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3.5 h-3.5 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <p className="text-xs text-indigo-700 font-medium truncate">
                  Showing results for{" "}
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-bold">
                    {searchQuery}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleSearchChange("")}
                className="flex-shrink-0 text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors underline-offset-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* ── Content ── */}
          <div className="p-6">
            {isLoading && <PageSpinner />}

            {showError && (
              <ErrorState message={fetchError} onRetry={handleRetry} />
            )}

            {showEmptyState && (
              <EmptyState
                hasSearch={!!searchQuery}
                onClear={() => handleSearchChange("")}
              />
            )}

            {(showTable || (isRefetching && !isLoading)) && (
              <div className="space-y-5">
                <WardTable wards={wards} isLoading={isRefetching} />
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
    </div>
  );
}