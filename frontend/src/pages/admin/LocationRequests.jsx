// import { useEffect, useState } from "react";
// import {
//     MapPin,
//     Building2,
//     Flag,
// } from "lucide-react";
// import { adminapi } from "@/service/adminurls";
// import LocationRequestDetailModal from "@/components/admin/LocationRequestDetailModal";
// import LocationActionModal from "@/components/admin/LocationActionModal";
// const filters = [
//     "PENDING",
//     "HOLD",
//     "COMPLETED",
//     "REJECTED",
// ];

// export default function LocationRequests() {

//     const [status, setStatus] = useState("PENDING");
//     const [requestType, setRequestType] = useState("");
//     const [requests, setRequests] = useState([]);
//     const [counts, setCounts] = useState({
//         pending: 0,
//         hold: 0,
//         completed: 0,
//         rejected: 0,
//     });
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [modalType, setModalType] = useState("");
//     const [selectedId, setSelectedId] = useState(null);
//     const [loadingAction, setLoadingAction] = useState(false);
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     const loadData = async () => {

//         try {

//             const res = await adminapi.getLocationRequests(
//                 status,
//                 requestType,
//                 page
//             );


//             console.log(res.data);
//             console.log(res.data.data);

//             setRequests(
//                 res.data.results.requests
//             );

//             setCounts(
//                 res.data.results.counts
//             );

//             setTotalPages(
//                 Math.ceil(
//                     res.data.count / 10
//                 )
//             );

//         } catch (err) {

//             console.log(err);

//         }

//     };


//     const completeRequest = async (id, admin_note) => {

//         await adminapi.completeLocationRequest(
//             id,
//             {
//                 admin_note
//             }
//         );

//         loadData();

//     };


//     const holdRequest = async (id, admin_note) => {

//         await adminapi.holdLocationRequest(
//             id,
//             {
//                 admin_note
//             }
//         );

//         loadData();

//     };


//     const rejectRequest = async (id, admin_note) => {

//         await adminapi.rejectLocationRequest(
//             id,
//             {
//                 admin_note
//             }
//         );

//         loadData();

//     };


//     const openRequest = (request) => {

//         setSelectedRequest(request);

//         setShowModal(true);

//     };

//     const closeModal = () => {

//         setShowModal(false);

//         setSelectedRequest(null);

//     };


//     const openActionModal = (type, id) => {

//         setModalType(type);

//         setSelectedId(id);

//         setModalOpen(true);

//     };

//     const closeActionModal = () => {

//         setModalOpen(false);

//         setModalType("");

//         setSelectedId(null);

//     };


//     const submitAction = async (note) => {

//         try {

//             setLoadingAction(true);

//             if (modalType === "COMPLETE") {

//                 await completeRequest(
//                     selectedId,
//                     note
//                 );

//             }

//             if (modalType === "HOLD") {

//                 await holdRequest(
//                     selectedId,
//                     note
//                 );

//             }

//             if (modalType === "REJECT") {

//                 await rejectRequest(
//                     selectedId,
//                     note
//                 );

//             }

//             closeActionModal();

//         } catch (err) {

//             console.log(err);

//         } finally {

//             setLoadingAction(false);

//         }

//     };

//     useEffect(() => {

//         loadData();

//     }, [status, requestType, page]);

//     return (

//         <div className="p-6">

//             <h1 className="text-3xl font-bold">
//                 Location Requests
//             </h1>

//             <p className="text-gray-500 mb-6">
//                 Manage district, panchayath and ward location requests.
//             </p>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

//                 <div className="bg-white rounded-xl shadow border p-4">

//                     <p className="text-gray-500 text-sm">
//                         Pending
//                     </p>

//                     <h2 className="text-3xl font-bold text-yellow-600">
//                         {counts.pending}
//                     </h2>

//                 </div>

//                 <div className="bg-white rounded-xl shadow border p-4">

//                     <p className="text-gray-500 text-sm">
//                         Hold
//                     </p>

//                     <h2 className="text-3xl font-bold text-orange-600">
//                         {counts.hold}
//                     </h2>

//                 </div>

//                 <div className="bg-white rounded-xl shadow border p-4">

//                     <p className="text-gray-500 text-sm">
//                         Completed
//                     </p>

//                     <h2 className="text-3xl font-bold text-green-600">
//                         {counts.completed}
//                     </h2>

//                 </div>

//                 <div className="bg-white rounded-xl shadow border p-4">

//                     <p className="text-gray-500 text-sm">
//                         Rejected
//                     </p>

//                     <h2 className="text-3xl font-bold text-red-600">
//                         {counts.rejected}
//                     </h2>

//                 </div>

//             </div>

//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

//                 <div className="flex flex-wrap gap-3">

//                     {filters.map((item) => (

//                         <button
//                             key={item}
//                             onClick={() => {

//                                 setStatus(item);

//                                 setPage(1);

//                             }}
//                             className={`px-5 py-2 rounded-lg transition

//                 ${status === item
//                                     ? "bg-emerald-600 text-white"
//                                     : "bg-gray-200 hover:bg-gray-300"
//                                 }`}
//                         >
//                             {item}
//                         </button>

//                     ))}

//                 </div>


//                 <select
//                     value={requestType}
//                     onChange={(e) => {

//                         setRequestType(e.target.value);

//                         setPage(1);

//                     }}
//                     className="border rounded-lg px-4 py-2"
//                 >

//                     <option value="">
//                         All Types
//                     </option>

//                     <option value="DISTRICT">
//                         District
//                     </option>

//                     <option value="PANCHAYATH">
//                         Panchayath
//                     </option>

//                     <option value="WARD">
//                         Ward
//                     </option>

//                 </select>

//                 <input
//                     type="text"
//                     placeholder="Search user..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full md:w-72 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />

//             </div>

//             <div className="bg-white rounded-xl shadow border overflow-x-auto">

//                 <table className="w-full">

//                     <thead>

//                         <tr className="border-b bg-gray-50">

//                             <th className="p-3 text-left">
//                                 User
//                             </th>

//                             <th className="p-3 text-left">
//                                 Role
//                             </th>

//                             <th className="p-3 text-left">
//                                 Type
//                             </th>

//                             <th className="p-3 text-left">
//                                 Requested Location
//                             </th>

//                             <th className="p-3 text-left">
//                                 Status
//                             </th>


//                             <th className="p-3 text-left">
//                                 Action
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {

//                             requests
//                                 .filter((item) => {

//                                     if (!search) return true;

//                                     return (
//                                         item.requested_by
//                                             .toLowerCase()
//                                             .includes(search.toLowerCase())
//                                     );

//                                 })
//                                 .map((item) => (

//                                     <tr
//                                         key={item.id}
//                                         className="border-b hover:bg-gray-50 transition"
//                                     >

//                                         <td className="p-3">

//                                             <div>

//                                                 <p className="font-semibold">

//                                                     {item.requested_by}

//                                                 </p>

//                                                 <p className="text-xs text-gray-500">

//                                                     {item.role}

//                                                 </p>

//                                             </div>

//                                         </td>

//                                         <td className="p-3">
//                                             {item.role}
//                                         </td>

//                                         <td className="p-3">

//                                             <span
//                                                 className="px-2 py-1 rounded-md bg-gray-100 font-medium"
//                                             >

//                                                 {item.request_type === "DISTRICT" && "📍 District"}

//                                                 {item.request_type === "PANCHAYATH" && "🏛 Panchayath"}

//                                                 {item.request_type === "WARD" && "🏘 Ward"}

//                                             </span>

//                                         </td>

//                                         <td className="p-3">

//                                             <div className="space-y-2 text-sm">

//                                                 <div className="flex items-center gap-2">

//                                                     <MapPin
//                                                         size={15}
//                                                         className="text-blue-600"
//                                                     />

//                                                     <span>

//                                                         {item.district_name || "-"}

//                                                     </span>

//                                                 </div>

//                                                 <div className="flex items-center gap-2">

//                                                     <Building2
//                                                         size={15}
//                                                         className="text-emerald-600"
//                                                     />

//                                                     <span>

//                                                         {item.panchayath_name || "-"}

//                                                     </span>

//                                                 </div>

//                                                 <div className="flex items-center gap-2">

//                                                     <Flag
//                                                         size={15}
//                                                         className="text-orange-500"
//                                                     />

//                                                     <span>

//                                                         {item.ward_number
//                                                             ? `Ward ${item.ward_number}`
//                                                             : "-"}

//                                                         {item.ward_name &&
//                                                             ` (${item.ward_name})`}

//                                                     </span>

//                                                 </div>

//                                             </div>

//                                         </td>

//                                         <td className="p-3">

//                                             <span
//                                                 className={`px-3 py-1 rounded-full text-xs font-semibold

//         ${item.status === "PENDING"
//                                                         ? "bg-yellow-100 text-yellow-700"

//                                                         : item.status === "COMPLETED"
//                                                             ? "bg-green-100 text-green-700"

//                                                             : item.status === "HOLD"
//                                                                 ? "bg-orange-100 text-orange-700"

//                                                                 : "bg-red-100 text-red-700"

//                                                     }`}
//                                             >

//                                                 {item.status}

//                                             </span>

//                                         </td>


//                                         <td className="p-3">

//                                             <button

//                                                 onClick={() => openRequest(item)}

//                                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"

//                                             >

//                                                 View

//                                             </button>

//                                         </td>

//                                     </tr>

//                                 ))

//                         }

//                     </tbody>

//                 </table>

//             </div>
//             <div className="flex justify-center items-center gap-3 mt-6">

//                 <button
//                     disabled={page === 1}
//                     onClick={() => setPage(page - 1)}
//                     className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                     Previous
//                 </button>

//                 <span className="font-medium">
//                     Page {page} of {totalPages}
//                 </span>

//                 <button
//                     disabled={page === totalPages}
//                     onClick={() => setPage(page + 1)}
//                     className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                     Next
//                 </button>

//             </div>


//             <LocationRequestDetailModal

//                 open={showModal}

//                 onClose={closeModal}

//                 request={selectedRequest}

//                 onComplete={(id) => {

//                     closeModal();

//                     openActionModal("COMPLETE", id);

//                 }}

//                 onHold={(id) => {

//                     closeModal();

//                     openActionModal("HOLD", id);

//                 }}

//                 onReject={(id) => {

//                     closeModal();

//                     openActionModal("REJECT", id);

//                 }}

//             />


//             <LocationActionModal

//                 open={modalOpen}

//                 loading={loadingAction}

//                 onClose={closeActionModal}

//                 onSubmit={submitAction}

//                 title={
//                     modalType === "COMPLETE"
//                         ? "Complete Request"

//                         : modalType === "HOLD"
//                             ? "Put Request On Hold"

//                             : "Reject Request"
//                 }

//                 actionLabel={
//                     modalType === "COMPLETE"
//                         ? "Complete"

//                         : modalType === "HOLD"
//                             ? "Hold"

//                             : "Reject"
//                 }

//                 buttonColor={
//                     modalType === "COMPLETE"
//                         ? "bg-green-600"

//                         : modalType === "HOLD"
//                             ? "bg-yellow-500"

//                             : "bg-red-600"
//                 }

//             />

//         </div>

//     );

// }




import { useEffect, useState } from "react";
import {
    MapPin,
    Building2,
    Flag,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    PauseCircle,
    CheckCircle2,
    XCircle,
    Inbox,
} from "lucide-react";
import { adminapi } from "@/service/adminurls";
import LocationRequestDetailModal from "@/components/admin/LocationRequestDetailModal";
import LocationActionModal from "@/components/admin/LocationActionModal";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const filters = [
    "PENDING",
    "HOLD",
    "COMPLETED",
    "REJECTED",
];

const statusStyles = {
    PENDING: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    HOLD: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
    REJECTED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
};

const typeLabels = {
    DISTRICT: { label: "District", icon: "📍" },
    PANCHAYATH: { label: "Panchayath", icon: "🏛" },
    WARD: { label: "Ward", icon: "🏘" },
};

export default function LocationRequests() {

    const [status, setStatus] = useState("PENDING");
    const [requestType, setRequestType] = useState("");
    const [requests, setRequests] = useState([]);
    const [counts, setCounts] = useState({
        pending: 0,
        hold: 0,
        completed: 0,
        rejected: 0,
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {

        try {

            setLoading(true);

            const res = await adminapi.getLocationRequests(
                status,
                requestType,
                page
            );

            setRequests(
                res.data.results.requests
            );

            setCounts(
                res.data.results.counts
            );

            setTotalPages(
                Math.ceil(
                    res.data.count / 10
                )
            );

        } catch (err) {

            console.log(err);
            handleApiError(
                err,
                "Failed to load location requests"
            );

        } finally {

            setLoading(false);

        }

    };


    const completeRequest = async (id, admin_note) => {

        await adminapi.completeLocationRequest(
            id,
            {
                admin_note
            }
        );

        loadData();

    };


    const holdRequest = async (id, admin_note) => {

        await adminapi.holdLocationRequest(
            id,
            {
                admin_note
            }
        );

        loadData();

    };


    const rejectRequest = async (id, admin_note) => {

        await adminapi.rejectLocationRequest(
            id,
            {
                admin_note
            }
        );

        loadData();

    };


    const openRequest = (request) => {

        setSelectedRequest(request);

        setShowModal(true);

    };

    const closeModal = () => {

        setShowModal(false);

        setSelectedRequest(null);

    };


    const openActionModal = (type, id) => {

        setModalType(type);

        setSelectedId(id);

        setModalOpen(true);

    };

    const closeActionModal = () => {

        setModalOpen(false);

        setModalType("");

        setSelectedId(null);

    };


    const submitAction = async (note) => {

        try {

            setLoadingAction(true);

            if (modalType === "COMPLETE") {

                await completeRequest(
                    selectedId,
                    note
                );
                toast.success("Location request completed successfully.");
            }




            if (modalType === "HOLD") {

                await holdRequest(
                    selectedId,
                    note
                );

                toast.success("Location request moved to hold successfully.");

            }

            if (modalType === "REJECT") {

                await rejectRequest(
                    selectedId,
                    note
                );

                toast.success("Location request rejected successfully.");

            }

            closeActionModal();

        } catch (err) {

            console.log(err);

            handleApiError(
                err,
                "Failed to update location request"
            );


        } finally {

            setLoadingAction(false);

        }

    };

    useEffect(() => {

        loadData();

    }, [status, requestType, page]);

    const filteredRequests = requests.filter((item) => {

        if (!search) return true;

        return (
            item.requested_by
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    });

    const statCards = [
        {
            key: "pending",
            label: "Pending",
            value: counts.pending,
            icon: Clock,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            valueColor: "text-yellow-700",
        },
        {
            key: "hold",
            label: "Hold",
            value: counts.hold,
            icon: PauseCircle,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            valueColor: "text-orange-700",
        },
        {
            key: "completed",
            label: "Completed",
            value: counts.completed,
            icon: CheckCircle2,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            valueColor: "text-emerald-700",
        },
        {
            key: "rejected",
            label: "Rejected",
            value: counts.rejected,
            icon: XCircle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            valueColor: "text-red-700",
        },
    ];

    return (

        <div className="p-6 bg-gray-50 min-h-screen">

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-900">
                    Location Requests
                </h1>

                <p className="text-gray-500 mt-1 text-sm">
                    Manage district, panchayath and ward location requests.
                </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                {statCards.map(({ key, label, value, icon: Icon, iconBg, iconColor, valueColor }) => (

                    <div
                        key={key}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
                    >

                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>

                            <Icon size={20} className={iconColor} />

                        </div>

                        <div>

                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                                {label}
                            </p>

                            <h2 className={`text-2xl font-bold ${valueColor}`}>
                                {value}
                            </h2>

                        </div>

                    </div>

                ))}

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">

                    <div className="flex flex-wrap gap-2">

                        {filters.map((item) => (

                            <button
                                key={item}
                                onClick={() => {

                                    setStatus(item);

                                    setPage(1);

                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors

                    ${status === item
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item.charAt(0) + item.slice(1).toLowerCase()}
                            </button>

                        ))}

                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto w-full lg:w-auto">

                        <select
                            value={requestType}
                            onChange={(e) => {

                                setRequestType(e.target.value);

                                setPage(1);

                            }}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >

                            <option value="">
                                All Types
                            </option>

                            <option value="DISTRICT">
                                District
                            </option>

                            <option value="PANCHAYATH">
                                Panchayath
                            </option>

                            <option value="WARD">
                                Ward
                            </option>

                        </select>

                        <div className="relative w-full sm:w-64">

                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />

                        </div>

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead>

                            <tr className="border-b border-gray-100 bg-gray-50/80">

                                <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                    User
                                </th>

                                <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                    Type
                                </th>

                                <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                    Requested Location
                                </th>

                                <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                    Status
                                </th>

                                <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading && (

                                Array.from({ length: 5 }).map((_, i) => (

                                    <tr key={i} className="border-b border-gray-50">

                                        <td className="p-4" colSpan={5}>

                                            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />

                                        </td>

                                    </tr>

                                ))

                            )}

                            {!loading && filteredRequests.length === 0 && (

                                <tr>

                                    <td colSpan={5} className="p-12">

                                        <div className="flex flex-col items-center justify-center text-center gap-2">

                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">

                                                <Inbox size={22} className="text-gray-400" />

                                            </div>

                                            <p className="text-gray-600 font-medium">
                                                No requests found
                                            </p>

                                            <p className="text-gray-400 text-sm">
                                                Try adjusting your filters or search term.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                            {!loading && filteredRequests.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                                >

                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm shrink-0">

                                                {item.requested_by?.charAt(0)?.toUpperCase()}

                                            </div>

                                            <div>

                                                <p className="font-semibold text-gray-800">

                                                    {item.requested_by}

                                                </p>

                                                <p className="text-xs text-gray-400">

                                                    {item.role}

                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-xs"
                                        >

                                            <span>{typeLabels[item.request_type]?.icon}</span>

                                            <span>{typeLabels[item.request_type]?.label}</span>

                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <div className="space-y-1.5 text-sm">

                                            <div className="flex items-center gap-2">

                                                <MapPin
                                                    size={14}
                                                    className="text-blue-500 shrink-0"
                                                />

                                                <span className="text-gray-700">

                                                    {item.district_name || "-"}

                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <Building2
                                                    size={14}
                                                    className="text-emerald-500 shrink-0"
                                                />

                                                <span className="text-gray-700">

                                                    {item.panchayath_name || "-"}

                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <Flag
                                                    size={14}
                                                    className="text-orange-500 shrink-0"
                                                />

                                                <span className="text-gray-700">

                                                    {item.ward_number
                                                        ? `Ward ${item.ward_number}`
                                                        : "-"}

                                                    {item.ward_name &&
                                                        ` (${item.ward_name})`}

                                                </span>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}`}
                                        >

                                            {item.status}

                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <button

                                            onClick={() => openRequest(item)}

                                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"

                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="flex justify-center items-center gap-3 mt-6">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <span className="text-sm font-medium text-gray-600">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <ChevronRight size={16} />
                </button>

            </div>


            <LocationRequestDetailModal

                open={showModal}

                onClose={closeModal}

                request={selectedRequest}

                onComplete={(id) => {

                    closeModal();

                    openActionModal("COMPLETE", id);

                }}

                onHold={(id) => {

                    closeModal();

                    openActionModal("HOLD", id);

                }}

                onReject={(id) => {

                    closeModal();

                    openActionModal("REJECT", id);

                }}

            />


            <LocationActionModal

                open={modalOpen}

                loading={loadingAction}

                onClose={closeActionModal}

                onSubmit={submitAction}

                title={
                    modalType === "COMPLETE"
                        ? "Complete Request"

                        : modalType === "HOLD"
                            ? "Put Request On Hold"

                            : "Reject Request"
                }

                actionLabel={
                    modalType === "COMPLETE"
                        ? "Complete"

                        : modalType === "HOLD"
                            ? "Hold"

                            : "Reject"
                }

                buttonColor={
                    modalType === "COMPLETE"
                        ? "bg-green-600"

                        : modalType === "HOLD"
                            ? "bg-yellow-500"

                            : "bg-red-600"
                }

            />

        </div>

    );

}