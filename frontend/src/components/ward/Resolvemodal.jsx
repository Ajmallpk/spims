import { useState } from "react";
import toast from "react-hot-toast";
import complaintapi from "@/service/complaintsurls";
import ConfirmModal from '../../components/ward/ConfirmModal'
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const MIN_CHARS = 10;

export default function ResolveModal({ complaintId, onClose, onSuccess }) {
  const token = localStorage.getItem("access");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [descError, setDescError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const handleSubmit = async () => {
    if (description.trim().length < MIN_CHARS) {
      setDescError(`Resolution description must be at least ${MIN_CHARS} characters.`);
      return;
    }

    setDescError("");

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("message", description.trim());
      files.forEach((file) => {
        formData.append("media_files", file);
      });

      await complaintapi.resolveComplaint(complaintId, formData);

      onSuccess("Complaint marked as resolved successfully.");
      onClose();

    } catch (err) {

    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Resolve Complaint</h2>
                <p className="text-xs text-gray-400">Provide resolution details</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Resolution Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descError && e.target.value.trim().length >= MIN_CHARS) setDescError("");
              }}
              rows={4}
              maxLength={500}
              placeholder="Describe how this complaint was resolved…"
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:ring-2 ${descError
                ? "border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50"
                : "border-gray-200 focus:border-green-400 focus:ring-green-100"
                }`}
            />
            <div className="flex items-start justify-between">
              {descError
                ? <p className="text-xs text-red-600 font-medium">{descError}</p>
                : <span />
              }
              <span className="text-xs text-gray-400 font-mono">{description.length}/500</span>
            </div>
          </div>

          {/* Proof Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Proof Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files));
                  setPreviewIndex(0); // 🔥 IMPORTANT
                }}
              />
              <p className="text-sm text-gray-500">
                Click to upload images or videos
              </p>
            </label>
            {files.length > 0 && files[previewIndex] && (
              <div className="mt-4 flex flex-col items-center gap-3">

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
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={() => setShowConfirm(true)} disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting…
                </>
              ) : "Confirm Resolution"}
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          title="Resolve Complaint"
          message="Are you sure you want to mark this complaint as resolved?"
          confirmText="Yes, Resolve"
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