// import { useState } from "react";
import { Link } from "react-router-dom"
// export default function LandingPage() {
//   const [activeStep, setActiveStep] = useState(0);

//   return (
//     <div className="bg-bg text-ink font-body overflow-x-hidden">

//       {/* NAVBAR */}
//       <nav className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/80 border-b border-line z-50">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron to-saffron2"></div>
//             <h1 className="font-display font-bold text-lg">
//               Jan<span className="text-saffron">Seva</span>
//             </h1>
//           </div>

//           <div className="hidden md:flex gap-8 text-sm text-slate">
//             <a href="#how">How It Works</a>
//             <a href="#roles">Roles</a>
//             <a href="#features">Features</a>
//           </div>

//           <div className="flex gap-3">
//             <button className="px-4 py-2 text-sm border border-line rounded-lg">
//               Sign In
//             </button>
//             <button className="px-5 py-2 text-sm bg-saffron text-white rounded-lg shadow-lg hover:bg-saffron2 transition">
//               Register →
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* HERO */}
//       <section className="min-h-screen grid md:grid-cols-2 items-center pt-28 px-10 max-w-7xl mx-auto">

//         <div>
//           <div className="inline-block px-4 py-1 text-xs uppercase tracking-widest bg-purple-100 text-saffron rounded-full mb-6">
//             Government of India · Digital Initiative
//           </div>

//           <h1 className="font-display text-5xl font-black leading-tight">
//             Governance that <span className="text-saffron italic">Listens</span> <br />
//             to Every <span className="text-green">Citizen</span>
//           </h1>

//           <p className="mt-6 text-slate max-w-md leading-relaxed">
//             Structured complaint workflow enabling transparent governance,
//             accountability and faster resolution.
//           </p>

//           <div className="mt-8 flex gap-4">
//             <button className="px-6 py-3 bg-saffron text-white rounded-xl shadow-lg hover:bg-saffron2 transition">
//               Login to Portal
//             </button>
//             <button className="px-6 py-3 border border-line rounded-xl hover:border-saffron transition">
//               Register as Citizen
//             </button>
//           </div>
//         </div>

//         {/* HERO CARD */}
//         <div className="hidden md:block">
//           <div className="bg-white p-6 rounded-2xl shadow-premium border border-line">
//             <h3 className="font-semibold mb-4">Live Complaint Feed</h3>

//             <div className="space-y-3 text-sm">
//               <div className="p-3 bg-bg rounded-lg border border-line">
//                 🚧 Road Damage – Under Review
//               </div>
//               <div className="p-3 bg-bg rounded-lg border border-line">
//                 💧 Water Supply – Open
//               </div>
//               <div className="p-3 bg-bg rounded-lg border border-line">
//                 💡 Street Light – Resolved
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <section className="bg-white border-y border-line grid md:grid-cols-4 text-center">
//         {[
//           ["12,450+", "Complaints Resolved"],
//           ["98.2%", "Resolution Rate"],
//           ["340+", "Wards Connected"],
//           ["48 hrs", "Avg Response Time"],
//         ].map(([num, label]) => (
//           <div key={label} className="py-10 border-r last:border-r-0 border-line">
//             <h2 className="font-display text-3xl font-black">{num}</h2>
//             <p className="text-muted text-sm mt-2">{label}</p>
//           </div>
//         ))}
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how" className="py-24 bg-ink text-white px-10">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="font-display text-4xl font-black mb-12">
//             How It Works
//           </h2>

//           <div className="grid md:grid-cols-4 gap-6">
//             {["Submit", "Review", "Escalate", "Resolve"].map((step, i) => (
//               <div
//                 key={step}
//                 onClick={() => setActiveStep(i)}
//                 className={`p-6 rounded-xl cursor-pointer transition ${
//                   activeStep === i
//                     ? "bg-saffron text-white"
//                     : "bg-ink2 hover:bg-ink"
//                 }`}
//               >
//                 <h3 className="font-bold text-lg">{step}</h3>
//                 <p className="text-sm opacity-70 mt-2">
//                   Structured governance workflow with SLA tracking.
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ROLES */}
//       <section id="roles" className="py-24 px-10 bg-bg">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="font-display text-4xl font-black mb-12">
//             Select Your Role
//           </h2>

//           <div className="grid md:grid-cols-2 gap-8">
//             {["Citizen", "Ward Member", "Panchayath", "Block Authority"].map(
//               (role) => (
//                 <div
//                   key={role}
//                   className="bg-white p-8 rounded-2xl border border-line hover:shadow-xl transition"
//                 >
//                   <h3 className="font-display text-2xl font-bold mb-4">
//                     {role}
//                   </h3>
//                   <p className="text-slate text-sm leading-relaxed">
//                     Dedicated dashboard and workflow tailored for {role}.
//                   </p>

//                   <button className="mt-6 px-5 py-2 bg-saffron text-white rounded-lg">
//                     Enter Portal →
//                   </button>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-ink text-white py-24 px-10">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="font-display text-4xl font-black">
//             Make Your Voice Count
//           </h2>
//           <p className="mt-4 text-white/60 max-w-xl mx-auto">
//             Join thousands of citizens strengthening democracy through
//             transparency and accountability.
//           </p>

//           <div className="mt-8 flex justify-center gap-4">
//             <button className="px-6 py-3 bg-saffron rounded-xl shadow-lg">
//               Register
//             </button>
//             <button className="px-6 py-3 border border-white/20 rounded-xl">
//               View Demo
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="bg-white border-t border-line py-8 text-center text-sm text-muted">
//         © 2025 Ministry of Panchayati Raj · Govt of India
//       </footer>
//     </div>
//   );
// }






import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --ink: #0a0d14;
    --ink2: #1a2035;
    --slate: #4a5568;
    --muted: #8896ab;
    --line: #e4e8ef;
    --bg: #f7f9fc;
    --white: #ffffff;
    --saffron: #5b1ae8;
    --saffron2: #32f0aa;
    --saffron-light: #fff3ec;
    --green: #138a3d;
    --green-light: #e8f7ed;
    --blue: #1a4db5;
    --blue-light: #eef2fb;
    --gold: #b8860b;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Outfit', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--ink); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; cursor: none; }

  .cursor { position: fixed; width: 8px; height: 8px; background: var(--saffron); border-radius: 50%; pointer-events: none; z-index: 9999; transition: transform 0.1s, width 0.2s, height 0.2s; transform: translate(-50%, -50%); }
  .cursor-ring { position: fixed; width: 36px; height: 36px; border: 1.5px solid rgba(232,104,26,0.5); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: left 0.12s ease, top 0.12s ease; }
  .cursor.hover { width: 14px; height: 14px; }
  .cursor-ring.hover { width: 54px; height: 54px; border-color: rgba(232,104,26,0.25); }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 2px; }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 500; display: flex; align-items: center; justify-content: space-between; padding: 22px 60px; transition: all 0.4s ease; }
  .nav.solid { background: rgba(247,249,252,0.94); backdrop-filter: blur(20px); border-bottom: 1px solid var(--line); padding: 14px 60px; box-shadow: 0 2px 20px rgba(0,0,0,0.05); }
  .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-emblem { width: 38px; height: 38px; background: linear-gradient(135deg, var(--saffron), #16046d); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(232,104,26,0.4); }
  .nav-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
  .nav-name span { color: var(--saffron); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a { color: var(--slate); text-decoration: none; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s; }
  .nav-links a:hover { color: var(--saffron); }
  .nav-actions { display: flex; gap: 10px; align-items: center; }
  .btn-ghost { padding: 8px 18px; border-radius: 8px; background: transparent; color: var(--slate); font-size: 0.82rem; font-weight: 500; border: 1px solid var(--line); cursor: pointer; font-family: var(--font-body); transition: all 0.2s; }
  .btn-ghost:hover { border-color: var(--saffron); color: var(--saffron); }
  .btn-fill { padding: 9px 22px; border-radius: 8px; background: var(--saffron); color: white; font-size: 0.82rem; font-weight: 600; border: none; cursor: pointer; font-family: var(--font-body); transition: all 0.2s; box-shadow: 0 3px 12px rgba(232,104,26,0.35); }
  .btn-fill:hover { background: var(--saffron2); transform: translateY(-1px); }

  /* HERO */
  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding: 0 60px; padding-top: 80px; position: relative; overflow: hidden; }
  .hero-bg-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .blob1 { width: 700px; height: 700px; top: -250px; right: -150px; background: radial-gradient(circle, rgba(232,104,26,0.08) 0%, transparent 70%); }
  .blob2 { width: 500px; height: 500px; bottom: -100px; left: 100px; background: radial-gradient(circle, rgba(19,138,61,0.06) 0%, transparent 70%); }
  .blob3 { width: 300px; height: 300px; top: 200px; left: -100px; background: radial-gradient(circle, rgba(26,77,181,0.05) 0%, transparent 70%); }
  .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 80px 60px 80px 0; position: relative; z-index: 2; }
  .hero-right { display: flex; align-items: center; justify-content: center; position: relative; padding: 40px 0; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; border-radius: 999px; background: var(--saffron-light); border: 1px solid rgba(232,104,26,0.3); font-size: 0.68rem; font-weight: 700; color: var(--saffron); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px; width: fit-content; animation: fu 0.7s ease both; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--saffron); animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }
  .hero h1 { font-family: var(--font-display); font-size: clamp(2.8rem, 4.2vw, 4.2rem); font-weight: 900; line-height: 1.06; color: var(--ink); letter-spacing: -0.02em; animation: fu 0.7s 0.08s ease both; }
  .hero h1 .ac { color: var(--saffron); font-style: italic; }
  .hero h1 .gr { color: var(--green); }
  .hero-sub { margin-top: 22px; font-size: 0.95rem; color: var(--slate); line-height: 1.78; max-width: 440px; animation: fu 0.7s 0.16s ease both; }
  .hero-btns { display: flex; gap: 12px; margin-top: 36px; animation: fu 0.7s 0.24s ease both; }
  .hbtn-p { padding: 14px 32px; border-radius: 10px; background: var(--saffron); color: white; font-size: 0.88rem; font-weight: 700; border: none; cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; gap: 10px; box-shadow: 0 6px 24px rgba(232,104,26,0.4); transition: all 0.25s; }
  .hbtn-p:hover { background: var(--saffron2); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(232,104,26,0.45); }
  .hbtn-s { padding: 14px 28px; border-radius: 10px; background: white; color: var(--ink); font-size: 0.88rem; font-weight: 600; border: 1px solid var(--line); cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; gap: 8px; transition: all 0.25s; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .hbtn-s:hover { border-color: var(--saffron); color: var(--saffron); transform: translateY(-2px); }
  .hero-trust { display: flex; gap: 22px; margin-top: 48px; animation: fu 0.7s 0.32s ease both; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 7px; font-size: 0.73rem; color: var(--muted); font-weight: 500; }
  .trust-icon { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
  
  /* HERO VISUAL */
  .hero-visual { position: relative; width: 100%; max-width: 500px; animation: fu 0.9s 0.2s ease both; }
  .hcard-main { background: white; border-radius: 20px; border: 1px solid var(--line); padding: 26px; box-shadow: 0 24px 80px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.05); }
  .hcard-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .hcard-title { font-size: 0.85rem; font-weight: 700; color: var(--ink); }
  .sbadge { padding: 3px 10px; border-radius: 999px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .sb-live { background: var(--saffron-light); color: var(--saffron); }
  .sb-open { background: var(--saffron-light); color: var(--saffron); }
  .sb-resolved { background: var(--green-light); color: var(--green); }
  .sb-review { background: var(--blue-light); color: var(--blue); }
  .sb-escalated { background: #fdf0f8; color: #c026a0; }
  .clist { display: flex; flex-direction: column; gap: 8px; }
  .crow { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--bg); border: 1px solid var(--line); }
  .cavatar { width: 32px; height: 32px; border-radius: 8px; background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .cinfo { flex: 1; min-width: 0; }
  .ctitle { font-size: 0.76rem; font-weight: 600; color: var(--ink); }
  .cmeta { font-size: 0.67rem; color: var(--muted); margin-top: 1px; }
  .float-card { position: absolute; background: white; border-radius: 14px; border: 1px solid var(--line); padding: 14px 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
  .fc1 { bottom: -24px; left: -44px; width: 158px; animation: flt 4s ease-in-out infinite; }
  .fc2 { top: 24px; right: -52px; width: 148px; animation: flt 4s 1.5s ease-in-out infinite; }
  .fnum { font-family: var(--font-display); font-size: 1.9rem; font-weight: 900; color: var(--ink); line-height: 1; }
  .flabel { font-size: 0.63rem; color: var(--muted); font-weight: 500; margin-top: 2px; }
  .ftag { font-size: 0.65rem; font-weight: 700; color: var(--green); background: var(--green-light); padding: 2px 8px; border-radius: 6px; display: inline-block; margin-top: 5px; }
  @keyframes flt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes fu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }

  /* STATS */
  .stats-band { display: grid; grid-template-columns: repeat(4,1fr); background: white; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .stat-cell { padding: 36px 40px; text-align: center; border-right: 1px solid var(--line); position: relative; overflow: hidden; transition: background 0.3s; }
  .stat-cell:last-child { border-right: none; }
  .stat-cell:hover { background: var(--bg); }
  .stat-cell::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--saffron),var(--saffron2)); transform:scaleX(0); transition:transform 0.3s; }
  .stat-cell:hover::after { transform:scaleX(1); }
  .stat-n { font-family: var(--font-display); font-size: 2.4rem; font-weight: 900; color: var(--ink); line-height: 1; }
  .stat-l { font-size: 0.72rem; color: var(--muted); font-weight: 500; letter-spacing: 0.03em; margin-top: 5px; }

  /* COMMON SECTION */
  .section { padding: 100px 60px; }
  .si { max-width: 1140px; margin: 0 auto; }
  .eyebrow { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--saffron); display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .eyebrow-line { width: 24px; height: 1.5px; background: var(--saffron); flex-shrink: 0; }
  .sh { font-family: var(--font-display); font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 900; color: var(--ink); line-height: 1.1; letter-spacing: -0.02em; }
  .sp { font-size: 0.9rem; color: var(--slate); line-height: 1.75; margin-top: 14px; max-width: 500px; }

  /* HOW IT WORKS */
  .works { background: var(--ink); }
  .works .eyebrow { color: var(--saffron2); }
  .works .eyebrow-line { background: var(--saffron2); }
  .works-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 56px; }
  .step-tabs { display: flex; gap: 8px; }
  .step-tab { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); font-family: var(--font-body); background: transparent; }
  .step-tab.on { background: var(--saffron); color: white; border-color: var(--saffron); }
  .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
  .step-card { background: var(--ink2); padding: 36px 26px; cursor: pointer; transition: background 0.25s; position: relative; }
  .step-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2.5px; background:var(--saffron); transform:scaleX(0); transition:transform 0.3s; }
  .step-card.on { background: #1e2740; }
  .step-card.on::after { transform:scaleX(1); }
  .step-card:hover { background: #1e2740; }
  .sc-num { font-family: var(--font-display); font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04); line-height: 1; margin-bottom: 20px; transition: color 0.25s; }
  .step-card.on .sc-num, .step-card:hover .sc-num { color: rgba(232,104,26,0.18); }
  .sc-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; transition: all 0.25s; }
  .step-card.on .sc-icon { background: rgba(232,104,26,0.15); border-color: rgba(232,104,26,0.3); }
  .sc-title { font-size: 0.9rem; font-weight: 700; color: white; margin-bottom: 10px; }
  .sc-desc { font-size: 0.77rem; color: rgba(255,255,255,0.4); line-height: 1.72; }
  .step-card.on .sc-desc { color: rgba(255,255,255,0.65); }

  /* HIERARCHY */
  .hierarchy { background: white; }
  .hier-wrap { display: grid; grid-template-columns: 5fr 4fr; gap: 80px; align-items: center; }
  .hier-levels { display: flex; flex-direction: column; }
  .hier-row { display: flex; align-items: stretch; }
  .hier-spine { width: 2px; background: var(--line); margin-right: 20px; flex-shrink: 0; position: relative; }
  .hier-dot { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 22px; left: -4px; }
  .hier-body { flex: 1; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--line); margin-bottom: 10px; display: flex; align-items: center; gap: 14px; transition: all 0.25s; cursor: default; }
  .hier-body:hover { border-color: var(--saffron); box-shadow: 0 4px 20px rgba(232,104,26,0.08); transform: translateX(4px); }
  .hier-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hier-name { font-size: 0.86rem; font-weight: 700; color: var(--ink); }
  .hier-desc { font-size: 0.73rem; color: var(--muted); line-height: 1.5; margin-top: 2px; }
  .hier-badge { font-size: 0.62rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }

  /* ROLES */
  .roles { background: var(--bg); }
  .roles-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-top: 56px; }
  .role-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 30px; display: flex; flex-direction: column; transition: all 0.3s; position: relative; overflow: hidden; }
  .role-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--saffron),var(--saffron2)); transform:scaleX(0); transition:transform 0.3s; }
  .role-card:hover { border-color: transparent; box-shadow: 0 16px 60px rgba(0,0,0,0.1); transform: translateY(-4px); }
  .role-card:hover::before { transform: scaleX(1); }
  .role-hdr { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
  .role-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .role-tag { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
  .role-title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin-bottom: 10px; }
  .role-desc { font-size: 0.82rem; color: var(--slate); line-height: 1.72; flex: 1; }
  .role-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line); }
  .role-access { font-size: 0.72rem; font-weight: 600; color: var(--muted); }
  .role-btn { padding: 9px 18px; border-radius: 8px; color: white; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; gap: 6px; transition: filter 0.2s; }
  .role-btn:hover { filter: brightness(1.1); }

  /* FEATURES */
  .features { background: white; }
  .feat-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 56px; }
  .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
  .feat-cell { background: white; padding: 30px 26px; display: flex; flex-direction: column; gap: 14px; transition: background 0.25s; position: relative; }
  .feat-cell:hover { background: var(--bg); }
  .feat-cell::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--saffron),transparent); transform:scaleX(0); transition:transform 0.3s; transform-origin:left; }
  .feat-cell:hover::after { transform:scaleX(1); }
  .feat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .feat-title { font-size: 0.9rem; font-weight: 700; color: var(--ink); }
  .feat-desc { font-size: 0.78rem; color: var(--slate); line-height: 1.72; }

  /* CTA */
  .cta-wrap { padding: 0 60px 100px; background: var(--bg); }
  .cta-box { max-width: 1140px; margin: 0 auto; background: var(--ink); border-radius: 24px; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; position: relative; }
  .cta-left { padding: 64px 60px; position: relative; z-index: 1; }
  .cta-left .eyebrow { color: var(--saffron); }
  .cta-left .eyebrow-line { background: var(--saffron); }
  .cta-btns { display: flex; gap: 12px; margin-top: 36px; }
  .cta-btn-p { padding: 13px 28px; border-radius: 10px; background: var(--saffron); color: white; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 16px rgba(232,104,26,0.4); }
  .cta-btn-p:hover { background: var(--saffron2); }
  .cta-btn-o { padding: 13px 24px; border-radius: 10px; background: transparent; color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; font-family: var(--font-body); transition: all 0.2s; }
  .cta-btn-o:hover { border-color: rgba(255,255,255,0.4); color: white; }
  .cta-right { position: relative; display: flex; align-items: center; justify-content: center; padding: 40px; }
  .cta-orb { position: absolute; border-radius: 50%; }
  .orb1 { width: 320px; height: 320px; top: -120px; right: -120px; background: radial-gradient(circle, rgba(232,104,26,0.25), transparent 70%); }
  .orb2 { width: 200px; height: 200px; bottom: -60px; left: -60px; background: radial-gradient(circle, rgba(19,138,61,0.18), transparent 70%); }
  .cta-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; position: relative; z-index: 1; }
  .cta-stat { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 22px 20px; }
  .cta-stat-n { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: white; line-height: 1; }
  .cta-stat-l { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: 4px; font-weight: 500; }

  /* FOOTER */
  .footer { background: white; border-top: 1px solid var(--line); padding: 36px 60px; }
  .footer-i { max-width: 1140px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .footer-brand { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--ink); }
  .footer-links { display: flex; gap: 24px; }
  .footer-links a { font-size: 0.78rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--saffron); }
  .footer-copy { font-size: 0.72rem; color: var(--muted); }

  /* REVEAL */
  .rv { opacity: 0; transform: translateY(26px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .rv.vis { opacity: 1; transform: none; }
  .d1{transition-delay:0.1s} .d2{transition-delay:0.2s} .d3{transition-delay:0.3s} .d4{transition-delay:0.4s}

  /* RESPONSIVE */
  @media(max-width:1024px){
    .hero{grid-template-columns:1fr;padding:100px 32px 60px;}
    .hero-right{display:none;}
    .nav{padding:16px 32px;}
    .nav.solid{padding:12px 32px;}
    .nav-links{display:none;}
    .section{padding:72px 32px;}
    .cta-wrap{padding:0 32px 72px;}
    .footer{padding:28px 32px;}
    .stats-band{grid-template-columns:1fr 1fr;}
    .stat-cell{border-right:none;border-bottom:1px solid var(--line);}
    .steps-grid{grid-template-columns:1fr 1fr;}
    .hier-wrap{grid-template-columns:1fr;gap:48px;}
    .roles-grid{grid-template-columns:1fr;}
    .feat-grid{grid-template-columns:1fr 1fr;}
    .cta-box{grid-template-columns:1fr;}
    .cta-right{display:none;}
  }
  @media(max-width:640px){
    .feat-grid,.steps-grid{grid-template-columns:1fr;}
    .hero h1{font-size:2.4rem;}
    .hero-btns{flex-direction:column;}
    .cta-btns{flex-direction:column;}
  }
`;

function Ico({ d, s = 18, c = "currentColor", w = 1.8, fill = "none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const I = {
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  arrow: ["M5 12h14M12 5l7 7-7 7"],
  arrowDR: ["M7 17L17 7M17 7H7M17 7v10"],
  file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
  search: ["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z", "M16 16l4.5 4.5"],
  check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"],
  building: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  landmark: ["M3 22h18", "M3 7h18", "M4 7V4h16v3", "M12 7v15"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  userchk: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M17 11l2 2 4-4"],
  eyeoff: ["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"],
  msg: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  clip: ["M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"],
  bar: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  board: ["M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", "M9 2h6v4H9z"],
  alert: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M12 8v4", "M12 16h.01"],
  verify: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  clock: ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 6v6l4 2"],
};

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const mv = (e) => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    const on = () => { dot.current?.classList.add("hover"); ring.current?.classList.add("hover"); };
    const off = () => { dot.current?.classList.remove("hover"); ring.current?.classList.remove("hover"); };
    document.addEventListener("mousemove", mv);
    const hov = document.querySelectorAll("button,a,.role-card,.step-card,.hier-body,.feat-cell,.stat-cell");
    hov.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => document.removeEventListener("mousemove", mv);
  }, []);
  return <><div className="cursor" ref={dot} /><div className="cursor-ring" ref={ring} /></>;
}

function Navbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav${solid ? " solid" : ""}`}>
      <div className="nav-brand">
        <div className="nav-emblem"><Ico d={I.shield} s={18} c="white" w={2} /></div>
        <span className="nav-name">Jan<span>Seva</span></span>
      </div>
      <ul className="nav-links">
        {[["#how-it-works", "How It Works"], ["#hierarchy", "Hierarchy"], ["#roles", "Roles"], ["#features", "Features"]].map(([h, l]) => (
          <li key={l}><a href={h}>{l}</a></li>
        ))}
      </ul>
      <div className="nav-actions">
        <Link to="/login">
          <button className="btn-ghost">Sign In</button>
        </Link>

        <Link to="/login">
          <button className="btn-fill">Register →</button>
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-blob blob1" /><div className="hero-bg-blob blob2" /><div className="hero-bg-blob blob3" />
      <div className="hero-left">
        <div className="hero-badge"><div className="badge-dot" />Government of India · Digital India Initiative</div>
        <h1>Governance that<br /><span className="ac">Listens</span> to Every<br /><span className="gr">Citizen</span></h1>
        <p className="hero-sub">A structured complaint workflow empowering citizens to raise public issues, enabling ward members to resolve them, and giving authorities real-time accountability at every level of governance.</p>
        <div className="hero-btns">
          <button className="hbtn-p">Login to Portal <Ico d={I.arrow} s={16} c="white" /></button>
          <button className="hbtn-s">Register as Citizen</button>
        </div>
        <div className="hero-trust">
          {[[I.verify, "Government Certified", "var(--green-light)", "var(--green)"], [I.lock, "End-to-End Encrypted", "var(--blue-light)", "var(--blue)"], [I.clock, "24/7 Available", "#fff8e6", "var(--gold)"]].map(([ic, lb, bg, co]) => (
            <div key={lb} className="trust-item">
              <div className="trust-icon" style={{ background: bg }}><Ico d={ic} s={12} c={co} w={2.5} /></div>
              {lb}
            </div>
          ))}
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-visual">
          <div className="hcard-main">
            <div className="hcard-hdr"><div className="hcard-title">Live Complaint Feed</div><span className="sbadge sb-live">● Live</span></div>
            <div className="clist">
              {[["🚧", "Road Damage — Ward 12", "Submitted 2h ago", "sb-review", "Under Review"], ["💧", "Water Supply Issue", "Submitted 1d ago", "sb-open", "Open"], ["💡", "Street Light Failure", "Submitted 3d ago", "sb-resolved", "Resolved"], ["🗑️", "Garbage Overflow", "Submitted 4h ago", "sb-escalated", "Escalated"]].map(([em, ti, me, sc, st]) => (
                <div className="crow" key={ti}>
                  <div className="cavatar">{em}</div>
                  <div className="cinfo"><div className="ctitle">{ti}</div><div className="cmeta">{me}</div></div>
                  <span className={`sbadge ${sc}`}>{st}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="float-card fc1"><div className="fnum">98.2%</div><div className="flabel">Resolution Rate</div><div className="ftag">↑ 4.1% this month</div></div>
          <div className="float-card fc2"><div className="fnum">48h</div><div className="flabel">Avg Response Time</div><div className="ftag">Guaranteed SLA</div></div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="stats-band">
      {[["12,450+", "Complaints Resolved"], ["98.2%", "Resolution Rate"], ["340+", "Wards Connected"], ["48 hrs", "Avg. Response Time"]].map(([n, l]) => (
        <div className="stat-cell rv" key={l}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
      ))}
    </div>
  );
}

const steps = [
  { n: "01", icon: I.file, title: "Submit Complaint", desc: "Citizens file complaints with location, evidence, and details. Automatically routed to the right ward member instantly." },
  { n: "02", icon: I.search, title: "Review & Resolve", desc: "Ward members investigate on the ground and work toward resolution within defined SLA windows for your area." },
  { n: "03", icon: I.arrowDR, title: "Escalate if Needed", desc: "Unresolved complaints auto-escalate to Panchayath or Block authority. Citizens are notified at every transition." },
  { n: "04", icon: I.check, title: "Final Decision", desc: "Authority delivers a final decision. Citizens are notified, case archived with a permanent audit trail." },
];
function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <section className="section works" id="how-it-works">
      <div className="si">
        <div className="works-top rv">
          <div>
            <div className="eyebrow"><div className="eyebrow-line" />Workflow</div>
            <h2 className="sh" style={{ color: "white" }}>How It Works</h2>
            <p className="sp" style={{ color: "rgba(255,255,255,0.45)" }}>Clear, transparent steps — every complaint tracked in real time.</p>
          </div>
          <div className="step-tabs">
            {steps.map((s, i) => <button key={s.n} className={`step-tab${active === i ? " on" : ""}`} onClick={() => setActive(i)}>{s.n}</button>)}
          </div>
        </div>
        <div className="steps-grid rv d1">
          {steps.map((s, i) => (
            <div className={`step-card${active === i ? " on" : ""}`} key={s.n} onClick={() => setActive(i)}>
              <div className="sc-num">{s.n}</div>
              <div className="sc-icon"><Ico d={s.icon} s={20} c={active === i ? "rgba(232,104,26,0.9)" : "rgba(255,255,255,0.4)"} /></div>
              <div className="sc-title">{s.title}</div>
              <div className="sc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const lvls = [
  { icon: I.alert, label: "Admin", desc: "Full system oversight and platform-wide control over all operations and data.", clr: "var(--saffron-light)", ic: "var(--saffron)", badge: "Super Admin", bc: "var(--saffron-light)", bt: "var(--saffron)" },
  { icon: I.building, label: "Block Authority", desc: "Oversees multiple panchayaths, handles high-priority escalations and final decisions.", clr: "var(--blue-light)", ic: "var(--blue)", badge: "Level 3", bc: "var(--blue-light)", bt: "var(--blue)" },
  { icon: I.landmark, label: "Panchayath Authority", desc: "Manages ward-level issues, reviews escalated cases, coordinates timely resolution.", clr: "var(--green-light)", ic: "var(--green)", badge: "Level 2", bc: "var(--green-light)", bt: "var(--green)" },
  { icon: I.userchk, label: "Ward Member", desc: "First contact for citizen complaints. Reviews, resolves, or escalates within the ward.", clr: "#f0f7ff", ic: "#3b82f6", badge: "Level 1", bc: "#f0f7ff", bt: "#3b82f6" },
  { icon: I.users, label: "Citizen", desc: "Submits complaints, tracks status in real time, and communicates with representatives.", clr: "#f8f0ff", ic: "#8b5cf6", badge: "Level 0", bc: "#f8f0ff", bt: "#8b5cf6" },
];
function Hierarchy() {
  return (
    <section className="section hierarchy" id="hierarchy">
      <div className="si">
        <div className="hier-wrap">
          <div className="hier-levels rv">
            {lvls.map((lv, i) => (
              <div className="hier-row" key={lv.label}>
                <div className="hier-spine">
                  <div className="hier-dot" style={{ background: lv.ic }} />
                  {i < lvls.length - 1 && <div style={{ position: "absolute", top: 32, bottom: -10, left: 0, width: 2, background: "var(--line)" }} />}
                </div>
                <div className="hier-body">
                  <div className="hier-icon" style={{ background: lv.clr }}><Ico d={lv.icon} s={20} c={lv.ic} /></div>
                  <div style={{ flex: 1 }}><div className="hier-name">{lv.label}</div><div className="hier-desc">{lv.desc}</div></div>
                  <div className="hier-badge" style={{ background: lv.bc, color: lv.bt }}>{lv.badge}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="rv d2">
            <div className="eyebrow"><div className="eyebrow-line" />Organizational Structure</div>
            <h2 className="sh">Governance Hierarchy</h2>
            <p className="sp">Issues flow through a structured chain of authority ensuring every complaint is addressed at the right level — with complete accountability throughout.</p>
            <div style={{ marginTop: 28, padding: "20px 22px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--line)", borderLeft: "3px solid var(--saffron)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Automatic SLA Escalation</div>
              <div style={{ fontSize: "0.75rem", color: "var(--slate)", lineHeight: 1.7 }}>Complaints not resolved within 72 hours auto-escalate one level up. Citizens are notified in real time at every transition.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const rdata = [
  { icon: I.users, title: "Citizen", desc: "File complaints about public issues, track resolution status in real time, and communicate directly with your ward representative. Your voice drives real change.", tag: "Public Access", tc: "var(--saffron-light)", tt: "var(--saffron)", ib: "var(--saffron-light)", ic: "var(--saffron)" },
  { icon: I.userchk, title: "Ward Member", desc: "Review citizen complaints assigned to your ward, investigate issues on the ground, and resolve or escalate within defined SLA windows to panchayath authority.", tag: "Ward Login", tc: "var(--blue-light)", tt: "var(--blue)", ib: "var(--blue-light)", ic: "var(--blue)" },
  { icon: I.landmark, title: "Panchayath Authority", desc: "Oversee all wards in your panchayath, manage escalated complaints, monitor ward-level resolution metrics, and ensure timely action from ward members.", tag: "Panchayath Login", tc: "var(--green-light)", tt: "var(--green)", ib: "var(--green-light)", ic: "var(--green)" },
  { icon: I.building, title: "Block Authority", desc: "Manage multiple panchayaths, review high-priority escalations, deliver final administrative decisions, and access comprehensive analytics dashboards.", tag: "Block Login", tc: "#f8f0ff", tt: "#8b5cf6", ib: "#f8f0ff", ic: "#8b5cf6" },
];
function Roles() {
  return (
    <section className="section roles" id="roles">
      <div className="si">
        <div className="rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div className="eyebrow"><div className="eyebrow-line" />Access Portals</div>
            <h2 className="sh">Select Your Role</h2>
            <p className="sp">Each portal has a tailored dashboard and permission set designed for your responsibilities.</p>
          </div>
        </div>
        <div className="roles-grid">
          {rdata.map((r, i) => (
            <div className={`role-card rv d${i + 1}`} key={r.title}>
              <div className="role-hdr">
                <div className="role-icon" style={{ background: r.ib }}><Ico d={r.icon} s={24} c={r.ic} /></div>
                <div className="role-tag" style={{ background: r.tc, color: r.tt }}>{r.tag}</div>
              </div>
              <div className="role-title">{r.title}</div>
              <div className="role-desc">{r.desc}</div>
              <div className="role-footer">
                <span className="role-access">Secure portal access</span>
                <button className="role-btn" style={{ background: r.ic }}>Enter Portal <Ico d={I.arrow} s={14} c="white" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const feats = [
  { icon: I.eyeoff, title: "Anonymous Reporting", desc: "Citizens can file complaints anonymously to encourage honest reporting of sensitive public issues without any fear of reprisal.", bg: "var(--saffron-light)", ic: "var(--saffron)" },
  { icon: I.arrowDR, title: "Escalation Tracking", desc: "Real-time tracking as complaints move through the hierarchy, with push notifications and full visibility at every stage.", bg: "var(--blue-light)", ic: "var(--blue)" },
  { icon: I.msg, title: "Case-Based Messaging", desc: "Secure, case-specific chat between citizens and officials for clarifications, updates, and resolution confirmation.", bg: "var(--green-light)", ic: "var(--green)" },
  { icon: I.clip, title: "Evidence Upload", desc: "Attach photos, videos, and documents to support complaints, ensuring stronger investigations and faster resolutions.", bg: "#fff8e6", ic: "var(--gold)" },
  { icon: I.bar, title: "Analytics Dashboard", desc: "Comprehensive performance data for authorities to monitor resolution rates, response times, and regional trends.", bg: "#f8f0ff", ic: "#8b5cf6" },
  { icon: I.board, title: "Full Audit Trail", desc: "Every action on every complaint is permanently logged, creating complete accountability and transparency across the system.", bg: "#eafaf1", ic: "#0a7a50" },
];
function Features() {
  return (
    <section className="section features" id="features">
      <div className="si">
        <div className="feat-top rv">
          <div>
            <div className="eyebrow"><div className="eyebrow-line" />Platform Capabilities</div>
            <h2 className="sh">Built for Good Governance</h2>
          </div>
          <p className="sp" style={{ margin: 0 }}>Designed to strengthen the bond between citizens and local government through radical transparency and efficiency.</p>
        </div>
        <div className="feat-grid rv d1">
          {feats.map(f => (
            <div className="feat-cell" key={f.title}>
              <div className="feat-icon" style={{ background: f.bg }}><Ico d={f.icon} s={22} c={f.ic} /></div>
              <div><div className="feat-title">{f.title}</div><div className="feat-desc">{f.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <div className="cta-wrap">
      <div className="si">
        <div className="cta-box rv">
          <div className="cta-left">
            <div className="eyebrow"><div className="eyebrow-line" />Join JanSeva Today</div>
            <h2 className="sh" style={{ color: "white", fontSize: "2.2rem" }}>Make Your Voice<br /><em style={{ fontStyle: "italic", color: "var(--saffron2)" }}>Count</em></h2>
            <p className="sp" style={{ color: "rgba(255,255,255,0.5)" }}>Join thousands of citizens already using JanSeva to resolve civic issues, hold officials accountable, and build better communities.</p>
            <div className="cta-btns">
              <button className="cta-btn-p">Register as Citizen <Ico d={I.arrow} s={16} c="white" /></button>
              <button className="cta-btn-o">View Demo</button>
            </div>
          </div>
          <div className="cta-right">
            <div className="cta-orb orb1" /><div className="cta-orb orb2" />
            <div className="cta-stats">
              {[["12,450+", "Complaints Resolved"], ["98.2%", "Resolution Rate"], ["340+", "Wards Connected"], ["2.4M+", "Citizens Served"]].map(([n, l]) => (
                <div className="cta-stat" key={l}><div className="cta-stat-n">{n}</div><div className="cta-stat-l">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-i">
        <div className="footer-brand">JanSeva Portal</div>
        <div className="footer-links">{["About", "Privacy", "Terms", "Contact", "Accessibility"].map(l => <a key={l} href="#">{l}</a>)}</div>
        <div className="footer-copy">© 2025 Ministry of Panchayati Raj, Govt. of India</div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <>
      <style>{CSS}</style>
      <Cursor />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Hierarchy />
      <Roles />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}


