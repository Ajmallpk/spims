import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintTable from "@/components/ward/Complainttable";
import ComplaintFilter from "@/components/ward/Complaintfilter";
import SearchBar from "@/components/ward/Searchbar";
import Pagination from "@/components/panjayath/Pagination";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function ComplaintList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchComplaints = useCallback(async (page, search, category, status) => {
    try {
      setIsLoading(true);

      const res = await wardapi.getComplaints({
        page,
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status }),
      });

      const data = res.data;

      setComplaints(data.results ?? []);
      setTotalCount(data.count ?? 0);

      const pageSize = data.results?.length || 10;
      setTotalPages(Math.ceil((data.count ?? 0) / pageSize) || 1);

    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints(currentPage, searchQuery, selectedCategory, selectedStatus);
  }, [currentPage, searchQuery, selectedCategory, selectedStatus, fetchComplaints]);

  const handleSearch = (q) => { setSearchQuery(q); setCurrentPage(1); };
  const handleCategory = (c) => { setSelectedCategory(c); setCurrentPage(1); };
  const handlePageChange = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleView = (id) => navigate(`/ward/complaints/${id}`);

  // Status summary counts
  const statusCounts = complaints.reduce((acc, c) => {
    const key = (c.status ?? "pending").toLowerCase().replace(/ /g, "_");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});


  const handleStatus = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">All Complaints</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and resolve citizen complaints under your ward
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={() => fetchComplaints(currentPage, searchQuery, selectedCategory, selectedStatus)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
            <svg className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Quick stats */}
      {!isLoading && complaints.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: totalCount, bg: "bg-gray-50 border-gray-200", text: "text-gray-700" },
            { label: "Pending", value: statusCounts.pending ?? 0, bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
            { label: "In Progress", value: statusCounts.in_progress ?? 0, bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
            { label: "Resolved", value: statusCounts.resolved ?? 0, bg: "bg-green-50 border-green-200", text: "text-green-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 flex items-center justify-between`}>
              <span className={`text-xs font-semibold ${s.text} opacity-70`}>{s.label}</span>
              <span className={`text-xl font-extrabold ${s.text}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">

        <SearchBar value={searchQuery} onChange={handleSearch} />

        <ComplaintFilter value={selectedCategory} onChange={handleCategory} />

        {/* 🔥 STATUS TOGGLE BUTTONS */}
        <div className="flex gap-2 flex-wrap">

          {[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "in_progress" },
            { label: "Resolved", value: "resolved" },
            { label: "Escalated", value: "escalated" },
          ].map((btn) => {
            const isActive = selectedStatus === btn.value;

            return (
              <button
                key={btn.value}
                onClick={() => handleStatus(btn.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition
          ${isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }
        `}
              >
                {btn.label}
              </button>
            );
          })}

        </div>

      </div>

      {/* Table */}
      <ComplaintTable complaints={complaints} isLoading={isLoading} onView={handleView} />

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