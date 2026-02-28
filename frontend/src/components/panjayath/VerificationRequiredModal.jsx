// components/VerificationRequiredModal.jsx
// SPIMS – Smart Panchayath Issue Management System
// Modal: Shown when account verification has NOT been submitted yet.

import { useNavigate } from "react-router-dom";

export default function VerificationRequiredModal({ onClose }) {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    onClose();
    navigate("/panchayath/profile");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-required-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

        <div className="p-7">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-200 mx-auto mb-5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-7 h-7 text-amber-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2
            id="verification-required-title"
            className="text-center text-xl font-black text-slate-900 tracking-tight"
          >
            Verification Required
          </h2>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-amber-300 rounded-full mx-auto my-3" />

          {/* Message */}
          <p className="text-center text-sm text-slate-500 leading-relaxed px-2">
            Your account must be verified before accessing full system
            features. Please complete your profile and submit your
            verification documents to proceed.
          </p>

          {/* Info box */}
          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-3 items-start">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            <p className="text-xs text-amber-700 leading-snug">
              Go to your Profile page to upload your Panchayath registration
              certificate and supporting documents.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleGoToProfile}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-sm shadow-amber-200 transition-all duration-150 hover:shadow-md"
            >
              Go to Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}