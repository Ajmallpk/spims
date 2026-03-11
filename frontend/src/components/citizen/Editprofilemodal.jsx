/**
 * EditProfileModal.jsx
 * Modal to update editable citizen profile fields.
 *
 * Props:
 *   isOpen          : boolean
 *   onClose         : () => void
 *   profile         : object
 *   onUpdateSuccess : (updated) => void
 *   token           : string
 */

import { useState, useEffect } from "react";

const WARDS = Array.from({ length: 20 }, (_, i) => `Ward ${String(i + 1).padStart(2, "0")}`);

const iCls = (err) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${err
    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
    : "border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
  }`;

const EditProfileModal = ({ isOpen, onClose, profile, onUpdateSuccess, token }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    wardName: "",
    houseNumber: "",
    streetName: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      setForm({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        wardName: profile.wardName || "",
        houseNumber: profile.houseNumber || "",
        streetName: profile.streetName || "",
        address: profile.address || "",
      });
      setErrors({});
      setApiError(null);
      setSuccess(false);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Must be exactly 10 digits";
    if (!form.wardName) e.wardName = "Please select a ward";
    if (!form.houseNumber.trim()) e.houseNumber = "House number is required";
    if (!form.streetName.trim()) e.streetName = "Street name is required";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async () => {
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/citizen/profile/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          house_number: form.houseNumber,
          street_name: form.streetName,
          address: form.address,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Update failed.");
      }
      const response = await res.json();
      const updated = response.data;
      onUpdateSuccess?.(updated);
      setSuccess(true);
      setTimeout(onClose, 800);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 pt-6 pb-4 border-b border-gray-100 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Edit Profile</h2>
              <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {success && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-2 text-sm text-teal-700 font-medium">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal-500 flex-shrink-0">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Profile updated!
            </div>
          )}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500 text-xs">*</span></label>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" className={iCls(errors.fullName)} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500 text-xs">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">+91</span>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} className={`${iCls(errors.phone)} pl-10`} />
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Ward */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Ward <span className="text-red-500 text-xs">*</span></label>
            <select name="wardName" value={form.wardName} onChange={handleChange} className={iCls(errors.wardName)}>
              <option value="">Select your ward</option>
              {WARDS.map((w) => <option key={w}>{w}</option>)}
            </select>
            {errors.wardName && <p className="text-xs text-red-500">{errors.wardName}</p>}
          </div>

          {/* House + Street (half width) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">House Number <span className="text-red-500 text-xs">*</span></label>
              <input name="houseNumber" value={form.houseNumber} onChange={handleChange} placeholder="e.g. 42B" className={iCls(errors.houseNumber)} />
              {errors.houseNumber && <p className="text-xs text-red-500">{errors.houseNumber}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Street Name <span className="text-red-500 text-xs">*</span></label>
              <input name="streetName" value={form.streetName} onChange={handleChange} placeholder="e.g. Gandhi Nagar" className={iCls(errors.streetName)} />
              {errors.streetName && <p className="text-xs text-red-500">{errors.streetName}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Address <span className="text-red-500 text-xs">*</span></label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="House, street, landmark, city…" className={`${iCls(errors.address)} resize-none`} />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl px-6 pb-6 pt-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} disabled={submitting} className="flex-1 border border-gray-200 text-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || success}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
            ) : success ? (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>Saved!</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;