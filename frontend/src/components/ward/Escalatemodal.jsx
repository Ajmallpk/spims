import { useState } from "react";
import toast from "react-hot-toast";
import wardapi from "@/service/wardurls";
import ConfirmModal from '../../components/ward/ConfirmModal'

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const MIN_CHARS = 10;

export default function EscalateModal({ complaintId, onClose, onSuccess }) {
  const token = localStorage.getItem("access");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const handleSubmit = async () => {
    if (reason.trim().length < MIN_CHARS) {
      setError(`Reason must be at least ${MIN_CHARS} characters.`);
      return;
    }

    setError("");

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("escalation_reason", reason.trim());

      files.forEach((file) => {
        formData.append("media_files", file);
      });

      await wardapi.escalateComplaint(complaintId, formData);

      onSuccess("Complaint escalated successfully.");
      onClose();

    } catch (err) {
      toast.error("Escalate failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-400 to-orange-500" />
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Escalate Complaint</h2>
                <p className="text-xs text-gray-400">This will notify higher authorities</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isSubmitting}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-orange-700 leading-relaxed">
              Escalating a complaint will mark it as high priority and alert senior administrators. This action cannot be undone.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Escalation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error && e.target.value.trim().length >= MIN_CHARS) setError("");
              }}
              rows={4}
              maxLength={500}
              placeholder="Explain why this complaint needs to be escalated…"
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:ring-2 ${error
                ? "border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50"
                : "border-gray-200 focus:border-red-400 focus:ring-red-100"
                }`}
            />

            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files));
                  setPreviewIndex(0); // 🔥 IMPORTANT FIX
                }}
              />
              <p className="text-sm text-gray-500">
                Click to upload images or videos
              </p>
            </label>
            {files.length > 0 && (
              <div className="mt-4 flex flex-col items-center gap-3">

                {/* Preview */}
                <div className="w-full h-64 bg-black rounded-xl flex items-center justify-center overflow-hidden">
                  {files[previewIndex].type.startsWith("video") ? (
                    <video
                      src={URL.createObjectURL(files[previewIndex])}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(files[previewIndex])}
                      alt="preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">

                  <button
                    onClick={() =>
                      setPreviewIndex((prev) =>
                        prev === 0 ? files.length - 1 : prev - 1
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Prev
                  </button>

                  <span className="text-sm text-gray-600">
                    {previewIndex + 1} / {files.length}
                  </span>

                  <button
                    onClick={() =>
                      setPreviewIndex((prev) =>
                        prev === files.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}
            <div className="flex items-start justify-between">
              {error
                ? <p className="text-xs text-red-600 font-medium">{error}</p>
                : <span />
              }
              <span className="text-xs text-gray-400 font-mono">{reason.length}/500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={() => setShowConfirm(true)} disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Escalating…
                </>
              ) : "Confirm Escalation"}
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          title="Escalate Complaint"
          message="Are you sure you want to escalate this complaint to Panchayath?"
          confirmText="Yes, Escalate"
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setShowConfirm(false);
            await handleSubmit();
          }}
          loading={isSubmitting}
        />
      )}
    </div>
  );
}