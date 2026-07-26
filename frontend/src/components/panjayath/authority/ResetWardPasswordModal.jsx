import { useState } from "react";
import { toast } from "react-hot-toast";
import panchayathApi from "@/service/panchayathurls";

const ResetWardPasswordModal = ({
    open,
    onClose,
    userId,
}) => {

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleReset = async () => {

        try {

            setLoading(true);

            const response =
                await panchayathApi.resetWardPassword(
                    userId
                );

            toast.success(
                response?.message ||
                "Password reset email sent successfully."
            );

            onClose();

        }

        catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to reset password."
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
                    Reset Password
                </h2>

                <p className="text-gray-600 mb-6">
                    A new password setup email will be sent to the Ward Officer's personal email.
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ResetWardPasswordModal;