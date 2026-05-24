
import { useState, useEffect, useCallback } from "react";
import { Building2, Search, ArrowUpDown, CheckCircle2, Ban, SlidersHorizontal } from "lucide-react";
import SearchBar from "@/components/admin/Searchbar";
import PanchayathTable from "@/components/admin/Panchayathtable";
import Pagination from "@/components/admin/Pagination";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";

/* ─── reusable components ─────────────────────────────────── */

const FilterTab = ({ active, onClick, label, icon: Icon, activeClass, inactiveClass }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${active ? activeClass : inactiveClass
      }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

/* ─── main component ──────────────────────────────────────── */

const PanchayathList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [complaintSort, setComplaintSort] = useState("");
  const [filterStatus, setFilterStatus] = useState("approved");
  const [actionModal, setActionModal] = useState({ open: false, type: null, id: null });

  const fetchPanchayaths = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { status: filterStatus, page, name: nameSearch, email: emailSearch, complaints: complaintSort };
      const { data } = await adminapi.getPanchayaths(params);
      if (Array.isArray(data)) {
        setList(data);
        setTotalPages(1);
      } else {
        setList(data.results || []);
        setTotalPages(
          Math.max(
            1,
            Math.ceil(
              (data.count || 0) / 10
            )
          )
        );
      }
    } catch (err) {
      handleApiError(err, "Failed to fetch panchayaths");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, nameSearch, emailSearch, complaintSort]);

  useEffect(() => {
    fetchPanchayaths(currentPage);
  }, [currentPage, filterStatus, fetchPanchayaths]);

  const handleSuspend = (id) => setActionModal({ open: true, type: "suspend", id });
  const handleActivate = (id) => setActionModal({ open: true, type: "activate", id });

  const handleConfirmAction = async () => {
    try {
      if (actionModal.type === "suspend") {
        await adminapi.suspendPanchayath(actionModal.id);
      } else if (actionModal.type === "activate") {
        await adminapi.activatePanchayath(actionModal.id);
      }
      setActionModal({ open: false, type: null, id: null });
      fetchPanchayaths(currentPage);
    } catch (err) {
      handleApiError(
        err,
        `Failed to ${actionModal.type === "suspend"
          ? "suspend"
          : "activate"
        } panchayath`
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSuspend = actionModal.type === "suspend";

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12">

      {/* ── page header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Panchayath List</h1>
              <p className="text-sm text-gray-400 mt-0.5">All verified and approved Panchayath authorities</p>
            </div>
          </div>

          {/* search & sort controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <SearchBar
                onSearch={(value) => { setNameSearch(value); setCurrentPage(1); }}
                placeholder="Search by name"
                className="pl-8"
              />
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <SearchBar
                onSearch={(value) => { setEmailSearch(value); setCurrentPage(1); }}
                placeholder="Search by email"
                className="pl-8"
              />
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
          </div>
        </div>
      </div>

      {/* ── filter tabs + table card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* filter strip */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-1">Status</span>

          <FilterTab
            active={filterStatus === "approved"}
            onClick={() => { setFilterStatus("approved"); setCurrentPage(1); }}
            label="Approved"
            icon={CheckCircle2}
            activeClass="bg-emerald-600 text-white border-emerald-600 shadow-sm"
            inactiveClass="bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          />

          <FilterTab
            active={filterStatus === "suspended"}
            onClick={() => { setFilterStatus("suspended"); setCurrentPage(1); }}
            label="Suspended"
            icon={Ban}
            activeClass="bg-red-600 text-white border-red-600 shadow-sm"
            inactiveClass="bg-white text-red-600 border-red-200 hover:bg-red-50"
          />
        </div>

        {/* table */}
        <div className="p-0">
          <PanchayathTable
            panchayaths={list}
            isLoading={loading}
            searching={nameSearch || emailSearch}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
          />
        </div>

        {/* pagination */}
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
                this Panchayath authority? This action can be reversed later.
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
                className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors ${isSuspend ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
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

export default PanchayathList;