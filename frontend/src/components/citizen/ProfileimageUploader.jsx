// citizen/components/ProfileImageUploader.jsx
import { useState, useRef, useCallback } from "react";
import { UploadCloud, Camera, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/jpeg", "image/png"];

function formatBytes(b) {
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ProfileImageUploader({ currentImage, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const processFile = useCallback((f) => {
    setError(null);
    setSuccess(false);
    if (!ACCEPTED.includes(f.type)) {
      setError("Only JPG and PNG images are accepted.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError(`File too large. Max 5MB (yours: ${formatBytes(f.size)}).`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setError(null);
    setSuccess(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const fd = new FormData();
      fd.append("profile_image", file);
      const res = await fetch("/api/citizen/update-profile-image/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed. Please try again.");
      const data = await res.json();
      setSuccess(true);
      setPreview(null);
      setFile(null);
      onSuccess?.(data.profile_image || data.image_url || data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile Photo</p>

      {/* Current/preview image */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md">
              <Camera className="w-7 h-7 text-indigo-400" />
            </div>
          )}
          {preview && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">NEW</span>
            </span>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !preview && inputRef.current?.click()}
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1.5 py-4 px-3 border-2 border-dashed rounded-xl transition-all duration-200",
            preview
              ? "border-indigo-300 bg-indigo-50 cursor-default"
              : dragOver
              ? "border-indigo-400 bg-indigo-50 cursor-pointer scale-[1.01]"
              : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer",
          ].join(" ")}
        >
          {preview ? (
            <p className="text-xs font-semibold text-indigo-600 text-center">
              ✓ {file?.name}
              <span className="block text-indigo-400 font-normal">{formatBytes(file?.size || 0)}</span>
            </p>
          ) : (
            <>
              <UploadCloud className={`w-5 h-5 transition-colors ${dragOver ? "text-indigo-600" : "text-indigo-400"}`} />
              <p className="text-xs text-gray-600 font-medium text-center">
                {dragOver ? "Drop to select" : "Drag & drop or click"}
              </p>
              <p className="text-[10px] text-gray-400">JPG, PNG — max 5MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            className="hidden"
          />
        </div>
      </div>

      {/* Error / success feedback */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          Profile photo updated successfully!
        </div>
      )}

      {/* Action buttons */}
      {preview && (
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
            ) : (
              <><UploadCloud className="w-3.5 h-3.5" /> Upload Photo</>
            )}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}