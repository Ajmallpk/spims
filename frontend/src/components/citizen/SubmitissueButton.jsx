// citizen/components/SubmitIssueButton.jsx
import { Send, Loader2 } from "lucide-react";

export default function SubmitIssueButton({ loading = false, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={[
        "w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200",
        loading || disabled
          ? "bg-indigo-300 text-white cursor-not-allowed"
          : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.99] shadow-md",
      ].join(" ")}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Submitting Report...
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          Submit Issue Report
        </>
      )}
    </button>
  );
}