/**
 * ChangeEmailForm.jsx
 * Form to change the citizen's email with password confirmation.
 *
 * Props:
 *   currentEmail : string – citizen's current email
 *   token        : string – Bearer auth token
 */

import { useState } from "react";
import citizenapi from "@/service/citizenurls";

const iCls = (err) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${err
    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
    : "border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
  }`;

const ChangeEmailForm = ({ currentEmail, token }) => {
  const [form, setForm] = useState({ newEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.newEmail.trim()) {
      e.newEmail = "New email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.newEmail)) {
      e.newEmail = "Enter a valid email address";
    } else if (form.newEmail === currentEmail) {
      e.newEmail = "New email must be different from current email";
    }
    if (!form.password) e.password = "Password confirmation is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async () => {
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }

    setSubmitting(true);
    setApiError(null);

    try {
      await citizenapi.changeEmail({
        new_email: form.newEmail,
        password: form.password,
      });
      setSuccess(true);
      setForm({ newEmail: "", password: "" });
      setErrors({});
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to change email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-800">Change Email Address</h3>
      </div>

      {/* Current email chip */}
      {currentEmail && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span className="text-xs text-gray-500">
            Current: <span className="font-semibold text-gray-700">{currentEmail}</span>
          </span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-teal-700 font-semibold">Verification email sent!</p>
            <p className="text-xs text-teal-600 mt-0.5">
              Check your current email and click the verification link to confirm the change.
            </p>
          </div>
        </div>
      )}

      {/* API error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {apiError}
        </div>
      )}

      {/* New email */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          New Email Address <span className="text-red-500 text-xs">*</span>
        </label>
        <input
          type="email"
          name="newEmail"
          value={form.newEmail}
          onChange={handleChange}
          placeholder="new@email.com"
          className={iCls(!!errors.newEmail)}
        />
        {errors.newEmail && <p className="text-xs text-red-500">{errors.newEmail}</p>}
      </div>

      {/* Password confirmation */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Confirm with Password <span className="text-red-500 text-xs">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your current password"
            className={`${iCls(!!errors.password)} pr-10`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        A verification email will be sent to your current email . Your email will only be updated after you verify it.
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          "Change Email"
        )}
      </button>
    </div>
  );
};

export default ChangeEmailForm;