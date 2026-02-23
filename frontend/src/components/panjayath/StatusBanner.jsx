
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
// import { submitVerification } from "@/blockSlice";


export default function StatusBanner({ icon, bg, borderColor, color, eyebrow, heading, body }) {
  return (
    <div
      className="rounded-2xl p-8 flex items-start gap-5"
      style={{ background: bg, border: `1.5px solid ${borderColor}` }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: 48, height: 48, background: `${color}18`, border: `1.5px solid ${color}44` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[0.63rem] font-bold tracking-[.14em] uppercase mb-1"
           style={{ color }}>
          {eyebrow}
        </p>
        <h3
          className="font-black leading-tight mb-2"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#0f172a" }}
        >
          {heading}
        </h3>
        <p className="text-[0.9rem] leading-[1.75] text-[#475569]">{body}</p>
      </div>
    </div>
  );
}