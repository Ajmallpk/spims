import { useEffect, useState } from "react";
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

    if (loading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-10 p-6">

            <div>

                <h2 className="text-2xl font-bold mb-4">
                    Waiting Citizen Verifications
                </h2>

                <table className="w-full border">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                District
                            </th>

                            <th className="p-3 text-left">
                                Panchayath
                            </th>

                            <th className="p-3 text-left">
                                Ward
                            </th>

                            <th className="p-3 text-left">
                                Submitted
                            </th>


                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {citizens.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="text-center p-5"
                                >
                                    No waiting citizens
                                </td>

                            </tr>

                        ) : (

                            citizens.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {item.name}
                                    </td>

                                    <td className="p-3">
                                        {item.district}
                                    </td>

                                    <td className="p-3">
                                        {item.panchayath}
                                    </td>

                                    <td className="p-3">
                                        {item.ward}
                                    </td>

                                    <td className="p-3">
                                        {item.submitted_at}
                                    </td>


                                    <td className="p-3">

                                        <button
                                            onClick={() => openCitizen(item.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            <div>

                <h2 className="text-2xl font-bold mb-4">
                    Waiting Ward Verifications
                </h2>

                <table className="w-full border">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Officer
                            </th>

                            <th className="p-3 text-left">
                                District
                            </th>

                            <th className="p-3 text-left">
                                Panchayath
                            </th>

                            <th className="p-3 text-left">
                                Ward
                            </th>

                            <th className="p-3 text-left">
                                Submitted
                            </th>


                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {wards.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="text-center p-5"
                                >
                                    No waiting ward officers
                                </td>

                            </tr>

                        ) : (

                            wards.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {item.officer_name}
                                    </td>

                                    <td className="p-3">
                                        {item.district}
                                    </td>

                                    <td className="p-3">
                                        {item.panchayath}
                                    </td>

                                    <td className="p-3">
                                        {item.ward}
                                    </td>

                                    <td className="p-3">
                                        {item.submitted_at}
                                    </td>



                                    <td className="p-3">

                                        <button
                                            onClick={() => openWard(item.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

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