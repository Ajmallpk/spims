// citizen/components/MediaUpload.jsx
import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, FileVideo, FileImage, AlertCircle } from "lucide-react";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "video/mp4"];
const ACCEPTED_EXT = ".jpg,.jpeg,.png,.mp4";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaUpload({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState(null);
  const inputRef = useRef(null);

  const processFile = useCallback((file) => {
    setSizeError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSizeError("Only JPG, PNG, and MP4 files are accepted.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`File too large. Maximum size is 20MB (your file: ${formatBytes(file.size)}).`);
      return;
    }
    const preview = URL.createObjectURL(file);
    onChange({ file, preview, type: file.type, size: file.size, name: file.name });
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    if (value?.preview) URL.revokeObjectURL(value.preview);
    onChange(null);
    setSizeError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isVideo = value?.type?.startsWith("video/");
  const isImage = value?.type?.startsWith("image/");

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <UploadCloud className="w-4 h-4 text-indigo-500" />
        Attach Media
        <span className="text-xs font-normal text-gray-400 ml-1">(optional, max 20MB)</span>
      </label>

      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "relative flex flex-col items-center justify-center gap-3 px-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            dragOver
              ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40",
          ].join(" ")}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <UploadCloud className={`w-6 h-6 transition-colors ${dragOver ? "text-indigo-600" : "text-indigo-400"}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {dragOver ? "Drop to upload" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or MP4 — up to 20MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXT}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 group">
          {/* Preview */}
          {isImage && (
            <img
              src={value.preview}
              alt="Preview"
              className="w-full max-h-56 object-cover"
            />
          )}
          {isVideo && (
            <video
              src={value.preview}
              controls
              className="w-full max-h-56 object-contain"
            />
          )}

          {/* Overlay meta */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-100">
            {isImage ? (
              <FileImage className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            ) : (
              <FileVideo className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-700 font-medium truncate flex-1">
              {value.name}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formatBytes(value.size)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {sizeError && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{sizeError}</p>
        </div>
      )}
    </div>
  );
}