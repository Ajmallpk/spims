// components/VerificationForm.jsx
// SPIMS – Smart Panchayath Issue Management System
// Verification submission form. Used when status is NOT_SUBMITTED or REJECTED.
//
// Fields: Office Address, License Number, Official Contact, Document Upload
// Submits: POST /api/panchayath/submit-verification/ via multipart FormData
//
// Props:
//   onSuccess    {Function}  - Called after successful submission (triggers status refresh)
//   isRejected   {boolean}   - If true, show "resubmit" context messaging

import { useState } from "react";
import DocumentUploadField from "@/components/panjayath/Documentuploadfield";
import panchayathapi from "@/service/panchayathurls";


// ─── Field component ─────────────────────────────────────────────────────────

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  hint,
  disabled = false,
  maxLength,
}) {
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {hint && <p className="text-xs text-slate-400">{hint}</p>}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        className={`
          w-full px-4 py-2.5
          rounded-xl border
          text-sm text-slate-800
          placeholder:text-slate-400
          bg-white
          outline-none
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
          ${hasError
            ? "border-rose-400 ring-1 ring-rose-200 focus:border-rose-500 focus:ring-rose-300"
            : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          }
        `}
      />

      {hasError && (
        <div className="flex items-start gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

// ─── Initial form state & validators ─────────────────────────────────────────

const INITIAL_FIELDS = {
  full_name: "",
  panchayath_name: "",
  district: "",
  official_contact: "",
  email: "",
};

const INITIAL_ERRORS = {
  full_name: "",
  panchayath_name: "",
  district: "",
  official_contact: "",
  email: "",
  aadhaar_image: "",
  selfie_image: "",
};

function validateFields(fields, aadhaarImage, selfieImage) {
  const errors = { ...INITIAL_ERRORS };
  let isValid = true;

  // Full Name
  if (!fields.full_name.trim()) {
    errors.full_name = "Full name is required.";
    isValid = false;
  } else if (fields.full_name.trim().length < 3) {
    errors.full_name = "Full name must be at least 3 characters.";
    isValid = false;
  }

  // Panchayath Name
  if (!fields.panchayath_name.trim()) {
    errors.panchayath_name = "Panchayath name is required.";
    isValid = false;
  }

  // District
  if (!fields.district.trim()) {
    errors.district = "District is required.";
    isValid = false;
  }

  // Official Contact
  if (!fields.official_contact.trim()) {
    errors.official_contact = "Official contact number is required.";
    isValid = false;
  } else if (!/^[6-9]\d{9}$/.test(fields.official_contact.replace(/\s|-/g, ""))) {
    errors.official_contact = "Enter a valid 10-digit Indian mobile number.";
    isValid = false;
  }

  // Email
  if (!fields.email.trim()) {
    errors.email = "Official email is required.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
    isValid = false;
  }

  // Aadhaar Image
  if (!aadhaarImage) {
    errors.aadhaar_image = "Please upload Aadhaar image.";
    isValid = false;
  }

  // Selfie Image
  if (!selfieImage) {
    errors.selfie_image = "Please upload Selfie image.";
    isValid = false;
  }

  return { errors, isValid };
}
// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * VerificationForm
 * @param {Function} onSuccess   - Called on successful submission
 * @param {boolean}  isRejected  - Show resubmission context
 */
export default function VerificationForm({ onSuccess, isRejected = false }) {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Field change handler ────────────────────────────────────────────────
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAadhaarChange = (file) => {
    setAadhaarImage(file);
    if (errors.aadhaar_image) {
      setErrors((prev) => ({ ...prev, aadhaar_image: "" }));
    }
  };

  const handleSelfieChange = (file) => {
    setSelfieImage(file);
    if (errors.selfie_image) {
      setErrors((prev) => ({ ...prev, selfie_image: "" }));
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const { errors: validationErrors, isValid } =
      validateFields(fields, aadhaarImage, selfieImage);
    setErrors(validationErrors);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fields.full_name.trim());
      formData.append("panchayath_name", fields.panchayath_name.trim());
      formData.append("district", fields.district.trim());
      formData.append("phone", fields.official_contact.trim());
      formData.append("email", fields.email.trim());
      formData.append("aadhaar_image", aadhaarImage);
      formData.append("selfie_image", selfieImage);

      await panchayathapi.submitVerification(formData);

      onSuccess();
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("[VerificationForm] Unauthorized – JWT may be expired.");
      } else {
        console.error("[VerificationForm] Submission error:", err);
      }

      // Handle field-level backend errors
      const data = err.response?.data;
      if (data && typeof data === "object" && !data.detail) {
        const backendErrors = { ...INITIAL_ERRORS };
        Object.keys(data).forEach((key) => {
          if (key in backendErrors) {
            backendErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
          }
        });
        setErrors(backendErrors);
      }

      setApiError(
        data?.detail ||
        data?.message ||
        err.message ||
        "Submission failed. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-5 border-b ${isRejected ? "border-rose-200 bg-rose-50/40" : "border-slate-200 bg-slate-50/60"}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isRejected ? "bg-rose-100" : "bg-blue-100"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              className={`w-5 h-5 ${isRejected ? "text-rose-600" : "text-blue-600"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              {isRejected ? "Resubmit Verification" : "Submit for Verification"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRejected
                ? "Update your details and upload corrected documents to resubmit for review."
                : "Fill in your official Panchayath details and upload supporting documents."}
            </p>
          </div>
        </div>

        {/* Required hint */}
        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
        </p>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-6 py-6 space-y-5">
          {/* Office Address */}
          <FormField
            label="Full Name (Officer Name)"
            name="full_name"
            value={fields.full_name}
            onChange={handleFieldChange}
            error={errors.full_name}
            placeholder="e.g. Rajeev Kumar"
            required
            disabled={isSubmitting}
          />

          {/* Two-column row for License + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Panchayath Name"
              name="panchayath_name"
              value={fields.panchayath_name}
              onChange={handleFieldChange}
              error={errors.panchayath_name}
              placeholder="e.g. Koyilandy Grama Panchayath"
              required
              disabled={isSubmitting}
            />

            <FormField
              label="District"
              name="district"
              value={fields.district}
              onChange={handleFieldChange}
              error={errors.district}
              placeholder="e.g. Kozhikode"
              required
              disabled={isSubmitting}
            />
            <FormField
              label="Official Email"
              name="email"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
              error={errors.email}
              placeholder="official@panchayath.gov.in"
              required
              disabled={isSubmitting}
            />

            <FormField
              label="Official Contact Number"
              name="official_contact"
              type="tel"
              value={fields.official_contact}
              onChange={handleFieldChange}
              error={errors.official_contact}
              placeholder="e.g. 9876543210"
              required
              hint="10-digit official contact number."
              disabled={isSubmitting}
              maxLength={10}
            />
          </div>

          {/* Document Upload */}
          <DocumentUploadField
            label="Aadhaar Image"
            name="aadhaar_image"
            onChange={handleAadhaarChange}
            error={errors.aadhaar_image}
            disabled={isSubmitting}
            required
          />

          <DocumentUploadField
            label="Selfie Image"
            name="selfie_image"
            onChange={handleSelfieChange}
            error={errors.selfie_image}
            disabled={isSubmitting}
            required
          />

          {/* Accepted documents note */}
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            <div>
              <p className="text-xs font-bold text-blue-700 mb-0.5">Accepted Documents</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                Upload your <strong>Panchayath Registration Certificate</strong>, <strong>Government Gazette Notification</strong>,
                or <strong>No-Objection Certificate</strong> issued by the District Administration. PDF or image format, max 10MB.
              </p>
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-rose-50 border border-rose-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-sm text-rose-700 font-medium">{apiError}</p>
            </div>
          )}
        </div>

        {/* Footer / Submit */}
        <div className="px-6 pb-6 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full flex items-center justify-center gap-2.5
              px-6 py-3 rounded-xl
              text-sm font-bold text-white
              shadow-sm transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed
              ${isRejected
                ? "bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-rose-200 hover:shadow-md"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200 hover:shadow-md"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                </svg>
                Submitting Verification…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                {isRejected ? "Resubmit for Verification" : "Submit for Verification"}
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-3">
            By submitting, you confirm all provided information is accurate and official.
          </p>
        </div>
      </form>
    </div>
  );
}