/**
 * LoginButton
 * Props:
 *  - label: string
 *  - loadingLabel: string
 *  - isLoading: boolean
 *  - disabled: boolean
 *  - type: "submit" | "button"
 *  - onClick: () => void (optional)
 */
const Spinner = () => (
  <svg
    className="w-4 h-4 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const LoginButton = ({
  label = "Sign In",
  loadingLabel = "Signing in…",
  isLoading = false,
  disabled = false,
  type = "submit",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5
        text-sm font-bold text-white tracking-wide
        bg-blue-700 hover:bg-blue-800 active:bg-blue-900
        rounded-lg shadow-md hover:shadow-lg
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default LoginButton;