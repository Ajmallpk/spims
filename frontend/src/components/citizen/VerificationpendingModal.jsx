// citizen/components/VerificationPendingModal.jsx
import { Clock, X } from 'lucide-react';

export default function VerificationPendingModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-blue-600" />
        </div>

        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
          Verification Pending
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
          Your verification request is currently under review by our team. You will be notified once it has been approved.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0 animate-pulse" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Verification typically takes 1-2 business days. Thank you for your patience.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-5 py-3 bg-gray-100 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}