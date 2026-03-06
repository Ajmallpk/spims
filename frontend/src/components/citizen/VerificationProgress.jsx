// citizen/components/VerificationProgress.jsx
import { FileCheck, SearchCheck, BadgeCheck } from "lucide-react";

const STEPS = [
  {
    id: 1,
    icon: FileCheck,
    label: "Documents Submitted",
    description: "Aadhaar & selfie uploaded",
    activeStatuses: ["PENDING", "APPROVED"],
  },
  {
    id: 2,
    icon: SearchCheck,
    label: "Under Ward Review",
    description: "Authority reviewing your documents",
    activeStatuses: ["PENDING"],
    completedStatuses: ["APPROVED"],
  },
  {
    id: 3,
    icon: BadgeCheck,
    label: "Approved & Verified",
    description: "You are a verified citizen",
    activeStatuses: [],
    completedStatuses: ["APPROVED"],
  },
];

function getStepState(step, status) {
  if (!status || status === "NOT_SUBMITTED") return "idle";
  if (status === "REJECTED") {
    // Mark step 1 as error, rest idle
    if (step.id === 1) return "error";
    return "idle";
  }
  if ((step.completedStatuses || []).includes(status)) return "completed";
  if ((step.activeStatuses || []).includes(status)) return "active";
  return "idle";
}

export default function VerificationProgress({ status }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h4 className="text-sm font-bold text-gray-900 mb-5">Verification Progress</h4>

      <div className="space-y-0">
        {STEPS.map((step, idx) => {
          const state = getStepState(step, status);
          const Icon = step.icon;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300",
                    state === "completed"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : state === "active"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : state === "error"
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-white border-gray-200 text-gray-300",
                  ].join(" ")}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={[
                      "w-0.5 flex-1 min-h-[28px] mt-1 mb-1 rounded-full transition-colors duration-300",
                      state === "completed"
                        ? "bg-emerald-300"
                        : state === "active"
                        ? "bg-indigo-200"
                        : "bg-gray-150 bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </div>

              {/* Content column */}
              <div className={`pb-5 flex-1 ${isLast ? "pb-0" : ""}`}>
                <p
                  className={[
                    "text-sm font-semibold leading-tight transition-colors",
                    state === "completed"
                      ? "text-emerald-700"
                      : state === "active"
                      ? "text-indigo-700"
                      : state === "error"
                      ? "text-red-600"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {step.label}
                  {state === "active" && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse inline-block" />
                      Current
                    </span>
                  )}
                  {state === "completed" && (
                    <span className="ml-2 text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                </p>
                <p
                  className={[
                    "text-xs mt-0.5 transition-colors",
                    state === "idle" ? "text-gray-300" : "text-gray-500",
                  ].join(" ")}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}