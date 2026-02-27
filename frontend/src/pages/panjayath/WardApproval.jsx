import { useState } from "react";
import useScrollReveal from "@/components/common/useScrollReveal";
import WardRequestCard from "@/components/panjayath/WardRequestCard";

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

export default function WardApprovals() {

  // Later this comes from API:
  // GET /api/panchayath/ward-verifications/

  const [requests, setRequests] = useState([
    { id: 1, name: "Ward 1", member: "Ramesh Kumar", status: "PENDING" },
    { id: 2, name: "Ward 2", member: "Anjali Devi", status: "APPROVED" },
    { id: 3, name: "Ward 3", member: "Faisal Rahman", status: "PENDING" },
  ]);

  const heroRef = useScrollReveal(0);

  const handleApprove = (id) =>
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "APPROVED" } : r
      )
    );

  const handleReject = (id) =>
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "REJECTED" } : r
      )
    );

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "PENDING").length;
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="bg-[#f8faff] font-body min-h-screen">
      <div className="max-w-[1140px] mx-auto py-24 px-16 space-y-12">

        {/* ── Hero Section ───────────────────────── */}
        <div ref={heroRef} style={revealStyle}>
          <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-4">
            Administrative Review
          </p>

          <h1
            className="font-black text-[#0f172a] mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
            }}
          >
            Ward Approval Requests
          </h1>

          <p className="text-[0.9rem] text-[#475569] max-w-xl">
            Review and process pending verification requests
            submitted by Ward authorities within your Panchayath.
          </p>
        </div>

        {/* ── Summary Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Requests", value: total, color: "#1a56db", bg: "#eff6ff" },
            { label: "Pending", value: pending, color: "#d97706", bg: "#fffbeb" },
            { label: "Approved", value: approved, color: "#059669", bg: "#ecfdf5" },
            { label: "Rejected", value: rejected, color: "#dc2626", bg: "#fef2f2" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6"
            >
              <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase text-[#94a3b8] mb-2">
                {item.label}
              </p>
              <p
                className="font-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem,3vw,2.5rem)",
                  color: item.color,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Request Cards ───────────────────────── */}
        <div className="space-y-5">
          {requests.map((req, i) => (
            <WardRequestCard
              key={req.id}
              req={req}
              onApprove={handleApprove}
              onReject={handleReject}
              delay={i * 80}
            />
          ))}
        </div>

        {/* ── All Resolved Card ───────────────────────── */}
        {pending === 0 && (
          <div className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8">
            <h2
              className="font-black mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem,3vw,2.8rem)",
              }}
            >
              All Requests Processed
            </h2>

            <p className="text-white/80">
              There are currently no pending Ward verification requests.
              New submissions will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}