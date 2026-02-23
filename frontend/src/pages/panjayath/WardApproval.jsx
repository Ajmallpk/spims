import { useState, useRef, useEffect } from "react";
import RequestCard from  '@/components/panjayath/RequestCard'


export default function WardApprovals() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Kizhakkumbhagom ward", president: "Ravi Kumar",   status: "PENDING"  },
    { id: 2, name: "Muvattupuzha ward",    president: "Anitha Mohan", status: "APPROVED" },
    { id: 3, name: "Piravom ward",          president: "Suresh Babu", status: "PENDING"  },
  ]);

  const heroRef = useScrollReveal(0);

  const handleApprove = (id) =>
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "APPROVED" } : req))
    );

  const handleReject = (id) =>
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "REJECTED" } : req))
    );

  // Summary counts
  const total    = requests.length;
  const pending  = requests.filter((r) => r.status === "PENDING").length;
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-body    { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      <div className="font-body bg-[#f8faff] text-[#475569] min-h-screen">
        <div className="max-w-[1140px] mx-auto py-24 px-16 max-md:py-16 max-md:px-8 space-y-12">

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div ref={heroRef} style={revealStyle}>
            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
              Administrative Review
            </p>
            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              ward Approval Requests
            </h1>
            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-xl">
              Review and action pending registration requests from ward
              authorities across your administrative ward.
            </p>
          </div>

          {/* ── Summary Stat Cards ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Total Requests", value: total,    color: "#1a56db", bg: "#eff6ff" },
              { label: "Pending",        value: pending,  color: "#d97706", bg: "#fffbeb" },
              { label: "Approved",       value: approved, color: "#059669", bg: "#ecfdf5" },
              { label: "Rejected",       value: rejected, color: "#dc2626", bg: "#fef2f2" },
            ].map(({ label, value, color, bg }, i) => (
              <div
                key={label}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,86,219,.10)] hover:-translate-y-1"
                style={{ ...revealStyle, animationDelay: `${i * 80}ms` }}
                ref={useScrollReveal(i * 80)}
              >
                <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase mb-2"
                   style={{ color: "#94a3b8" }}>
                  {label}
                </p>
                <p
                  className="font-black leading-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem,3vw,2.5rem)",
                    color,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Request Cards ─────────────────────────────────────────────── */}
          <div className="space-y-5">
            {requests.map((req, i) => (
              <RequestCard
                key={req.id}
                req={req}
                onApprove={handleApprove}
                onReject={handleReject}
                delay={i * 80}
              />
            ))}
          </div>

          {/* ── All resolved — gradient card ───────────────────────────────── */}
          {pending === 0 && (
            <div
              className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8 relative overflow-hidden"
            >
              <div style={{ position:"absolute", width:200, height:200, background:"rgba(255,255,255,.05)", borderRadius:"50%", filter:"blur(40px)", top:-50, right:-50 }} />
              <div style={{ position:"absolute", width:200, height:200, background:"rgba(255,255,255,.05)", borderRadius:"50%", filter:"blur(40px)", bottom:-60, left:-40 }} />
              <div className="relative z-10">
                <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-white/60 mb-3">
                  Queue Clear
                </p>
                <h2
                  className="font-black text-white mb-3 leading-tight"
                  style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(2rem,3vw,2.8rem)" }}
                >
                  All Requests Resolved
                </h2>
                <p className="text-[0.9rem] leading-[1.75] text-white/80 max-w-lg">
                  There are no pending ward approval requests at this time.
                  New submissions will appear here for review.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}