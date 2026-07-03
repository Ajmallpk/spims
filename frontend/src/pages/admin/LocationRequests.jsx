import { useEffect, useState } from "react";
import {
    MapPin,
    Building2,
    Flag,
} from "lucide-react";
import { adminapi } from "@/service/adminurls";
import LocationRequestDetailModal from "@/components/admin/LocationRequestDetailModal";
import LocationActionModal from "@/components/admin/LocationActionModal";
const filters = [
    "PENDING",
    "HOLD",
    "COMPLETED",
    "REJECTED",
];

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

    const loadData = async () => {

        try {

            const res = await adminapi.getLocationRequests(
                status,
                requestType
            );


            console.log(res.data);
            console.log(res.data.data);

            setRequests(res.data.data.requests);
            setCounts(res.data.data.counts);

        } catch (err) {

            console.log(err);

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

            }

            if (modalType === "HOLD") {

                await holdRequest(
                    selectedId,
                    note
                );

            }

            if (modalType === "REJECT") {

                await rejectRequest(
                    selectedId,
                    note
                );

            }

            closeActionModal();

        } catch (err) {

            console.log(err);

        } finally {

            setLoadingAction(false);

        }

    };

    useEffect(() => {

        loadData();

    }, [status, requestType]);

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold">
                Location Requests
            </h1>

            <p className="text-gray-500 mb-6">
                Manage district, panchayath and ward location requests.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div className="bg-white rounded-xl shadow border p-4">

                    <p className="text-gray-500 text-sm">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-600">
                        {counts.pending}
                    </h2>

                </div>

                <div className="bg-white rounded-xl shadow border p-4">

                    <p className="text-gray-500 text-sm">
                        Hold
                    </p>

                    <h2 className="text-3xl font-bold text-orange-600">
                        {counts.hold}
                    </h2>

                </div>

                <div className="bg-white rounded-xl shadow border p-4">

                    <p className="text-gray-500 text-sm">
                        Completed
                    </p>

                    <h2 className="text-3xl font-bold text-green-600">
                        {counts.completed}
                    </h2>

                </div>

                <div className="bg-white rounded-xl shadow border p-4">

                    <p className="text-gray-500 text-sm">
                        Rejected
                    </p>

                    <h2 className="text-3xl font-bold text-red-600">
                        {counts.rejected}
                    </h2>

                </div>

            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div className="flex flex-wrap gap-3">

                    {filters.map((item) => (

                        <button
                            key={item}
                            onClick={() => setStatus(item)}
                            className={`px-5 py-2 rounded-lg transition

                ${status === item
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {item}
                        </button>

                    ))}

                </div>


                <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="border rounded-lg px-4 py-2"
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

                <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-72 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

            </div>

            <div className="bg-white rounded-xl shadow border overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b bg-gray-50">

                            <th className="p-3 text-left">
                                User
                            </th>

                            <th className="p-3 text-left">
                                Role
                            </th>

                            <th className="p-3 text-left">
                                Type
                            </th>

                            <th className="p-3 text-left">
                                Requested Location
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>


                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            requests
                                .filter((item) => {

                                    if (!search) return true;

                                    return (
                                        item.requested_by
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                    );

                                })
                                .map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >

                                        <td className="p-3">

                                            <div>

                                                <p className="font-semibold">

                                                    {item.requested_by}

                                                </p>

                                                <p className="text-xs text-gray-500">

                                                    {item.role}

                                                </p>

                                            </div>

                                        </td>

                                        <td className="p-3">
                                            {item.role}
                                        </td>

                                        <td className="p-3">

                                            <span
                                                className="px-2 py-1 rounded-md bg-gray-100 font-medium"
                                            >

                                                {item.request_type === "DISTRICT" && "📍 District"}

                                                {item.request_type === "PANCHAYATH" && "🏛 Panchayath"}

                                                {item.request_type === "WARD" && "🏘 Ward"}

                                            </span>

                                        </td>

                                        <td className="p-3">

                                            <div className="space-y-2 text-sm">

                                                <div className="flex items-center gap-2">

                                                    <MapPin
                                                        size={15}
                                                        className="text-blue-600"
                                                    />

                                                    <span>

                                                        {item.district_name || "-"}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    <Building2
                                                        size={15}
                                                        className="text-emerald-600"
                                                    />

                                                    <span>

                                                        {item.panchayath_name || "-"}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    <Flag
                                                        size={15}
                                                        className="text-orange-500"
                                                    />

                                                    <span>

                                                        {item.ward_number
                                                            ? `Ward ${item.ward_number}`
                                                            : "-"}

                                                        {item.ward_name &&
                                                            ` (${item.ward_name})`}

                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="p-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold

        ${item.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"

                                                        : item.status === "COMPLETED"
                                                            ? "bg-green-100 text-green-700"

                                                            : item.status === "HOLD"
                                                                ? "bg-orange-100 text-orange-700"

                                                                : "bg-red-100 text-red-700"

                                                    }`}
                                            >

                                                {item.status}

                                            </span>

                                        </td>


                                        <td className="p-3">

                                            <button

                                                onClick={() => openRequest(item)}

                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"

                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

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