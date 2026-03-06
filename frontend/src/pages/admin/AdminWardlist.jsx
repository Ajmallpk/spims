import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapPin, RefreshCw } from "lucide-react";
import SearchBar from "@/components/admin/Searchbar";
import PanchayathFilter from "@/components/admin/Panchayathfilter";
import WardTable from "@/components/admin/Wardtable";
import Pagination from "@/components/admin/Pagination";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const WardList = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPanchayath, setSelectedPanchayath] = useState("");
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null,
    id: null,
  });

  const fetchWards = useCallback(
    async (page = 1, search = "", panchayath = "") => {
      setLoading(true);
      try {
        const params = { status: "approved", page };
        if (search) params.search = search;
        if (panchayath) params.panchayath = panchayath;

        const { data } = await adminapi.getWards(
          "approved",
          page,
          search,
          panchayath
        )

        if (Array.isArray(data)) {
          setWards(data);
          setTotalPages(1);
        } else {
          setWards(data.results || []);
          setTotalPages(
            data.total_pages || Math.ceil((data.count || 0) / 10) || 1
          );
        }
      } catch (err) {
        toast.error("Error fetching wards:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWards(currentPage, searchQuery, selectedPanchayath);
  }, [currentPage, searchQuery, selectedPanchayath, fetchWards]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePanchayathChange = useCallback((id) => {
    setSelectedPanchayath(id);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleSuspendWard = (id) => {
    setActionModal({ open: true, type: "suspend", id });
  };

  const handleActivateWard = (id) => {
    setActionModal({ open: true, type: "activate", id });
  };


  const handleConfirmAction = async () => {
    try {
      if (actionModal.type === "suspend") {
        await adminapi.suspendWard(actionModal.id);
      } else if (actionModal.type === "activate") {
        await adminapi.activateWard(actionModal.id);
      }

      setActionModal({ open: false, type: null, id: null });
      fetchWards(currentPage, searchQuery, selectedPanchayath);
    } catch (err) {
      toast.error("Ward action failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl mt-0.5">
            <MapPin className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Ward List
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              System-wide ward authority monitoring
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            fetchWards(currentPage, searchQuery, selectedPanchayath)
          }
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search wards…"
        />
        <PanchayathFilter
          value={selectedPanchayath}
          onChange={handlePanchayathChange}
        />
      </div>

      {/* Summary Pills */}
      {!loading && wards.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <MapPin size={11} />
            {wards.length} ward{wards.length !== 1 ? "s" : ""} shown
          </span>
          {selectedPanchayath && (
            <button
              onClick={() => handlePanchayathChange("")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors duration-150"
            >
              Clear filter ×
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <WardTable
        wards={wards}
        isLoading={loading}
        onSuspend={handleSuspendWard}
        onActivate={handleActivateWard}
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
              this Ward authority?
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

export default WardList;