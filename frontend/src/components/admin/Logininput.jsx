/**
 * LoginInput
 * Props:
 *  - id: string
 *  - label: string
 *  - type: string
 *  - value: string
 *  - onChange: (e) => void
 *  - placeholder: string
 *  - disabled: boolean
 *  - icon: LucideIcon component (optional)
 *  - rightElement: ReactNode (optional, e.g. eye toggle)
 *  - autoComplete: string
 */
const LoginInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  icon: Icon,
  rightElement,
  autoComplete,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} ${
            rightElement ? "pr-10" : "pr-3.5"
          } py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            transition-all duration-150`}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginInput;