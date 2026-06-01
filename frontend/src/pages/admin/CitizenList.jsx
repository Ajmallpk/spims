
// import { useState, useEffect } from "react";
// import { Users, Search, SlidersHorizontal, Ban, CheckCircle2, ChevronRight, X } from "lucide-react";
// import { adminapi } from "@/service/adminurls";
// import Pagination from "@/components/admin/Pagination";
// import { handleApiError } from "@/utils/handleApiError";
// import { useNavigate } from "react-router-dom";

// /* ─── status badge ────────────────────────────────────────── */

// const StatusBadge = ({ status }) => {
//   const isActive = status === "ACTIVE";
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
//       isActive
//         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//         : "bg-red-50 text-red-700 border-red-200"
//     }`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
//       {status}
//     </span>
//   );
// };

// /* ─── main component ──────────────────────────────────────── */

// const CitizenList = () => {
//   const navigate = useNavigate();
//   const [wardFilter, setWardFilter] = useState("");
//   const [panchayathFilter, setPanchayathFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [citizens, setCitizens] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [actionModal, setActionModal] = useState({ open: false, type: null, id: null });

//   const fetchCitizens = async () => {
//     setLoading(true);
//     try {
//       const { data } = await adminapi.getCitizens({
//         page: currentPage,
//         ward: wardFilter,
//         panchayath: panchayathFilter,
//         status: statusFilter,
//       });
//       setCitizens(data.results || []);
//       setTotalPages(Math.ceil((data.count || 0) / 10));
//     } catch (err) {
//       handleApiError(err, "Failed to fetch citizens");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCitizens(); }, [currentPage, wardFilter, panchayathFilter, statusFilter]);

//   const handleSuspend  = (id) => setActionModal({ open: true, type: "suspend",  id });
//   const handleActivate = (id) => setActionModal({ open: true, type: "activate", id });

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleConfirmAction = async () => {
//     try {
//       if (actionModal.type === "suspend") {
//         await adminapi.suspendCitizen(actionModal.id);
//       } else {
//         await adminapi.activateCitizen(actionModal.id);
//       }
//       setActionModal({ open: false, type: null, id: null });
//       fetchCitizens();
//     } catch (err) {
//       handleApiError(err, "Citizen action failed");
//     }
//   };

//   const hasFilters = wardFilter || panchayathFilter || statusFilter;
//   const isSuspend  = actionModal.type === "suspend";

//   return (
//     <div className="max-w-7xl mx-auto space-y-5 pb-12">

//       {/* ── page header ── */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//           {/* title */}
//           <div className="flex items-center gap-3">
//             <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
//               <Users size={20} className="text-indigo-600" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 tracking-tight">Citizen List</h1>
//               <p className="text-sm text-gray-400 mt-0.5">Manage and monitor registered citizens</p>
//             </div>
//           </div>

//           {/* filters */}
//           <div className="flex flex-wrap items-center gap-2.5">

//             {/* ward filter */}
//             <div className="relative">
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Filter by ward"
//                 value={wardFilter}
//                 onChange={(e) => { setWardFilter(e.target.value); setCurrentPage(1); }}
//                 className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             {/* panchayath filter */}
//             <div className="relative">
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Filter by panchayath"
//                 value={panchayathFilter}
//                 onChange={(e) => { setPanchayathFilter(e.target.value); setCurrentPage(1); }}
//                 className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             {/* status filter */}
//             <div className="relative">
//               <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
//                 className="appearance-none pl-8 pr-8 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//               >
//                 <option value="">All Statuses</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="SUSPENDED">Suspended</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* active filter chips */}
//         {hasFilters && (
//           <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
//             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active filters:</span>
//             {wardFilter && (
//               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
//                 Ward: {wardFilter}
//                 <button onClick={() => setWardFilter("")}><X size={11} /></button>
//               </span>
//             )}
//             {panchayathFilter && (
//               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
//                 Panchayath: {panchayathFilter}
//                 <button onClick={() => setPanchayathFilter("")}><X size={11} /></button>
//               </span>
//             )}
//             {statusFilter && (
//               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
//                 Status: {statusFilter}
//                 <button onClick={() => setStatusFilter("")}><X size={11} /></button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── table card ── */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//         {/* card header */}
//         <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
//           <Users size={14} className="text-indigo-500" />
//           <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Citizens</h2>
//           {!loading && citizens.length > 0 && (
//             <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold">
//               {citizens.length} shown
//             </span>
//           )}
//         </div>

//         {/* table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-100 bg-gray-50/40">
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ward</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Panchayath</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="py-16">
//                     <div className="flex flex-col items-center gap-3">
//                       <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
//                       <p className="text-sm text-gray-400 font-medium">Loading citizens…</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : citizens.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <Users size={32} className="text-gray-200" />
//                       <p className="text-sm font-medium text-gray-400">No citizens found</p>
//                       {hasFilters && (
//                         <p className="text-xs text-gray-400">Try adjusting your filters</p>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 citizens.map((c) => (
//                   <tr
//                     key={c.id}
//                     onClick={() => navigate(`/admin/citizens/${c.id}`)}
//                     className="group cursor-pointer hover:bg-indigo-50/40 transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2.5">
//                         <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs">
//                           {c.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                         <span className="font-semibold text-gray-800">{c.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-500">{c.email}</td>
//                     <td className="px-6 py-4 text-gray-600">{c.ward || "—"}</td>
//                     <td className="px-6 py-4 text-gray-600">{c.panchayath || "—"}</td>
//                     <td className="px-6 py-4">
//                       <StatusBadge status={c.status} />
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         {c.status === "ACTIVE" ? (
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleSuspend(c.id); }}
//                             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
//                           >
//                             <Ban size={11} /> Suspend
//                           </button>
//                         ) : (
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleActivate(c.id); }}
//                             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
//                           >
//                             <CheckCircle2 size={11} /> Activate
//                           </button>
//                         )}
//                         <ChevronRight
//                           size={14}
//                           className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* pagination */}
//         <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>

//       {/* ── confirm modal ── */}
//       {actionModal.open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

//             {/* modal header */}
//             <div className={`flex items-center gap-3 px-6 py-5 border-b ${isSuspend ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSuspend ? "bg-red-100" : "bg-emerald-100"}`}>
//                 {isSuspend
//                   ? <Ban size={16} className="text-red-600" />
//                   : <CheckCircle2 size={16} className="text-emerald-600" />
//                 }
//               </div>
//               <h2 className="text-base font-bold text-gray-800">
//                 Confirm {isSuspend ? "Suspension" : "Activation"}
//               </h2>
//             </div>

//             {/* modal body */}
//             <div className="px-6 py-5">
//               <p className="text-sm text-gray-500 leading-relaxed">
//                 Are you sure you want to{" "}
//                 <span className={`font-semibold ${isSuspend ? "text-red-600" : "text-emerald-600"}`}>
//                   {isSuspend ? "suspend" : "activate"}
//                 </span>{" "}
//                 this citizen? This action can be reversed later.
//               </p>
//             </div>

//             {/* modal footer */}
//             <div className="flex justify-end gap-3 px-6 pb-5">
//               <button
//                 onClick={() => setActionModal({ open: false, type: null, id: null })}
//                 className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors ${
//                   isSuspend ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
//                 }`}
//               >
//                 {isSuspend ? "Yes, Suspend" : "Yes, Activate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CitizenList;


import { useState, useEffect,useCallback } from "react";
import { Users, Search, SlidersHorizontal, Ban, CheckCircle2, ChevronRight, X } from "lucide-react";
import { adminapi } from "@/service/adminurls";
import Pagination from "@/components/admin/Pagination";
import { handleApiError } from "@/utils/handleApiError";
import { useNavigate } from "react-router-dom";

/* ─── status badge ────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
      {status}
    </span>
  );
};

/* ─── main component ──────────────────────────────────────── */

const CitizenList = () => {
  const navigate = useNavigate();
  const [wardFilter, setWardFilter] = useState("");
  const [panchayathFilter, setPanchayathFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionModal, setActionModal] = useState({ open: false, type: null, id: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCitizens =
    useCallback(
      async () => {

        setLoading(true);

        try {

          const { data } =
            await adminapi
              .getCitizens({

                page: currentPage,

                ward: wardFilter,

                panchayath:
                  panchayathFilter,

                status:
                  statusFilter

              });

          setCitizens(
            data.results || []
          );

          setTotalCount(
            data.count || 0
          );

          setTotalPages(
            Math.max(
              1,
              Math.ceil(
                (data.count || 0)
                / 10
              )
            )
          );

        }

        catch (err) {

          handleApiError(
            err,
            "Failed to fetch citizens"
          );

        }

        finally {

          setLoading(false);

        }

      },

      [
        currentPage,
        wardFilter,
        panchayathFilter,
        statusFilter
      ]

    );

  useEffect(() => {

    fetchCitizens();

  }, [fetchCitizens]);

  const handleSuspend = (id) => setActionModal({ open: true, type: "suspend", id });
  const handleActivate = (id) => setActionModal({ open: true, type: "activate", id });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmAction = async () => {
    try {

      setActionLoading(true);


      if (actionModal.type === "suspend") {
        await adminapi.suspendCitizen(actionModal.id);
      } else {
        await adminapi.activateCitizen(actionModal.id);
      }
      setActionModal({ open: false, type: null, id: null });
      fetchCitizens();
    } catch (err) {

      handleApiError(
        err,
        "Citizen action failed"
      );

    }

    finally {

      setActionLoading(false);

    }

  };


  const hasFilters = wardFilter || panchayathFilter || statusFilter;
  const isSuspend = actionModal.type === "suspend";

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12">

      {/* ── page header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Citizen List</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage and monitor registered citizens</p>
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* ward filter */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by ward"
                value={wardFilter}
                onChange={(e) => { setWardFilter(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* panchayath filter */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by panchayath"
                value={panchayathFilter}
                onChange={(e) => { setPanchayathFilter(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          </div>
        </div>

        {/* active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active filters:</span>
            {wardFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Ward: {wardFilter}
                <button onClick={() => setWardFilter("")}><X size={11} /></button>
              </span>
            )}
            {panchayathFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Panchayath: {panchayathFilter}
                <button onClick={() => setPanchayathFilter("")}><X size={11} /></button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("")}><X size={11} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── table card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* card header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <Users size={14} className="text-indigo-500" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Citizens</h2>
          {!loading && citizens.length > 0 && (
            <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold">

              {totalCount} total

            </span>
          )}
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ward</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Panchayath</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      <p className="text-sm text-gray-400 font-medium">Loading citizens…</p>
                    </div>
                  </td>
                </tr>
              ) : citizens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={32} className="text-gray-200" />
                      <p className="text-sm font-medium text-gray-400">No citizens found</p>
                      {hasFilters && (
                        <p className="text-xs text-gray-400">Try adjusting your filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                citizens.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/admin/citizens/${c.id}`)}
                    className="group cursor-pointer hover:bg-indigo-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs">
                          {c.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-gray-600">{c.ward || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{c.panchayath || "—"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.status === "ACTIVE" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSuspend(c.id); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                          >
                            <Ban size={11} /> Suspend
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleActivate(c.id); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle2 size={11} /> Activate
                          </button>
                        )}
                        <ChevronRight
                          size={14}
                          className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

      {/* ── confirm modal ── */}
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
                this citizen? This action can be reversed later.
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

                onClick={
                  handleConfirmAction
                }

                disabled={
                  actionLoading
                }

                className={`
 px-4
 py-2
 text-sm
 font-semibold
 rounded-xl
 text-white
 transition-colors
 disabled:opacity-50
 disabled:cursor-not-allowed

 ${isSuspend
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }

 `}
              >
                {
                  actionLoading

                    ?

                    "Processing..."

                    :

                    isSuspend

                      ?

                      "Yes, Suspend"

                      :

                      "Yes, Activate"

                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenList;