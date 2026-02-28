// components/DocumentUploadField.jsx
// SPIMS – Smart Panchayath Issue Management System
// Styled file upload input for verification documents.
// Accepts: PDF, JPG, PNG
// Shows: selected filename, size, type icon, error state.
//
// Props:
//   label       {string}   - Field label
//   name        {string}   - Input name attribute
//   onChange    {Function} - Called with File object or null
//   error       {string}   - Validation error message
//   disabled    {boolean}  - Disable during submission
//   required    {boolean}  - Show required asterisk

import { useState, useRef } from "react";

const ACCEPTED_TYPES = {
  "application/pdf": { ext: "PDF", icon: "pdf", color: "text-rose-600", bg: "bg-rose-100" },
  "image/jpeg": { ext: "JPG", icon: "img", color: "text-blue-600", bg: "bg-blue-100" },
  "image/jpg": { ext: "JPG", icon: "img", color: "text-blue-600", bg: "bg-blue-100" },
  "image/png": { ext: "PNG", icon: "img", color: "text-indigo-600", bg: "bg-indigo-100" },
};

const ACCEPT_STRING = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FileTypeIcon({ type }) {
  const config = ACCEPTED_TYPES[type] ?? { ext: "FILE", color: "text-slate-500", bg: "bg-slate-100" };

  if (config.icon === "pdf") {
    return (
      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${config.color}`}>
          <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
          <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${config.color}`}>
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

/**
 * DocumentUploadField
 * @param {string}   label     - Field label text
 * @param {string}   name      - HTML input name
 * @param {Function} onChange  - Receives (File | null)
 * @param {string}   [error]   - Validation error message
 * @param {boolean}  [disabled]
 * @param {boolean}  [required]
 */
export default function DocumentUploadField({
  label,
  name,
  onChange,
  error,
  disabled = false,
  required = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setSizeError("");

    if (!file) {
      setSelectedFile(null);
      onChange(null);
      return;
    }

    // Size validation
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(`File exceeds ${MAX_SIZE_MB}MB limit. Please choose a smaller file.`);
      setSelectedFile(null);
      onChange(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    onChange(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setSizeError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate change event
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) {
        inputRef.current.files = dt.files;
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  const combinedError = sizeError || error;
  const hasFile = !!selectedFile;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {/* Drop zone / trigger area */}
      {!hasFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center
            w-full rounded-xl border-2 border-dashed
            px-6 py-7
            cursor-pointer
            transition-all duration-200
            ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200" : ""}
            ${combinedError && !disabled
              ? "border-rose-300 bg-rose-50/40 hover:border-rose-400"
              : !disabled
              ? "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30"
              : ""
            }
          `}
        >
          {/* Upload icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${combinedError ? "bg-rose-100" : "bg-blue-100"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              className={`w-5 h-5 ${combinedError ? "text-rose-500" : "text-blue-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <p className="text-sm font-semibold text-slate-700 text-center">
            Drop file here or{" "}
            <span className="text-blue-600 underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1 text-center">
            Accepted: PDF, JPG, PNG · Max {MAX_SIZE_MB}MB
          </p>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={ACCEPT_STRING}
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
      ) : (
        /* Selected file preview */
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
          <FileTypeIcon type={selectedFile.type} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {formatBytes(selectedFile.size)} ·{" "}
              {ACCEPTED_TYPES[selectedFile.type]?.ext ?? selectedFile.type.split("/")[1].toUpperCase()}
            </p>
          </div>

          {/* Success tick */}
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          {/* Remove button */}
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors flex-shrink-0"
              aria-label="Remove file"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {combinedError && (
        <div className="flex items-start gap-1.5 mt-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="text-xs text-rose-600 font-medium">{combinedError}</p>
        </div>
      )}
    </div>
  );
}