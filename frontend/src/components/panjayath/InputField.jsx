import { useSelector, useDispatch } from "react-redux";
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

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  NOT_SUBMITTED: {
    label: "Not Submitted",
    bg: "#eff6ff",
    color: "#1a56db",
  },
  PENDING: {
    label: "Under Review",
    bg: "#fffbeb",
    color: "#d97706",
  },
  APPROVED: {
    label: "Approved",
    bg: "#ecfdf5",
    color: "#059669",
  },
  REJECTED: {
    label: "Rejected",
    bg: "#fef2f2",
    color: "#dc2626",
  },
};

function InputField({ label, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="panchayth text-[0.68rem] font-bold tracking-[.14em] uppercase mb-2"
        style={{ color: focused ? "#1a56db" : "#94a3b8" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-[0.9rem] text-[#0f172a] bg-[#f8faff] outline-none transition-all duration-200"
        style={{
          border: focused ? "1.5px solid #1a56db" : "1.5px solid #e2e8f0",
          boxShadow: focused ? "0 0 0 4px rgba(26,86,219,.08)" : "none",
          fontFamily: "'Outfit', sans-serif",
        }}
      />
    </div>
  );
}