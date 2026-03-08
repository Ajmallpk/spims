/**
 * VerificationProgress.jsx
 * Step-by-step progress indicator for the verification pipeline.
 * Props:
 *   status: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED"
 */

const STEPS = [
  {
    id: 1,
    label: "Documents Submitted",
    description: "Aadhaar and selfie uploaded",
    activeOn: ["PENDING", "APPROVED", "REJECTED"],
    completedOn: ["APPROVED"],
  },
  {
    id: 2,
    label: "Under Ward Review",
    description: "Authority reviewing your documents",
    activeOn: ["PENDING", "APPROVED"],
    completedOn: ["APPROVED"],
  },
  {
    id: 3,
    label: "Approved & Active",
    description: "Post issues and interact freely",
    activeOn: ["APPROVED"],
    completedOn: ["APPROVED"],
  },
];

const getStepState = (step, status) => {
  if (status === "REJECTED") {
    if (step.id === 1) return "completed";
    if (step.id === 2) return "rejected";
    return "inactive";
  }
  if (step.completedOn.includes(status)) return "completed";
  if (step.activeOn.includes(status)) return "active";
  return "inactive";
};

const StepIcon = ({ state, id }) => {
  if (state === "completed") {
    return (
      <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shadow-sm flex-shrink-0 ring-4 ring-teal-100">
        <span className="text-white text-sm font-bold">{id}</span>
      </div>
    );
  }
  if (state === "rejected") {
    return (
      <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
      <span className="text-gray-400 text-sm font-semibold">{id}</span>
    </div>
  );
};

const VerificationProgress = ({ status = "NOT_SUBMITTED" }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-1">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Verification Progress</h3>
        <p className="text-xs text-gray-400 mt-0.5">Track your verification journey</p>
      </div>

      <div className="space-y-0">
        {STEPS.map((step, idx) => {
          const state = getStepState(step, status);
          const isLast = idx === STEPS.length - 1;

          const labelColor =
            state === "completed"
              ? "text-teal-700 font-semibold"
              : state === "active"
              ? "text-gray-900 font-semibold"
              : state === "rejected"
              ? "text-red-600 font-semibold"
              : "text-gray-400";

          const descColor =
            state === "inactive" ? "text-gray-300" : "text-gray-500";

          const lineColor =
            state === "completed" ? "bg-teal-500" : "bg-gray-200";

          return (
            <div key={step.id} className="flex gap-4">
              {/* Left: icon + connector line */}
              <div className="flex flex-col items-center">
                <StepIcon state={state} id={step.id} />
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1 rounded-full min-h-6 ${lineColor} transition-colors duration-500`} />
                )}
              </div>

              {/* Right: text */}
              <div className={`pb-${isLast ? "0" : "5"} pt-1.5 flex-1`}>
                <p className={`text-sm ${labelColor} leading-tight`}>{step.label}</p>
                <p className={`text-xs mt-0.5 ${descColor}`}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status note at bottom */}
      {status === "REJECTED" && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2 text-xs text-red-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          You may re-submit after correcting the issues noted below.
        </div>
      )}
      {status === "APPROVED" && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-teal-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 text-teal-500">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verification complete. You can now post issues.
        </div>
      )}
    </div>
  );
};

export default VerificationProgress;