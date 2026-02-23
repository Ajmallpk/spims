
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
// import { submitVerification } from "@/blockSlice";


// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
export default function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};



function FileUploadField({ label, hint, icon, file, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange({ target: { files: [dropped] } });
  };

  return (
    <div>
      {/* Label */}
      <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase mb-2"
         style={{ color: file ? "#1a56db" : "#94a3b8" }}>
        {label}
      </p>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl px-5 py-6 flex items-center gap-4 cursor-pointer transition-all duration-200"
        style={{
          border: file
            ? "1.5px solid #1a56db"
            : dragging
            ? "1.5px dashed #1a56db"
            : "1.5px dashed #cbd5e1",
          background: file ? "#eff6ff" : dragging ? "#eff6ff" : "#f8faff",
          boxShadow: file ? "0 0 0 4px rgba(26,86,219,.07)" : "none",
        }}
      >
        {/* Icon badge */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 44, height: 44,
            background: file ? "#1a56db" : "#e2e8f0",
            border: file ? "none" : "1.5px solid #cbd5e1",
            transition: "all 0.2s",
          }}
        >
          {file ? (
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            icon
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {file ? (
            <>
              <p className="text-[0.85rem] font-semibold text-[#1a56db] truncate">{file.name}</p>
              <p className="text-[0.72rem] text-[#94a3b8] mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · Click to replace
              </p>
            </>
          ) : (
            <>
              <p className="text-[0.85rem] font-medium text-[#475569]">
                Drop file here or <span className="text-[#1a56db] font-semibold">browse</span>
              </p>
              <p className="text-[0.72rem] text-[#94a3b8] mt-0.5">{hint}</p>
            </>
          )}
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}