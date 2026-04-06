import { useState, useEffect } from "react";
import panchayathApi from "@/service/panchayathurls";



const CATEGORY_COLORS = {
    ROAD: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
    WATER: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    ELECTRICITY: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
    WASTE: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
    OTHER: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
};

const STATUS_CONFIG = {
    ESCALATED: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "Escalated",
        cardAccent: "border-l-red-500",
    },
    IN_PROGRESS: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "In Progress",
        cardAccent: "border-l-amber-400",
    },
    RESOLVED: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        label: "Resolved",
        cardAccent: "border-l-emerald-500",
    },
};



function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-pulse border-l-4 border-l-slate-200">
            <div className="flex items-start justify-between mb-3">
                <div className="h-4 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-20" />
            </div>
            <div className="h-5 bg-slate-200 rounded w-4/5 mb-2" />
            <div className="h-5 bg-slate-200 rounded w-3/5 mb-4" />
            <div className="h-3 bg-slate-100 rounded w-full mb-2" />
            <div className="h-3 bg-slate-100 rounded w-5/6 mb-5" />
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-3 bg-slate-200 rounded w-28 mb-1" />
                    <div className="h-3 bg-slate-200 rounded w-20" />
                </div>
                <div className="h-8 bg-slate-200 rounded-lg w-24" />
            </div>
        </div>
    );
}

function CategoryBadge({ category }) {
    const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {category}
        </span>
    );
}

function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
            {s.label}
        </span>
    );
}

function ComplaintCard({ complaint }) {
    const accent = STATUS_CONFIG[complaint.status].cardAccent;

    return (
        <div
            className={`group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 border-l-4 ${accent} p-5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-3`}
        >
            {/* Top row: badges */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <CategoryBadge category={complaint.category} />
                <StatusBadge status={complaint.status} />
            </div>

            {/* Title */}
            <h3 className="text-slate-800 font-bold text-base leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                {complaint.title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{complaint.description}</p>

            {/* Meta */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-auto">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-slate-600">{complaint.citizen_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{complaint.ward_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(complaint.created_at)}</span>
                </div>
            </div>

            {/* Divider + Footer */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{complaint.id}</span>
                <button
                    onClick={() => (window.location.href = `/panchayath/complaints/${complaint.id}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                    View Details
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="text-slate-700 font-semibold text-base mb-1">No complaints found</h3>
            <p className="text-slate-400 text-sm max-w-xs">
                No complaints match your current filters. Try adjusting your search or filter criteria.
            </p>
        </div>
    );
}

export default function EscalatedComplaints() {
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [wardFilter, setWardFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [activeToggle, setActiveToggle] = useState("ALL");
    const [wards, setWards] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsRes, wardsRes] = await Promise.all([
                    panchayathApi.getEscalatedComplaints(),
                    panchayathApi.listWard(),
                ]);

                setComplaints(complaintsRes.data);
                setWards(wardsRes.data.results || wardsRes.data); // pagination safe

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggle = (val) => {
        setActiveToggle(val);
        setStatusFilter(val);
    };

    const filtered = complaints.filter((c) => {
        const matchSearch =
            search === "" ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.citizen_name.toLowerCase().includes(search.toLowerCase());

        const matchWard =
            wardFilter === "ALL" || c.ward_id === wardFilter;

        const matchCategory =
            categoryFilter === "ALL" || c.category === categoryFilter;

        const matchStatus =
            statusFilter === "ALL" || c.status === statusFilter;

        return matchSearch && matchWard && matchCategory && matchStatus;
    });

    const counts = {
        ALL: complaints.length,
        ESCALATED: complaints.filter((c) => c.status === "ESCALATED").length,
        IN_PROGRESS: complaints.filter((c) => c.status === "IN_PROGRESS").length,
        RESOLVED: complaints.filter((c) => c.status === "RESOLVED").length,
    };

    const TOGGLES = [
        { label: "All", value: "ALL", count: counts.ALL },
        { label: "Escalated", value: "ESCALATED", count: counts.ESCALATED },
        { label: "In Progress", value: "IN_PROGRESS", count: counts.IN_PROGRESS },
        { label: "Resolved", value: "RESOLVED", count: counts.RESOLVED },
    ];


    const wardOptions = [
        { id: "ALL", name: "All Wards" },
        ...wards.map((w) => ({
            id: w.id,
            name: w.ward_name,
        })),
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Page Header ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium tracking-wide uppercase">
                        <span>SPIMS</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span>Panchayath Dashboard</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-500">Escalated Complaints</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Escalated Complaints</h1>
                            <p className="text-slate-500 text-sm mt-1">Manage and review complaints escalated from wards</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {counts.ESCALATED} Active Escalations
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Stats Bar ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Complaints", value: counts.ALL, color: "text-slate-700", bg: "bg-white" },
                        { label: "Escalated", value: counts.ESCALATED, color: "text-red-600", bg: "bg-red-50" },
                        { label: "In Progress", value: counts.IN_PROGRESS, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Resolved", value: counts.RESOLVED, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3`}>
                            <div>
                                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Search + Filters ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by complaint title or citizen name..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400 text-slate-700"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Dropdowns */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Ward</label>
                            <select
                                value={wardFilter}
                                onChange={(e) =>
                                    setWardFilter(
                                        e.target.value === "ALL" ? "ALL" : Number(e.target.value)
                                    )
                                }
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
                            >
                                {wardOptions.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
                            >
                                {["ALL", "ROAD", "WATER", "ELECTRICITY", "WASTE", "OTHER"].map((c) => (
                                    <option key={c} value={c}>
                                        {c === "ALL" ? "All Categories" : c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setActiveToggle(e.target.value); }}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
                            >
                                {["ALL", "ESCALATED", "IN_PROGRESS", "RESOLVED"].map((s) => (
                                    <option key={s} value={s}>
                                        {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {TOGGLES.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => handleToggle(t.value)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border ${activeToggle === t.value
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                            >
                                {t.label}
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${activeToggle === t.value ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Results Info ── */}
                {!loading && (
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
                            {filtered.length === 1 ? "complaint" : "complaints"}
                            {search && (
                                <span>
                                    {" "}for <span className="font-medium text-blue-600">"{search}"</span>
                                </span>
                            )}
                        </p>
                        {(search || wardFilter !== "All Wards" || categoryFilter !== "ALL" || statusFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setWardFilter("All Wards");
                                    setCategoryFilter("ALL");
                                    setStatusFilter("ALL");
                                    setActiveToggle("ALL");
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filtered.map((complaint) => (
                            <ComplaintCard key={complaint.id} complaint={complaint} />
                        ))
                    )}
                </div>

                {/* ── Footer ── */}
                {!loading && filtered.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                        SPIMS – Smart Panchayath Issue Management System &nbsp;•&nbsp; Panchayath Dashboard
                    </div>
                )}
            </div>
        </div>
    );
}