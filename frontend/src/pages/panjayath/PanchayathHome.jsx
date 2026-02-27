import useScrollReveal from "@/components/common/useScrollReveal";
import StatCard from "@/components/common/StatCard";


import {
  Users,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

const revealStyle = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
};

export default function PanchayathHome() {

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

      <div className="bg-[#f8faff] text-[#475569] font-body min-h-screen">
        <div className="max-w-[1140px] mx-auto py-24 px-16 max-md:py-16 max-md:px-8 space-y-16">

          {/* ── Hero Section ───────────────────────────── */}
          <div ref={heroRef} style={revealStyle}>

            <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-[#1a56db] mb-5">
              Administrative Dashboard
            </p>

            <h1
              className="font-black leading-[1.06] tracking-[-0.02em] text-[#0f172a] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.2rem)",
              }}
            >
              Welcome,{" "}
              <span className="text-[#1a56db]">
                Panchayath Authority
              </span>
            </h1>

            <p className="text-[0.9rem] leading-[1.75] text-[#475569] max-w-2xl">
              Monitor ward activities, review verification requests, and manage
              governance operations within your Panchayath jurisdiction.
            </p>
          </div>

          {/* ── Stats Grid ───────────────────────────── */}
          <StatCard
            title="Total Wards"
            value="12"
            icon={Users}
            color="#1a56db"
          />

          <StatCard
            title="Pending Approvals"
            value="4"
            icon={Clock}
            color="#d97706"
          />

          <StatCard
            title="Escalated Issues"
            value="9"
            icon={AlertTriangle}
            color="#dc2626"
          />

          <StatCard
            title="Resolution Rate"
            value="74%"
            icon={TrendingUp}
            color="#059669"
          />

          {/* ── Gradient Impact Card ───────────────────── */}
          <div
            ref={cardRef}
            style={{ ...revealStyle, position: "relative" }}
            className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-8 overflow-hidden"
          >
            {/* Decorative Orbs */}
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

            <div className="relative z-10">
              <p className="text-[0.68rem] font-bold tracking-[.14em] uppercase text-white/60 mb-4">
                Monthly Summary
              </p>

              <h2
                className="font-black leading-tight text-white mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                }}
              >
                Panchayath Governance Performance
              </h2>

              <p className="text-[0.9rem] leading-[1.75] text-white/80 max-w-lg">
                Ward-level governance activities are progressing steadily.
                Continue monitoring escalations and ensure timely resolution
                across your Panchayath.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}