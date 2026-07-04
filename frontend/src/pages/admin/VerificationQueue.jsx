// import { useEffect, useState } from "react";
// import { adminapi } from "@/service/adminurls";
// import { handleApiError } from "@/utils/handleApiError";
// import VerificationQueueDetailModal from "@/components/admin/VerificationQueueDetailModal";

// export default function VerificationQueue() {
//     const [citizens, setCitizens] = useState([]);
//     const [wards, setWards] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalOpen, setModalOpen] = useState(false);

//     const [modalTitle, setModalTitle] = useState("");

//     const [modalType, setModalType] = useState("");

//     const [detail, setDetail] = useState({});

//     useEffect(() => {
//         fetchQueue();
//     }, []);

//     const fetchQueue = async () => {
//         try {
//             const res = await adminapi.getVerificationQueue();

//             setCitizens(
//                 res.data.data.waiting_citizens || []
//             );

//             setWards(
//                 res.data.data.waiting_wards || []
//             );
//         } catch (error) {
//             handleApiError(
//                 error,
//                 "Failed to load verification queue"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     const openCitizen = async (id) => {

//         try {

//             const res =
//                 await adminapi.getWaitingCitizenDetail(id);

//             setDetail(res.data.data);

//             setModalTitle(
//                 "Citizen Verification Details"
//             );

//             setModalType("citizen");

//             setModalOpen(true);

//         }

//         catch (error) {

//             handleApiError(error);

//         }

//     };

//     const openWard = async (id) => {

//         try {

//             const res =
//                 await adminapi.getWaitingWardDetail(id);

//             setDetail(res.data.data);

//             setModalTitle(
//                 "Ward Verification Details"
//             );

//             setModalType("ward");

//             setModalOpen(true);

//         }

//         catch (error) {

//             handleApiError(error);

//         }

//     };

//     if (loading) {
//         return (
//             <div className="p-6">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-10 p-6">

//             <div>

//                 <h2 className="text-2xl font-bold mb-4">
//                     Waiting Citizen Verifications
//                 </h2>

//                 <table className="w-full border">

//                     <thead className="bg-gray-100">

//                         <tr>

//                             <th className="p-3 text-left">
//                                 Name
//                             </th>

//                             <th className="p-3 text-left">
//                                 District
//                             </th>

//                             <th className="p-3 text-left">
//                                 Panchayath
//                             </th>

//                             <th className="p-3 text-left">
//                                 Ward
//                             </th>

//                             <th className="p-3 text-left">
//                                 Submitted
//                             </th>


//                             <th className="p-3 text-left">
//                                 Action
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {citizens.length === 0 ? (

//                             <tr>

//                                 <td
//                                     colSpan={5}
//                                     className="text-center p-5"
//                                 >
//                                     No waiting citizens
//                                 </td>

//                             </tr>

//                         ) : (

//                             citizens.map((item) => (

//                                 <tr
//                                     key={item.id}
//                                     className="border-t"
//                                 >

//                                     <td className="p-3">
//                                         {item.name}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.district}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.panchayath}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.ward}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.submitted_at}
//                                     </td>


//                                     <td className="p-3">

//                                         <button
//                                             onClick={() => openCitizen(item.id)}
//                                             className="bg-blue-600 text-white px-3 py-1 rounded"
//                                         >
//                                             View
//                                         </button>

//                                     </td>

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//             <div>

//                 <h2 className="text-2xl font-bold mb-4">
//                     Waiting Ward Verifications
//                 </h2>

//                 <table className="w-full border">

//                     <thead className="bg-gray-100">

//                         <tr>

//                             <th className="p-3 text-left">
//                                 Officer
//                             </th>

//                             <th className="p-3 text-left">
//                                 District
//                             </th>

//                             <th className="p-3 text-left">
//                                 Panchayath
//                             </th>

//                             <th className="p-3 text-left">
//                                 Ward
//                             </th>

//                             <th className="p-3 text-left">
//                                 Submitted
//                             </th>


//                             <th className="p-3 text-left">
//                                 Action
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {wards.length === 0 ? (

//                             <tr>

//                                 <td
//                                     colSpan={5}
//                                     className="text-center p-5"
//                                 >
//                                     No waiting ward officers
//                                 </td>

//                             </tr>

//                         ) : (

//                             wards.map((item) => (

//                                 <tr
//                                     key={item.id}
//                                     className="border-t"
//                                 >

//                                     <td className="p-3">
//                                         {item.officer_name}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.district}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.panchayath}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.ward}
//                                     </td>

//                                     <td className="p-3">
//                                         {item.submitted_at}
//                                     </td>



//                                     <td className="p-3">

//                                         <button
//                                             onClick={() => openWard(item.id)}
//                                             className="bg-blue-600 text-white px-3 py-1 rounded"
//                                         >
//                                             View
//                                         </button>

//                                     </td>

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>


//             <VerificationQueueDetailModal
//                 open={modalOpen}
//                 onClose={() => setModalOpen(false)}
//                 title={modalTitle}
//                 data={detail}
//                 type={modalType}
//             />

//         </div>
//     );
// }



import { useEffect, useState } from "react";
import {
    Users,
    ShieldCheck,
    Clock,
    Inbox,
    MapPin,
    Building2,
    Flag,
} from "lucide-react";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";
import VerificationQueueDetailModal from "@/components/admin/VerificationQueueDetailModal";

export default function VerificationQueue() {
    const [citizens, setCitizens] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [modalTitle, setModalTitle] = useState("");

    const [modalType, setModalType] = useState("");

    const [detail, setDetail] = useState({});

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await adminapi.getVerificationQueue();

            setCitizens(
                res.data.data.waiting_citizens || []
            );

            setWards(
                res.data.data.waiting_wards || []
            );
        } catch (error) {
            handleApiError(
                error,
                "Failed to load verification queue"
            );
        } finally {
            setLoading(false);
        }
    };

    const openCitizen = async (id) => {

        try {

            const res =
                await adminapi.getWaitingCitizenDetail(id);

            setDetail(res.data.data);

            setModalTitle(
                "Citizen Verification Details"
            );

            setModalType("citizen");

            setModalOpen(true);

        }

        catch (error) {

            handleApiError(error);

        }

    };

    const openWard = async (id) => {

        try {

            const res =
                await adminapi.getWaitingWardDetail(id);

            setDetail(res.data.data);

            setModalTitle(
                "Ward Verification Details"
            );

            setModalType("ward");

            setModalOpen(true);

        }

        catch (error) {

            handleApiError(error);

        }

    };

    const SkeletonRows = () => (

        Array.from({ length: 4 }).map((_, i) => (

            <tr key={i} className="border-t border-gray-50">

                <td className="p-4" colSpan={6}>

                    <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />

                </td>

            </tr>

        ))

    );

    const EmptyRow = ({ label }) => (

        <tr>

            <td colSpan={6} className="p-10">

                <div className="flex flex-col items-center justify-center text-center gap-2">

                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">

                        <Inbox size={20} className="text-gray-400" />

                    </div>

                    <p className="text-gray-500 text-sm font-medium">
                        {label}
                    </p>

                </div>

            </td>

        </tr>

    );

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">

            <div className="mb-2">

                <h1 className="text-2xl font-bold text-gray-900">
                    Verification Queue
                </h1>

                <p className="text-gray-500 mt-1 text-sm">
                    Review citizens and ward officers waiting for account verification.
                </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">

                        <Users size={20} className="text-blue-600" />

                    </div>

                    <div>

                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                            Waiting Citizens
                        </p>

                        <h2 className="text-2xl font-bold text-blue-700">
                            {loading ? "-" : citizens.length}
                        </h2>

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">

                        <ShieldCheck size={20} className="text-emerald-600" />

                    </div>

                    <div>

                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                            Waiting Ward Officers
                        </p>

                        <h2 className="text-2xl font-bold text-emerald-700">
                            {loading ? "-" : wards.length}
                        </h2>

                    </div>

                </div>

            </div>

            <div>

                <div className="flex items-center gap-2 mb-4">

                    <Users size={18} className="text-gray-400" />

                    <h2 className="text-lg font-bold text-gray-900">
                        Waiting Citizen Verifications
                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="bg-gray-50/80 border-b border-gray-100">

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Name
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        District
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Panchayath
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Ward
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Submitted
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading && <SkeletonRows />}

                                {!loading && citizens.length === 0 && (

                                    <EmptyRow label="No waiting citizens" />

                                )}

                                {!loading && citizens.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                                    >

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">

                                                    {item.name?.charAt(0)?.toUpperCase()}

                                                </div>

                                                <p className="font-semibold text-gray-800">
                                                    {item.name}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <MapPin size={14} className="text-blue-500 shrink-0" />

                                                {item.district}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <Building2 size={14} className="text-emerald-500 shrink-0" />

                                                {item.panchayath}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <Flag size={14} className="text-orange-500 shrink-0" />

                                                {item.ward}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-500">

                                                <Clock size={14} className="shrink-0" />

                                                {item.submitted_at}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() => openCitizen(item.id)}
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

            </div>

            <div>

                <div className="flex items-center gap-2 mb-4">

                    <ShieldCheck size={18} className="text-gray-400" />

                    <h2 className="text-lg font-bold text-gray-900">
                        Waiting Ward Verifications
                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="bg-gray-50/80 border-b border-gray-100">

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Officer
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        District
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Panchayath
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Ward
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Submitted
                                    </th>

                                    <th className="p-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading && <SkeletonRows />}

                                {!loading && wards.length === 0 && (

                                    <EmptyRow label="No waiting ward officers" />

                                )}

                                {!loading && wards.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                                    >

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm shrink-0">

                                                    {item.officer_name?.charAt(0)?.toUpperCase()}

                                                </div>

                                                <p className="font-semibold text-gray-800">
                                                    {item.officer_name}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <MapPin size={14} className="text-blue-500 shrink-0" />

                                                {item.district}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <Building2 size={14} className="text-emerald-500 shrink-0" />

                                                {item.panchayath}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-700">

                                                <Flag size={14} className="text-orange-500 shrink-0" />

                                                {item.ward}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2 text-gray-500">

                                                <Clock size={14} className="shrink-0" />

                                                {item.submitted_at}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() => openWard(item.id)}
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

            </div>


            <VerificationQueueDetailModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                data={detail}
                type={modalType}
            />

        </div>
    );
}