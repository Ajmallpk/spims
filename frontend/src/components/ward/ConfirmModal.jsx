import React from "react";

export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        
        <div className="p-6 space-y-5">

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>

          {/* Message */}
          <p className="text-sm text-gray-600">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}