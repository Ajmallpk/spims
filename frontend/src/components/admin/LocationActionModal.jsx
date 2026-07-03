import { useState, useEffect } from "react";

export default function LocationActionModal({
    open,
    title,
    actionLabel,
    buttonColor,
    loading,
    onClose,
    onSubmit,
}) {

    const [note, setNote] = useState("");

    useEffect(() => {
        if (open) {
            setNote("");
        }
    }, [open]);

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

                <h2 className="text-xl font-bold mb-5">
                    {title}
                </h2>

                <textarea
                    rows={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter admin note..."
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => onSubmit(note)}
                        className={`px-5 py-2 rounded-lg text-white ${buttonColor}`}
                    >
                        {loading ? "Please wait..." : actionLabel}
                    </button>

                </div>

            </div>

        </div>

    );
}