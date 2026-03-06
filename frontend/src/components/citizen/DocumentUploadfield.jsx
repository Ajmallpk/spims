// citizen/components/DocumentUploadField.jsx
import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, FileText, FileImage, AlertCircle, Eye } from "lucide-react";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPTED_EXT = ".jpg,.jpeg,.png,.pdf";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentUploadField({ label, hint, value, onChange, error, required = false }) {
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef(null);

  const processFile = useCallback((file) => {
    setSizeError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSizeError("Only JPG, PNG, and PDF files are accepted.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`File too large. Max 10MB (yours: ${formatBytes(file.size)}).`);
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

  const handleRemove = () => {
    if (value?.preview) URL.revokeObjectURL(value.preview);
    onChange(null);
    setSizeError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isPdf = value?.type === "application/pdf";
  const isImage = value?.type?.startsWith("image/");
  const fieldError = error || sizeError;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}

      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "flex flex-col items-center justify-center gap-2.5 px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            fieldError && !sizeError
              ? "border-red-300 bg-red-50"
              : dragOver
              ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
              : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40",
          ].join(" ")}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-indigo-200" : "bg-indigo-100"}`}>
            <UploadCloud className={`w-5 h-5 transition-colors ${dragOver ? "text-indigo-700" : "text-indigo-400"}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {dragOver ? "Drop file here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or PDF — max 10MB</p>
          </div>
          <input ref={inputRef} type="file" accept={ACCEPTED_EXT} onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
          {/* Preview area */}
          {isImage && (
            <div className="relative bg-gray-900 group">
              <img src={value.preview} alt="Document preview" className="w-full max-h-44 object-cover opacity-90" />
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg text-xs font-medium text-gray-700">
                  <Eye className="w-3.5 h-3.5" /> View Full
                </div>
              </button>
            </div>
          )}
          {isPdf && (
            <div className="flex items-center justify-center py-8 bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-red-400" />
                <p className="text-xs font-medium text-gray-600">PDF Document</p>
              </div>
            </div>
          )}

          {/* File meta row */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100">
            {isImage ? (
              <FileImage className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-700 font-medium truncate flex-1">{value.name}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatBytes(value.size)}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
            >
              <X className="w-2.5 h-2.5 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {fieldError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {fieldError}
        </div>
      )}

      {/* Full-size preview modal */}
      {previewOpen && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-2xl w-full">
            <img src={value.preview} alt="Full preview" className="w-full rounded-xl shadow-2xl" />
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}