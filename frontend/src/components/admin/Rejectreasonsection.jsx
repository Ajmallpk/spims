/**
 * RejectReasonSection
 * Props:
 *  - value: string
 *  - onChange: (val: string) => void
 *  - error: string | null
 */

const MIN_CHARS = 10;
const MAX_CHARS = 500;

const RejectReasonSection = ({ value, onChange, error }) => {
  const remaining = MAX_CHARS - value.length;
  const hasError = !!error;

  return (
    <div className="mt-4 space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        Rejection Reason{" "}
        <span className="text-red-500">*</span>
      </label>

      <p className="text-xs text-gray-400 mb-1">
        Minimum {MIN_CHARS} characters. This reason will be sent to the
        applicant.
      </p>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_CHARS}
          rows={4}
          placeholder="Provide a clear reason for rejecting this verification request..."
          className={`w-full rounded-lg border px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all duration-150 ${
            hasError
              ? "border-red-400 focus:ring-red-200 bg-red-50"
              : "border-gray-300 focus:ring-blue-200 focus:border-blue-400 bg-white"
          }`}
        />

        {/* Character counter */}
        <div className="absolute bottom-2.5 right-3 text-xs text-gray-400 pointer-events-none">
          <span
            className={
              value.length < MIN_CHARS && value.length > 0
                ? "text-red-400 font-medium"
                : value.length >= MAX_CHARS - 20
                ? "text-orange-400 font-medium"
                : ""
            }
          >
            {value.length}
          </span>
          <span>/{MAX_CHARS}</span>
        </div>
      </div>

      {/* Inline error message */}
      {hasError && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default RejectReasonSection;