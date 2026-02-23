import { useRef, useEffect } from "react";

// ─── Scroll Reveal Hook ─────────────────────────────────────
function useScrollReveal(delay = 0) {
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

export default function PageLocked() {
  const heroRef = useScrollReveal(0);
  const cardRef = useScrollReveal(120);

  return (
    <>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      <div className="font-body bg-[#f8faff] text-[#475569] min-h-screen">
        <div className="max-w-[1140px] mx-auto py-24 px-16 max-md:py-16 max-md:px-8 space-y-14">

          {/* ── Hero ───────────────────────────────────── */}
          <div ref={heroRef} style={revealStyle}>
            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
              Access Control
            </p>

            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              This Page Is Currently Locked
            </h1>

            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-xl">
              You do not currently have permission to access this section.
              Please contact your administrator or wait until your account
              is verified.
            </p>
          </div>

          {/* ── Locked Card ───────────────────────────── */}
          <div
            ref={cardRef}
            style={revealStyle}
            className="relative bg-white border border-[#e2e8f0] rounded-2xl p-12 overflow-hidden"
          >
            {/* Gradient top line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6]" />

            <div className="flex flex-col items-center text-center space-y-6">

              {/* Lock Icon */}
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 72,
                  height: 72,
                  background:
                    "linear-gradient(135deg, #1a56db 0%, #3b82f6 100%)",
                  boxShadow: "0 8px 24px rgba(26,86,219,.25)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 10-8 0v4M5 11h14v10H5z"
                  />
                </svg>
              </div>

              <div>
                <h2
                  className="font-black text-[#0f172a] mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem",
                  }}
                >
                  Restricted Access
                </h2>

                <p className="text-[0.85rem] text-[#64748b] max-w-md">
                  Your role does not permit viewing this content at this time.
                  Once your permissions are updated, this page will become available.
                </p>
              </div>

              <button
                className="text-white font-bold rounded-xl px-6 py-3 text-sm transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#1a56db",
                  boxShadow: "0 6px 18px rgba(26,86,219,.28)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1e40af")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1a56db")
                }
              >
                Contact Administrator
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}