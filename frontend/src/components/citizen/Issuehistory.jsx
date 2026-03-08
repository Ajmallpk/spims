/**
 * IssueHistory.jsx
 * Filterable, paginated list of issues posted by the citizen.
 *
 * Props:
 *   issues  : array
 *   loading : boolean
 */

import { useState } from "react";
import StatusBadge from "@/components/citizen/StatusBadge";

const PAGE_SIZE = 5;
const FILTERS = ["ALL", "PENDING", "OPEN", "RESOLVED", "ESCALATED", "CLOSED"];

const IssueCard = ({ issue }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {issue.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {issue.category && (
                <span className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5 font-medium">
                  {issue.category}
                </span>
              )}
              {issue.location && (
                <span className="text-xs text-gray-400">{issue.location}</span>
              )}
            </div>
          </div>
        </div>
        <StatusBadge status={issue.status} size="sm" />
      </div>

      {/* Description */}
      <p
        className={`text-sm text-gray-600 leading-relaxed ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {issue.description}
      </p>
      {issue.description?.length > 120 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(issue.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {issue.upvotes !== undefined && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              {issue.upvotes}
            </span>
          )}
        </div>
        <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors">
          View
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse space-y-3">
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
      </div>
      <div className="h-5 w-16 bg-gray-100 rounded-full" />
    </div>
    <div className="space-y-1.5">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
    <div className="flex justify-between pt-2 border-t border-gray-50">
      <div className="h-3 w-24 bg-gray-100 rounded" />
      <div className="h-6 w-14 bg-gray-100 rounded-full" />
    </div>
  </div>
);

const IssueHistory = ({ issues = [], loading }) => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = issues.filter((i) => {
    const matchStatus = activeFilter === "ALL" || i.status === activeFilter;
    const matchSearch =
      !search ||
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f) => { setActiveFilter(f); setPage(1); };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-gray-800">Issue History</h2>
          {!loading && (
            <span className="bg-teal-50 text-teal-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {issues.length}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search issues…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-full pl-8 pr-4 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 transition-all w-44"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === f
                ? "bg-teal-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-gray-300">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-400">No issues found</p>
          <p className="text-xs text-gray-300">
            {search ? "Try a different search term" : "No issues match this filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                  page === p ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueHistory;