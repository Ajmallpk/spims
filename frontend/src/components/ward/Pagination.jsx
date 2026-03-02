export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3">
      {/* Left: page count */}
      <p className="text-xs text-gray-400">
        Page <span className="font-semibold text-gray-600">{currentPage}</span> of{" "}
        <span className="font-semibold text-gray-600">{totalPages}</span>
      </p>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
            bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page number pills */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("ellipsis_" + p);
              acc.push(p);
              return acc;
            }, [])
            .map((p) =>
              typeof p === "string" ? (
                <span key={p} className="px-1 text-gray-400 text-xs">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  disabled={isLoading}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                    ${p === currentPage
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    }`}
                >
                  {p}
                </button>
              )
            )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
            bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}