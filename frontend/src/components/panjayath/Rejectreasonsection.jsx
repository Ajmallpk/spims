// components/RejectReasonSection.jsx
// SPIMS – Smart Panchayath Issue Management System
// Textarea input for rejection reason with character counter + validation.
// Used inside WardApprovalModal when user clicks "Reject".

const MIN_CHARS = 10;
const MAX_CHARS = 500;

/**
 * RejectReasonSection
 *
 * @param {string}   value        - Current textarea value (controlled)
 * @param {Function} onChange     - Called with new string value on every keystroke
 * @param {string}   [error]      - Validation error message to display (empty = no error)
 * @param {boolean}  [disabled]   - Disable input during API submission
 */
export default function RejectReasonSection({
  value,
  onChange,
  error,
  disabled = false,
}) {
  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount >= MAX_CHARS * 0.9 && !isOverLimit;

  // Counter color logic
  const counterCls = isOverLimit
    ? "text-rose-600 font-bold"
    : isNearLimit
    ? "text-amber-600 font-semibold"
    : "text-slate-400";

  const borderCls = error || isOverLimit
    ? "border-rose-400 ring-1 ring-rose-300 focus:border-rose-500 focus:ring-rose-300"
    : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300";

  return (
    <div className="mt-4 space-y-1.5">
      {/* Label */}
      <label className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Rejection Reason
          <span className="text-rose-500 ml-0.5">*</span>
        </span>
        <span className={`text-xs ${counterCls} transition-colors duration-150`}>
          {charCount} / {MAX_CHARS}
        </span>
      </label>

      {/* Hint */}
      <p className="text-xs text-slate-400">
        Minimum {MIN_CHARS} characters. Provide a clear reason that will be
        communicated to the ward officer.
      </p>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        maxLength={MAX_CHARS + 50} // slight buffer; over-limit error shown via UI
        placeholder="e.g. The submitted documents are incomplete. Please re-upload the Panchayath registration certificate and the No-Objection Certificate."
        className={`
          w-full px-4 py-3
          rounded-xl
          border
          text-sm text-slate-800
          placeholder:text-slate-400
          bg-white
          resize-none
          outline-none
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
          ${borderCls}
        `}
      />

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-1.5 mt-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            isOverLimit
              ? "bg-rose-500"
              : isNearLimit
              ? "bg-amber-400"
              : charCount >= MIN_CHARS
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
          style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}