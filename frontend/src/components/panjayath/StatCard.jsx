import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function StatCard({ title, value, delay }) {
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