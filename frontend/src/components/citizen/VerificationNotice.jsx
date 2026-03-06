// citizen/components/VerificationNotice.jsx
import { useState } from "react";
import { ShieldAlert, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerificationNotice({ status }) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  // Only show for non-verified, non-approved statuses
  if (dismissed || status === "APPROVED") return null;

  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";

  const config = isPending
    ? {
        bg: "bg-yellow-50 border-yellow-200",
        icon: "text-yellow-500",
        iconBg: "bg-yellow-100",
        text: "text-yellow-800",
        sub: "text-yellow-600",
        btn: "bg-yellow-600 hover:bg-yellow-700 text-white",
        message: "Your verification is under review. You'll be notified once approved.",
        btnLabel: "View Status",
      }
    : isRejected
    ? {
        bg: "bg-red-50 border-red-200",
        icon: "text-red-500",
        iconBg: "bg-red-100",
        text: "text-red-800",
        sub: "text-red-600",
        btn: "bg-red-600 hover:bg-red-700 text-white",
        message: "Your verification was rejected. Please resubmit with correct documents.",
        btnLabel: "Resubmit Now",
      }
    : {
        bg: "bg-indigo-50 border-indigo-200",
        icon: "text-indigo-500",
        iconBg: "bg-indigo-100",
        text: "text-indigo-900",
        sub: "text-indigo-600",
        btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
        message: "You are not verified. Only verified citizens can post civic issues.",
        btnLabel: "Verify Now",
      };

  return (
    <div
      className={[
        "flex items-start gap-3 px-4 py-3.5 rounded-xl border mb-5 relative",
        config.bg,
      ].join(" ")}
    >
      <div
        className={[
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          config.iconBg,
        ].join(" ")}
      >
        <ShieldAlert className={["w-5 h-5", config.icon].join(" ")} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={["text-sm font-semibold", config.text].join(" ")}>
          {isPending
            ? "Verification Pending"
            : isRejected
            ? "Verification Rejected"
            : "Identity Verification Required"}
        </p>
        <p className={["text-xs mt-0.5 leading-relaxed", config.sub].join(" ")}>
          {config.message}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate("/citizen/verification")}
          className={[
            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
            config.btn,
          ].join(" ")}
        >
          {config.btnLabel}
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-current opacity-50" />
        </button>
      </div>
    </div>
  );
}