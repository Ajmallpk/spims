import { useState } from "react";
import toast from "react-hot-toast";
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const MIN_CHARS = 10;

export default function ResolveModal({ complaintId, onClose, onSuccess }) {
  const token = localStorage.getItem("access");
  const [description, setDescription] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [descError, setDescError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (description.trim().length < MIN_CHARS) {
      setDescError(`Resolution description must be at least ${MIN_CHARS} characters.`);
      return;
    }
    setDescError("");
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("resolution_description", description.trim());
      if (proofImage) formData.append("proof_image", proofImage);

      const res = await fetch(`${API_BASE}/api/ward/complaint/${complaintId}/resolve/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSuccess("Complaint marked as resolved successfully.");
      onClose();
    } catch (err) {
      toast.error("Resolve complaint error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
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
            <button onClick={onClose} disabled={isSubmitting}
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
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:ring-2 ${
                descError
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
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all">
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setProofImage(e.target.files?.[0] ?? null)} />
              {proofImage ? (
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium px-4">
                  <span className="truncate max-w-[200px]">{proofImage.name}</span>
                  <button type="button" onClick={(e) => { e.preventDefault(); setProofImage(null); }}
                    className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Click to upload image</p>
              )}
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}
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
    </div>
  );
}