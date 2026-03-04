const STEPS = [
  {
    id: 1,
    label: "Verification Documents Submitted",
    description: "All required documents uploaded and request submitted",
  },
  {
    id: 2,
    label: "Under Administrative Review",
    description: "Documents being reviewed by the panchayath administration",
  },
  {
    id: 3,
    label: "Approved & Access Granted",
    description: "Verification complete — full ward officer access unlocked",
  },
];

function getStepState(stepId, status) {
  const s = (status ?? "not_submitted").toLowerCase();

  if (s === "approved") {
    return "completed"; // all steps done
  }
  if (s === "pending") {
    if (stepId === 1) return "completed";
    if (stepId === 2) return "active";
    return "upcoming";
  }
  if (s === "rejected") {
    if (stepId === 1) return "rejected";
    return "upcoming";
  }
  // not_submitted
  return "upcoming";
}

const STEP_ICON_MAP = {
  completed: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  active: <span className="w-2.5 h-2.5 bg-white rounded-full" />,
  rejected: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  upcoming: null, // uses step number
};

const STEP_CIRCLE_STYLES = {
  completed: "bg-green-500 border-green-500 text-white",
  active:    "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100",
  rejected:  "bg-red-500 border-red-500 text-white",
  upcoming:  "bg-white border-gray-200 text-gray-400",
};

const STEP_LABEL_STYLES = {
  completed: "text-green-700",
  active:    "text-blue-700",
  rejected:  "text-red-600",
  upcoming:  "text-gray-400",
};

const STEP_DESC_STYLES = {
  completed: "text-green-600",
  active:    "text-blue-500",
  rejected:  "text-red-400",
  upcoming:  "text-gray-300",
};

export default function VerificationProgress({ status }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-800">Verification Progress</h3>
        <p className="text-xs text-gray-400 mt-0.5">Track your verification journey step by step</p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-gray-100 z-0" />

        <div className="space-y-6 relative z-10">
          {STEPS.map((step) => {
            const state = getStepState(step.id, status);
            const icon = STEP_ICON_MAP[state];

            return (
              <div key={step.id} className="flex items-start gap-4">
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                    flex-shrink-0 transition-all ${STEP_CIRCLE_STYLES[state]}`}
                >
                  {icon ?? (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${STEP_LABEL_STYLES[state]}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${STEP_DESC_STYLES[state]}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}