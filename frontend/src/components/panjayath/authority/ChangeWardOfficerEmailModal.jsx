import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import panchayathApi from "@/service/panchayathurls";

const ChangeWardOfficerEmailModal = ({
    open,
    onClose,
    userId,
    currentEmail,
}) => {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setEmail(currentEmail || "");

    }, [currentEmail]);

    if (!open) return null;

    const handleSave = async () => {

        if (!email.trim()) {

            toast.error(
                "Officer email is required."
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
                            email.trim(),
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
                error?.response?.data?.message ||
                "Failed to update officer email."
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

                    Change Officer Email

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
                                ? "Saving..."
                                : "Update Email"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ChangeWardOfficerEmailModal;