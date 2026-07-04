import { useState, useEffect } from "react";
import toast from "react-hot-toast";


export default function LocationRequestModal({
    open,
    onClose,
    api,
    allowWardRequest = true,
}) {

    const [requestType, setRequestType] = useState(
        allowWardRequest ? "WARD" : "DISTRICT"
    );

    const [districtName, setDistrictName] = useState("");
    const [panchayathName, setPanchayathName] = useState("");
    const [wardNumber, setWardNumber] = useState("");
    const [wardName, setWardName] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setRequestType(
            allowWardRequest ? "WARD" : "DISTRICT"
        );
    }, [allowWardRequest, open]);

    if (!open) return null;

    const submit = async () => {

        try {

            setLoading(true);

            await api.createLocationRequest({

                request_type: requestType,

                district_name: districtName,

                panchayath_name: panchayathName,

                ward_number: wardNumber || null,

                ward_name: wardName,

                message,

            });

            toast.success(
                "Location request submitted successfully."
            );

            onClose();

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-full max-w-xl p-6">

                <h2 className="text-xl font-bold">
                    Request Missing Location
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    If your District, Panchayath or Ward is unavailable,
                    submit a request to the Administrator.
                </p>

                <div className="mt-5 space-y-4">

                    <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    >
                        <option value="DISTRICT">District</option>

                        <option value="PANCHAYATH">Panchayath</option>

                        {allowWardRequest && (
                            <option value="WARD">Ward</option>
                        )}

                    </select>

                    <input
                        placeholder="District Name"
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    {(requestType === "PANCHAYATH" || requestType === "WARD") && (

                        <input
                            placeholder="Panchayath Name"
                            value={panchayathName}
                            onChange={(e) => setPanchayathName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    )}

                    {allowWardRequest && requestType === "WARD" && (

                        <>
                            <input
                                placeholder="Ward Number"
                                value={wardNumber}
                                onChange={(e) => setWardNumber(e.target.value)}
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <input
                                placeholder="Ward Name (Optional)"
                                value={wardName}
                                onChange={(e) => setWardName(e.target.value)}
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </>

                    )}

                    <textarea
                        rows={4}
                        placeholder="Additional Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={submit}
                        className="bg-emerald-500 text-white px-5 py-2 rounded-lg"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div>

            </div>

        </div>

    );

}