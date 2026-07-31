import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import panchayathApi from "@/service/panchayathurls";
import getErrorMessage from "@/utils/getErrorMessage";

const ChangeWardOfficerEmailModal = ({
    open,
    onClose,
    userId,
    currentEmail,
}) => {

    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (open) {
            setEmail(currentEmail || "");
            setReason("");
        }

    }, [currentEmail, open]);

    if (!open) return null;

    const handleSave = async () => {

        if (!email.trim()) {

            toast.error(
                "Officer email is required."
            );

            return;

        }



        if (reason.trim().length < 10) {

            toast.error(
                "Replacement reason must be at least 10 characters."
            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await panchayathApi.replaceWardOfficer(
                    userId,
                    {
                        officer_personal_email:
                            email.trim().toLowerCase(),

                        reason:
                            reason.trim(),
                    }
                );

            toast.success(
                response?.message ||
                "Officer replaced successfully."
            );

            onClose();

        }

        catch (error) {

            console.error(error);

            toast.error(
                getErrorMessage(error)
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-md p-6">

                <h2 className="text-xl font-semibold mb-4">

                    Replace Ward Officer

                </h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    className="w-full border rounded-lg px-4 py-3 mb-6"
                />


                <label className="block mb-2 font-medium">
                    Replacement Reason
                </label>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="w-full border rounded-lg px-4 py-3 mb-6"
                    placeholder="Enter replacement reason"
                />

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                    >
                        {
                            loading
                                ? "Replacing..."
                                : "Replace Officer"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ChangeWardOfficerEmailModal;