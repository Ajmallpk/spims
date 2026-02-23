import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.detail || data?.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Role validation
      const role = data?.user?.role || data?.role || "";
      if (role !== "SYSTEM_ADMIN") {
        setError("Access denied. This portal is restricted to administrators only.");
        setLoading(false);
        return;
      }

      // Status validation
      const status = data?.user?.status || data?.status || "";
      if (status !== "ACTIVE") {
        setError("Your account has been suspended or is pending activation. Contact the system administrator.");
        setLoading(false);
        return;
      }

      // Persist token
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access", data.access);
      storage.setItem("refresh", data.refresh);
      storage.setItem("role", data.role);

      onSuccess?.();

    } catch (err) {
      setError("Unable to connect to the server. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono">
          Email Address
        </label>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-900/60 transition-all duration-200 ${error && !email ? "border-red-500/50 bg-red-950/10" : "border-slate-700/60 focus-within:border-blue-500/60 focus-within:bg-slate-900/80"
          }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="admin@spims.gov.in"
            autoComplete="username"
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-700 focus:outline-none font-mono disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono">
          Password
        </label>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-900/60 transition-all duration-200 ${error && !password ? "border-red-500/50 bg-red-950/10" : "border-slate-700/60 focus-within:border-blue-500/60 focus-within:bg-slate-900/80"
          }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="••••••••••••"
            autoComplete="current-password"
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-700 focus:outline-none font-mono disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 disabled:opacity-50"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember me + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => setRememberMe((v) => !v)}
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0 cursor-pointer ${rememberMe
                ? "bg-blue-600 border-blue-500"
                : "bg-slate-800/60 border-slate-700/60 group-hover:border-slate-500/70"
              }`}
          >
            {rememberMe && (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs text-slate-500 font-mono group-hover:text-slate-400 transition-colors">
            Remember this device
          </span>
        </label>
        <button type="button" className="text-xs text-blue-500 hover:text-blue-400 font-mono transition-colors">
          Forgot password?
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/25">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-4 h-4 flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed font-mono">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl
          text-sm font-bold tracking-wide font-mono
          transition-all duration-200 active:scale-[0.98] overflow-hidden
          ${loading
            ? "bg-blue-700/50 border border-blue-600/30 text-blue-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500/40 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
          }
        `}
        style={!loading ? { boxShadow: "0 0 20px rgba(29,78,216,0.25)" } : {}}
      >
        {/* Shimmer on hover */}
        {!loading && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}

        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Access System</span>
          </>
        )}
      </button>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.8" className="w-3.5 h-3.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs text-slate-700 font-mono">
          256-bit encrypted · Authorized personnel only
        </span>
      </div>
    </form>
  );
}