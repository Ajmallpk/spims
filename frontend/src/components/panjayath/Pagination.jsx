// components/Pagination.jsx
// SPIMS – Smart Panchayath Issue Management System
// Pagination controls: Previous / page indicators / Next.
// Handles edge cases: first page, last page, single page.
//
// Props:
//   currentPage   {number}   - 1-based current page number
//   totalPages    {number}   - Total number of pages
//   onPageChange  {Function} - Called with new page number
//   isLoading     {boolean}  - Disable controls during fetch
//   totalCount    {number}   - (optional) total record count for display

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  totalCount,
}) {
  // Don't render if there's only one page or no pages at all
  if (!totalPages || totalPages <= 1) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  // Build visible page numbers window (max 5 pages shown)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    return Array.from(pages).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  const btnBase = `
    inline-flex items-center justify-center
    min-w-[36px] h-9 px-3
    rounded-lg
    text-sm font-semibold
    border
    transition-all duration-150
    select-none
  `;

  const activeBtn = `
    bg-blue-600 text-white border-blue-600
    shadow-sm shadow-blue-200
    cursor-default
  `;

  const inactiveBtn = `
    bg-white text-slate-600 border-slate-200
    hover:bg-slate-50 hover:border-slate-300
    cursor-pointer
  `;

  const disabledBtn = `
    bg-slate-50 text-slate-300 border-slate-200
    cursor-not-allowed opacity-60
  `;

  const navBtn = (disabled) =>
    disabled || isLoading ? disabledBtn : inactiveBtn;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      {/* Record count summary */}
      {totalCount !== undefined && (
        <p className="text-xs text-slate-500 font-medium order-2 sm:order-1">
          Page{" "}
          <span className="font-bold text-slate-700">{currentPage}</span> of{" "}
          <span className="font-bold text-slate-700">{totalPages}</span>
          {totalCount !== undefined && (
            <>
              {" · "}
              <span className="font-bold text-slate-700">{totalCount}</span>{" "}
              total records
            </>
          )}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous */}
        <button
          onClick={() => !isFirst && !isLoading && onPageChange(currentPage - 1)}
          disabled={isFirst || isLoading}
          aria-label="Previous page"
          className={`${btnBase} ${navBtn(isFirst)} gap-1.5`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) => {
          const prevPage = pageNumbers[idx - 1];
          const showEllipsisBefore = prevPage && page - prevPage > 1;

          return (
            <span key={page} className="flex items-center gap-1.5">
              {showEllipsisBefore && (
                <span className="text-slate-400 text-sm select-none px-1">…</span>
              )}
              <button
                onClick={() =>
                  page !== currentPage && !isLoading && onPageChange(page)
                }
                disabled={isLoading}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={`${btnBase} ${
                  page === currentPage ? activeBtn : inactiveBtn
                } ${isLoading && page !== currentPage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {page}
              </button>
            </span>
          );
        })}

        {/* Next */}
        <button
          onClick={() => !isLast && !isLoading && onPageChange(currentPage + 1)}
          disabled={isLast || isLoading}
          aria-label="Next page"
          className={`${btnBase} ${navBtn(isLast)} gap-1.5`}
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}