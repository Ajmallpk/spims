import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import axiosInstance from "@/api/axiosInstance";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.05) 0%, transparent 45%), #060c1a",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Login Card */}
      <div
        className="relative w-full max-w-md"
        style={{ animation: "fadeInUp 0.4s ease-out both" }}
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent mb-0 rounded-t-2xl" />

        <div
          className="rounded-2xl border border-slate-700/50 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(13,21,38,0.95) 0%, rgba(8,14,28,0.98) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(29,78,216,0.08), 0 25px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 text-center relative">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-30"
              style={{ background: "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.3), transparent 60%)" }} />
            <div className="absolute top-0 right-0 w-16 h-16 opacity-30"
              style={{ background: "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.3), transparent 60%)" }} />

            {/* Logo */}
            <div className="flex items-center justify-center mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  boxShadow: "0 0 30px rgba(29,78,216,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {/* Subtle inner glow ring */}
                <div className="absolute inset-1 rounded-xl border border-blue-400/20" />
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7 relative z-10">
                  <path d="M3 21l9-18 9 18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 15h12" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Titles */}
            <h1
              className="text-xl font-bold text-slate-100 tracking-tight leading-snug"
              style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.01em" }}
            >
              SPIMS Administration Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Secure Governance Access
            </p>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #22c55e" }} />
                <span className="text-xs text-emerald-400 font-mono font-semibold">System Online</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          {/* Form */}
          <div className="px-8 py-7">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>

          {/* Footer */}
          <div
            className="px-8 py-4 flex flex-col items-center gap-1.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}
          >
            <p className="text-xs text-slate-700 font-mono">
              Smart Panchayath Public Issue Management System
            </p>
            <p className="text-xs text-slate-800 font-mono">
              © 2026 Local Self Government Dept., Kerala · v2.0.1
            </p>
          </div>
        </div>

        {/* Bottom glow */}
        <div
          className="h-px w-3/4 mx-auto mt-0 rounded-b-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(29,78,216,0.3), transparent)" }}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}