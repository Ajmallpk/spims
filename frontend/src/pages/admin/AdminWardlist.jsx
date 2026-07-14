
import { useState, useEffect, useCallback } from "react";
import { MapPin, RefreshCw, Search, ArrowUpDown, SlidersHorizontal, CheckCircle2, Ban, X } from "lucide-react";
import SearchBar from "@/components/admin/Searchbar";
import PanchayathFilter from "@/components/admin/Panchayathfilter";
import WardTable from "@/components/admin/Wardtable";
import Pagination from "@/components/admin/Pagination";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";
import toast from "react-hot-toast";

/* ─── main component ──────────────────────────────────────── */

const WardList = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPanchayath, setSelectedPanchayath] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [complaintSort, setComplaintSort] = useState("");
  const [actionModal, setActionModal] = useState({ open: false, type: null, id: null });

  const fetchWards = useCallback(async (page = 1, panchayath = "") => {
    setLoading(true);
    try {
      const { data } = await adminapi.getWards({
        page, panchayath,
        name: nameSearch, email: emailSearch,
        status: statusFilter, complaints: complaintSort,
      });
      if (Array.isArray(data)) {
        setWards(data);
        setTotalPages(1);
      } else {
        setWards(data.results || []);
        setTotalPages(data.total_pages || Math.ceil((data.count || 0) / 10) || 1);
      }
    } catch (err) {
      handleApiError(err, "Error fetching wards");
    } finally {
      setLoading(false);
    }
  }, [nameSearch, emailSearch, statusFilter, complaintSort]);

  useEffect(() => {
    fetchWards(currentPage, selectedPanchayath);
  }, [currentPage, selectedPanchayath, nameSearch, emailSearch, statusFilter, complaintSort, fetchWards]);

  const handlePanchayathChange = useCallback((id) => {
    setSelectedPanchayath(id ? String(id) : "");
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuspendWard  = (id) => setActionModal({ open: true, type: "suspend",  id });
  const handleActivateWard = (id) => setActionModal({ open: true, type: "activate", id });

  const handleConfirmAction = async () => {
    try {
      if (actionModal.type === "suspend") {
        await adminapi.suspendWard(actionModal.id);
        // toast.success("Ward suspended successfully.");
      } else if (actionModal.type === "activate") {
        await adminapi.activateWard(actionModal.id);
        //  toast.success("Ward activated successfully.");
      }
      setActionModal({ open: false, type: null, id: null });
      fetchWards(currentPage, selectedPanchayath);
    } catch (err) {
      handleApiError(err, "Ward action failed");
    }
  };

  const hasFilters = nameSearch || emailSearch || statusFilter || complaintSort || selectedPanchayath;
  const isSuspend  = actionModal.type === "suspend";

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12">

      {/* ── page header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <MapPin size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Ward List</h1>
              <p className="text-sm text-gray-400 mt-0.5">System-wide ward authority monitoring</p>
            </div>
          </div>

          {/* controls */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* name search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <SearchBar
                onSearch={(value) => { setNameSearch(value); setCurrentPage(1); }}
                placeholder="Search ward name"
                className="pl-8"
              />
            </div>

            {/* email search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <SearchBar
                onSearch={(value) => { setEmailSearch(value); setCurrentPage(1); }}
                placeholder="Search email"
                className="pl-8"
              />
            </div>

            {/* status filter */}
            <div className="relative">
              <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-8 pr-8 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* complaint sort */}
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={complaintSort}
                onChange={(e) => { setComplaintSort(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-8 pr-8 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="">Sort by Complaints</option>
                <option value="high">High → Low</option>
                <option value="low">Low → High</option>
              </select>
            </div>

            {/* panchayath filter */}
            <PanchayathFilter
              value={selectedPanchayath}
              onChange={handlePanchayathChange}
            />

            {/* refresh */}
            <button
              onClick={() => fetchWards(currentPage, selectedPanchayath)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active filters:</span>

            {nameSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Name: {nameSearch}
                <button onClick={() => setNameSearch("")}><X size={11} /></button>
              </span>
            )}
            {emailSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Email: {emailSearch}
                <button onClick={() => setEmailSearch("")}><X size={11} /></button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("")}><X size={11} /></button>
              </span>
            )}
            {complaintSort && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Sort: {complaintSort === "high" ? "High → Low" : "Low → High"}
                <button onClick={() => setComplaintSort("")}><X size={11} /></button>
              </span>
            )}
            {selectedPanchayath && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Panchayath filtered
                <button onClick={() => handlePanchayathChange("")}><X size={11} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── ward count pill ── */}
      {!loading && wards.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <MapPin size={11} />
            {wards.length} ward{wards.length !== 1 ? "s" : ""} shown
          </span>
        </div>
      )}

      {/* ── table + pagination card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <MapPin size={14} className="text-indigo-500" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Wards</h2>
        </div>

        <WardTable
          wards={wards}
          isLoading={loading}
          searching={hasFilters}
          onSuspend={handleSuspendWard}
          onActivate={handleActivateWard}
        />

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* ── confirm action modal ── */}
      {actionModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* modal header */}
            <div className={`flex items-center gap-3 px-6 py-5 border-b ${isSuspend ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSuspend ? "bg-red-100" : "bg-emerald-100"}`}>
                {isSuspend
                  ? <Ban size={16} className="text-red-600" />
                  : <CheckCircle2 size={16} className="text-emerald-600" />
                }
              </div>
              <h2 className="text-base font-bold text-gray-800">
                Confirm {isSuspend ? "Suspension" : "Activation"}
              </h2>
            </div>

            {/* modal body */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to{" "}
                <span className={`font-semibold ${isSuspend ? "text-red-600" : "text-emerald-600"}`}>
                  {isSuspend ? "suspend" : "activate"}
                </span>{" "}
                this Ward authority? This action can be reversed later.
              </p>
            </div>

            {/* modal footer */}
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setActionModal({ open: false, type: null, id: null })}
                className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors ${
                  isSuspend ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isSuspend ? "Yes, Suspend" : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardList;