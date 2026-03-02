import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CitizenTable from "../components/CitizenTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function CitizenList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [citizens, setCitizens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCitizens = useCallback(async (page, search) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: "approved",
        page: String(page),
        ...(search ? { search } : {}),
      });

      const res = await fetch(`${API_BASE}/api/ward/citizens/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Support both paginated { results, count } and plain array responses
      if (Array.isArray(data)) {
        setCitizens(data);
        setTotalPages(1);
        setTotalCount(data.length);
      } else {
        setCitizens(data.results ?? []);
        setTotalCount(data.count ?? 0);
        const pageSize = data.results?.length || 10;
        setTotalPages(Math.ceil((data.count ?? 0) / pageSize) || 1);
      }
    } catch (err) {
      console.error("Failed to fetch citizens:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCitizens(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchCitizens]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (id) => {
    navigate(`/ward/citizens/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Approved Citizens</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and monitor verified citizens under your ward
          </p>
        </div>

        {/* Total Badge */}
        {!isLoading && (
          <div className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-semibold text-gray-700">
              {totalCount.toLocaleString()} Citizen{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchBar value={searchQuery} onChange={handleSearch} />
        {searchQuery && !isLoading && (
          <p className="text-xs text-gray-500 whitespace-nowrap">
            {citizens.length === 0
              ? "No results found"
              : `${citizens.length} result${citizens.length !== 1 ? "s" : ""} for "${searchQuery}"`}
          </p>
        )}
      </div>

      {/* Table */}
      <CitizenTable
        citizens={citizens}
        isLoading={isLoading}
        onView={handleView}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}