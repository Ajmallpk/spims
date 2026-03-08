/**
 * DocumentUploadField.jsx
 * Drag-and-drop document upload field.
 * Props:
 *   label:       string   – field label
 *   accept:      string   – mime types e.g. "image/*,.pdf"
 *   value:       File | null
 *   onChange:    (File) => void
 *   error:       string | null
 *   required:    boolean
 *   hint:        string   – helper text
 */

import { useRef, useState } from "react";

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (file) => {
  if (!file) return null;
  const type = file.type;
  if (type === "application/pdf") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-red-400">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-teal-400">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
};

const DocumentUploadField = ({
  label,
  accept = "image/jpeg,image/png,application/pdf",
  value,
  onChange,
  error,
  required = false,
  hint,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasFile = !!value;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      {/* Drop zone */}
      <div
        onClick={() => !hasFile && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${hasFile
            ? "border-teal-300 bg-teal-50/50 cursor-default"
            : dragging
            ? "border-teal-400 bg-teal-50 scale-[1.01]"
            : error
            ? "border-red-300 bg-red-50/30 hover:border-red-400"
            : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/30"
          }`}
      >
        {hasFile ? (
          /* File selected state */
          <div className="p-4 flex items-center gap-3">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-14 h-14 rounded-lg object-cover border border-teal-200 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white border border-teal-200 flex items-center justify-center flex-shrink-0">
                {getFileIcon(value)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{value.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(value.size)}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span className="text-xs text-teal-600 font-medium">Ready to upload</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-600 font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              dragging ? "bg-teal-100" : "bg-white border border-gray-200"
            }`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className={`w-6 h-6 transition-colors ${dragging ? "text-teal-500" : "text-gray-400"}`}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {dragging ? "Drop to upload" : "Drag & drop or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {hint || "Supports JPG, PNG, PDF · Max 5MB"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUploadField;