// citizen/components/VerificationRequiredModal.jsx
import { ShieldAlert, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VerificationRequiredModal({ onClose }) {
  const navigate = useNavigate();

  const handleGoToVerification = () => {
    onClose();
    navigate('/citizen/verification');
  };

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

        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7 text-amber-600" />
        </div>

        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
          Verification Required
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
          You must complete identity verification before you can report civic issues in your community.
        </p>

        <button
          onClick={handleGoToVerification}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Go to Verification Page
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2.5 px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors rounded-xl hover:bg-gray-50"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}