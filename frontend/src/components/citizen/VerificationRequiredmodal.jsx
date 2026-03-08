const VerificationRequiredModal = ({ isOpen, onClose, onVerify }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-teal-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Verification Required</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            You must complete citizen verification before posting issues. This helps us maintain the authenticity of reports.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={() => {
              onVerify?.();
              onClose();
            }}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Verify Now
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequiredModal;