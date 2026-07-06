import { useState } from "react";
import toast from "react-hot-toast";
import wardapi from "@/service/wardurls";

export default function HoldModal({
    complaintId,
    onClose,
    onSuccess,
}) {

    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        if (reason.trim().length < 10) {
            toast.error("Reason must contain at least 10 characters.");
            return;
        }

        try {

            setLoading(true);

            await wardapi.holdComplaint(
                complaintId,
                {
                    hold_reason: reason
                }
            );

            toast.success("Complaint put on hold.");

            onSuccess("Complaint put on hold.");

            onClose();

        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Unable to put complaint on hold."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <h2 className="text-lg font-bold mb-4">
                    Put Complaint On Hold
                </h2>

                <textarea
                    rows={5}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full border rounded-xl p-3 resize-none"
                />

                <div className="flex justify-end gap-3 mt-5">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-xl"
                    >
                        {loading ? "Saving..." : "Put On Hold"}
                    </button>

                </div>

            </div>

        </div>

    );

}