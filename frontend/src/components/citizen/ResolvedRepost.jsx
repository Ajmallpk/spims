// citizen/components/ResolvedRepost.jsx
import { BadgeCheck } from "lucide-react";

export default function ResolvedRepost({ resolution }) {
  if (!resolution) return null;

  const { authority_name, description, proof_image, proof_video, resolved_at } =
    resolution;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      {/* Authority header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {(authority_name || "A")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-emerald-900 truncate">
              {authority_name || "Authority"}
            </span>
            <BadgeCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          </div>
          {resolved_at && (
            <p className="text-[11px] text-emerald-600 mt-0.5">
              Resolved on {formatDate(resolved_at)}
            </p>
          )}
        </div>
        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full tracking-wide flex-shrink-0">
          RESOLVED
        </span>
      </div>

      {/* Resolution description */}
      {description && (
        <p className="text-xs text-emerald-800 leading-relaxed mb-3 pl-0.5">
          {description}
        </p>
      )}

      {/* Proof image */}
      {proof_image && (
        <div className="rounded-xl overflow-hidden border border-emerald-200">
          <img
            src={proof_image}
            alt="Resolution proof"
            className="w-full max-h-52 object-cover"
          />
        </div>
      )}

      {/* Proof video (only if no image) */}
      {proof_video && !proof_image && (
        <div className="rounded-xl overflow-hidden border border-emerald-200 bg-black">
          <video
            src={proof_video}
            controls
            className="w-full max-h-52 object-contain"
          />
        </div>
      )}
    </div>
  );
}