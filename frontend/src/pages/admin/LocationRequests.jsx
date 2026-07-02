import { useEffect, useState } from "react";
import { adminapi } from "@/service/adminurls";

const filters = [
    "PENDING",
    "HOLD",
    "COMPLETED",
    "REJECTED",
];

export default function LocationRequests() {

    const [status, setStatus] = useState("PENDING");
    const [requests, setRequests] = useState([]);

    const loadData = async () => {

        try {

            const res = await adminapi.getLocationRequests(status);


            console.log(res.data);
            console.log(res.data.data);

            setRequests(res.data.data);

        } catch (err) {

            console.log(err);

        }

    };


    const completeRequest = async (id) => {

        const admin_note = prompt(
            "Enter completion message"
        );

        if (admin_note === null) return;

        try {

            await adminapi.completeLocationRequest(
                id,
                {
                    admin_note
                }
            );

            loadData();

        } catch (err) {

            console.log(err);

        }

    };


    const holdRequest = async (id) => {

        const admin_note = prompt(
            "Reason for Hold"
        );

        if (admin_note === null) return;

        try {

            await adminapi.holdLocationRequest(
                id,
                {
                    admin_note
                }
            );

            loadData();

        } catch (err) {

            console.log(err);

        }

    };


    const rejectRequest = async (id) => {

        const admin_note = prompt(
            "Reason for Reject"
        );

        if (admin_note === null) return;

        try {

            await adminapi.rejectLocationRequest(
                id,
                {
                    admin_note
                }
            );

            loadData();

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadData();

    }, [status]);

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Location Requests
            </h1>

            <div className="flex gap-3 mb-6">

                {
                    filters.map((item) => (

                        <button
                            key={item}
                            onClick={() => setStatus(item)}
                            className={`px-5 py-2 rounded-lg

                            ${status === item
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-200"
                                }

                            `}
                        >
                            {item}
                        </button>

                    ))
                }

            </div>

            <div className="bg-white rounded-xl shadow border">

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

                            requests.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {item.requested_by}
                                    </td>

                                    <td className="p-3">
                                        {item.role}
                                    </td>

                                    <td className="p-3">
                                        {item.request_type}
                                    </td>

                                    <td className="p-3">

                                        {item.district_name}

                                        <br />

                                        {item.panchayath_name}

                                        <br />

                                        Ward {item.ward_number}

                                        {item.ward_name &&
                                            ` - ${item.ward_name}`
                                        }

                                    </td>

                                    <td className="p-3">

                                        {item.status}

                                    </td>


                                    <td className="p-3">

                                        {

                                            item.status === "PENDING" && (

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            completeRequest(item.id)
                                                        }
                                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Complete
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            holdRequest(item.id)
                                                        }
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Hold
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            rejectRequest(item.id)
                                                        }
                                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            )

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}