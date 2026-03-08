/**
 * ProfileAvatarUploader.jsx
 * Handles profile photo preview and upload.
 *
 * Props:
 *   avatarUrl    : string | null   – current avatar URL
 *   onUpload     : (newUrl) => void – called after successful upload
 *   token        : string           – Bearer auth token
 */

import { useRef, useState } from "react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "CZ";

const ProfileAvatarUploader = ({ avatarUrl, fullName, onUpload, token }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/citizen/upload-avatar/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUpload?.(data.avatarUrl ?? data.avatar_url ?? preview);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const displaySrc = preview || avatarUrl;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Avatar circle */}
      <div
        className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group ring-4 ring-white shadow-md flex-shrink-0"
        onClick={() => !uploading && inputRef.current?.click()}
        title="Change profile photo"
      >
        {/* Image or initials fallback */}
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={fullName || "Profile"}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-xl font-bold select-none">
            {getInitials(fullName)}
          </div>
        )}

        {/* Hover / uploading overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 ${
            uploading
              ? "bg-black/50 opacity-100"
              : "bg-black/40 opacity-0 group-hover:opacity-100"
          }`}
        >
          {uploading ? (
            <svg
              className="animate-spin w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-white"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-white text-xs font-medium">Upload</span>
            </>
          )}
        </div>

        {/* Camera badge */}
        {!uploading && (
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm pointer-events-none">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="w-3 h-3"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 text-center max-w-[100px]">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatarUploader;