import React from "react";
import { Search, X } from "lucide-react";

const ComplaintChatSearch = ({ value, onChange, onClear, resultCount }) => {
  return (
    <div className="mb-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by complaint title or citizen name…"
          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />

        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {value && (
        <p className="mt-2 text-xs text-slate-500 pl-1">
          {resultCount === 0
            ? "No results found"
            : `${resultCount} result${resultCount !== 1 ? "s" : ""} for "${value}"`}
        </p>
      )}
    </div>
  );
};

export default ComplaintChatSearch;