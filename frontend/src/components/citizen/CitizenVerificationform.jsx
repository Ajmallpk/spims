/**
 * CitizenVerificationForm.jsx
 * Multi-field verification form with document uploads.
 * Props:
 *   profile:              object   – pre-filled profile data
 *   verificationStatus:   object   – current status
 *   onSubmitSuccess:      () => void
 *   token:                string   – Bearer auth token
 */

import { useState, useEffect } from "react";
import DocumentUploadField from "@/components/citizen/Documentuploadfield";
import citizenapi from "@/service/citizenurls";

;

const InputField = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const inputClass = (hasError) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${hasError
    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
    : "border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
  }`;

const isReadOnly = (status) =>
  status === "APPROVED" || status === "PENDING";

const CitizenVerificationForm = ({
  profile,
  verificationStatus,
  onSubmitSuccess,
  token,
  allowWardChange
}) => {
  const status = verificationStatus?.status ?? "NOT_SUBMITTED";
  const readOnly = isReadOnly(status);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    ward: "",
    houseNumber: "",
    streetName: "",
    address: "",
  });

  const [files, setFiles] = useState({ aadhaar: null, selfie: null });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [wards, setWards] = useState([]);

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await citizenapi.getWards();
        setWards(res.data);
      } catch (error) {
        console.error("Failed to load wards", error);
      }
    };

    fetchWards();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be exactly 10 digits";
    if (!form.ward) newErrors.ward = "Please select a ward";
    if (!form.houseNumber.trim()) newErrors.houseNumber = "House number is required";
    if (!form.streetName.trim()) newErrors.streetName = "Street name is required"
    if (!files.aadhaar) newErrors.aadhaar = "Aadhaar document is required";
    if (!files.selfie) newErrors.selfie = "Selfie photo is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();

      formData.append("full_name", form.fullName);
      formData.append("phone", form.phone);
      formData.append("ward", form.ward);
      formData.append("house_number", form.houseNumber);
      formData.append("street_name", form.streetName);

      if (files.aadhaar) formData.append("aadhaar_image", files.aadhaar);
      if (files.selfie) formData.append("selfie_image", files.selfie);

      await citizenapi.submitVerification(formData);

      setSubmitSuccess(true);
      onSubmitSuccess?.();

    } catch (err) {
      if (err.response && err.response.data) {
        setSubmitError(JSON.stringify(err.response.data));
      } else {
        setSubmitError("Verification failed. Please try again.");
      }
  } finally {
    setIsSubmitting(false);
  }
};

// Approved state
if (status === "APPROVED" && !allowWardChange) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center gap-4 min-h-64">
      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-teal-500">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900">You're Verified!</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
          Your citizen identity has been confirmed. You have full access to post and manage issues.
        </p>
      </div>
      <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-4 py-3 text-sm text-teal-700 font-medium">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal-500">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Verified Citizen Badge Active
      </div>
    </div>
  );
}

// Pending state
if (status === "PENDING") {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center gap-4 min-h-64">
      <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-yellow-500">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900">Under Review</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
          Your documents are being reviewed by the ward authority. You will be notified once the review is complete.
        </p>
      </div>
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-xs text-yellow-700 font-medium">
        ⏳ Typical review time: 1–2 working days
      </div>
    </div>
  );
}

return (
  <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
    {/* Header */}
    <div className="pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Citizen Verification Form</h2>
          <p className="text-xs text-gray-400 mt-1">
            {status === "REJECTED"
              ? "Please update your details and re-submit with correct documents."
              : "Fill in your details and upload required documents to get verified."}
          </p>
        </div>
        {status === "REJECTED" && (
          <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Re-submission
          </span>
        )}
      </div>
    </div>

    {/* Success banner */}
    {submitSuccess && (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal-500 flex-shrink-0">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-teal-700 font-medium">
          Verification submitted successfully! Your request is under review.
        </p>
      </div>
    )}

    {/* API error */}
    {submitError && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <p className="text-sm text-red-600">{submitError}</p>
      </div>
    )}

    {/* Personal Details */}
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Personal Details</h3>
      </div>

      <div id="field-fullName">
        <InputField label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="As on Aadhaar card"
            className={inputClass(!!errors.fullName)}
          />
        </InputField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div id="field-email">
          <InputField label="Email" required error={errors.email}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={inputClass(!!errors.email)}
            />
          </InputField>
        </div>
        <div id="field-phone">
          <InputField label="Phone Number" required error={errors.phone}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+91</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength={10}
                className={`${inputClass(!!errors.phone)} pl-10`}
              />
            </div>
          </InputField>
        </div>
      </div>
    </section>

    {/* Address Details */}
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Address Details</h3>
      </div>

      <div id="field-ward">
        <InputField label="Ward" required error={errors.ward}>
          <select
            name="ward"
            value={form.ward}
            onChange={handleChange}
            className={inputClass(!!errors.ward)}
          >
            <option value="">Select your ward</option>

            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}

          </select>
        </InputField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div id="field-houseNumber">
          <InputField label="House Number" required error={errors.houseNumber}>
            <input
              type="text"
              name="houseNumber"
              value={form.houseNumber}
              onChange={handleChange}
              placeholder="e.g. 12A"
              className={inputClass(!!errors.houseNumber)}
            />
          </InputField>
        </div>
        <div id="field-streetName">
          <InputField label="Street Name" required error={errors.streetName}>
            <input
              type="text"
              name="streetName"
              value={form.streetName}
              onChange={handleChange}
              placeholder="e.g. Gandhi Nagar"
              className={inputClass(!!errors.streetName)}
            />
          </InputField>
        </div>
      </div>

      <div id="field-address">
        <InputField label="Full Address" required error={errors.address}>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            placeholder="House no., street, landmark, city..."
            className={`${inputClass(!!errors.address)} resize-none`}
          />
        </InputField>
      </div>
    </section>

    {/* Document Uploads */}
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Document Upload</h3>
      </div>

      <div id="field-aadhaar">
        <DocumentUploadField
          label="Aadhaar Card"
          required
          accept="image/jpeg,image/png,application/pdf"
          value={files.aadhaar}
          onChange={(file) => {
            setFiles((p) => ({ ...p, aadhaar: file }));
            if (errors.aadhaar) setErrors((p) => ({ ...p, aadhaar: null }));
          }}
          error={errors.aadhaar}
          hint="Front side of Aadhaar · JPG, PNG or PDF · Max 5MB"
        />
      </div>

      <div id="field-selfie">
        <DocumentUploadField
          label="Selfie Photo"
          required
          accept="image/jpeg,image/png"
          value={files.selfie}
          onChange={(file) => {
            setFiles((p) => ({ ...p, selfie: file }));
            if (errors.selfie) setErrors((p) => ({ ...p, selfie: null }));
          }}
          error={errors.selfie}
          hint="Clear selfie in good lighting · JPG or PNG · Max 5MB"
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Your documents are encrypted and used only for identity verification. They are reviewed solely by authorized ward officials.
      </div>
    </section>

    {/* Submit */}
    <div className="pt-2 border-t border-gray-100">
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || submitSuccess}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : submitSuccess ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Submitted
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {status === "REJECTED" ? "Re-submit Verification" : "Submit for Verification"}
          </>
        )}
      </button>
    </div>
  </div>
);
};

export default CitizenVerificationForm;