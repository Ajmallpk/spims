import { useState, useRef, useEffect } from "react";




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
      { threshold: 0.08 }
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
const STATUS = {
  PENDING:  { label: "Pending",  bg: "#fffbeb", color: "#d97706", border: "#fcd34d" },
  APPROVED: { label: "Approved", bg: "#ecfdf5", color: "#059669", border: "#6ee7b7" },
  REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};





function RequestCard({ req, onApprove, onReject, delay }) {
  const ref = useScrollReveal(delay);
  const status = STATUS[req.status] || STATUS.PENDING;

  return (
    <div
      ref={ref}
      style={{ ...revealStyle, position: "relative" }}
      className="group bg-white border border-[#e2e8f0] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] hover:-translate-y-1 overflow-hidden"
    >
      {/* Activity top border */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      <div className="flex items-start justify-between gap-6 flex-wrap">

        {/* Left — info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">

          {/* Avatar badge */}
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 font-black text-white text-sm"
            style={{
              width: 48, height: 48,
              background: "linear-gradient(135deg, #1a56db 0%, #3b82f6 100%)",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 12px rgba(26,86,219,.25)",
            }}
          >
            {req.name.charAt(0)}
          </div>

          <div className="min-w-0">
            {/* Eyebrow */}
            <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-1">
              Panchayath
            </p>
            {/* Name */}
            <h3
              className="font-black text-[#0f172a] leading-tight truncate mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
            >
              {req.name}
            </h3>
            {/* President */}
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <p className="text-[0.8rem] text-[#475569]">President: <span className="font-medium text-[#0f172a]">{req.president}</span></p>
            </div>
          </div>
        </div>

        {/* Right — status + actions */}
        <div className="flex flex-col items-end gap-4">

          {/* Status pill */}
          <span
            className="text-[0.63rem] uppercase font-bold tracking-[.05em] px-3 py-1 rounded-full"
            style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
          >
            {status.label}
          </span>

          {/* Action buttons — PENDING only */}
          {req.status === "PENDING" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onApprove(req.id)}
                className="text-white font-bold rounded-xl px-5 py-2 text-sm transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#059669",
                  boxShadow: "0 4px 12px rgba(5,150,105,.28)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
              >
                Approve
              </button>
              <button
                onClick={() => onReject(req.id)}
                className="font-bold rounded-xl px-5 py-2 text-sm transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1.5px solid #fca5a5",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dc2626";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.color = "#dc2626";
                }}
              >
                Reject
              </button>
            </div>
          )}

          {/* Resolved state indicator */}
          {req.status === "APPROVED" && (
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-[0.75rem] text-[#059669] font-semibold">Decision recorded</p>
            </div>
          )}
          {req.status === "REJECTED" && (
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-[0.75rem] text-[#dc2626] font-semibold">Decision recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}