import Avatar from "@/components/ui/Avatar";

const AuthorityResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className="bg-green-500 text-white rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Avatar alt={response.authorityName} size="sm" className="ring-2 ring-white/40" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{response.authorityName}</span>
            <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">
              ✓ Official
            </span>
          </div>
          <p className="text-green-100 text-xs mt-0.5">{response.timeAgo}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/70 flex-shrink-0">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed">{response.message}</p>

      {/* Proof image */}
      {response.proofImage && (
        <img
          src={response.proofImage}
          alt="Proof of completion"
          className="rounded-lg w-full object-cover max-h-72 mt-1"
        />
      )}
    </div>
  );
};

export default AuthorityResponse;