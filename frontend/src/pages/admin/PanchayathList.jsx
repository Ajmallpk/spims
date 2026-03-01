import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";
import SearchBar from "@/components/admin/Searchbar";
import PanchayathTable from "@/components/admin/Searchbar";
import Pagination from "@/components/admin/Pagination";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const PanchayathList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPanchayaths = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = { status: "approved", page };
      if (search) params.search = search;

      const { data } = await axios.get("/api/admin/panchayaths/", {
        headers: getAuthHeaders(),
        params,
      });

      // Support both paginated { results, count } and plain array responses
      if (Array.isArray(data)) {
        setList(data);
        setTotalPages(1);
      } else {
        setList(data.results || []);
        setTotalPages(data.total_pages || Math.ceil((data.count || 0) / 10) || 1);
      }
    } catch (err) {
      console.error("Error fetching panchayaths:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPanchayaths(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchPanchayaths]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl mt-0.5">
            <Building2 className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Panchayath List
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              All verified and approved Panchayath authorities
            </p>
          </div>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search panchayaths…"
        />
      </div>

      {/* Table */}
      <PanchayathTable panchayaths={list} isLoading={loading} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PanchayathList;