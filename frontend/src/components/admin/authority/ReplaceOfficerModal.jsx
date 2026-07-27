import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { adminapi } from "@/service/adminurls";

const ReplaceOfficerModal = ({
    open,
    onClose,
    userId,
    currentEmail,
}) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setEmail(currentEmail || "");
        }
    }, [currentEmail, open]);

    if (!open) return null;

    const handleReplace = async () => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {

            toast.error("Enter a valid email address.");

            return;
        }

        try {

            setLoading(true);

            const response =
                await adminapi.updateOfficerEmail(
                    userId,
                    {
                        officer_personal_email:
                            email.trim().toLowerCase(),
                    }
                );

            toast.success(
                response.message ||
                "Officer replaced successfully."
            );

            onClose();

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to replace officer."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <h2 className="text-2xl font-semibold mb-4">
                    Replace Officer
                </h2>

                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">

                    <p className="text-sm text-yellow-800">

                        Replacing the officer will:

                    </p>

                    <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">

                        <li>Assign a new officer to this office account.</li>

                        <li>Revoke the previous officer's password.</li>

                        <li>Send a password setup link to the new officer.</li>

                        <li>Keep all office data, complaints, permissions and verification records unchanged.</li>

                    </ul>

                </div>

                <label className="block mb-2 font-medium">
                    New Officer Personal Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter new officer email"
                />

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleReplace}
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                    >
                        {loading
                            ? "Replacing..."
                            : "Replace Officer"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ReplaceOfficerModal;