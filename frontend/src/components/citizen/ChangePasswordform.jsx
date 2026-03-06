// citizen/components/ChangePasswordForm.jsx
import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

function PasswordInput({ label, placeholder, value, onChange, error, showToggle }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all",
            error
              ? "border-red-300 bg-red-50 focus:border-red-400"
              : "border-gray-200 bg-gray-50 focus:border-indigo-300 focus:bg-white",
          ].join(" ")}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}
        </p>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Good", color: "bg-blue-400" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? level.color : "bg-gray-200",
            ].join(" ")}
          />
        ))}
      </div>
      <p className={`text-[10px] font-semibold ${score <= 1 ? "text-red-500" : score === 2 ? "text-yellow-600" : score === 3 ? "text-blue-600" : "text-emerald-600"}`}>
        {level.label} password
      </p>
    </div>
  );
}

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.current_password) e.current_password = "Current password is required.";
    if (!form.new_password) {
      e.new_password = "New password is required.";
    } else if (form.new_password.length < 8) {
      e.new_password = "Password must be at least 8 characters.";
    }
    if (!form.confirm_password) {
      e.confirm_password = "Please confirm your new password.";
    } else if (form.new_password !== form.confirm_password) {
      e.confirm_password = "Passwords do not match.";
    }
    return e;
  };

  const setField = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: "" }));
    setSuccess(false);
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch("/api/citizen/change-password/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Failed to update password.");
      }
      setSuccess(true);
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        Change Password
      </h4>

      {apiError && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {apiError}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          Password changed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <PasswordInput
          label="Current Password"
          placeholder="Your existing password"
          value={form.current_password}
          onChange={(v) => setField("current_password", v)}
          error={errors.current_password}
          showToggle
        />
        <div>
          <PasswordInput
            label="New Password"
            placeholder="At least 8 characters"
            value={form.new_password}
            onChange={(v) => setField("new_password", v)}
            error={errors.new_password}
            showToggle
          />
          <PasswordStrength password={form.new_password} />
        </div>
        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={form.confirm_password}
          onChange={(v) => setField("confirm_password", v)}
          error={errors.confirm_password}
          showToggle
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : "Change Password"}
        </button>
      </form>
    </div>
  );
}