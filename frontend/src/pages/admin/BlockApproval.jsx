import { useState } from "react";
import AdminDashboardLayout from "@/layouts/admin/AdminDashboardLayout";
import BlockApprovalTable from "@/components/admin/BlockApprovalTable";
import BlockApprovalDetailsModal from "@/components/admin/BlockApprovalDetailsModal";
import RejectReasonModal from "@/components/admin/RejectReasonModal";

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const initialData = [
  {
    id: 1,
    blockName: "Tirur Block",
    name: "Muhammed Ashiq K",
    email: "ashiq.k@tirur.gov.in",
    phone: "+91 94460 12345",
    submittedDate: "22 Feb 2026",
    district: "Malappuram",
    status: "Pending",
  },
  {
    id: 2,
    blockName: "Tanur Block",
    name: "Sreeja Nair P",
    email: "sreeja.nair@tanur.gov.in",
    phone: "+91 98760 54321",
    submittedDate: "21 Feb 2026",
    district: "Malappuram",
    status: "Pending",
  },
  {
    id: 3,
    blockName: "Ponnani Block",
    name: "Arun Das M",
    email: "arun.das@ponnani.gov.in",
    phone: "+91 91234 67890",
    submittedDate: "20 Feb 2026",
    district: "Malappuram",
    status: "Approved",
  },
  {
    id: 4,
    blockName: "Perinthalmanna Block",
    name: "Fathima Beevi T",
    email: "fathima.t@perinthalmanna.gov.in",
    phone: "+91 87654 32109",
    submittedDate: "19 Feb 2026",
    district: "Malappuram",
    status: "Rejected",
  },
  {
    id: 5,
    blockName: "Kondotty Block",
    name: "Rajesh Kumar V",
    email: "rajesh.v@kondotty.gov.in",
    phone: "+91 99998 77776",
    submittedDate: "18 Feb 2026",
    district: "Malappuram",
    status: "Pending",
  },
  {
    id: 6,
    blockName: "Manjeri Block",
    name: "Anitha Lakshmi S",
    email: "anitha.s@manjeri.gov.in",
    phone: "+91 80001 22334",
    submittedDate: "17 Feb 2026",
    district: "Malappuram",
    status: "Approved",
  },
  {
    id: 7,
    blockName: "Nilambur Block",
    name: "Santhosh Babu R",
    email: "santhosh.r@nilambur.gov.in",
    phone: "+91 70009 88776",
    submittedDate: "16 Feb 2026",
    district: "Malappuram",
    status: "Pending",
  },
  {
    id: 8,
    blockName: "Eranad Block",
    name: "Priya Chandran G",
    email: "priya.g@eranad.gov.in",
    phone: "+91 96660 44455",
    submittedDate: "15 Feb 2026",
    district: "Malappuram",
    status: "Rejected",
  },
];

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected"];

const tabCounts = (data) => ({
  All: data.length,
  Pending: data.filter((d) => d.status === "Pending").length,
  Approved: data.filter((d) => d.status === "Approved").length,
  Rejected: data.filter((d) => d.status === "Rejected").length,
});

const tabStyle = {
  All: { active: "bg-slate-700/60 text-slate-200 border-slate-600/60", count: "bg-slate-600/60 text-slate-300" },
  Pending: { active: "bg-amber-500/15 text-amber-300 border-amber-500/30", count: "bg-amber-500/20 text-amber-400" },
  Approved: { active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", count: "bg-emerald-500/20 text-emerald-400" },
  Rejected: { active: "bg-red-500/15 text-red-300 border-red-500/30", count: "bg-red-500/20 text-red-400" },
};

// ─── Page Content ────────────────────────────────────────────────────────────
function BlockApprovalsContent() {
  const [records, setRecords] = useState(initialData);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    showToast("Block authority has been approved successfully.", "success");
  };

  const handleRejectOpen = (block) => {
    setRejectTarget(block);
    setShowDetailsModal(false);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = (id, reason) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected", rejectReason: reason } : r))
    );
    setShowRejectModal(false);
    setRejectTarget(null);
    showToast("Block authority request has been rejected.", "error");
  };

  const handleView = (block) => {
    setSelectedBlock(block);
    setShowDetailsModal(true);
  };

  const counts = tabCounts(records);

  const filteredBySearch = (filter === "All" ? records : records.filter((r) => r.status === filter))
    .filter((r) =>
      search === "" ||
      r.blockName.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-6 relative">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/90 border-red-500/30 text-red-300"
          }`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${toast.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-sm font-semibold font-mono">{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              Block Authority Verification Requests
            </h1>
          </div>
          <p className="text-sm text-slate-500 pl-3.5">
            Review and approve block-level authorities — {counts.Pending} pending action
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 font-mono">{counts.Pending} Pending</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 font-mono">{counts.Approved} Approved</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-xs font-bold text-red-400 font-mono">{counts.Rejected} Rejected</span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-slate-700/50">

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_TABS.map((tab) => {
              const isActive = filter === tab;
              const ts = tabStyle[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border font-mono transition-all duration-150 ${
                    isActive
                      ? ts.active
                      : "text-slate-600 bg-transparent border-transparent hover:text-slate-400 hover:border-slate-700/50"
                  }`}
                >
                  {tab}
                  <span className={`px-1.5 py-0.5 rounded-md text-xs leading-none ${isActive ? ts.count : "text-slate-700"}`}>
                    {counts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 focus-within:border-blue-500/40 transition-colors duration-150" style={{ minWidth: 220 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search block, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-300 placeholder-slate-700 focus:outline-none w-full font-mono"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-600 hover:text-slate-400 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <BlockApprovalTable
          data={filteredBySearch}
          filter="All"
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleRejectOpen}
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700/40 bg-slate-900/30">
          <p className="text-xs text-slate-700 font-mono">
            Showing <span className="text-slate-500">{filteredBySearch.length}</span> of <span className="text-slate-500">{records.length}</span> records
          </p>
          <p className="text-xs text-slate-700 font-mono">
            Last updated: <span className="text-slate-500">just now</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedBlock && (
        <BlockApprovalDetailsModal
          block={selectedBlock}
          onClose={() => { setShowDetailsModal(false); setSelectedBlock(null); }}
          onApprove={handleApprove}
          onReject={handleRejectOpen}
        />
      )}

      {showRejectModal && rejectTarget && (
        <RejectReasonModal
          block={rejectTarget}
          onClose={() => { setShowRejectModal(false); setRejectTarget(null); }}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────
export default function BlockApprovalsPage() {
  return (
    <AdminDashboardLayout defaultPage="approvals">
      <BlockApprovalsContent />
    </AdminDashboardLayout>
  );
}