import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination
 * Props:
 *  - currentPage: number (1-based)
 *  - totalPages: number
 *  - onPageChange: (page: number) => void
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-xs text-gray-400 font-medium">
        Page{" "}
        <span className="text-gray-700 font-semibold">{currentPage}</span> of{" "}
        <span className="text-gray-700 font-semibold">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft size={13} />
          Previous
        </button>

        {/* Page number pills — show a window around current page */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
            )
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) {
                acc.push("…");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1.5 text-xs text-gray-400 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors duration-150 ${
                    p === currentPage
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;