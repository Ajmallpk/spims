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
  const [previewMedia, setPreviewMedia] = useState(null);
  console.log("CARD STATUS 👉", complaint?.status);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900 leading-snug flex-1">
            {complaint.title ?? "Untitled Complaint"}
          </h3>
          <StatusBadge status={complaint.status} />
          {complaint.status === "HOLD" && (
            <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-800">
                Complaint On Hold
              </p>

              <p className="mt-2 text-sm text-gray-700">
                {complaint.hold_reason}
              </p>

              {complaint.hold_by_name && (
                <p className="mt-2 text-xs text-gray-500">
                  Held By : {complaint.hold_by_name}
                </p>
              )}

              {complaint.hold_at && (
                <p className="text-xs text-gray-500">
                  {new Date(complaint.hold_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
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
                  onClick={() => setPreviewMedia(complaint.media[currentIndex])}
                  className="w-full max-h-64 object-cover rounded-xl cursor-pointer"
                />
              ) : (
                <video
                  src={complaint.media[currentIndex].file}
                  controls
                  onClick={() => setPreviewMedia(complaint.media[currentIndex])}
                  className="w-full max-h-64 rounded-xl cursor-pointer"
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

      {
        previewMedia && (
          <div
            className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreviewMedia(null)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Close Button */}
              <button
                onClick={() => setPreviewMedia(null)}
                className="absolute top-3 right-3 z-10 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-100"
              >
                ✕
              </button>

              {/* Image */}
              {previewMedia.type === "IMAGE" ? (
                <img
                  src={previewMedia.file}
                  alt=""
                  className="w-full max-h-[90vh] object-contain rounded-xl"
                />
              ) : (
                <video
                  src={previewMedia.file}
                  controls
                  autoPlay
                  className="w-full max-h-[90vh] rounded-xl"
                />
              )}

            </div>
          </div>
        )
      }
    </div>
  );
}