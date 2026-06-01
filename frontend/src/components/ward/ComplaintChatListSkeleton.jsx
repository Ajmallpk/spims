import React from "react";

const SkeletonCard = () => (
  <div className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm animate-pulse">
    {/* Avatar */}
    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-slate-200" />

    {/* Body */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded-full w-3/5" />
          <div className="h-2.5 bg-slate-100 rounded-full w-2/5" />
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
          <div className="h-2.5 bg-slate-200 rounded-full w-12" />
          <div className="h-4 bg-slate-100 rounded-full w-14" />
        </div>
      </div>
      <div className="mt-3 h-2.5 bg-slate-100 rounded-full w-4/5" />
    </div>

    {/* Chevron placeholder */}
    <div className="flex-shrink-0 w-4 h-4 rounded bg-slate-100 self-center" />
  </div>
);

const ComplaintChatSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default ComplaintChatSkeleton;