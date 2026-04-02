import StatusBadge from "@/components/ward/StatusBadge";
import { useState } from "react";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

const CATEGORY_ICONS = {
  water: "Water",
  road: "Road",
  electricity: "Electricity",
  waste: "Waste Management",
  other: "Other"
};

export default function ComplaintInfoCard({ complaint }) {
  if (!complaint) return null;
  const catKey = (complaint.category ?? "other").toLowerCase();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900 leading-snug flex-1">
            {complaint.title ?? "Untitled Complaint"}
          </h3>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
            {CATEGORY_ICONS[catKey] ?? "Other"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
            {formatDate(complaint.created_at)}
          </span>
        </div>
        {complaint.description && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{complaint.description}</p>
          </div>
        )}
        {complaint.media?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Attachments
            </p>

            <div className="relative">
              {/* MEDIA DISPLAY */}
              {complaint.media[currentIndex].type === "IMAGE" ? (
                <img
                  src={complaint.media[currentIndex].file}
                  className="w-full max-h-64 object-cover rounded-xl"
                />
              ) : (
                <video
                  src={complaint.media[currentIndex].file}
                  controls
                  className="w-full max-h-64 rounded-xl"
                />
              )}

              {/* LEFT BUTTON */}
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  ←
                </button>
              )}

              {/* RIGHT BUTTON */}
              {currentIndex < complaint.media.length - 1 && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  →
                </button>
              )}
            </div>

            {/* DOT INDICATOR */}
            <div className="flex justify-center gap-1 mt-2">
              {complaint.media.map((_, i) => (
                <div
                  key={i} 
                  className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-blue-500" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>
        )}
        {complaint.resolution_description && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl space-y-1">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Resolution Note</p>
            <p className="text-sm text-green-800 leading-relaxed">{complaint.resolution_description}</p>
          </div>
        )}
        {complaint.escalation_reason && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-1">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Escalation Reason</p>
            <p className="text-sm text-red-800 leading-relaxed">{complaint.escalation_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}