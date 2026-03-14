import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { adminapi } from "@/service/adminurls";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const PasswordField = ({ label, id, value, onChange, show, onToggle, error, placeholder }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <Lock
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={15}
      />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-150 ${error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
          }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
        <AlertCircle size={12} className="flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (successMsg) setSuccessMsg("");
    if (apiError) setApiError("");
  };

  const toggleShow = (key) =>
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const validate = () => {
    const errs = {};
    if (!form.current_password.trim())
      errs.current_password = "Current password is required.";
    if (!form.new_password.trim())
      errs.new_password = "New password is required.";
    else if (form.new_password.length < 8)
      errs.new_password = "Password must be at least 8 characters.";
    if (!form.confirm_password.trim())
      errs.confirm_password = "Please confirm your new password.";
    else if (form.new_password !== form.confirm_password)
      errs.confirm_password = "Passwords do not match.";
    if (
      form.current_password &&
      form.new_password &&
      form.current_password === form.new_password
    )
      errs.new_password =
        "New password must be different from current password.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      await adminapi.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      setSuccessMsg("Password changed successfully.");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      setErrors({});
    } catch (err) {
      toast.error("Error changing password:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.current_password?.[0] ||
        "Failed to change password. Please try again.";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <CheckCircle size={16} className="flex-shrink-0 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
          {apiError}
        </div>
      )}

      <PasswordField
        label="Current Password"
        id="current_password"
        value={form.current_password}
        onChange={(v) => setField("current_password", v)}
        show={show.current}
        onToggle={() => toggleShow("current")}
        error={errors.current_password}
        placeholder="Enter current password"
      />

      <PasswordField
        label="New Password"
        id="new_password"
        value={form.new_password}
        onChange={(v) => setField("new_password", v)}
        show={show.new}
        onToggle={() => toggleShow("new")}
        error={errors.new_password}
        placeholder="Minimum 8 characters"
      />

      {/* Password strength hint */}
      {form.new_password.length > 0 && form.new_password.length < 8 && (
        <p className="text-xs text-amber-600 font-medium -mt-3">
          {8 - form.new_password.length} more characters needed
        </p>
      )}

      <PasswordField
        label="Confirm New Password"
        id="confirm_password"
        value={form.confirm_password}
        onChange={(v) => setField("confirm_password", v)}
        show={show.confirm}
        onToggle={() => toggleShow("confirm")}
        error={errors.confirm_password}
        placeholder="Re-enter new password"
      />

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Updating…
            </>
          ) : (
            <>
              <Lock size={15} />
              Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;