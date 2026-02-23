import { useState } from "react";

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleSubmit = () => {
    if (!form.current || !form.next || !form.confirm) { setError("All fields are required."); return; }
    if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.next !== form.confirm) { setError("Passwords do not match."); return; }
    setError("");
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); }, 1800);
  };

  const EyeIcon = ({ visible }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      {visible ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,9,20,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1526 0%, #0a1020 100%)" }}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" className="w-5 h-5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono">Change Password</h2>
              <p className="text-xs text-slate-600 mt-0.5">Update your account password</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-500 hover:text-slate-200 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" className="w-7 h-7"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="text-sm font-bold text-emerald-400 font-mono">Password updated successfully!</p>
            </div>
          ) : (
            <>
              {[
                { label: "Current Password", field: "current" },
                { label: "New Password", field: "next" },
                { label: "Confirm New Password", field: "confirm" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-xs text-slate-600 font-mono block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input
                      type={show[f.field] ? "text" : "password"}
                      value={form[f.field]}
                      onChange={(e) => { setForm((p) => ({ ...p, [f.field]: e.target.value })); setError(""); }}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-slate-300 placeholder-slate-700 bg-slate-800/60 border border-slate-700/50 focus:outline-none focus:border-blue-500/50 transition-all duration-150 font-mono"
                    />
                    <button type="button" onClick={() => toggle(f.field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                      <EyeIcon visible={show[f.field]} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Password strength hint */}
              {form.next && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${form.next.length < 6 ? "w-1/4 bg-red-500" : form.next.length < 10 ? "w-1/2 bg-amber-500" : "w-full bg-emerald-500"}`} />
                    </div>
                    <span className={`text-xs font-mono ${form.next.length < 6 ? "text-red-400" : form.next.length < 10 ? "text-amber-400" : "text-emerald-400"}`}>
                      {form.next.length < 6 ? "Weak" : form.next.length < 10 ? "Fair" : "Strong"}
                    </span>
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
            </>
          )}
        </div>

        {!success && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/40">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 bg-slate-800/60 border border-slate-700/50 hover:text-slate-200 transition-all duration-150">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm font-bold rounded-xl text-white bg-blue-600/80 border border-blue-500/50 hover:bg-blue-600 transition-all duration-150 active:scale-95">Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountSecurityPanel({ security }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(security.twoFAEnabled);
  const [twoFAPending, setTwoFAPending] = useState(false);

  const handleToggle2FA = () => {
    setTwoFAPending(true);
    setTimeout(() => {
      setTwoFAEnabled((v) => !v);
      setTwoFAPending(false);
    }, 900);
  };

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* Security Overview Card */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-700/50">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">Account Security</p>
              <p className="text-xs text-slate-600 mt-0.5">Authentication & access management</p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {[
              {
                label: "Last Login",
                value: security.lastLogin,
                icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
                accent: "blue",
              },
              {
                label: "Account Created",
                value: security.accountCreated,
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                accent: "slate",
              },
              {
                label: "Login IP Address",
                value: security.loginIP,
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                accent: "slate",
              },
              {
                label: "Browser / Device",
                value: security.device,
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                accent: "slate",
              },
            ].map((item) => (
              <div key={item.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-150">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.accent === "blue" ? "bg-blue-500/15" : "bg-slate-700/60"}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={item.accent === "blue" ? "#60a5fa" : "#64748b"} strokeWidth="1.8" className="w-4 h-4">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 font-mono">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-300 mt-0.5 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Sessions Card */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">Active Sessions</p>
            </div>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
              {security.activeSessions} online
            </span>
          </div>

          <div className="p-5 space-y-3">
            {security.sessions.map((session, i) => (
              <div key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/50 transition-all duration-150">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${session.current ? "bg-blue-500/15 border border-blue-500/20" : "bg-slate-700/50"}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={session.current ? "#60a5fa" : "#64748b"} strokeWidth="1.8" className="w-4 h-4">
                      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-300">{session.device}</p>
                      {session.current && (
                        <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded text-blue-400 bg-blue-400/10">Current</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-mono">{session.location} · {session.time}</p>
                  </div>
                </div>
                {!session.current && (
                  <button className="text-xs font-semibold text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2FA Card */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-700/50">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              Two-Factor Authentication
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2">
                  <p className="text-sm font-bold text-slate-200">Authenticator App</p>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono border ${twoFAEnabled ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" : "text-slate-500 bg-slate-700/40 border-slate-700/60"}`}>
                    {twoFAEnabled ? "ENABLED" : "DISABLED"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {twoFAEnabled
                    ? "Your account is protected with two-factor authentication. An additional code is required at login."
                    : "Enable 2FA to add an extra layer of protection to your administrator account."}
                </p>
              </div>

              <button
                onClick={handleToggle2FA}
                disabled={twoFAPending}
                className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${twoFAEnabled ? "bg-emerald-500" : "bg-slate-700"} ${twoFAPending ? "opacity-60" : ""}`}
                style={{ boxShadow: twoFAEnabled ? "0 0 12px rgba(52,211,153,0.4)" : "none" }}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${twoFAEnabled ? "left-7" : "left-1"}`} />
              </button>
            </div>

            {!twoFAEnabled && (
              <button
                onClick={handleToggle2FA}
                disabled={twoFAPending}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-purple-400 bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-150 active:scale-95 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {twoFAPending ? "Processing..." : "Enable Two-Factor Authentication"}
              </button>
            )}
          </div>
        </div>

        {/* Change Password CTA */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-200 mb-0.5">Password</p>
              <p className="text-xs text-slate-600">
                Last changed: <span className="text-slate-500">{security.passwordLastChanged}</span>
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl text-blue-400 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-150 active:scale-95 whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
              </svg>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </>
  );
}