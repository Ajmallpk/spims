// citizen/components/CitizenVerificationForm.jsx
import { useState } from "react";
import {
  User, Mail, Phone, Building2, Home, MapPin, FileText,
  CheckCircle2, AlertCircle, Send, Loader2
} from "lucide-react";
import DocumentUploadField from "@/components/citizen/DocumentUploadField";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  phone: "",
  ward_name: "",
  house_number: "",
  street_name: "",
  full_address: "",
  aadhaar_image: null,
  selfie_image: null,
};

const INITIAL_ERRORS = {};

function validate(form) {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = "Phone must be exactly 10 digits.";
  }
  if (!form.ward_name.trim()) errors.ward_name = "Ward name is required.";
  if (!form.house_number.trim()) errors.house_number = "House number is required.";
  if (!form.street_name.trim()) errors.street_name = "Street name is required.";
  if (!form.full_address.trim()) errors.full_address = "Full address is required.";
  if (!form.aadhaar_image) errors.aadhaar_image = "Aadhaar document is required.";
  if (!form.selfie_image) errors.selfie_image = "Selfie photo is required.";
  return { errors, valid: Object.keys(errors).length === 0 };
}

function TextField({ label, icon: Icon, type = "text", placeholder, value, onChange, error, maxLength, inputMode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        inputMode={inputMode}
        className={[
          "w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-150",
          error
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-gray-200 bg-white focus:border-indigo-300",
        ].join(" ")}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}
        </p>
      )}
    </div>
  );
}

export default function CitizenVerificationForm({ profile, onSuccess }) {
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    full_name: profile?.full_name || profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    ward_name: profile?.ward_name || profile?.ward || "",
  });
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [apiError, setApiError] = useState(null);

  const setField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const { errors: newErrors, valid } = validate(form);
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "aadhaar_image" || key === "selfie_image") {
          if (val?.file) fd.append(key, val.file);
        } else {
          fd.append(key, val);
        }
      });

      const res = await fetch("/api/citizen/submit-verification/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Submission failed. Please try again.");
      }

      setSuccessMsg("Your verification documents have been submitted. You'll be notified once reviewed.");
      onSuccess?.();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Submitted Successfully!</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{successMsg}</p>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse inline-block" />
          <span className="text-xs font-medium text-yellow-700">Status changed to: Pending Review</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Verification Documents</h3>
        <p className="text-xs text-gray-400 mt-1">
          Fill in your details and upload the required documents to complete citizen verification.
        </p>
      </div>

      {apiError && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Section: Personal Info */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Personal Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Full Name" icon={User} placeholder="As on Aadhaar card"
              value={form.full_name} onChange={(v) => setField("full_name", v)}
              error={errors.full_name}
            />
            <TextField
              label="Email" icon={Mail} type="email" placeholder="your@email.com"
              value={form.email} onChange={(v) => setField("email", v)}
              error={errors.email}
            />
            <TextField
              label="Phone Number" icon={Phone} placeholder="10-digit mobile number"
              value={form.phone} onChange={(v) => setField("phone", v.replace(/\D/g, "").slice(0, 10))}
              error={errors.phone} maxLength={10} inputMode="numeric"
            />
            <TextField
              label="Ward Name" icon={Building2} placeholder="e.g. Ward 5 - Mannuthy"
              value={form.ward_name} onChange={(v) => setField("ward_name", v)}
              error={errors.ward_name}
            />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Section: Address */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Address Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="House Number" icon={Home} placeholder="e.g. 12A / TC 14/205"
              value={form.house_number} onChange={(v) => setField("house_number", v)}
              error={errors.house_number}
            />
            <TextField
              label="Street Name" icon={MapPin} placeholder="e.g. MG Road, Puthiyara"
              value={form.street_name} onChange={(v) => setField("street_name", v)}
              error={errors.street_name}
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Complete address including city, district, pincode..."
              value={form.full_address}
              onChange={(e) => { setField("full_address", e.target.value); }}
              rows={3}
              className={[
                "w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all resize-none",
                errors.full_address
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-white focus:border-indigo-300",
              ].join(" ")}
            />
            {errors.full_address && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{errors.full_address}
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Section: Documents */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Identity Documents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DocumentUploadField
              label="Aadhaar Card"
              hint="Upload front side of your Aadhaar card"
              value={form.aadhaar_image}
              onChange={(v) => setField("aadhaar_image", v)}
              error={errors.aadhaar_image}
              required
            />
            <DocumentUploadField
              label="Selfie Photo"
              hint="Clear photo of your face, no sunglasses"
              value={form.selfie_image}
              onChange={(v) => setField("selfie_image", v)}
              error={errors.selfie_image}
              required
            />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          By submitting, you confirm that the information provided is accurate and the documents are genuine.
          Providing false information may result in permanent account suspension.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={[
            "w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200",
            loading
              ? "bg-indigo-300 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.99] shadow-md",
          ].join(" ")}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
          ) : (
            <><Send className="w-4 h-4" />Submit Verification</>
          )}
        </button>
      </form>
    </div>
  );
}