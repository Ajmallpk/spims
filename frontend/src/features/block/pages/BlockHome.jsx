import { useEffect, useRef } from "react";

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
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

// ─── Reveal Wrapper Style ─────────────────────────────────────────────────────
const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, delay }) {
  const ref = useScrollReveal(delay);
  return (
    <div
      ref={ref}
      style={{ ...revealStyle, position: "relative" }}
      className="group bg-white border border-[#e2e8f0] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] hover:-translate-y-1 overflow-hidden"
    >
      {/* Activity card top border — inline + Tailwind */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1a56db] to-[#3b82f6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />

      {/* Eyebrow */}
      <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-3">
        {title}
      </p>

      {/* Value */}
      <p
        className="font-black leading-tight text-[#0f172a]"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 3vw, 2.8rem)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── BlockHome ────────────────────────────────────────────────────────────────
export default function BlockHome() {

  const heroRef = useScrollReveal(0);
  const gridRef = useScrollReveal(100);
  const cardRef = useScrollReveal(200);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      {/* Page Wrapper */}
      <div className="bg-[#f8faff] text-[#475569] font-body min-h-screen">
        <div
          className="max-w-[1140px] mx-auto py-24 px-16 max-md:py-16 max-md:px-8 space-y-16"
        >

          {/* ── Hero Section */}
          <div ref={heroRef} style={revealStyle}>

            {/* Eyebrow */}
            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-5">
              Administrative Dashboard
            </p>

            {/* H1 */}
            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              Welcome,{" "}
              <span className="text-[#1a56db]">
                {"Block Authority"}
              </span>
            </h1>

            {/* Body */}
            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-2xl">
              This is your administrative overview dashboard.
              Monitor approvals, escalations, and Panchayath performance.
            </p>
          </div>

          {/* ── Stats Grid */}
          <div
            ref={gridRef}
            style={revealStyle}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard title="Total Panchayaths" value="18"  delay={0}   />
            <StatCard title="Pending Approvals" value="6"   delay={80}  />
            <StatCard title="Escalated Issues"  value="12"  delay={160} />
            <StatCard title="Resolution Rate"   value="82%" delay={240} />
          </div>

          {/* ── Gradient Impact Card */}
          <div
            ref={cardRef}
            style={{ ...revealStyle, position: "relative" }}
            className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8 overflow-hidden"
          >
            {/* Orb 1 */}
            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,.05)",
                borderRadius: "50%",
                filter: "blur(40px)",
                top: "-50px",
                right: "-50px",
              }}
            />
            {/* Orb 2 */}
            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,.05)",
                borderRadius: "50%",
                filter: "blur(40px)",
                bottom: "-60px",
                left: "-40px",
              }}
            />

            {/* Content */}
            <div className="relative z-10">

              {/* Eyebrow */}
              <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-white/60 mb-4">
                Monthly Summary
              </p>

              {/* Section Heading */}
              <h2
                className="font-black leading-tight text-white mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                }}
              >
                Governance Performance
              </h2>

              {/* Body */}
              <p className="text-[0.9rem] leading-[1.75] text-white/80 max-w-lg">
                Your administrative efficiency across Panchayaths
                is performing at a strong level this month.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}