import { useState, useMemo } from "react";
import AdminDashboardLayout from "@/layouts/admin/Admindashboardlayout";
import StatCard from "@/components/admin/StatCard";
import BlockFilterBar from "@/components/admin/BlockFilterBar";
import BlockListTable from "@/components/admin/BlockListTable";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const BLOCKS_DATA = [
  { id: 1, blockName: "Tirur Block", email: "tirur.admin@spims.gov.in", phone: "+91 94460 11001", district: "Malappuram", status: "Active", totalPanchayaths: 62, totalWards: 744, createdDate: "12 Jan 2024", avatarColor: "#3b82f6" },
  { id: 2, blockName: "Tanur Block", email: "tanur.admin@spims.gov.in", phone: "+91 94460 11002", district: "Malappuram", status: "Active", totalPanchayaths: 44, totalWards: 528, createdDate: "14 Jan 2024", avatarColor: "#22c55e" },
  { id: 3, blockName: "Ponnani Block", email: "ponnani.admin@spims.gov.in", phone: "+91 94460 11003", district: "Malappuram", status: "Pending", totalPanchayaths: 0, totalWards: 0, createdDate: "16 Feb 2026", avatarColor: "#f59e0b" },
  { id: 4, blockName: "Perinthalmanna Block", email: "perinthalmanna.admin@spims.gov.in", phone: "+91 94460 11004", district: "Malappuram", status: "Active", totalPanchayaths: 55, totalWards: 660, createdDate: "20 Jan 2024", avatarColor: "#8b5cf6" },
  { id: 5, blockName: "Kondotty Block", email: "kondotty.admin@spims.gov.in", phone: "+91 94460 11005", district: "Malappuram", status: "Suspended", totalPanchayaths: 38, totalWards: 456, createdDate: "25 Jan 2024", avatarColor: "#ef4444" },
  { id: 6, blockName: "Manjeri Block", email: "manjeri.admin@spims.gov.in", phone: "+91 94460 11006", district: "Malappuram", status: "Active", totalPanchayaths: 71, totalWards: 852, createdDate: "02 Feb 2024", avatarColor: "#06b6d4" },
  { id: 7, blockName: "Nilambur Block", email: "nilambur.admin@spims.gov.in", phone: "+91 94460 11007", district: "Malappuram", status: "Active", totalPanchayaths: 49, totalWards: 588, createdDate: "05 Feb 2024", avatarColor: "#f97316" },
  { id: 8, blockName: "Eranad Block", email: "eranad.admin@spims.gov.in", phone: "+91 94460 11008", district: "Malappuram", status: "Pending", totalPanchayaths: 0, totalWards: 0, createdDate: "18 Feb 2026", avatarColor: "#a78bfa" },
  { id: 9, blockName: "Tirur Municipality", email: "tirurm.admin@spims.gov.in", phone: "+91 94460 11009", district: "Malappuram", status: "Suspended", totalPanchayaths: 22, totalWards: 264, createdDate: "10 Mar 2024", avatarColor: "#fb7185" },
  { id: 10, blockName: "Malappuram Block", email: "malappuram.admin@spims.gov.in", phone: "+91 94460 11010", district: "Malappuram", status: "Active", totalPanchayaths: 78, totalWards: 936, createdDate: "15 Mar 2024", avatarColor: "#34d399" },
  { id: 11, blockName: "Tirurrangadi Block", email: "tirurrangadi.admin@spims.gov.in", phone: "+91 94460 11011", district: "Malappuram", status: "Active", totalPanchayaths: 33, totalWards: 396, createdDate: "20 Mar 2024", avatarColor: "#60a5fa" },
  { id: 12, blockName: "Valanchery Block", email: "valanchery.admin@spims.gov.in", phone: "+91 94460 11012", district: "Malappuram", status: "Pending", totalPanchayaths: 0, totalWards: 0, createdDate: "20 Feb 2026", avatarColor: "#fbbf24" },
];

// ─── Stat icon helpers ─────────────────────────────────────────────────────
const TotalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ActiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SuspendedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeLinecap="round" />
  </svg>
);

// ─── Page Content ─────────────────────────────────────────────────────────────
function ListBlocksContent() {
  const [blocks, setBlocks] = useState(BLOCKS_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSuspend = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Suspended" } : b)));
    showToast("Block authority has been suspended.", "error");
  };

  const handleActivate = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Active" } : b)));
    showToast("Block authority has been reactivated.", "success");
  };

  const handleViewProfile = (block) => {
    showToast(`Viewing profile: ${block.blockName}`, "info");
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedStatus("All");
  };

  // Live stats
  const stats = useMemo(() => ({
    total: blocks.length,
    active: blocks.filter((b) => b.status === "Active").length,
    pending: blocks.filter((b) => b.status === "Pending").length,
    suspended: blocks.filter((b) => b.status === "Suspended").length,
  }), [blocks]);

  // Filtered records
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesSearch =
        searchTerm === "" ||
        b.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "All" || b.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [blocks, searchTerm, selectedStatus]);

  const hasFilters = searchTerm !== "" || selectedStatus !== "All";

  return (
    <div className="flex flex-col gap-6 relative">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-300"
              : toast.type === "error"
              ? "bg-red-950/95 border-red-500/30 text-red-300"
              : "bg-slate-800/95 border-slate-600/50 text-slate-300"
          }`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-400"
                : toast.type === "error"
                ? "bg-red-400"
                : "bg-blue-400"
            }`}
          />
          <span className="text-sm font-semibold font-mono">{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              Registered Block Authorities
            </h1>
          </div>
          <p className="text-sm text-slate-500 pl-3.5">
            Overview and monitoring of active block administrations
          </p>
        </div>

        {/* Export / Refresh */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono text-slate-400 bg-slate-800/50 border border-slate-700/50 hover:text-slate-200 hover:border-slate-600/70 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono text-blue-400 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Blocks"
          value={stats.total}
          subtext="All registered authorities"
          color="blue"
          trend={`${stats.total} total`}
          icon={<TotalIcon />}
        />
        <StatCard
          title="Active Blocks"
          value={stats.active}
          subtext="Fully operational"
          color="green"
          trend={`${Math.round((stats.active / stats.total) * 100)}% rate`}
          icon={<ActiveIcon />}
        />
        <StatCard
          title="Pending Verification"
          value={stats.pending}
          subtext="Awaiting admin review"
          color="yellow"
          trend={stats.pending > 0 ? "Action needed" : "All clear"}
          icon={<PendingIcon />}
        />
        <StatCard
          title="Suspended Blocks"
          value={stats.suspended}
          subtext="Access restricted"
          color="red"
          trend={stats.suspended > 0 ? "Review needed" : "None"}
          icon={<SuspendedIcon />}
        />
      </div>

      {/* Filter Bar */}
      <BlockFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClear={handleClear}
        totalResults={filteredBlocks.length}
      />

      {/* Table Card */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-slate-500 to-slate-700" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
              Block Directory
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status legend */}
            {[
              { label: "Active", dot: "bg-emerald-400" },
              { label: "Pending", dot: "bg-amber-400" },
              { label: "Suspended", dot: "bg-red-400" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/40">
                <span className={`w-1.5 h-1.5 rounded-full ${l.dot}`} />
                <span className="text-xs text-slate-600 font-mono">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <BlockListTable
          data={filteredBlocks}
          onViewProfile={handleViewProfile}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          hasFilters={hasFilters}
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700/40 bg-slate-900/30">
          <p className="text-xs text-slate-700 font-mono">
            Showing{" "}
            <span className="text-slate-500">{filteredBlocks.length}</span> of{" "}
            <span className="text-slate-500">{blocks.length}</span> blocks
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-xs text-slate-700 font-mono">
              Last updated: <span className="text-slate-500">just now</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ListBlocksPage() {
  return (
    <AdminDashboardLayout defaultPage="blocks">
      <ListBlocksContent />
    </AdminDashboardLayout>
  );
}