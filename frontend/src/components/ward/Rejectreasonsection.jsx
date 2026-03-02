const MIN_CHARS = 10;
const MAX_CHARS = 500;

export default function RejectReasonSection({ value, onChange, error }) {
  const remaining = MAX_CHARS - value.length;
  const isUnderMin = value.length > 0 && value.length < MIN_CHARS;
  const isAtLimit = value.length >= MAX_CHARS;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        Reason for Rejection <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_CHARS}
          rows={4}
          placeholder="Provide a clear reason for rejecting this citizen's verification request..."
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-150
            focus:ring-2 focus:ring-offset-0
            ${
              error || isUnderMin
                ? "border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50"
                : "border-gray-200 focus:border-blue-400 focus:ring-blue-100 bg-white"
            }
          `}
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-h-[18px]">
          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
          {!error && isUnderMin && (
            <p className="text-xs text-amber-600 font-medium">
              Minimum {MIN_CHARS} characters required
            </p>
          )}
        </div>
        <span
          className={`text-xs font-mono flex-shrink-0 ${
            isAtLimit
              ? "text-red-500 font-semibold"
              : remaining <= 50
              ? "text-amber-500"
              : "text-gray-400"
          }`}
        >
          {value.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
}