import { useRef, useState } from "react";

const MAX_MB = 10;

export default function DocumentUploadField({
  label,
  name,
  onChange,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  error,
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (f) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`File exceeds ${MAX_MB}MB limit.`);
      return;
    }
    setLocalError("");
    setFile(f);
    onChange(name, f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleInputChange = (e) => processFile(e.target.files?.[0]);

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setLocalError("");
    onChange(name, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = localError || error;
  const hasFile = !!file;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 px-4 py-5
          border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
          ${displayError
            ? "border-red-300 bg-red-50 hover:border-red-400"
            : hasFile
            ? "border-green-300 bg-green-50"
            : isDragging
            ? "border-blue-400 bg-blue-50 scale-[1.01]"
            : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
      >
        {hasFile ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-700 truncate max-w-[180px]">{file.name}</p>
                <p className="text-xs text-green-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full
                bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm transition-colors
              ${isDragging ? "bg-blue-100 border-blue-200" : "bg-white border-gray-200"}`}>
              <svg className={`w-5 h-5 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                <span className="text-blue-600">Click to upload</span>{" "}
                <span className="text-gray-400">or drag & drop</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG — max {MAX_MB}MB</p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {displayError && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  );
}