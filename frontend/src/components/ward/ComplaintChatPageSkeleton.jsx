import React from "react";

const BubbleSkeleton = ({ align = "left" }) => (
  <div className={`flex ${align === "right" ? "justify-end" : "justify-start"} animate-pulse`}>
    <div className={`flex flex-col gap-1.5 max-w-[60%] ${align === "right" ? "items-end" : "items-start"}`}>
      <div className="h-2 bg-slate-200 rounded-full w-12" />
      <div
        className={`h-10 rounded-2xl ${
          align === "right" ? "bg-blue-200 rounded-br-sm" : "bg-slate-200 rounded-bl-sm"
        }`}
        style={{ width: `${120 + Math.random() * 80}px` }}
      />
      <div className="h-2 bg-slate-100 rounded-full w-10" />
    </div>
  </div>
);

const ComplaintChatPageSkeleton = () => {
  const pattern = ["left", "right", "left", "left", "right", "right", "left"];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header skeleton */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 animate-pulse">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded-full w-28" />
              <div className="h-2.5 bg-slate-100 rounded-full w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 rounded-xl bg-slate-200" />
            <div className="h-9 w-24 rounded-xl bg-red-200" />
          </div>
        </div>
      </div>

      {/* Info card skeleton */}
      <div className="flex-shrink-0 bg-blue-600 px-4 py-3 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 rounded-2xl px-4 py-3">
            <div className="flex gap-4">
              <div className="h-2.5 bg-white/30 rounded-full w-10" />
              <div className="h-2.5 bg-white/30 rounded-full flex-1" />
              <div className="h-2.5 bg-white/30 rounded-full w-16" />
              <div className="h-2.5 bg-white/30 rounded-full w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden bg-slate-50 px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {pattern.map((align, i) => (
            <BubbleSkeleton key={i} align={align} />
          ))}
        </div>
      </div>

      {/* Input skeleton */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-3 animate-pulse">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 h-11 rounded-2xl bg-slate-200" />
          <div className="w-11 h-11 rounded-2xl bg-blue-200" />
        </div>
      </div>
    </div>
  );
};

export default ComplaintChatPageSkeleton;