import { ShieldAlert, X, UserCircle } from "lucide-react";

export default function VerificationRequiredModal({ onClose, onGoToProfile }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-red-500 w-full" />

        <div className="p-6">
          {/* Close */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Required</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              You must complete your verification before accessing ward features. Please update your
              profile and submit your verification request.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onGoToProfile}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}