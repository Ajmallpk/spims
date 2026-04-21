import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";
import SearchBar from "@/components/admin/Searchbar";
import PanchayathTable from "@/components/admin/Panchayathtable";
import Pagination from "@/components/admin/Pagination";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const PanchayathList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null,
    id: null,
  });
  const [filterStatus, setFilterStatus] = useState("approved");

  const fetchPanchayaths = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = { status: filterStatus, page };
      if (search) params.search = search;

      const { data } = await adminapi.getPanchayaths(params)

      if (Array.isArray(data)) {
        setList(data);
        setTotalPages(1);
      } else {
        setList(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 10));
      }
    } catch (err) {
      // toast.error("Error fetching panchayaths:", err);
      handleApiError(err, "Failed to fetch panchayaths");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const handleSuspend = (id) => {
    setActionModal({ open: true, type: "suspend", id });
  };

  const handleActivate = (id) => {
    setActionModal({ open: true, type: "activate", id });
  };


  const handleConfirmAction = async () => {
    try {
      if (actionModal.type === "suspend") {
        await adminapi.suspendPanchayath(actionModal.id);
      } else if (actionModal.type === "activate") {
        await adminapi.activatePanchayath(actionModal.id);
      }

      setActionModal({ open: false, type: null, id: null });
      fetchPanchayaths(currentPage, searchQuery);
    } catch (err) {
      // toast.error("Action failed:", err);
      handleApiError(err, "Action failed:");
    }
  };

  useEffect(() => {
    fetchPanchayaths(currentPage, searchQuery);
  }, [currentPage, searchQuery, filterStatus, fetchPanchayaths]);

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

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-3 py-1 rounded text-sm ${filterStatus === "approved"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-emerald-700"
            }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilterStatus("suspended")}
          className={`px-3 py-1 rounded text-sm ${filterStatus === "suspended"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-700"
            }`}
        >
          Suspended
        </button>
      </div>

      {/* Table */}
      <PanchayathTable
        panchayaths={list}
        isLoading={loading}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {actionModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm {actionModal.type === "suspend" ? "Suspension" : "Activation"}
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {actionModal.type === "suspend" ? "suspend" : "activate"}
              </span>{" "}
              this Panchayath authority?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setActionModal({ open: false, type: null, id: null })
                }
                className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${actionModal.type === "suspend"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanchayathList;