import { useState } from "react";
import useScrollReveal from "@/components/common/useScrollReveal";
import EscalationCard from "@/components/panjayath/EscalationCard";

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

export default function EscalatedComplaints() {

  // Later fetch from:
  // GET /api/panchayath/escalations/

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Water Supply Disruption",
      ward: "Ward 3",
      status: "PENDING",
    },
    {
      id: 2,
      title: "Road Damage Complaint",
      ward: "Ward 1",
      status: "PENDING",
    },
    {
      id: 3,
      title: "Waste Management Issue",
      ward: "Ward 2",
      status: "RESOLVED",
    },
  ]);

  const heroRef = useScrollReveal(0);

  const handleResolve = (id) =>
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "RESOLVED" } : c
      )
    );

  const handleEscalate = (id) =>
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "ESCALATED" } : c
      )
    );

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "PENDING").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
  const escalated = complaints.filter((c) => c.status === "ESCALATED").length;

  return (
    <div className="bg-[#f8faff] font-body min-h-screen">
      <div className="max-w-[1140px] mx-auto py-24 px-16 space-y-12">

        {/* ── Hero ───────────────────────── */}
        <div ref={heroRef} style={revealStyle}>
          <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
            Escalation Management
          </p>

          <h1
            className="font-black text-[#0f172a] mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
            }}
          >
            Escalated Complaints
          </h1>

          <p className="text-[0.9rem] text-[#475569] max-w-xl">
            Review and process complaints escalated from Ward authorities.
            Resolve issues or escalate further to Block level when required.
          </p>
        </div>

        {/* ── Summary Stats ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Cases", value: total, color: "#1a56db" },
            { label: "Pending", value: pending, color: "#d97706" },
            { label: "Resolved", value: resolved, color: "#059669" },
            { label: "Escalated to Block", value: escalated, color: "#dc2626" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6"
            >
              <p className="text-xs font-bold uppercase text-[#94a3b8] mb-2">
                {item.label}
              </p>
              <p
                className="font-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  color: item.color,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Complaint Cards ───────────────────────── */}
        <div className="space-y-5">
          {complaints.map((c, i) => (
            <EscalationCard
              key={c.id}
              complaint={c}
              onResolve={handleResolve}
              onEscalate={handleEscalate}
              delay={i * 80}
            />
          ))}
        </div>

        {/* ── All Resolved Gradient Card ───────────────────────── */}
        {pending === 0 && (
          <div className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8">
            <h2
              className="font-black mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem,3vw,2.8rem)",
              }}
            >
              All Cases Processed
            </h2>
            <p className="text-white/80">
              There are no pending escalated complaints at this time.
              Governance workflow is up to date.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}