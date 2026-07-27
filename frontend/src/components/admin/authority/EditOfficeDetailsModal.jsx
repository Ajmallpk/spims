import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { adminapi } from "@/service/adminurls";

const EditOfficeDetailsModal = ({
    open,
    onClose,
    account,
}) => {

    const [officialEmail, setOfficialEmail] = useState("");
    const [officialPhone, setOfficialPhone] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (open && account) {

            setOfficialEmail(
                account.official_email || ""
            );

            setOfficialPhone(
                account.official_phone || ""
            );

            setReason("");

        }

    }, [open, account]);

    if (!open) return null;

    const validate = () => {

        if (!reason.trim()) {

            toast.error(
                "Please enter the reason for the update."
            );

            return false;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                officialEmail.trim()
            )
        ) {

            toast.error(
                "Enter a valid official email."
            );

            return false;

        }

        if (
            !/^[6-9]\d{9}$/.test(
                officialPhone.trim()
            )
        ) {

            toast.error(
                "Enter a valid 10-digit phone number."
            );

            return false;

        }

        const emailChanged =
            officialEmail.trim().toLowerCase() !==
            (
                account.official_email || ""
            )
                .trim()
                .toLowerCase();

        const phoneChanged =
            officialPhone.trim() !==
            (
                account.official_phone || ""
            )
                .trim();

        if (
            !emailChanged &&
            !phoneChanged
        ) {

            toast.error(
                "No changes detected."
            );

            return false;

        }

        return true;

    };

    const handleSave = async () => {

        if (!validate()) {
            return;
        }

        try {

            setLoading(true);

            const payload = {
                reason: reason.trim(),
            };

            const emailChanged =
                officialEmail.trim().toLowerCase() !==
                (account.official_email || "")
                    .trim()
                    .toLowerCase();

            const phoneChanged =
                officialPhone.trim() !==
                (account.official_phone || "")
                    .trim();

            if (emailChanged) {
                payload.official_email =
                    officialEmail.trim().toLowerCase();
            }

            if (phoneChanged) {
                payload.official_phone =
                    officialPhone.trim();
            }

            const response =
                await adminapi.updateOfficeDetails(
                    account.id,
                    payload
                );

            toast.success(
                response.message ||
                "Office details updated successfully."
            );

            onClose(true);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to update office details."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-xl p-6">

                <h2 className="text-2xl font-semibold mb-6">
                    Edit Office Details
                </h2>

                <div className="space-y-5">

                    <div>

                        <label className="block mb-2 font-medium">
                            Official Email
                        </label>

                        <input
                            type="email"
                            value={officialEmail}
                            onChange={(e) =>
                                setOfficialEmail(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Official Phone
                        </label>

                        <input
                            type="text"
                            value={officialPhone}
                            onChange={(e) =>
                                setOfficialPhone(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Reason for Update
                        </label>

                        <textarea
                            rows={4}
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value
                                )
                            }
                            placeholder="Enter the reason for updating the office details..."
                            className="w-full border rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">

                        <p className="text-sm text-blue-700">

                            <strong>Important:</strong>

                        </p>

                        <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">

                            <li>
                                Updating the official email will revoke the current password.
                            </li>

                            <li>
                                A new password setup email will be sent to the officer.
                            </li>

                            <li>
                                Office data, complaints, verification and permissions remain unchanged.
                            </li>

                        </ul>

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={() => onClose(false)}
                        disabled={loading}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
                    >
                        {
                            loading
                                ? "Updating..."
                                : "Update Office Details"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

};

export default EditOfficeDetailsModal;