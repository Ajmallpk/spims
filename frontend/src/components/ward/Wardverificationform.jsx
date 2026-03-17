import { useState, useEffect } from "react";
import DocumentUploadField from "@/components/ward/Documentuploadfield";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";


const INITIAL_FIELDS = {
  officer_full_name: "",
  ward_name: "",
  panchayath_id: "",
  official_email: "",
  official_contact: "",
  office_address: "",
};

// ── Reusable sub-components ───────────────────────────────────────────────────

function FormInput({ label, name, value, onChange, type = "text", required, placeholder, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150
          ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50 placeholder-red-300"
            : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
          }`}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function FormTextArea({ label, name, value, onChange, required, placeholder, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className={`w-full resize-none px-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150
          ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50 placeholder-red-300"
            : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
          }`}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="flex-1 h-px bg-gray-100" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <span className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WardVerificationForm({ onSuccess, prefillData }) {

  const [fields, setFields] = useState({
    ...INITIAL_FIELDS,
    ward_name: prefillData?.ward_name ?? "",
    official_email: prefillData?.email ?? "",
    official_contact: prefillData?.phone ?? prefillData?.mobile ?? "",
  });

  const [files, setFiles] = useState({
    aadhaar_image: null,
    selfie_image: null,
    supporting_document: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [panchayaths, setPanchayaths] = useState([]);


  // ── Handlers ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchPanchayaths = async () => {
      try {
        const res = await wardapi.getPanchayathDropdown();
        setPanchayaths(res.data);
      } catch (error) {
        // interceptor will show toast
      }
    };

    fetchPanchayaths();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = (name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ───────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};

    if (!fields.officer_full_name.trim() || fields.officer_full_name.trim().length < 3)
      errs.officer_full_name = "Full name must be at least 3 characters.";

    if (!fields.ward_name.trim())
      errs.ward_name = "Ward name is required.";

    if (!fields.panchayath_id)
      errs.panchayath_id = "Please select a Panchayath.";

    if (!fields.official_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.official_email))
      errs.official_email = "Enter a valid official email address.";

    if (!fields.official_contact.trim() || fields.official_contact.trim().length < 10)
      errs.official_contact = "Enter a valid 10-digit contact number.";

    if (!fields.office_address.trim() || fields.office_address.trim().length < 10)
      errs.office_address = "Office address must be at least 10 characters.";

    if (!files.aadhaar_image)
      errs.aadhaar_image = "Aadhaar card image is required.";

    if (!files.selfie_image)
      errs.selfie_image = "Selfie image is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setServerError("");

      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v.trim()));

      if (files.aadhaar_image)
        fd.append("aadhaar_image", files.aadhaar_image);

      if (files.selfie_image)
        fd.append("selfie_image", files.selfie_image);

      if (files.supporting_document)
        fd.append("supporting_document", files.supporting_document);

      await wardapi.submitWardVerification(fd);

      toast.success("Verification submitted successfully");

      localStorage.setItem("verification_submitted", "true");

      onSuccess();

      
    } catch (err) {
      // interceptor will show toast
      console.error(err);

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          setErrors(data);
          return;
        }
      }

      setServerError("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-base font-bold text-gray-900">Submit Verification Documents</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Provide your officer details and upload the required documents. All information will be verified by the administrative team.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}

        {/* Section: Officer Details */}
        <div className="space-y-4">
          <SectionDivider label="Officer Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Officer Full Name"
              name="officer_full_name"
              value={fields.officer_full_name}
              onChange={handleChange}
              required
              placeholder="e.g. Rajan Mathew"
              error={errors.officer_full_name}
            />
            <FormInput
              label="Official Email"
              name="official_email"
              value={fields.official_email}
              onChange={handleChange}
              type="email"
              required
              placeholder="officer@panchayath.gov.in"
              error={errors.official_email}
            />
            <FormInput
              label="Official Contact Number"
              name="official_contact"
              value={fields.official_contact}
              onChange={handleChange}
              type="tel"
              required
              placeholder="e.g. 9876543210"
              error={errors.official_contact}
            />
          </div>
        </div>

        {/* Section: Ward & Panchayath */}
        <div className="space-y-4">
          <SectionDivider label="Ward & Panchayath" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Ward Name"
              name="ward_name"
              value={fields.ward_name}
              onChange={handleChange}
              required
              placeholder="e.g. Ward No. 7"
              error={errors.ward_name}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Select Panchayath <span className="text-red-500">*</span>
              </label>

              <select
                name="panchayath_id"
                value={fields.panchayath_id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150
      ${errors.panchayath_id
                    ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50"
                    : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
              >
                <option value="">-- Select Panchayath --</option>

                {panchayaths.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.panchayath_name}
                  </option>
                ))}
              </select>

              {errors.panchayath_id && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.panchayath_id}
                </p>
              )}
            </div>
          </div>

          <FormTextArea
            label="Office Address"
            name="office_address"
            value={fields.office_address}
            onChange={handleChange}
            required
            placeholder="Full office address including district, state and PIN code"
            error={errors.office_address}
          />
        </div>

        {/* Section: Documents */}
        <div className="space-y-4">
          <SectionDivider label="Required Documents" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUploadField
              label="Aadhaar Card Image"
              name="aadhaar_image"
              onChange={handleFile}
              required
              accept=".jpg,.jpeg,.png,.pdf"
              error={errors.aadhaar_image}
            />
            <DocumentUploadField
              label="Selfie with ID Card"
              name="selfie_image"
              onChange={handleFile}
              required
              accept=".jpg,.jpeg,.png"
              error={errors.selfie_image}
            />
          </div>

          <DocumentUploadField
            label="Supporting Document"
            name="supporting_document"
            onChange={handleFile}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="text-xs text-gray-400">
            Optional: Appointment letter, ID card, or any official document supporting your role.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold
              text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors
              shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting Verification…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit for Verification
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            By submitting, you confirm all provided information is accurate and authentic.
          </p>
        </div>
      </div>
    </div>
  );
}