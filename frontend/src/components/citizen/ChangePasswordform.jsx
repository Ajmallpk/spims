/**
 * ChangePasswordForm.jsx
 * Secure password change form with validation.
 *
 * Props:
 *   token : string – Bearer auth token
 */

import { useState } from "react";
import citizenapi from "@/service/citizenurls";

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const iCls = (err) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all pr-10 ${err
    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
    : "border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
  }`;

const PasswordField = ({ label, name, value, onChange, error, show, onToggle, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "••••••••"}
        className={iCls(!!error)}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <EyeIcon open={show} />
      </button>
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const ChangePasswordForm = ({ token }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      e.newPassword = "Password must be at least 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
      await citizenapi.changePassword({
        current_password: form.currentPassword,
        new_password: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "currentPassword", label: "Current Password", placeholder: "Your current password" },
    { name: "newPassword", label: "New Password", placeholder: "Min. 8 characters" },
    { name: "confirmPassword", label: "Confirm Password", placeholder: "Repeat new password" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-800">Change Password</h3>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 font-medium">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Password updated successfully.
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

      {fields.map(({ name, label, placeholder }) => (
        <PasswordField
          key={name}
          label={label}
          name={name}
          value={form[name]}
          onChange={handleChange}
          error={errors[name]}
          show={show[name]}
          onToggle={() => setShow((p) => ({ ...p, [name]: !p[name] }))}
          placeholder={placeholder}
        />
      ))}

      {/* Password strength hint */}
      {form.newPassword && (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((lvl) => {
            const strength = Math.min(
              4,
              [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter((r) =>
                r.test(form.newPassword)
              ).length
            );
            return (
              <div
                key={lvl}
                className={`h-1 flex-1 rounded-full transition-colors ${lvl <= strength
                    ? strength <= 1
                      ? "bg-red-400"
                      : strength <= 2
                        ? "bg-yellow-400"
                        : strength <= 3
                          ? "bg-teal-400"
                          : "bg-green-500"
                    : "bg-gray-200"
                  }`}
              />
            );
          })}
          <span className="text-xs text-gray-400 flex-shrink-0">
            {(() => {
              const s = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter((r) =>
                r.test(form.newPassword)
              ).length;
              return ["", "Weak", "Fair", "Good", "Strong"][s] || "";
            })()}
          </span>
        </div>
      )}

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
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </div>
  );
};

export default ChangePasswordForm;