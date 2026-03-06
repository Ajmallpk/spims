// citizen/components/ChangeEmailForm.jsx
import { useState } from "react";
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangeEmailForm() {
  const [form, setForm] = useState({ new_email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.new_email.trim()) {
      e.new_email = "New email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.new_email)) {
      e.new_email = "Enter a valid email address.";
    }
    if (!form.password) e.password = "Password confirmation is required.";
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
      const res = await fetch("/api/citizen/change-email/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Failed to update email.");
      }
      setSuccess(true);
      setForm({ new_email: "", password: "" });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Mail className="w-4 h-4 text-indigo-400" />
        Change Email Address
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
          Email updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* New email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">New Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="new@email.com"
              value={form.new_email}
              onChange={(e) => setField("new_email", e.target.value)}
              className={[
                "w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all",
                errors.new_email
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-gray-50 focus:border-indigo-300 focus:bg-white",
              ].join(" ")}
            />
          </div>
          {errors.new_email && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{errors.new_email}
            </p>
          )}
        </div>

        {/* Password confirm */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Confirm with Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              placeholder="Your current password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              className={[
                "w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all",
                errors.password
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-gray-50 focus:border-indigo-300 focus:bg-white",
              ].join(" ")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : "Update Email"}
        </button>
      </form>
    </div>
  );
}